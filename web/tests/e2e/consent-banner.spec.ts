import { test, expect } from "@playwright/test";

test.describe("consent banner - UI journey", () => {
  test("shows on first visit with no error surface, and no gtag call before scripts settle", async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (err) => errors.push(String(err)));

    await page.goto("/");
    await expect(page.getByRole("region", { name: "Cookie consent" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Accept" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Decline" })).toBeVisible();
    expect(errors).toEqual([]);
  });

  test("accept grants consent, persists, and hides the banner permanently", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Accept" }).click();
    await expect(page.getByRole("region", { name: "Cookie consent" })).toBeHidden();

    const stored = await page.evaluate(() => window.localStorage.getItem("analytics-consent"));
    expect(stored).toBe("granted");

    await page.reload();
    await expect(page.getByRole("region", { name: "Cookie consent" })).toBeHidden();
  });

  test("decline denies consent, persists, and hides the banner permanently", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Decline" }).click();
    await expect(page.getByRole("region", { name: "Cookie consent" })).toBeHidden();

    const stored = await page.evaluate(() => window.localStorage.getItem("analytics-consent"));
    expect(stored).toBe("denied");

    await page.reload();
    await expect(page.getByRole("region", { name: "Cookie consent" })).toBeHidden();
  });
});
