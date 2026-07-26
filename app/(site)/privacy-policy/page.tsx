import {
  CmsMarkdownPage,
  generateCmsPageMetadata,
} from "@/components/sections/CmsMarkdownPage";

const FALLBACK_BODY = `**Effective Date: December 15, 2023**

This privacy policy describes how Trade-In Solutions Irvine collects, uses, and protects your personal information when you use our website or services.

## Information Collection

We collect information you provide through contact forms, appointment requests, and phone or email communications.

## Contact

info@tradeinsolutions-irvine.com`;

export async function generateMetadata() {
  return generateCmsPageMetadata({
    slug: "privacy-policy",
    path: "/privacy-policy/",
    fallbackTitle: "Privacy Policy",
    fallbackDescription:
      "Privacy policy for Trade-In Solutions Irvine — how we collect and use your data.",
  });
}

export default function PrivacyPolicyPage() {
  return (
    <CmsMarkdownPage
      slug="privacy-policy"
      eyebrow="Privacy Policy"
      fallbackTitle="Privacy Policy"
      fallbackBody={FALLBACK_BODY}
    />
  );
}
