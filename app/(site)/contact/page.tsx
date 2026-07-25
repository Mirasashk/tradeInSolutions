import { ContactForm } from "@/components/forms/ContactForm";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Contact Us",
  path: "/contact/",
});

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="text-4xl font-bold text-brand-navy">Contact Us</h1>
      <p className="mt-4 text-muted-foreground">
        Have questions about selling your car? Send us a message and we&apos;ll get back
        to you shortly.
      </p>
      <div className="mt-8">
        <ContactForm />
      </div>
    </div>
  );
}
