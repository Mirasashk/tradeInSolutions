import { expect, test } from "@playwright/test";

test("homepage loads", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: /buy your car today/i }),
  ).toBeVisible();
});

test("contact form renders", async ({ page }) => {
  await page.goto("/contact/");
  await expect(page.getByRole("heading", { name: /get in touch/i })).toBeVisible();
  await expect(page.getByLabel("Name")).toBeVisible();
});

test("faq page renders", async ({ page }) => {
  await page.goto("/faq/");
  await expect(
    page.getByRole("heading", { name: /frequently asked questions/i }),
  ).toBeVisible();
});

test("value estimator page renders", async ({ page }) => {
  await page.goto("/value-estimator/");
  await expect(
    page.getByRole("heading", { name: /what's my car worth/i }),
  ).toBeVisible();
});
