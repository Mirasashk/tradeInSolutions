/** Strip Firestore/CMS meta fields before binding snapshot data to editor forms. */
export function stripContentMeta<T extends Record<string, unknown>>(data: T): T {
  const {
    status,
    updatedAt,
    legacySanityId,
    updatedBy,
    restoredFromVersionId,
    ...rest
  } = data;
  void status;
  void updatedAt;
  void legacySanityId;
  void updatedBy;
  void restoredFromVersionId;
  return rest as T;
}
