import type { FaqItem, NavItem } from "@/types";

import { defaultNavigation } from "./defaults";

export function normalizeNavItems(items: unknown): NavItem[] {
  if (!Array.isArray(items)) {
    return defaultNavigation;
  }

  const normalized = items
    .map((item) => {
      if (!item || typeof item !== "object") {
        return null;
      }

      const record = item as Record<string, unknown>;
      const label = typeof record.label === "string" ? record.label.trim() : "";
      const href =
        typeof record.href === "string"
          ? record.href.trim()
          : typeof record.url === "string"
            ? record.url.trim()
            : "";

      if (!label || !href) {
        return null;
      }

      return { label, href };
    })
    .filter((item): item is NavItem => item !== null);

  return normalized.length ? normalized : defaultNavigation;
}

export function normalizeFaqItem(item: FaqItem, fallbackId: string): FaqItem | null {
  const question = item.question?.trim();
  if (!question) {
    return null;
  }

  let answer = item.answer;
  if (Array.isArray(answer)) {
    answer = portableTextToMarkdown(answer);
  }
  if (typeof answer !== "string") {
    answer = answer != null ? String(answer) : "";
  }

  return {
    ...item,
    _id: item._id || fallbackId,
    question,
    answer,
  };
}

function portableTextToMarkdown(blocks: unknown[]): string {
  return blocks
    .map((block) => {
      if (!block || typeof block !== "object") return "";
      const record = block as { children?: { text?: string }[] };
      if (!Array.isArray(record.children)) return "";
      return record.children.map((child) => child.text ?? "").join("");
    })
    .filter(Boolean)
    .join("\n\n");
}

export function normalizeFaqItems(items: FaqItem[]): FaqItem[] {
  return items
    .map((item, index) => normalizeFaqItem(item, item._id || String(index)))
    .filter((item): item is FaqItem => item !== null);
}
