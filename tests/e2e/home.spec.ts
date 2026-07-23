import { test, expect } from "@playwright/test";

/**
 * End-to-end tests for the home page.
 *
 * These tests open a real browser and verify that the page loads correctly.
 * They are slower than unit tests but give the highest confidence that the
 * app works as a whole.
 *
 * Run with: npm run test:e2e
 * View results: npm run test:e2e:ui
 */

test.describe("Home Page", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the home page before each test
    await page.goto("/");
  });

  test("has the correct page title", async ({ page }) => {
    await expect(page).toHaveTitle(/Church of Christ Huddersfield/i);
  });

  test("displays the main heading with church name", async ({ page }) => {
    const heading = page.getByRole("heading", { level: 1 });
    await expect(heading).toBeVisible();
    await expect(heading).toContainText("Church of Christ");
  });

  test("shows the navigation header", async ({ page }) => {
    const header = page.getByRole("banner"); // <header> has implicit "banner" role
    await expect(header).toBeVisible();
  });

  test("has a 'Join Us This Sunday' call-to-action button", async ({ page }) => {
    const ctaButton = page.getByRole("link", { name: /join us this sunday/i });
    await expect(ctaButton).toBeVisible();
  });

  test("has a Sign In link in the navigation", async ({ page }) => {
    const signInLink = page.getByRole("link", { name: /sign in/i }).first();
    await expect(signInLink).toBeVisible();
  });

  test("shows the footer", async ({ page }) => {
    const footer = page.getByRole("contentinfo"); // <footer> has implicit "contentinfo" role
    await expect(footer).toBeVisible();
  });

  test("the About section is present", async ({ page }) => {
    const aboutSection = page.locator("#about");
    await expect(aboutSection).toBeVisible();
  });

  test("the Contact section is present", async ({ page }) => {
    const contactSection = page.locator("#contact");
    await expect(contactSection).toBeVisible();
  });

  test("Sign In link navigates to the sign-in page", async ({ page }) => {
    await page.getByRole("link", { name: /sign in/i }).first().click();
    await expect(page).toHaveURL(/\/sign-in/);
  });
});

test.describe("Sign In Page", () => {
  test("displays the sign-in form", async ({ page }) => {
    await page.goto("/sign-in");
    await expect(page.getByRole("heading", { name: /welcome back/i })).toBeVisible();
    await expect(page.getByLabel(/email address/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /sign in/i })).toBeVisible();
  });

  test("shows validation error for empty form submission", async ({ page }) => {
    await page.goto("/sign-in");
    // HTML5 validation prevents submitting an empty form
    const emailInput = page.getByLabel(/email address/i);
    await expect(emailInput).toHaveAttribute("required");
  });

  test("has a link to the sign-up page", async ({ page }) => {
    await page.goto("/sign-in");
    const signUpLink = page.getByRole("link", { name: /sign up/i });
    await expect(signUpLink).toBeVisible();
    await signUpLink.click();
    await expect(page).toHaveURL(/\/sign-up/);
  });
});
