import Image from "next/image";

import { cmsImageUrl as getCmsImageUrl } from "@/lib/firebase/storage";
import type { CmsImage } from "@/types";

type CmsImageProps = {
  image?: CmsImage | null;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
};

export function CmsImage({
  image,
  alt,
  width,
  height,
  className,
  priority,
}: CmsImageProps) {
  const src = getCmsImageUrl(image, width, height);
  if (!src) {
    return null;
  }

  const imageAlt = image?.alt ?? alt;

  return (
    <Image
      src={src}
      alt={imageAlt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      unoptimized
    />
  );
}

export function cmsImageUrl(
  image: CmsImage | null | undefined,
  width: number,
  height?: number,
): string | undefined {
  return getCmsImageUrl(image, width, height);
}

/** @deprecated Use CmsImage */
export const SanityImage = CmsImage;

/** @deprecated Use cmsImageUrl */
export const sanityImageUrl = cmsImageUrl;
