import Link from "next/link";
import { ArrowRight, Clock, Mail, MapPin, Phone } from "lucide-react";

import { ContactForm } from "@/components/forms/ContactForm";
import { GoogleMapEmbed } from "@/components/sections/GoogleMapEmbed";
import { PageHero } from "@/components/sections/PageHero";
import { Reveal } from "@/components/shared/motion";
import { buildMetadataFromCms } from "@/lib/seo";
import { getNavigation, getSiteSettings } from "@/lib/cms/fetch";

export async function generateMetadata() {
  const settings = await getSiteSettings();
  return buildMetadataFromCms({
    title: "Contact Us",
    description:
      "Contact Trade-In Solutions Irvine — call, email, or send us a message. We're here to help you sell your car.",
    path: "/contact/",
    settings,
  });
}

export default async function ContactPage() {
  const [settings, navItems] = await Promise.all([getSiteSettings(), getNavigation()]);
  const phoneHref = settings.phone.replace(/\D/g, "");

  const contactDetails = [
    { icon: MapPin, label: "Address", value: settings.address },
    { icon: Phone, label: "Phone", value: settings.phone, href: `tel:${phoneHref}` },
    {
      icon: Mail,
      label: "Email",
      value: settings.email,
      href: `mailto:${settings.email}`,
    },
    { icon: Clock, label: "Hours", value: settings.hours },
  ];

  const quickLinks = navItems.filter((item) =>
    ["/faq/", "/schedule-appointment/", "/branch-locations/"].includes(item.href),
  );

  return (
    <div>
      <PageHero
        eyebrow="Contact"
        title="Get In Touch"
        subtitle="Questions about selling your car? Call, email, or send us a message — we respond fast."
      />

      <div className="mx-auto grid max-w-6xl items-start gap-10 px-4 py-16 lg:grid-cols-[1.2fr_1fr]">
        <Reveal>
          <div className="rounded-2xl border bg-card p-8 shadow-sm md:p-10">
            <h2 className="text-2xl font-bold text-brand-navy">Send a Message</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              We&apos;ll get back to you within one business day.
            </p>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>
        </Reveal>

        <div className="space-y-6">
          <Reveal delay={0.1}>
            <ul className="grid gap-4 sm:grid-cols-2">
              {contactDetails.map((detail) => (
                <li
                  key={detail.label}
                  className="rounded-2xl border bg-card p-5 shadow-sm"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-gold/15 text-brand-gold">
                    <detail.icon className="h-5 w-5" />
                  </span>
                  <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {detail.label}
                  </p>
                  {detail.href ? (
                    <Link
                      href={detail.href}
                      className="mt-1 block text-sm font-semibold text-brand-navy hover:text-brand-gold"
                    >
                      {detail.value}
                    </Link>
                  ) : (
                    <p className="mt-1 text-sm font-medium text-foreground/80">
                      {detail.value}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.2}>
            <GoogleMapEmbed
              embedUrl={settings.mapEmbedUrl}
              title="Irvine location map"
            />
          </Reveal>

          {quickLinks.length ? (
            <Reveal delay={0.25}>
              <div className="rounded-2xl border bg-muted/40 p-6">
                <h3 className="font-semibold text-brand-navy">
                  Looking for something else?
                </h3>
                <ul className="mt-4 space-y-3">
                  {quickLinks.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="group inline-flex items-center gap-2 text-sm font-medium text-brand-gold"
                      >
                        {item.label}
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ) : null}
        </div>
      </div>
    </div>
  );
}
