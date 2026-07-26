import { describe, expect, it, vi } from "vitest";

import { restoreCmsVersion } from "./cms-restore";

vi.mock("@/lib/firebase/cms-versions", () => ({
  getCmsVersion: vi.fn(),
}));

import { getCmsVersion } from "@/lib/firebase/cms-versions";

describe("cms-restore", () => {
  it("restores snapshot as draft and strips meta fields", async () => {
    vi.mocked(getCmsVersion).mockResolvedValue({
      id: "version-1",
      action: "draft",
      status: "published",
      snapshot: {
        title: "Old title",
        status: "published",
        updatedAt: "2026-01-01",
        updatedBy: { uid: "editor-1" },
      },
    });

    const save = vi.fn().mockResolvedValue(undefined);

    const restored = await restoreCmsVersion({
      collectionPath: "cmsBlogPosts",
      docId: "post-1",
      versionId: "version-1",
      meta: { uid: "editor-2", email: "editor@example.com" },
      save,
    });

    expect(restored).toEqual({ title: "Old title" });
    expect(save).toHaveBeenCalledWith({ title: "Old title" }, "draft", {
      uid: "editor-2",
      email: "editor@example.com",
      restoredFromVersionId: "version-1",
    });
  });
});
