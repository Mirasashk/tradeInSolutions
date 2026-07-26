# Context — components/admin/versions

## Purpose

Shared CMS version history UI for admin editor pages: list prior saves, compare against current form state, and restore as draft.

## Key files

- CmsVersionHistory.tsx: Persistent sidebar with version list, field diff table, and restore-as-draft action
- CmsEditorLayout.tsx: Two-column editor layout (form + version sidebar)

## Implemented

- [x] Version list with timestamp, author, action badge, and status
- [x] Field-level diff vs current unsaved form state
- [x] Restore as draft with confirmation and toast feedback
- [x] Always-visible version sidebar on all 15 CMS editor pages via `CmsEditorLayout`

## Remaining

- [ ] Unified diff snippet for long markdown fields (optional enhancement)

## Conventions

- Reads from `{collection}/{docId}/versions` via `lib/firebase/cms-versions.ts`
- Writes only through save helpers + Cloud Function triggers (no direct version writes)
- Disabled on new collection docs until first save assigns an ID

## Notes

- Snapshots store pre-write document state (archived by `cmsVersionOnWrite` Cloud Function).
- Retention cap is 50 versions per document.
