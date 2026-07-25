import { onRequest } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import type { Request, Response } from "express";

import { applyCors, handleOptions } from "./lib/cors";

const sanityWebhookSecret = defineSecret("SANITY_WEBHOOK_SECRET");
const githubDispatchToken = defineSecret("GITHUB_DISPATCH_TOKEN");

export const sanityRevalidate = onRequest(
  {
    region: "us-west1",
    secrets: [sanityWebhookSecret, githubDispatchToken],
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

    const signature = req.get("sanity-webhook-signature");
    const secret = sanityWebhookSecret.value();

    if (!signature || signature !== secret) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const repo = process.env.GITHUB_REPOSITORY ?? "Mirasashk/tradeInSolutions";
    const [owner, repoName] = repo.split("/");

    try {
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
            event_type: "sanity-publish",
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`GitHub dispatch failed: ${response.status}`);
      }

      res.status(200).json({ success: true });
    } catch (error) {
      console.error("sanityRevalidate error", error);
      res.status(500).json({ error: "Failed to trigger rebuild" });
    }
  },
);
