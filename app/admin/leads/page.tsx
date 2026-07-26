"use client";

import { useEffect, useState } from "react";

import { listLeads } from "@/lib/firebase/firestore";
import type { LeadRecord } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const LEAD_TYPES = [
  "",
  "contact",
  "appointment",
  "beat_offer",
  "value_estimator",
] as const;

function LeadsInbox({ filter }: { filter: string }) {
  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    void listLeads(filter || undefined)
      .then((items) => {
        if (!cancelled) {
          setLeads(items as LeadRecord[]);
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
  }, [filter]);

  if (loading) {
    return <p className="text-muted-foreground">Loading…</p>;
  }

  if (leads.length === 0) {
    return <p className="text-muted-foreground">No leads yet.</p>;
  }

  return (
    <div className="space-y-4">
      {leads.map((lead) => (
        <Card key={lead.id}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base capitalize">
              {lead.type.replace(/_/g, " ")}
            </CardTitle>
            <Badge variant="outline">{lead.createdAt ?? "—"}</Badge>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-2 text-sm sm:grid-cols-2">
              {Object.entries(lead)
                .filter(([key]) => !["id", "type", "createdAt"].includes(key))
                .map(([key, value]) => (
                  <div key={key}>
                    <dt className="font-medium text-brand-navy">{key}</dt>
                    <dd className="text-muted-foreground">{String(value ?? "")}</dd>
                  </div>
                ))}
            </dl>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function AdminLeadsPage() {
  const [filter, setFilter] = useState("");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-brand-navy">Leads</h1>
        <p className="text-muted-foreground">Form submissions from the public site.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {LEAD_TYPES.map((type) => (
          <button
            key={type || "all"}
            type="button"
            onClick={() => setFilter(type)}
            className={`rounded-full px-3 py-1 text-sm ${
              filter === type ? "bg-brand-navy text-white" : "bg-white border"
            }`}
          >
            {type || "All"}
          </button>
        ))}
      </div>

      <LeadsInbox key={filter} filter={filter} />
    </div>
  );
}
