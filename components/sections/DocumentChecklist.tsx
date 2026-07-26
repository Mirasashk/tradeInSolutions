"use client";

import { useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ChecklistProps = {
  owned: string[];
  financed: string[];
  leased: string[];
};

export function DocumentChecklist({ owned, financed, leased }: ChecklistProps) {
  const [tab, setTab] = useState<"owned" | "financed" | "leased">("owned");

  const lists = { owned, financed, leased };
  const labels = {
    owned: "I Own My Car",
    financed: "My Car Is Financed",
    leased: "My Car Is Leased",
  };
  const items = lists[tab].length
    ? lists[tab]
    : [
        "Valid driver's license",
        "Vehicle registration",
        "All keys and remotes",
        "Payoff letter (if financed)",
      ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>What to Bring to Your Appointment</CardTitle>
        <div className="mt-2 flex flex-wrap gap-2">
          {(Object.keys(labels) as Array<keyof typeof labels>).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                tab === key
                  ? "bg-brand-navy text-white"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {labels[key]}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
