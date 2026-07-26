import { getFirebaseApp } from "@/lib/firebase";
import { getDownloadURL, ref, uploadBytes, getStorage } from "firebase/storage";

import type { CmsImage } from "@/types";

export function getClientStorage() {
  const app = getFirebaseApp();
  if (!app) {
    throw new Error("Firebase is not configured.");
  }
  return getStorage(app);
}

export async function uploadCmsImage(
  file: File,
  collection: string,
  docId: string,
  alt?: string,
): Promise<CmsImage> {
  const storage = getClientStorage();
  const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
  const storagePath = `cms/${collection}/${docId}/${Date.now()}-${safeName}`;
  const storageRef = ref(storage, storagePath);

  await uploadBytes(storageRef, file, { contentType: file.type });
  const url = await getDownloadURL(storageRef);

  return {
    storagePath,
    url,
    alt: alt ?? file.name,
  };
}

export function cmsImageUrl(
  image: CmsImage | null | undefined,
  width?: number,
  height?: number,
): string | undefined {
  void width;
  void height;
  return image?.url;
}
