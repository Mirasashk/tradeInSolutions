# Context — app/admin

## Purpose

Client-side admin SPA for CMS content editing, leads inbox, and site publish triggers. Compatible with Next.js static export.

## Key files

- layout.tsx: AuthProvider + AdminLayout wrapper
- login/page.tsx: Email/password sign-in
- page.tsx: Dashboard
- leads/page.tsx: Form submission inbox
- content/**: CRUD editors for all CMS types

## Implemented

- [x] Login, dashboard, leads inbox
- [x] Singleton editors (site settings, navigation, home, about, appointment)
- [x] Collection editors (blog, testimonials, locations, FAQ, pages, team, trust badges, marketing)

## Remaining

- [ ] None

## Conventions

- Static routes only; collection edits use `/edit/?id=` query params.
- Publish site calls `/api/cms-publish` with Firebase ID token.

## Notes

- Disallowed in robots.txt. Protected by Firebase Auth + Firestore rules.
