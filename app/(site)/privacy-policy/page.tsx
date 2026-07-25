import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Privacy Policy",
  path: "/privacy-policy/",
});

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-4xl font-bold text-brand-navy">Privacy Policy</h1>
      <p className="mt-6 leading-7 text-muted-foreground">
        Privacy policy content will be managed via Sanity CMS or legal review. This
        placeholder page ensures routing and SEO metadata are in place for launch.
      </p>
    </div>
  );
}
