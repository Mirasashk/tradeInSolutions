import { Star } from "lucide-react";

export function StarRating({ rating = 5 }: { rating?: number }) {
  const count = Math.min(5, Math.max(0, Math.round(rating)));

  return (
    <span className="flex items-center gap-0.5 text-brand-gold">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="h-4 w-4 fill-current" />
      ))}
    </span>
  );
}
