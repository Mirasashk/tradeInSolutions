#!/usr/bin/env node
/**
 * One-time migration from Sanity to Firestore.
 * Requires: NEXT_PUBLIC_SANITY_*, SANITY_API_READ_TOKEN, FIREBASE_SERVICE_ACCOUNT_JSON
 *
 * Install sanity client temporarily: npx sanity@latest documents query ...
 * Or run with @sanity/client if available.
 */
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { createClient } from "@sanity/client";

import { initFirebaseAdmin } from "./lib/load-service-account.mjs";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token = process.env.SANITY_API_READ_TOKEN;

if (!projectId || !token) {
  console.error("Set NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_READ_TOKEN");
  process.exit(1);
}

const sanity = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  token,
  useCdn: false,
});

const app = initFirebaseAdmin();
const db = getFirestore(app);

const meta = {
  status: "published",
  publishedAt: FieldValue.serverTimestamp(),
  updatedAt: FieldValue.serverTimestamp(),
};

function richToMarkdown(value) {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (!Array.isArray(value)) return "";
  return value
    .map((block) => {
      if (block._type === "block" && Array.isArray(block.children)) {
        return block.children.map((child) => child.text ?? "").join("");
      }
      return "";
    })
    .filter(Boolean)
    .join("\n\n");
}

async function migrateSingleton(type, docId, transform = (d) => d) {
  const doc = await sanity.fetch(`*[_type == "${type}"][0]`);
  if (!doc) {
    console.log(`Skip ${type}: no document`);
    return;
  }
  const { _id, _type, _rev, _createdAt, _updatedAt, ...rest } = doc;
  await db
    .collection("cmsSingletons")
    .doc(docId)
    .set({
      ...transform(rest),
      legacySanityId: _id,
      ...meta,
    });
  console.log(`Migrated singleton ${docId}`);
}

async function migrateCollection(type, collection, transform = (d) => d) {
  const docs = await sanity.fetch(`*[_type == "${type}"]`);
  for (const doc of docs) {
    const { _id, _type, _rev, _createdAt, _updatedAt, ...rest } = doc;
    await db
      .collection(collection)
      .doc(_id)
      .set({
        ...transform(rest),
        legacySanityId: _id,
        ...meta,
      });
  }
  console.log(`Migrated ${docs.length} ${type} → ${collection}`);
}

await migrateSingleton("siteSettings", "siteSettings");
await migrateSingleton("navigation", "navigation");
await migrateSingleton("homePage", "homePage");
await migrateSingleton("aboutPage", "aboutPage", (d) => ({
  ...d,
  story: richToMarkdown(d.story),
  confidenceGuarantee: richToMarkdown(d.confidenceGuarantee),
}));
await migrateSingleton("appointmentPage", "appointmentPage");
await migrateSingleton("leadMagnet", "leadMagnet");

await migrateCollection("page", "cmsPages", (d) => ({
  ...d,
  slug: d.slug?.current ?? d.slug,
  body: richToMarkdown(d.body),
}));

await migrateCollection("blogPost", "cmsBlogPosts", (d) => ({
  ...d,
  slug: d.slug?.current ?? d.slug,
  body: richToMarkdown(d.body),
  publishedAt: d.publishedAt ?? null,
}));

await migrateCollection("testimonial", "cmsTestimonials");
await migrateCollection("location", "cmsLocations", (d) => ({
  ...d,
  directions: richToMarkdown(d.directions),
}));
await migrateCollection("faqItem", "cmsFaqItems", (d) => ({
  ...d,
  answer: richToMarkdown(d.answer),
}));
await migrateCollection("teamMember", "cmsTeamMembers");
await migrateCollection("trustBadge", "cmsTrustBadges");
await migrateCollection("caseStudy", "cmsCaseStudies");
await migrateCollection("socialProofItem", "cmsSocialProofItems");

console.log("Migration complete.");
