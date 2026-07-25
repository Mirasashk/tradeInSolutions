import createImageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

import { getSanityClient } from "./client";
import { isSanityConfigured } from "./env";

export function urlFor(source: SanityImageSource) {
  if (!isSanityConfigured) {
    throw new Error(
      "Sanity is not configured. Set NEXT_PUBLIC_SANITY_PROJECT_ID before using image URLs.",
    );
  }

  return createImageUrlBuilder(getSanityClient()).image(source);
}
