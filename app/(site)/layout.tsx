import { AnnouncementBar } from "@/components/shared/AnnouncementBar";
import { CTABanner } from "@/components/shared/CTABanner";
import { Footer } from "@/components/shared/Footer";
import { Nav } from "@/components/shared/Nav";
import { buildLocalBusinessJsonLd, buildMetadata } from "@/lib/seo";
import { getNavigation, getSiteSettings } from "@/lib/sanity/fetch";

export const metadata = buildMetadata({
  title: "Sell Your Car for Cash in Irvine",
  description:
    "Free appraisal, same-day payment, and a hassle-free car selling experience in Orange County.",
});

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [settings, navItems] = await Promise.all([getSiteSettings(), getNavigation()]);
  const jsonLd = buildLocalBusinessJsonLd();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AnnouncementBar settings={settings} />
      <Nav items={navItems} />
      <main>{children}</main>
      <CTABanner settings={settings} />
      <Footer settings={settings} navItems={navItems} />
    </>
  );
}
