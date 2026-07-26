import Markdown from "react-markdown";

type MarkdownContentProps = {
  value?: string | null;
};

export function MarkdownContent({ value }: MarkdownContentProps) {
  if (!value?.trim()) {
    return null;
  }

  return (
    <div className="prose prose-slate max-w-none">
      <Markdown
        components={{
          h2: ({ children }) => (
            <h2 className="mt-8 mb-4 text-2xl font-semibold text-brand-navy">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="mt-6 mb-3 text-xl font-semibold text-brand-navy">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="mb-4 leading-7 text-muted-foreground">{children}</p>
          ),
          ul: ({ children }) => (
            <ul className="mb-4 list-disc space-y-2 pl-6 text-muted-foreground">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-4 list-decimal space-y-2 pl-6 text-muted-foreground">
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="leading-7">{children}</li>,
          a: ({ href, children }) => (
            <a href={href} className="text-brand-navy underline hover:text-brand-gold">
              {children}
            </a>
          ),
        }}
      >
        {value}
      </Markdown>
    </div>
  );
}

/** Renders markdown strings; legacy Portable Text arrays are ignored. */
export function PortableTextContent({ value }: { value: unknown }) {
  if (typeof value === "string") {
    return <MarkdownContent value={value} />;
  }
  return null;
}
