"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

import { useAuth } from "@/components/admin/AuthProvider";
import { signOutAdmin } from "@/lib/firebase/auth";
import { Button } from "@/components/ui/button";

const navLinks = [
  { href: "/admin/", label: "Dashboard" },
  { href: "/admin/leads/", label: "Leads" },
  { href: "/admin/content/site-settings/", label: "Site Settings" },
  { href: "/admin/content/navigation/", label: "Navigation" },
  { href: "/admin/content/home/", label: "Home Page" },
  { href: "/admin/content/about/", label: "About" },
  { href: "/admin/content/appointment/", label: "Appointment" },
  { href: "/admin/content/blog/", label: "Blog" },
  { href: "/admin/content/testimonials/", label: "Testimonials" },
  { href: "/admin/content/locations/", label: "Locations" },
  { href: "/admin/content/faq/", label: "FAQ" },
  { href: "/admin/content/pages/", label: "Pages" },
  { href: "/admin/content/marketing/", label: "Marketing" },
  { href: "/admin/content/team/", label: "Team" },
  { href: "/admin/content/trust-badges/", label: "Trust Badges" },
];

export function AdminLayout({ children }: { children: ReactNode }) {
  const { user, loading, isAdmin, configured } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname?.startsWith("/admin/login");

  useEffect(() => {
    if (loading || isLoginPage) return;
    if (!configured) return;
    if (!user) {
      router.replace("/admin/login/");
    }
  }, [user, loading, isLoginPage, router, configured]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-muted-foreground">Loading…</p>
      </div>
    );
  }

  if (!configured) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-8">
        <p className="text-center text-muted-foreground">
          Firebase is not configured. Set NEXT_PUBLIC_FIREBASE_* in your environment.
        </p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 p-8">
        <h1 className="text-xl font-semibold text-brand-navy">Unauthorized</h1>
        <p className="text-muted-foreground">
          Your account is not registered as an admin. Contact the site owner.
        </p>
        <Button variant="outline" onClick={() => signOutAdmin()}>
          Sign out
        </Button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="w-64 shrink-0 border-r bg-white p-4">
        <div className="mb-6">
          <p className="text-sm font-semibold text-brand-navy">Trade-In Solutions</p>
          <p className="text-xs text-muted-foreground">Admin</p>
        </div>
        <nav className="flex flex-col gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-md px-3 py-2 text-sm ${
                pathname === link.href || pathname?.startsWith(link.href.slice(0, -1))
                  ? "bg-brand-navy text-white"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="mt-8 border-t pt-4">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start"
            onClick={() => signOutAdmin()}
          >
            Sign out
          </Button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto p-8">{children}</main>
    </div>
  );
}
