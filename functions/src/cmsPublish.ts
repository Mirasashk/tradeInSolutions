import { onRequest } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { initializeApp, getApps } from "firebase-admin/app";
import type { Request, Response } from "express";

import { applyCors, handleOptions } from "./lib/cors";

const githubDispatchToken = defineSecret("GITHUB_DISPATCH_TOKEN");

function getAdminApp() {
  if (!getApps().length) {
    initializeApp();
  }
  return { auth: getAuth(), db: getFirestore() };
}

export const cmsPublish = onRequest(
  {
    region: "us-west1",
    secrets: [githubDispatchToken],
  },
  async (req: Request, res: Response) => {
    applyCors(req, res);
    if (handleOptions(req, res)) {
      return;
    }

    if (req.method !== "POST") {
      res.status(405).json({ error: "Method not allowed" });
      return;
    }

    const authHeader = req.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const idToken = authHeader.slice("Bearer ".length);

    try {
      const { auth, db } = getAdminApp();
      const decoded = await auth.verifyIdToken(idToken);
      const adminDoc = await db.collection("admins").doc(decoded.uid).get();

      if (!adminDoc.exists) {
        res.status(403).json({ error: "Forbidden" });
        return;
      }

      const repo = process.env.GITHUB_REPOSITORY ?? "Mirasashk/tradeInSolutions";
      const [owner, repoName] = repo.split("/");

      const response = await fetch(
        `https://api.github.com/repos/${owner}/${repoName}/dispatches`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${githubDispatchToken.value()}`,
            Accept: "application/vnd.github+json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            event_type: "cms-publish",
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`GitHub dispatch failed: ${response.status}`);
      }

      res.status(200).json({ success: true });
    } catch (error) {
      console.error("cmsPublish error", error);
      res.status(500).json({ error: "Failed to trigger rebuild" });
    }
  },
);
