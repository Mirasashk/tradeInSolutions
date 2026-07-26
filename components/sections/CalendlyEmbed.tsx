export function CalendlyEmbed({ url }: { url?: string }) {
  if (!url) return null;

  return (
    <section className="mx-auto max-w-4xl px-4 py-8">
      <h2 className="mb-4 text-2xl font-bold text-brand-navy">Book Online</h2>
      <div className="aspect-[4/3] w-full overflow-hidden rounded-lg border">
        <iframe
          src={url}
          title="Schedule appointment"
          className="h-full w-full border-0"
        />
      </div>
    </section>
  );
}
