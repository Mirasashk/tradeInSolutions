# Context — components/admin

## Purpose

Shared UI for the Firebase-backed `/admin` CMS panel: auth, layout, forms, and collection editors.

## Key files

- AuthProvider.tsx: Firebase Auth state and admin profile check
- AdminLayout.tsx: Sidebar navigation and auth gate
- SaveBar.tsx: Draft/publish content and trigger site rebuild
- ImageUploadField.tsx: Firebase Storage uploads for CMS images
- MarkdownField.tsx: Markdown editing with preview
- CollectionListPage.tsx: Reusable list view for Firestore collections

## Implemented

- [x] Auth provider and layout shell
- [x] Save bar with cmsPublish integration
- [x] Image upload and markdown fields
- [x] Collection list helper

## Remaining

- [ ] None

## Conventions

- All components are client components (`"use client"`).
- Edit routes use query params (`?id=`) for static export compatibility.

## Notes

- Admin users must have a matching document in `admins/{uid}`.
