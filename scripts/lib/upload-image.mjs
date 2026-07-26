import { randomUUID } from "node:crypto";
import { existsSync } from "node:fs";
import { extname } from "node:path";

const CONTENT_TYPES = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
};

function downloadUrl(bucketName, storagePath, token) {
  const encoded = encodeURIComponent(storagePath);
  return `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encoded}?alt=media&token=${token}`;
}

/**
 * Upload a local image to Firebase Storage and return a CmsImage
 * ({ storagePath, url, alt }). Idempotent: if the object already exists,
 * its existing download token is reused instead of re-uploading.
 */
export async function uploadCmsImage(bucket, localPath, storagePath, alt) {
  if (!existsSync(localPath)) {
    throw new Error(`Image not found: ${localPath}`);
  }

  const file = bucket.file(storagePath);
  const [exists] = await file.exists();

  let token;
  if (exists) {
    const [metadata] = await file.getMetadata();
    token = metadata.metadata?.firebaseStorageDownloadTokens?.split(",")[0];
    if (!token) {
      token = randomUUID();
      await file.setMetadata({
        metadata: { firebaseStorageDownloadTokens: token },
      });
    }
  } else {
    token = randomUUID();
    const contentType =
      CONTENT_TYPES[extname(localPath).toLowerCase()] ?? "application/octet-stream";
    await bucket.upload(localPath, {
      destination: storagePath,
      metadata: {
        contentType,
        cacheControl: "public, max-age=31536000, immutable",
        metadata: { firebaseStorageDownloadTokens: token },
      },
    });
  }

  return {
    storagePath,
    url: downloadUrl(bucket.name, storagePath, token),
    alt,
  };
}
