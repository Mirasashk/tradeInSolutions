import { describe, expect, it } from "vitest";

import { getSiteSettings, getNavigation, getHomePage } from "./fetch";
import { defaultSiteSettings, defaultNavigation, defaultHomePage } from "./defaults";

describe("cms fetch fallbacks", () => {
  it("returns default site settings when Firestore is unavailable", async () => {
    const settings = await getSiteSettings();
    expect(settings.phone).toBe(defaultSiteSettings.phone);
  });

  it("returns default navigation when Firestore is unavailable", async () => {
    const nav = await getNavigation();
    expect(nav.length).toBeGreaterThan(0);
    expect(nav[0]?.label).toBe(defaultNavigation[0]?.label);
  });

  it("merges default home page content", async () => {
    const home = await getHomePage();
    expect(home.heroHeadline).toBe(defaultHomePage.heroHeadline);
  });
});
