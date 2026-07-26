/** Remove Firestore document id before binding to form state. */
export function stripFirestoreId<T extends { id: string }>(data: T): Omit<T, "id"> {
  const { id, ...rest } = data;
  void id;
  return rest;
}
