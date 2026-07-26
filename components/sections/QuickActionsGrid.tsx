import Link from "next/link";
import { Car, Calendar, HelpCircle, Scale } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const defaultActions = [
  { title: "How It Works", href: "/about-us/", icon: HelpCircle },
  { title: "Got Previous Offers?", href: "/faq/#compare-offers", icon: Scale },
  { title: "Value My Car", href: "/value-estimator/", icon: Car },
  { title: "Schedule Appointment", href: "/schedule-appointment/", icon: Calendar },
];

export function QuickActionsGrid() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <h2 className="text-center text-3xl font-bold text-brand-navy">Quick Actions</h2>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {defaultActions.map((item) => (
          <Card key={item.title}>
            <CardHeader>
              <item.icon className="mb-2 h-8 w-8 text-brand-gold" />
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
  );
}
