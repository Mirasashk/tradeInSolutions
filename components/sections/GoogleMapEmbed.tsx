export function GoogleMapEmbed({
  embedUrl,
  title = "Map",
}: {
  embedUrl?: string;
  title?: string;
}) {
  const defaultUrl =
    "https://maps.google.com/maps?q=9891+Irvine+Center+Drive,+Irvine,+CA+92618&output=embed";
  const src = embedUrl ?? defaultUrl;

  return (
    <div className="aspect-video w-full overflow-hidden rounded-lg border">
      <iframe
        src={src}
        title={title}
        className="h-full w-full border-0"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
    </div>
  );
}
