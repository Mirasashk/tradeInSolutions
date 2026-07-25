import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "About Us",
  path: "/about-us/",
});

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-4xl font-bold text-brand-navy">About Trade-In Solutions</h1>
      <p className="mt-6 leading-7 text-muted-foreground">
        Trade-In Solutions Irvine has helped thousands of customers sell their cars for
        cash with a transparent, hassle-free process. Content will be managed via Sanity
        CMS.
      </p>
    </div>
  );
}
