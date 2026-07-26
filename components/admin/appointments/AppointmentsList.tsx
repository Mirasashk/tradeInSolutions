"use client";

import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  formatAppointmentDate,
  partitionUpcomingPast,
  vehicleSummary,
} from "@/lib/admin/appointments";
import type { AppointmentLead } from "@/types";

type AppointmentsListProps = {
  leads: AppointmentLead[];
  onSelect: (lead: AppointmentLead) => void;
};

function AppointmentCards({
  title,
  items,
  onSelect,
}: {
  title: string;
  items: AppointmentLead[];
  onSelect: (lead: AppointmentLead) => void;
}) {
  if (items.length === 0) return null;

  return (
    <section className="space-y-3">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </h3>
      <div className="space-y-3">
        {items.map((lead) => (
          <Card
            key={lead.id}
            className="cursor-pointer transition hover:border-brand-gold/60"
            onClick={() => onSelect(lead)}
          >
            <CardHeader className="flex flex-row items-start justify-between gap-3 pb-2">
              <div>
                <CardTitle className="text-base">{lead.name}</CardTitle>
                <p className="mt-1 text-sm text-muted-foreground">
                  {formatAppointmentDate(lead)}
                </p>
              </div>
              <Badge variant="outline">{lead.appointmentStatus ?? "pending"}</Badge>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p>{lead.phone}</p>
              <p>{lead.email}</p>
              {vehicleSummary(lead) ? (
                <p className="mt-1">{vehicleSummary(lead)}</p>
              ) : null}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

export function AppointmentsList({ leads, onSelect }: AppointmentsListProps) {
  const { upcoming, past } = partitionUpcomingPast(leads);

  if (leads.length === 0) {
    return (
      <div className="rounded-2xl border bg-card p-8 text-center shadow-sm">
        <p className="text-muted-foreground">No appointment requests yet.</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Submissions from the{" "}
          <Link
            href="/schedule-appointment/"
            className="text-brand-gold hover:underline"
          >
            schedule appointment
          </Link>{" "}
          form will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <AppointmentCards title="Upcoming" items={upcoming} onSelect={onSelect} />
      <AppointmentCards title="Past" items={past} onSelect={onSelect} />
    </div>
  );
}
