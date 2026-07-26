"use client";

import { ChevronLeft, ChevronRight, LayoutGrid, List, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";

type AppointmentsToolbarProps = {
  monthLabel: string;
  view: "calendar" | "list";
  loading?: boolean;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
  onViewChange: (view: "calendar" | "list") => void;
  onRefresh: () => void;
};

export function AppointmentsToolbar({
  monthLabel,
  view,
  loading,
  onPrevMonth,
  onNextMonth,
  onToday,
  onViewChange,
  onRefresh,
}: AppointmentsToolbarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <Button type="button" variant="outline" size="icon" onClick={onPrevMonth}>
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Previous month</span>
        </Button>
        <Button type="button" variant="outline" onClick={onToday}>
          Today
        </Button>
        <Button type="button" variant="outline" size="icon" onClick={onNextMonth}>
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Next month</span>
        </Button>
        <h2 className="ml-2 text-lg font-semibold text-brand-navy">{monthLabel}</h2>
      </div>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant={view === "calendar" ? "default" : "outline"}
          size="sm"
          onClick={() => onViewChange("calendar")}
        >
          <LayoutGrid className="mr-1.5 h-4 w-4" />
          Calendar
        </Button>
        <Button
          type="button"
          variant={view === "list" ? "default" : "outline"}
          size="sm"
          onClick={() => onViewChange("list")}
        >
          <List className="mr-1.5 h-4 w-4" />
          List
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={onRefresh}
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          <span className="sr-only">Refresh</span>
        </Button>
      </div>
    </div>
  );
}
