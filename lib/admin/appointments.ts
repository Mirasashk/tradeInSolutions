import type { AppointmentLead } from "@/types";

/** Appointments are interpreted in Pacific Time (Irvine HQ). */
const TIMEZONE = "America/Los_Angeles";

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const TIME_PATTERN = /^\d{2}:\d{2}(:\d{2})?$/;

export function isAppointmentLead(lead: unknown): lead is AppointmentLead {
  if (!lead || typeof lead !== "object") return false;
  const record = lead as Record<string, unknown>;
  return record.type === "appointment";
}

export function parseAppointmentDateTime(lead: AppointmentLead): Date | null {
  const { preferredDate, preferredTime } = lead;
  if (!DATE_PATTERN.test(preferredDate) || !TIME_PATTERN.test(preferredTime)) {
    return null;
  }

  const time = preferredTime.length === 5 ? `${preferredTime}:00` : preferredTime;
  const parsed = new Date(`${preferredDate}T${time}`);

  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function formatAppointmentDate(lead: AppointmentLead): string {
  const date = parseAppointmentDateTime(lead);
  if (!date) {
    return [lead.preferredDate, lead.preferredTime].filter(Boolean).join(" ");
  }

  return new Intl.DateTimeFormat("en-US", {
    timeZone: TIMEZONE,
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export function sortAppointments(leads: AppointmentLead[]): AppointmentLead[] {
  return [...leads].sort((a, b) => {
    const aDate = parseAppointmentDateTime(a);
    const bDate = parseAppointmentDateTime(b);

    if (aDate && bDate) return aDate.getTime() - bDate.getTime();
    if (aDate) return -1;
    if (bDate) return 1;
    return a.preferredDate.localeCompare(b.preferredDate);
  });
}

export function groupAppointmentsByDate(
  leads: AppointmentLead[],
): Map<string, AppointmentLead[]> {
  const grouped = new Map<string, AppointmentLead[]>();

  for (const lead of leads) {
    const key = DATE_PATTERN.test(lead.preferredDate) ? lead.preferredDate : "unknown";
    const existing = grouped.get(key) ?? [];
    existing.push(lead);
    grouped.set(key, existing);
  }

  for (const [key, items] of grouped) {
    grouped.set(key, sortAppointments(items));
  }

  return grouped;
}

export function getMonthBounds(year: number, month: number) {
  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 0);
  return { start, end, daysInMonth: end.getDate() };
}

export function toDateKey(year: number, month: number, day: number): string {
  const monthStr = String(month + 1).padStart(2, "0");
  const dayStr = String(day).padStart(2, "0");
  return `${year}-${monthStr}-${dayStr}`;
}

export function filterAppointmentsForMonth(
  leads: AppointmentLead[],
  year: number,
  month: number,
): AppointmentLead[] {
  const prefix = `${year}-${String(month + 1).padStart(2, "0")}`;
  return leads.filter((lead) => lead.preferredDate?.startsWith(prefix));
}

export function partitionUpcomingPast(leads: AppointmentLead[]) {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const upcoming: AppointmentLead[] = [];
  const past: AppointmentLead[] = [];

  for (const lead of sortAppointments(leads)) {
    const date = parseAppointmentDateTime(lead);
    if (date && date < now) {
      past.push(lead);
    } else {
      upcoming.push(lead);
    }
  }

  return { upcoming, past: past.reverse() };
}

export function vehicleSummary(lead: AppointmentLead): string {
  return [lead.vehicleYear, lead.vehicleMake, lead.vehicleModel]
    .filter(Boolean)
    .join(" ");
}
