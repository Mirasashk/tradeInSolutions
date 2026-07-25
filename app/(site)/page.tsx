import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Sell Your Car for Cash in Irvine",
  path: "/",
});

export default function HomePage() {
  return (
    <div>
      <section className="bg-brand-navy px-4 py-20 text-white">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold md:text-5xl">
            We Will Buy Your Car Today — Absolutely Hassle Free!
          </h1>
          <p className="mt-4 text-lg text-white/85">
            Get a fair cash offer with a free appraisal. Same-day payment available.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="bg-brand-gold text-brand-navy hover:bg-brand-gold/90"
            >
              <Link href="/schedule-appointment/">Get Your Free Appraisal</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10"
            >
              <Link href="tel:8884272302">Call (888) 427-2302</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-center text-3xl font-bold text-brand-navy">
          Quick Actions
        </h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { title: "How It Works", href: "/about-us/" },
            { title: "Compare Offers", href: "/faq/#compare-offers" },
            { title: "Value My Car", href: "/schedule-appointment/" },
            { title: "Schedule Appointment", href: "/schedule-appointment/" },
          ].map((item) => (
            <Card key={item.title}>
              <CardHeader>
                <CardTitle className="text-lg">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <Link
                  href={item.href}
                  className="text-sm font-medium text-brand-gold hover:underline"
                >
                  Learn more →
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
