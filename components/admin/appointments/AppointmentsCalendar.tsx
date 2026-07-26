"use client";

import {
  filterAppointmentsForMonth,
  getMonthBounds,
  groupAppointmentsByDate,
  toDateKey,
} from "@/lib/admin/appointments";
import type { AppointmentLead } from "@/types";
import { cn } from "@/lib/utils";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

type AppointmentsCalendarProps = {
  leads: AppointmentLead[];
  year: number;
  month: number;
  onSelect: (lead: AppointmentLead) => void;
};

export function AppointmentsCalendar({
  leads,
  year,
  month,
  onSelect,
}: AppointmentsCalendarProps) {
  const monthLeads = filterAppointmentsForMonth(leads, year, month);
  const grouped = groupAppointmentsByDate(monthLeads);
  const { daysInMonth } = getMonthBounds(year, month);
  const firstWeekday = new Date(year, month, 1).getDay();

  const cells: Array<{ day: number | null; dateKey: string | null }> = [];
  for (let i = 0; i < firstWeekday; i += 1) {
    cells.push({ day: null, dateKey: null });
  }
  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push({ day, dateKey: toDateKey(year, month, day) });
  }

  const todayKey = toDateKey(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate(),
  );

  return (
    <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
      <div className="grid grid-cols-7 border-b bg-muted/40">
        {WEEKDAYS.map((label) => (
          <div
            key={label}
            className="px-2 py-2 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground"
          >
            {label}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {cells.map((cell, index) => {
          if (cell.day === null || cell.dateKey === null) {
            return (
              <div
                key={`empty-${index}`}
                className="min-h-28 border-b border-r bg-muted/10"
              />
            );
          }

          const dayLeads = grouped.get(cell.dateKey) ?? [];
          const isToday = cell.dateKey === todayKey;

          return (
            <div
              key={cell.dateKey}
              className="min-h-28 border-b border-r p-2 align-top last:border-r-0"
            >
              <div
                className={cn(
                  "mb-2 inline-flex h-7 w-7 items-center justify-center rounded-full text-sm font-medium",
                  isToday ? "bg-brand-gold text-brand-navy" : "text-brand-navy",
                )}
              >
                {cell.day}
              </div>
              <ul className="space-y-1">
                {dayLeads.slice(0, 3).map((lead) => (
                  <li key={lead.id}>
                    <button
                      type="button"
                      onClick={() => onSelect(lead)}
                      className="w-full truncate rounded-md bg-brand-navy/5 px-1.5 py-1 text-left text-xs font-medium text-brand-navy hover:bg-brand-gold/20"
                    >
                      {lead.preferredTime.slice(0, 5)} · {lead.name}
                    </button>
                  </li>
                ))}
                {dayLeads.length > 3 ? (
                  <li className="px-1.5 text-xs text-muted-foreground">
                    +{dayLeads.length - 3} more
                  </li>
                ) : null}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
