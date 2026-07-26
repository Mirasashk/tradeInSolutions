import { deleteField, type FieldValue } from "firebase/firestore";
import type { DocumentData } from "firebase/firestore";

function isFieldValue(value: unknown): value is FieldValue {
  return typeof value === "object" && value !== null && "_methodName" in value;
}

/** Converts null/undefined to deleteField(); strips undefined from nested maps. */
export function sanitizeForFirestore(
  data: DocumentData,
): Record<string, DocumentData[string] | FieldValue> {
  const out: Record<string, DocumentData[string] | FieldValue> = {};

  for (const [key, value] of Object.entries(data)) {
    if (value === undefined || value === null) {
      out[key] = deleteField();
      continue;
    }

    if (isFieldValue(value)) {
      out[key] = value;
      continue;
    }

    if (Array.isArray(value)) {
      out[key] = value;
      continue;
    }

    if (typeof value === "object") {
      out[key] = sanitizeForFirestore(value as DocumentData);
      continue;
    }

    out[key] = value;
  }

  return out;
}
