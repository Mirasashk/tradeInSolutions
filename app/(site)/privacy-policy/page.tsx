import { PortableTextContent } from "@/components/shared/PortableTextContent";
import { buildMetadataFromCms } from "@/lib/seo";
import { getPageBySlug, getSiteSettings } from "@/lib/cms/fetch";
import type { PageContent } from "@/types";

export async function generateMetadata() {
  const settings = await getSiteSettings();
  const page = (await getPageBySlug("privacy-policy")) as PageContent | null;

  return buildMetadataFromCms({
    title: page?.seoTitle ?? "Privacy Policy",
    description:
      page?.seoDescription ??
      "Privacy policy for Trade-In Solutions Irvine — how we collect and use your data.",
    path: "/privacy-policy/",
    settings,
  });
}

export default async function PrivacyPolicyPage() {
  const page = (await getPageBySlug("privacy-policy")) as PageContent | null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-4xl font-bold text-brand-navy">
        {page?.title ?? "Privacy Policy"}
      </h1>
      <div className="mt-6 leading-7 text-muted-foreground">
        {page?.body ? (
          <PortableTextContent value={page.body} />
        ) : (
          <>
            <p>Effective Date: December 15, 2023</p>
            <p className="mt-4">
              This privacy policy describes how Trade-In Solutions Irvine collects,
              uses, and protects your personal information when you use our website or
              services.
            </p>
            <h2 className="mt-8 text-xl font-semibold text-brand-navy">
              Information Collection
            </h2>
            <p className="mt-2">
              We collect information you provide through contact forms, appointment
              requests, and phone or email communications.
            </p>
            <h2 className="mt-8 text-xl font-semibold text-brand-navy">Contact</h2>
            <p className="mt-2">info@tradeinsolutions-irvine.com</p>
          </>
        )}
      </div>
    </div>
  );
}
