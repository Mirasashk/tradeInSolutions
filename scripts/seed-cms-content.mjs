#!/usr/bin/env node
/**
 * Seed the full CMS content set (singletons + collections) into Firestore,
 * uploading images from /assets to Firebase Storage along the way.
 *
 * Content mirrors the original WordPress site (tradeinsolutions-irvine.com).
 *
 * Usage (from repo root):
 *   node --env-file=.env scripts/seed-cms-content.mjs
 *
 * Idempotent: existing docs are matched (by slug/name/question/label/text)
 * and updated in place; images already in Storage are not re-uploaded.
 *
 * Pass --prune to demote existing published docs that are NOT part of the
 * seed to "draft" (reversible in /admin/), preventing duplicate content.
 */
import { fileURLToPath } from "node:url";
import { join } from "node:path";

import { FieldValue, getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

import { initFirebaseAdmin, loadServiceAccount } from "./lib/load-service-account.mjs";
import { uploadCmsImage } from "./lib/upload-image.mjs";
import { blogPosts } from "./data/seed-blog-posts.mjs";
import { faqItems } from "./data/seed-faq-items.mjs";
import { testimonials } from "./data/seed-testimonials.mjs";
import {
  locations,
  pages,
  singletons,
  socialProofItems,
  teamMembers,
  trustBadges,
} from "./data/seed-site-content.mjs";

const ASSETS_DIR = fileURLToPath(new URL("../assets/", import.meta.url));
const PRUNE = process.argv.includes("--prune");

const app = initFirebaseAdmin();
const db = getFirestore(app);

const projectId =
  loadServiceAccount()?.project_id ?? process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const bucketName =
  process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? `${projectId}.firebasestorage.app`;
const bucket = getStorage(app).bucket(bucketName);

/**
 * Date-only strings parse as UTC midnight and can render one day early in
 * US timezones; anchor them to midday so the displayed date is stable.
 */
function normalizePublishedAt(value) {
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return `${value}T12:00:00`;
  }
  return value;
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);
}

function isImageSpec(value) {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    typeof value.file === "string"
  );
}

/** Recursively replace `{ file, alt }` markers with uploaded CmsImage objects. */
async function resolveImages(value, collection, docId) {
  if (Array.isArray(value)) {
    return Promise.all(value.map((item) => resolveImages(item, collection, docId)));
  }
  if (isImageSpec(value)) {
    const storagePath = `cms/${collection}/${docId}/${value.file}`;
    const image = await uploadCmsImage(
      bucket,
      join(ASSETS_DIR, value.file),
      storagePath,
      value.alt,
    );
    console.log(`  image ${value.file} → ${storagePath}`);
    return image;
  }
  if (typeof value === "object" && value !== null) {
    const result = {};
    for (const [key, nested] of Object.entries(value)) {
      result[key] = await resolveImages(nested, collection, docId);
    }
    return result;
  }
  return value;
}

async function seedSingletons() {
  for (const [docId, raw] of Object.entries(singletons)) {
    const data = await resolveImages(raw, "cmsSingletons", docId);
    await db
      .collection("cmsSingletons")
      .doc(docId)
      .set(
        {
          ...data,
          status: "published",
          publishedAt: FieldValue.serverTimestamp(),
          updatedAt: FieldValue.serverTimestamp(),
        },
        { merge: true },
      );
    console.log(`Singleton cmsSingletons/${docId} seeded`);
  }
}

/**
 * Upsert entries into a collection without creating duplicates: an entry is
 * matched to an existing doc by `matchField`, otherwise created under a
 * deterministic ID. Existing docs that match no seed entry are reported.
 */
async function seedCollection(collection, entries, matchField) {
  const snapshot = await db.collection(collection).get();
  const existing = snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() }));
  const managedIds = new Set();

  let created = 0;
  let updated = 0;

  for (const entry of entries) {
    const { key, ...content } = entry;
    const matchValue = content[matchField];
    const match = existing.find((doc) => doc.data[matchField] === matchValue);
    const docId = match?.id ?? key ?? slugify(String(matchValue));
    managedIds.add(docId);

    const data = await resolveImages(content, collection, docId);
    await db
      .collection(collection)
      .doc(docId)
      .set(
        {
          ...data,
          status: "published",
          publishedAt:
            normalizePublishedAt(data.publishedAt) ?? FieldValue.serverTimestamp(),
          updatedAt: FieldValue.serverTimestamp(),
        },
        { merge: true },
      );

    if (match) updated += 1;
    else created += 1;
  }

  const unmanaged = existing.filter((doc) => !managedIds.has(doc.id));
  console.log(`${collection}: ${created} created, ${updated} updated`);
  for (const doc of unmanaged) {
    if (PRUNE && doc.data.status === "published") {
      await db
        .collection(collection)
        .doc(doc.id)
        .set(
          { status: "draft", updatedAt: FieldValue.serverTimestamp() },
          { merge: true },
        );
      console.log(
        `  pruned ${collection}/${doc.id} → draft ` +
          `(${matchField}: ${JSON.stringify(doc.data[matchField] ?? null)})`,
      );
    } else {
      console.log(
        `  note: ${collection}/${doc.id} exists but is not in the seed ` +
          `(${matchField}: ${JSON.stringify(doc.data[matchField] ?? null)})`,
      );
    }
  }
}

console.log(`Seeding CMS content into project "${projectId}" (bucket: ${bucketName})`);

await seedSingletons();
await seedCollection("cmsBlogPosts", blogPosts, "slug");
await seedCollection("cmsTestimonials", testimonials, "name");
await seedCollection("cmsFaqItems", faqItems, "question");
await seedCollection("cmsLocations", locations, "name");
await seedCollection("cmsTeamMembers", teamMembers, "name");
await seedCollection("cmsTrustBadges", trustBadges, "label");
await seedCollection("cmsSocialProofItems", socialProofItems, "text");
await seedCollection("cmsPages", pages, "slug");

console.log("CMS content seeding complete.");
