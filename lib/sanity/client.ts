import { createClient, type SanityClient } from "next-sanity";

import { apiVersion, dataset, isSanityConfigured, projectId } from "./env";

let client: SanityClient | undefined;

export function getSanityClient(): SanityClient {
  if (!isSanityConfigured) {
    throw new Error(
      "Sanity is not configured. Set NEXT_PUBLIC_SANITY_PROJECT_ID before using the Sanity client.",
    );
  }

  if (!client) {
    client = createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: true,
    });
  }

  return client;
}

export function getBuildClient(): SanityClient {
  return getSanityClient().withConfig({
    useCdn: false,
    token: process.env.SANITY_API_READ_TOKEN,
  });
}
