"use client";

import { motion } from "framer-motion";

import { SanityImage } from "@/components/shared/SanityImage";
import type { SanityImage as SanityImageType } from "@/types";

type HeroSectionProps = {
  title: string;
  subtitle?: string;
  backgroundImage?: SanityImageType | null;
  videoUrl?: string;
  children?: React.ReactNode;
  className?: string;
};

export function HeroSection({
  title,
  subtitle,
  backgroundImage,
  videoUrl,
  children,
  className = "",
}: HeroSectionProps) {
  const hasImage = Boolean(backgroundImage?.url);

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`relative overflow-hidden bg-brand-navy px-4 py-20 text-white ${className}`}
    >
      {hasImage ? (
        <div className="absolute inset-0 opacity-30">
          <SanityImage
            image={backgroundImage}
            alt=""
            width={1920}
            height={800}
            className="h-full w-full object-cover"
            priority
          />
        </div>
      ) : null}
      {videoUrl ? (
        <div className="absolute inset-0 opacity-20">
          <VideoEmbed url={videoUrl} title={title} />
        </div>
      ) : null}
      <div className="relative mx-auto max-w-4xl text-center">
        <h1 className="text-4xl font-bold md:text-5xl">{title}</h1>
        {subtitle ? <p className="mt-4 text-lg text-white/85">{subtitle}</p> : null}
        {children ? (
          <div className="mt-8 flex flex-wrap justify-center gap-4">{children}</div>
        ) : null}
      </div>
    </motion.section>
  );
}

function VideoEmbed({ url, title }: { url: string; title: string }) {
  const embedUrl = toEmbedUrl(url);
  if (!embedUrl) return null;

  return (
    <iframe
      src={embedUrl}
      title={title}
      className="h-full w-full"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  );
}

function toEmbedUrl(url: string): string | null {
  if (url.includes("youtube.com/watch")) {
    const id = new URL(url).searchParams.get("v");
    return id ? `https://www.youtube.com/embed/${id}` : null;
  }
  if (url.includes("youtu.be/")) {
    const id = url.split("youtu.be/")[1]?.split("?")[0];
    return id ? `https://www.youtube.com/embed/${id}` : null;
  }
  if (url.includes("vimeo.com/")) {
    const id = url.split("vimeo.com/")[1]?.split("?")[0];
    return id ? `https://player.vimeo.com/video/${id}` : null;
  }
  return url.includes("embed") ? url : null;
}

export function VideoHeroEmbed({ url, title }: { url: string; title: string }) {
  const embedUrl = toEmbedUrl(url);
  if (!embedUrl) return null;

  return (
    <div className="mx-auto mt-8 aspect-video max-w-3xl overflow-hidden rounded-lg">
      <iframe
        src={embedUrl}
        title={title}
        className="h-full w-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
