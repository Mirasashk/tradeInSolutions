import { visionTool } from "@sanity/vision";
import { defineConfig, type SingleWorkspace } from "sanity";
import { structureTool } from "sanity/structure";

import { apiVersion, dataset, isSanityConfigured, projectId } from "./lib/sanity/env";
import { schemaTypes } from "./sanity/schemaTypes";

const config: SingleWorkspace = {
  name: "tradeinsolutions",
  title: "Trade-In Solutions Irvine",
  projectId: projectId || "missing-project-id",
  dataset,
  basePath: "/studio",
  plugins: [structureTool(), visionTool({ defaultApiVersion: apiVersion })],
  schema: {
    types: schemaTypes,
  },
};

if (!isSanityConfigured) {
  console.warn(
    "Sanity Studio: NEXT_PUBLIC_SANITY_PROJECT_ID is not set. Studio will not work until configured.",
  );
}

export default defineConfig(config);
