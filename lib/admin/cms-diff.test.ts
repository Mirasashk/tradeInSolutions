import { describe, expect, it } from "vitest";

import { diffCmsRecords, flattenCmsData } from "./cms-diff";

describe("cms-diff", () => {
  it("flattens nested objects and skips volatile meta fields", () => {
    const flat = flattenCmsData({
      heroHeadline: "Hello",
      nested: { title: "Nested title" },
      updatedAt: "2026-01-01",
      updatedBy: { uid: "abc" },
    });

    expect(flat).toEqual({
      heroHeadline: "Hello",
      "nested.title": "Nested title",
    });
  });

  it("detects added, removed, and changed fields", () => {
    const entries = diffCmsRecords(
      { title: "Old", body: "Keep" },
      { title: "New", excerpt: "Added" },
    );

    expect(entries).toEqual([
      { field: "body", type: "removed", before: "Keep" },
      { field: "excerpt", type: "added", after: "Added" },
      { field: "title", type: "changed", before: "Old", after: "New" },
    ]);
  });
});
