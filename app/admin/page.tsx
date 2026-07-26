"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { listLeads } from "@/lib/firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminDashboardPage() {
  const [leadCount, setLeadCount] = useState<number | null>(null);

  useEffect(() => {
    void listLeads().then((leads) => setLeadCount(leads.length));
  }, []);

  const shortcuts = [
    {
      href: "/admin/leads/",
      label: "View leads",
      description: "Form submissions inbox",
    },
    {
      href: "/admin/content/site-settings/",
      label: "Site settings",
      description: "Phone, hours, logo",
    },
    {
      href: "/admin/content/home/",
      label: "Home page",
      description: "Hero and homepage sections",
    },
    { href: "/admin/content/blog/", label: "Blog", description: "Posts and articles" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-brand-navy">Dashboard</h1>
        <p className="text-muted-foreground">Manage site content and leads.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-brand-navy">{leadCount ?? "—"}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {shortcuts.map((item) => (
          <Link key={item.href} href={item.href}>
            <Card className="transition hover:border-brand-gold">
              <CardHeader>
                <CardTitle className="text-base">{item.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <p className="text-xs text-muted-foreground">
        After editing content, click <strong>Publish content</strong> then{" "}
        <strong>Publish site</strong> to rebuild the live static site.
      </p>
    </div>
  );
}
