"use client";

import { History } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import { stripContentMeta } from "@/lib/admin/cms-content-meta";
import { diffCmsRecordFromCurrent, type CmsDiffEntry } from "@/lib/admin/cms-diff";
import { CMS_SAVE_MESSAGES, getErrorMessage } from "@/lib/admin/cms-save-feedback";
import { restoreCmsVersion } from "@/lib/admin/cms-restore";
import { useCmsEditorMeta } from "@/lib/admin/use-cms-editor-meta";
import { listCmsVersions } from "@/lib/firebase/cms-versions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { CmsStatus, CmsVersion, CmsWriteMeta } from "@/types/cms";

export type CmsVersionHistoryProps<T extends Record<string, unknown>> = {
  collectionPath: string;
  docId?: string | null;
  currentData: T;
  disabled?: boolean;
  saving?: boolean;
  onRestored: (data: T) => void;
  save: (data: T, status: CmsStatus, meta?: CmsWriteMeta) => Promise<void>;
};

function formatWhen(value?: string) {
  if (!value) return "Unknown time";
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function actionLabel(action: CmsVersion["action"]) {
  switch (action) {
    case "published":
      return "Published";
    case "revert":
      return "Restored";
    case "create":
      return "Created";
    default:
      return "Draft save";
  }
}

function CmsVersionDiff({ entries }: { entries: CmsDiffEntry[] }) {
  if (entries.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">No differences from current form.</p>
    );
  }

  return (
    <div className="max-h-64 overflow-auto rounded-md border">
      <table className="w-full text-left text-sm">
        <thead className="sticky top-0 bg-muted/80">
          <tr>
            <th className="px-3 py-2 font-medium">Field</th>
            <th className="px-3 py-2 font-medium">Change</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr key={entry.field} className="border-t align-top">
              <td className="px-3 py-2 font-mono text-xs">{entry.field}</td>
              <td className="px-3 py-2">
                {entry.type === "changed" ? (
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground line-through">
                      {entry.before}
                    </p>
                    <p className="text-xs text-brand-navy">{entry.after}</p>
                  </div>
                ) : entry.type === "added" ? (
                  <p className="text-xs text-brand-navy">+ {entry.after}</p>
                ) : (
                  <p className="text-xs text-muted-foreground">− {entry.before}</p>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function CmsVersionHistory<T extends Record<string, unknown>>({
  collectionPath,
  docId,
  currentData,
  disabled,
  saving,
  onRestored,
  save,
}: CmsVersionHistoryProps<T>) {
  const editorMeta = useCmsEditorMeta();
  const [loading, setLoading] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [versions, setVersions] = useState<CmsVersion[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const wasSavingRef = useRef(false);

  const canLoadVersions = Boolean(docId && !disabled);
  const [prevCanLoad, setPrevCanLoad] = useState(canLoadVersions);

  if (canLoadVersions !== prevCanLoad) {
    setPrevCanLoad(canLoadVersions);
    if (canLoadVersions) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }

  const loadVersions = useCallback(async () => {
    if (!docId || disabled) return;
    const items = await listCmsVersions(collectionPath, docId);
    setVersions(items);
    setSelectedId((current) => {
      if (current && items.some((item) => item.id === current)) return current;
      return items[0]?.id ?? null;
    });
  }, [collectionPath, docId, disabled]);

  useEffect(() => {
    if (!canLoadVersions) return;

    let cancelled = false;

    listCmsVersions(collectionPath, docId!)
      .then((items) => {
        if (cancelled) return;
        setVersions(items);
        setSelectedId((current) => {
          if (current && items.some((item) => item.id === current)) return current;
          return items[0]?.id ?? null;
        });
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [canLoadVersions, collectionPath, docId]);

  useEffect(() => {
    if (wasSavingRef.current && !saving && docId && !disabled) {
      void loadVersions();
    }
    wasSavingRef.current = Boolean(saving);
  }, [saving, docId, disabled, loadVersions]);

  const selectedVersion = useMemo(
    () =>
      (canLoadVersions
        ? versions.find((version) => version.id === selectedId)
        : null) ?? null,
    [canLoadVersions, versions, selectedId],
  );

  const diffEntries = useMemo(() => {
    if (!selectedVersion) return [];
    return diffCmsRecordFromCurrent(
      stripContentMeta(selectedVersion.snapshot),
      stripContentMeta(currentData),
    );
  }, [selectedVersion, currentData]);

  async function handleRestore() {
    if (!docId || !selectedVersion || !editorMeta) return;

    const confirmed = confirm(
      "Restore this version as a draft? The current content will be archived in version history.",
    );
    if (!confirmed) return;

    setRestoring(true);
    try {
      const restored = await restoreCmsVersion({
        collectionPath,
        docId,
        versionId: selectedVersion.id,
        meta: editorMeta,
        save: async (data, status, meta) => save(data as T, status, meta),
      });
      onRestored(restored as T);
      toast.success(CMS_SAVE_MESSAGES.versionRestored);
      await loadVersions();
    } catch (error) {
      toast.error(CMS_SAVE_MESSAGES.versionRestoreFailed, {
        description: getErrorMessage(error),
      });
    } finally {
      setRestoring(false);
    }
  }

  return (
    <aside className="sticky top-8 w-full shrink-0 lg:w-80 xl:w-96">
      <div className="flex max-h-[calc(100vh-6rem)] flex-col rounded-lg border bg-white shadow-sm">
        <div className="border-b px-4 py-3">
          <div className="flex items-center gap-2">
            <History className="h-4 w-4 text-brand-navy" />
            <h2 className="text-sm font-semibold text-brand-navy">Version history</h2>
            {versions.length ? (
              <Badge variant="secondary" className="ml-auto">
                {versions.length}
              </Badge>
            ) : null}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Compare previous saves and restore a version as draft.
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {disabled || !docId ? (
            <p className="text-sm text-muted-foreground">
              Save this document once to start building version history.
            </p>
          ) : null}

          {!disabled && docId && loading ? (
            <p className="text-sm text-muted-foreground">Loading versions…</p>
          ) : null}

          {!disabled && docId && !loading && versions.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No versions yet. Save changes to start building history.
            </p>
          ) : null}

          {!disabled && docId && !loading && versions.length > 0 ? (
            <div className="space-y-4">
              <ul className="space-y-2">
                {versions.map((version) => (
                  <li key={version.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedId(version.id)}
                      className={`w-full rounded-md border px-3 py-2 text-left transition ${
                        selectedId === version.id
                          ? "border-brand-gold bg-brand-gold/10"
                          : "hover:border-brand-gold/40"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-medium text-brand-navy">
                          {formatWhen(version.createdAt)}
                        </span>
                        <Badge variant="outline">{actionLabel(version.action)}</Badge>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {version.createdBy?.email ??
                          version.createdBy?.uid ??
                          "Unknown editor"}{" "}
                        · {version.status}
                      </p>
                    </button>
                  </li>
                ))}
              </ul>

              {selectedVersion ? (
                <div className="space-y-3 border-t pt-4">
                  <h3 className="text-sm font-semibold text-brand-navy">
                    Changes vs current form
                  </h3>
                  <CmsVersionDiff entries={diffEntries} />
                  <Button
                    type="button"
                    className="w-full"
                    onClick={() => void handleRestore()}
                    disabled={restoring || !editorMeta}
                  >
                    {restoring ? "Restoring…" : "Restore as draft"}
                  </Button>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </aside>
  );
}
