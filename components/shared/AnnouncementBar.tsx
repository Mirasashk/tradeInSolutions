import type { SiteSettings } from "@/types";

export function AnnouncementBar({ settings }: { settings: SiteSettings }) {
  if (!settings.announcementText) {
    return null;
  }

  return (
    <div className="bg-brand-gold px-4 py-2 text-center text-sm font-semibold text-brand-navy">
      {settings.announcementText}
    </div>
  );
}
