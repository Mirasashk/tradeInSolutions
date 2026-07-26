import { describe, expect, it } from "vitest";

import { buildFaqPageJsonLd, buildReviewJsonLd } from "@/lib/seo";

describe("buildFaqPageJsonLd", () => {
  it("maps FAQ items to FAQPage schema", () => {
    const jsonLd = buildFaqPageJsonLd([
      { _id: "1", question: "Test question?", answer: [] },
    ]);

    expect(jsonLd["@type"]).toBe("FAQPage");
    expect(jsonLd.mainEntity).toHaveLength(1);
    expect(jsonLd.mainEntity[0].name).toBe("Test question?");
  });
});

describe("buildReviewJsonLd", () => {
  it("returns null when no testimonials", () => {
    expect(buildReviewJsonLd([])).toBeNull();
  });

  it("includes aggregate rating", () => {
    const jsonLd = buildReviewJsonLd([
      { _id: "1", name: "Jane", quote: "Great service", rating: 5 },
    ]);

    expect(jsonLd?.aggregateRating.ratingValue).toBe("5.0");
    expect(jsonLd?.review).toHaveLength(1);
  });
});
