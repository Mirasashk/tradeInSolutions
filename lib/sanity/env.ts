export const apiVersion = "2026-07-25";

function readEnv(name: string): string {
  return process.env[name]?.trim() ?? "";
}

export const projectId = readEnv("NEXT_PUBLIC_SANITY_PROJECT_ID");

export const dataset = readEnv("NEXT_PUBLIC_SANITY_DATASET") || "production";

export const isSanityConfigured = Boolean(projectId);
