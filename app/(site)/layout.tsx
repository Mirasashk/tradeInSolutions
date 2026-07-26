import { AnnouncementBar } from "@/components/shared/AnnouncementBar";
import { CTABanner } from "@/components/shared/CTABanner";
import { ExitIntentPopup } from "@/components/shared/ExitIntentPopup";
import { Footer } from "@/components/shared/Footer";
import { LiveChat } from "@/components/shared/LiveChat";
import { Nav } from "@/components/shared/Nav";
import { ScrollTracker } from "@/components/shared/ScrollTracker";
import { buildLocalBusinessJsonLd, buildMetadata } from "@/lib/seo";
import { getNavigation, getSiteSettings } from "@/lib/cms/fetch";

export const metadata = buildMetadata({
  title: "Sell Your Car for Cash in Irvine",
  description:
    "Free appraisal, same-day payment, and a hassle-free car selling experience in Orange County.",
});

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [settings, navItems] = await Promise.all([getSiteSettings(), getNavigation()]);
  const jsonLd = buildLocalBusinessJsonLd(settings);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ScrollTracker />
      <LiveChat scriptUrl={settings.liveChatScriptUrl} />
      <AnnouncementBar settings={settings} />
      <Nav items={navItems} settings={settings} />
      <main className="pb-24">{children}</main>
      <CTABanner settings={settings} sticky />
      <Footer settings={settings} navItems={navItems} />
      <ExitIntentPopup
        title={settings.exitIntentTitle}
        message={settings.exitIntentMessage}
      />
    </>
  );
}
