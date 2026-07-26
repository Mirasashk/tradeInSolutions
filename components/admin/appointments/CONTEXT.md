# Context — components/admin/appointments

## Purpose

Admin UI for viewing website appointment requests from Firestore `leads` (type `appointment`).

## Key files

- AppointmentsToolbar.tsx: Month navigation, calendar/list toggle, refresh
- AppointmentsCalendar.tsx: Month grid with per-day appointment chips
- AppointmentsList.tsx: Upcoming/past list grouped cards
- AppointmentDetailPanel.tsx: Dialog with full lead details and contact links

## Implemented

- [x] Calendar month view with day cells
- [x] List view (upcoming vs past)
- [x] Detail dialog with tel/mailto links
- [x] Reads via `listLeads("appointment")`

## Remaining

- [ ] Status editing (pending/confirmed/completed/cancelled)
- [ ] Google Calendar two-way sync

## Conventions

- Dates parsed as Pacific Time (`America/Los_Angeles`) in `lib/admin/appointments.ts`.
- Read-only v1 — no client writes to `leads`.

## Notes

- Google Calendar integration deferred; see `docs/decisions.md`.
