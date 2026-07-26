import { describe, expect, it } from "vitest";

import { defaultNavigation } from "./defaults";
import { normalizeFaqItems, normalizeNavItems } from "./normalize";

describe("normalizeNavItems", () => {
  it("returns defaults when items are invalid", () => {
    expect(normalizeNavItems([{ label: "Home" }])).toEqual(defaultNavigation);
  });

  it("keeps valid items only", () => {
    expect(
      normalizeNavItems([
        { label: "FAQ", href: "/faq/" },
        { label: "Broken" },
        { label: "Contact", href: "/contact/" },
      ]),
    ).toEqual([
      { label: "FAQ", href: "/faq/" },
      { label: "Contact", href: "/contact/" },
    ]);
  });
});

describe("normalizeFaqItems", () => {
  it("converts portable text answers to markdown strings", () => {
    const items = normalizeFaqItems([
      {
        _id: "1",
        question: "Test?",
        answer: [
          {
            _type: "block",
            children: [{ _type: "span", text: "Yes" }],
          },
        ] as unknown as string,
      },
    ]);

    expect(items[0]?.answer).toBe("Yes");
  });
});
