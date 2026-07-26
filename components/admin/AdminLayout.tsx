"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

import { useAuth } from "@/components/admin/AuthProvider";
import { signOutAdmin } from "@/lib/firebase/auth";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type NavItem = { href: string; label: string };
type NavGroup = { label?: string; items: NavItem[] };

const NAV_GROUPS_STORAGE_KEY = "admin-nav-open-groups";

const navGroups: NavGroup[] = [
  {
    items: [{ href: "/admin/", label: "Dashboard" }],
  },
  {
    label: "Operations",
    items: [
      { href: "/admin/leads/", label: "Leads" },
      { href: "/admin/appointments/", label: "Appointments" },
    ],
  },
  {
    label: "Content Management",
    items: [
      { href: "/admin/content/site-settings/", label: "Site Settings" },
      { href: "/admin/content/navigation/", label: "Navigation" },
      { href: "/admin/content/home/", label: "Home Page" },
      { href: "/admin/content/about/", label: "About" },
      { href: "/admin/content/appointment/", label: "Appointment Page" },
      { href: "/admin/content/blog/", label: "Blog" },
      { href: "/admin/content/testimonials/", label: "Testimonials" },
      { href: "/admin/content/locations/", label: "Locations" },
      { href: "/admin/content/faq/", label: "FAQ" },
      { href: "/admin/content/pages/", label: "Pages" },
      { href: "/admin/content/marketing/", label: "Marketing" },
      { href: "/admin/content/team/", label: "Team" },
      { href: "/admin/content/trust-badges/", label: "Trust Badges" },
    ],
  },
];

function isNavActive(pathname: string | null, href: string): boolean {
  if (!pathname) return false;
  if (href === "/admin/") {
    return pathname === "/admin" || pathname === "/admin/";
  }
  if (pathname === href) return true;
  const base = href.endsWith("/") ? href.slice(0, -1) : href;
  return pathname.startsWith(`${base}/`) || pathname === base;
}

function groupHasActiveItem(group: NavGroup, pathname: string | null): boolean {
  return group.items.some((item) => isNavActive(pathname, item.href));
}

function readStoredOpenGroups(): string[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(NAV_GROUPS_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed)
      ? parsed.filter((v): v is string => typeof v === "string")
      : null;
  } catch {
    return null;
  }
}

function defaultOpenGroups(pathname: string | null): string[] {
  return navGroups
    .filter((group) => group.label && groupHasActiveItem(group, pathname))
    .map((group) => group.label!);
}

function NavLink({ item, pathname }: { item: NavItem; pathname: string | null }) {
  const active = isNavActive(pathname, item.href);

  return (
    <Link
      href={item.href}
      className={cn(
        "rounded-md px-3 py-2 text-sm",
        active ? "bg-brand-navy text-white" : "text-slate-700 hover:bg-slate-100",
      )}
    >
      {item.label}
    </Link>
  );
}

function getInitialOpenGroups(pathname: string | null): string[] {
  const stored = readStoredOpenGroups();
  const active = defaultOpenGroups(pathname);
  if (stored) {
    return Array.from(new Set([...stored, ...active]));
  }
  return active;
}

function AdminSidebarNav({ pathname }: { pathname: string | null }) {
  const [openGroups, setOpenGroups] = useState<string[]>(() =>
    getInitialOpenGroups(pathname),
  );
  const [prevPathname, setPrevPathname] = useState(pathname);

  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    const activeGroups = defaultOpenGroups(pathname);
    if (activeGroups.length > 0) {
      setOpenGroups((current) => Array.from(new Set([...current, ...activeGroups])));
    }
  }

  useEffect(() => {
    window.localStorage.setItem(NAV_GROUPS_STORAGE_KEY, JSON.stringify(openGroups));
  }, [openGroups]);

  function toggleGroup(label: string) {
    setOpenGroups((current) =>
      current.includes(label)
        ? current.filter((item) => item !== label)
        : [...current, label],
    );
  }

  return (
    <nav className="flex flex-col gap-4">
      {navGroups.map((group) => {
        if (!group.label) {
          return (
            <div key="dashboard" className="flex flex-col gap-1">
              {group.items.map((item) => (
                <NavLink key={item.href} item={item} pathname={pathname} />
              ))}
            </div>
          );
        }

        const isOpen = openGroups.includes(group.label);

        return (
          <div key={group.label}>
            <button
              type="button"
              onClick={() => toggleGroup(group.label!)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between rounded-md px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground hover:bg-slate-100 hover:text-brand-navy"
            >
              <span>{group.label}</span>
              <ChevronDown
                className={cn(
                  "h-4 w-4 shrink-0 transition-transform duration-200",
                  isOpen ? "rotate-0" : "-rotate-90",
                )}
                aria-hidden
              />
            </button>
            {isOpen ? (
              <div className="mt-1 flex flex-col gap-1 pl-1">
                {group.items.map((item) => (
                  <NavLink key={item.href} item={item} pathname={pathname} />
                ))}
              </div>
            ) : null}
          </div>
        );
      })}
    </nav>
  );
}

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
        <AdminSidebarNav pathname={pathname} />
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
