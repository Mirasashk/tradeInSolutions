import { expect, test } from "@playwright/test";

test("homepage loads", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: /buy your car today/i }),
  ).toBeVisible();
});

test("contact form renders", async ({ page }) => {
  await page.goto("/contact/");
  await expect(page.getByRole("heading", { name: /contact us/i })).toBeVisible();
  await expect(page.getByLabel("Name")).toBeVisible();
  await expect(page.getByLabel("Email")).toBeVisible();
  await expect(page.getByRole("button", { name: /send message/i })).toBeVisible();
});
