# Context — components/admin

## Purpose

Shared UI for the Firebase-backed `/admin` CMS panel: auth, layout, forms, collection editors, and operations views.

## Key files

- AuthProvider.tsx: Firebase Auth state and admin profile check
- AdminLayout.tsx: Grouped sidebar navigation and auth gate; labeled groups are collapsible with persisted open state
- AdminToaster.tsx: Sonner toast host for admin feedback
- SaveBar.tsx: Draft/publish content and trigger site rebuild (with toasts)
- ImageUploadField.tsx: Firebase Storage uploads for CMS images
- MarkdownField.tsx: Markdown editing with preview
- CollectionListPage.tsx: Reusable list view for Firestore collections
- appointments/: Calendar and list views for appointment leads
- versions/CmsVersionHistory.tsx: Always-visible version history sidebar for CMS editors
- CmsEditorLayout.tsx: Two-column layout wrapping editor forms + version sidebar

## Implemented

- [x] Auth provider and layout shell
- [x] Grouped sidebar: Operations + Content Management (collapsible sections)
- [x] Save bar with cmsPublish integration and toast feedback
- [x] Image upload and markdown fields
- [x] Collection list helper
- [x] Appointments calendar/list page (`/admin/appointments/`)
- [x] CMS version history on all editor pages (diff + restore as draft)

## Remaining

- [ ] Appointment status updates (requires Cloud Function + rules change)
- [ ] Google Calendar sync (deferred — see docs/decisions.md)

## Conventions

- All components are client components (`"use client"`).
- Edit routes use query params (`?id=`) for static export compatibility.
- CMS save/delete feedback uses Sonner via SaveBar and `deleteWithFeedback`.
- Version history reads `versions` subcollections; writes are Cloud Function only.

## Notes

- Admin users must have a matching document in `admins/{uid}`.
- "Appointment Page" in Content Management edits CMS copy; "Appointments" under Operations is the leads calendar.
