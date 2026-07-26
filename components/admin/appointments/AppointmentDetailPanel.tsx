"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatAppointmentDate, vehicleSummary } from "@/lib/admin/appointments";
import type { AppointmentLead } from "@/types";

type AppointmentDetailPanelProps = {
  lead: AppointmentLead | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function DetailRow({
  label,
  value,
}: {
  label: string;
  value?: string | boolean | null;
}) {
  if (value === undefined || value === null || value === "") return null;

  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-1 text-sm text-brand-navy">
        {typeof value === "boolean" ? (value ? "Yes" : "No") : value}
      </dd>
    </div>
  );
}

export function AppointmentDetailPanel({
  lead,
  open,
  onOpenChange,
}: AppointmentDetailPanelProps) {
  if (!lead) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{lead.name}</DialogTitle>
          <p className="text-sm text-muted-foreground">{formatAppointmentDate(lead)}</p>
        </DialogHeader>

        <dl className="grid gap-4 sm:grid-cols-2">
          <DetailRow label="Phone" value={lead.phone} />
          <DetailRow label="Email" value={lead.email} />
          <DetailRow label="Vehicle" value={vehicleSummary(lead) || undefined} />
          <DetailRow label="Mileage" value={lead.vehicleMileage} />
          <DetailRow label="Condition" value={lead.conditionDescription} />
          <DetailRow label="Previous offer" value={lead.hasPreviousOffer} />
          <DetailRow label="Status" value={lead.appointmentStatus ?? "pending"} />
          <DetailRow label="Submitted" value={lead.createdAt} />
        </dl>

        {lead.notes ? (
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Notes
            </dt>
            <dd className="mt-1 whitespace-pre-wrap text-sm text-brand-navy">
              {lead.notes}
            </dd>
          </div>
        ) : null}

        <div className="flex flex-wrap gap-3 pt-2">
          <a
            href={`tel:${lead.phone.replace(/\D/g, "")}`}
            className="text-sm font-medium text-brand-gold hover:underline"
          >
            Call
          </a>
          <a
            href={`mailto:${lead.email}`}
            className="text-sm font-medium text-brand-gold hover:underline"
          >
            Email
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
}
