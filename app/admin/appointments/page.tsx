"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

import { AppointmentDetailPanel } from "@/components/admin/appointments/AppointmentDetailPanel";
import { AppointmentsCalendar } from "@/components/admin/appointments/AppointmentsCalendar";
import { AppointmentsList } from "@/components/admin/appointments/AppointmentsList";
import { AppointmentsToolbar } from "@/components/admin/appointments/AppointmentsToolbar";
import { isAppointmentLead } from "@/lib/admin/appointments";
import { listLeads } from "@/lib/firebase/firestore";
import type { AppointmentLead } from "@/types";

export default function AdminAppointmentsPage() {
  const now = new Date();
  const [view, setView] = useState<"calendar" | "list">("calendar");
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [leads, setLeads] = useState<AppointmentLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<AppointmentLead | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const loadAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const items = await listLeads("appointment");
      setLeads(items.filter(isAppointmentLead) as AppointmentLead[]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    listLeads("appointment")
      .then((items) => {
        if (!cancelled) {
          setLeads(items.filter(isAppointmentLead) as AppointmentLead[]);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const monthLabel = useMemo(
    () =>
      new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(
        new Date(year, month, 1),
      ),
    [year, month],
  );

  function goToMonth(nextYear: number, nextMonth: number) {
    const date = new Date(nextYear, nextMonth, 1);
    setYear(date.getFullYear());
    setMonth(date.getMonth());
  }

  function handleSelect(lead: AppointmentLead) {
    setSelected(lead);
    setDetailOpen(true);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-brand-navy">Appointments</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Appointment requests submitted through the website. For all other form
          submissions, see{" "}
          <Link href="/admin/leads/" className="text-brand-gold hover:underline">
            Leads
          </Link>
          .
        </p>
      </div>

      <AppointmentsToolbar
        monthLabel={monthLabel}
        view={view}
        loading={loading}
        onPrevMonth={() => goToMonth(year, month - 1)}
        onNextMonth={() => goToMonth(year, month + 1)}
        onToday={() => {
          const today = new Date();
          setYear(today.getFullYear());
          setMonth(today.getMonth());
        }}
        onViewChange={setView}
        onRefresh={() => void loadAppointments()}
      />

      {loading && leads.length === 0 ? (
        <p className="text-muted-foreground">Loading appointments…</p>
      ) : view === "calendar" ? (
        <AppointmentsCalendar
          leads={leads}
          year={year}
          month={month}
          onSelect={handleSelect}
        />
      ) : (
        <AppointmentsList leads={leads} onSelect={handleSelect} />
      )}

      <AppointmentDetailPanel
        lead={selected}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
    </div>
  );
}
