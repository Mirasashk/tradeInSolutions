import Link from "next/link";

import { ContactForm } from "@/components/forms/ContactForm";
import { GoogleMapEmbed } from "@/components/sections/GoogleMapEmbed";
import { HeroSection } from "@/components/sections/HeroSection";
import { buildMetadataFromCms } from "@/lib/seo";
import { getNavigation, getSiteSettings } from "@/lib/cms/fetch";

export async function generateMetadata() {
  const settings = await getSiteSettings();
  return buildMetadataFromCms({
    title: "Contact Us",
    description:
      "Contact Trade-In Solutions Irvine — call, email, or send us a message.",
    path: "/contact/",
    settings,
  });
}

export default async function ContactPage() {
  const [settings, navItems] = await Promise.all([getSiteSettings(), getNavigation()]);
  const phoneHref = settings.phone.replace(/\D/g, "");

  return (
    <div>
      <HeroSection
        title="Get In Touch"
        subtitle="We are here to help you sell your car."
      />

      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 lg:grid-cols-2">
        <section>
          <h2 className="text-2xl font-bold text-brand-navy">Send a Message</h2>
          <div className="mt-6">
            <ContactForm />
          </div>
        </section>

        <section className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-brand-navy">Contact Info</h2>
            <ul className="mt-4 space-y-2 text-muted-foreground">
              <li>{settings.address}</li>
              <li>
                <Link
                  href={`tel:${phoneHref}`}
                  className="font-semibold text-brand-gold"
                >
                  {settings.phone}
                </Link>
              </li>
              <li>
                <Link
                  href={`mailto:${settings.email}`}
                  className="text-brand-gold hover:underline"
                >
                  {settings.email}
                </Link>
              </li>
              <li>{settings.hours}</li>
            </ul>
          </div>

          <GoogleMapEmbed embedUrl={settings.mapEmbedUrl} title="Irvine location map" />

          <div>
            <h3 className="font-semibold text-brand-navy">Quick Links</h3>
            <ul className="mt-3 space-y-2 text-sm">
              {navItems
                .filter((item) =>
                  ["/faq/", "/schedule-appointment/", "/branch-locations/"].includes(
                    item.href,
                  ),
                )
                .map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="text-brand-gold hover:underline">
                      {item.label}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
