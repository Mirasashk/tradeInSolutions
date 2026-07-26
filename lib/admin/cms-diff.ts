const SKIP_FIELDS = new Set([
  "updatedAt",
  "publishedAt",
  "updatedBy",
  "restoredFromVersionId",
  "legacySanityId",
]);

export type CmsDiffEntry = {
  field: string;
  type: "added" | "removed" | "changed";
  before?: string;
  after?: string;
};

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function formatValue(value: unknown): string {
  if (value === undefined) return "";
  if (value === null) return "null";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return JSON.stringify(value, null, 2);
}

export function flattenCmsData(
  data: Record<string, unknown>,
  prefix = "",
): Record<string, unknown> {
  const flat: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(data)) {
    if (SKIP_FIELDS.has(key)) continue;

    const path = prefix ? `${prefix}.${key}` : key;

    if (isPlainObject(value)) {
      Object.assign(flat, flattenCmsData(value, path));
      continue;
    }

    flat[path] = value;
  }

  return flat;
}

export function diffCmsRecords(
  before: Record<string, unknown>,
  after: Record<string, unknown>,
): CmsDiffEntry[] {
  const left = flattenCmsData(before);
  const right = flattenCmsData(after);
  const fields = new Set([...Object.keys(left), ...Object.keys(right)]);
  const entries: CmsDiffEntry[] = [];

  for (const field of [...fields].sort()) {
    const beforeValue = left[field];
    const afterValue = right[field];
    const beforeText = formatValue(beforeValue);
    const afterText = formatValue(afterValue);

    if (!(field in left)) {
      entries.push({ field, type: "added", after: afterText });
      continue;
    }

    if (!(field in right)) {
      entries.push({ field, type: "removed", before: beforeText });
      continue;
    }

    if (beforeText !== afterText) {
      entries.push({ field, type: "changed", before: beforeText, after: afterText });
    }
  }

  return entries;
}

export function diffCmsRecordFromCurrent(
  snapshot: Record<string, unknown>,
  current: Record<string, unknown>,
): CmsDiffEntry[] {
  return diffCmsRecords(snapshot, current);
}
