import { expect, test } from "@playwright/test";

test.describe("UAV Mission Intent Analyzer", () => {
  test("landing page renders hero and navigation", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", {
        name: /Understand UAV missions from natural language/i,
      }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Open analyzer" }),
    ).toBeVisible();
  });

  test("analyzer page shows mission prompt region", async ({ page }) => {
    await page.goto("/analyzer");
    await expect(
      page.getByRole("heading", { name: /Mission analyzer/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("textbox", { name: "Mission description" }),
    ).toBeVisible();
  });

  test("admin page shows health section", async ({ page }) => {
    await page.goto("/admin");
    await expect(
      page.getByRole("heading", { name: /Admin & API test/i }),
    ).toBeVisible();
    await expect(page.getByText(/GET \/health/i)).toBeVisible();
  });

  test("theme toggle switches accessible name", async ({ page }) => {
    await page.goto("/");
    const btn = page
      .getByRole("banner")
      .getByRole("button", { name: /Switch to (dark|light) mode/ });
    await expect(btn).toBeVisible();
    const before = await btn.getAttribute("aria-label");
    await btn.click();
    const nextName =
      before === "Switch to dark mode"
        ? "Switch to light mode"
        : "Switch to dark mode";
    await expect(
      page.getByRole("banner").getByRole("button", { name: nextName }),
    ).toBeVisible();
  });
});
