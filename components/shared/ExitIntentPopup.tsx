"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function ExitIntentPopup({
  title = "Wait! Get a free appraisal before you go",
  message = "Schedule your free appraisal today — no obligation.",
}: {
  title?: string;
  message?: string;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("exit-intent-dismissed")) return;

    function handleMouseLeave(e: MouseEvent) {
      if (e.clientY <= 0) {
        setOpen(true);
        sessionStorage.setItem("exit-intent-dismissed", "1");
      }
    }

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{message}</DialogDescription>
        </DialogHeader>
        <Button asChild className="bg-brand-gold text-brand-navy">
          <Link href="/schedule-appointment/">Get Your Free Appraisal</Link>
        </Button>
      </DialogContent>
    </Dialog>
  );
}
