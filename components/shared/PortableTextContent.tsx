import { PortableText, type PortableTextComponents } from "@portabletext/react";

const components: PortableTextComponents = {
  block: {
    h2: ({ children }) => (
      <h2 className="mt-8 mb-4 text-2xl font-semibold text-brand-navy">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-6 mb-3 text-xl font-semibold text-brand-navy">{children}</h3>
    ),
    normal: ({ children }) => (
      <p className="mb-4 leading-7 text-muted-foreground">{children}</p>
    ),
  },
};

export function PortableTextContent({ value }: { value: unknown }) {
  if (!value) {
    return null;
  }

  return (
    <div className="prose prose-slate max-w-none">
      <PortableText value={value as never} components={components} />
    </div>
  );
}
