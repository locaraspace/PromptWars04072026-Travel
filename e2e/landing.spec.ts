import { test, expect } from '@playwright/test';

/**
 * Smoke tests for the public (unauthenticated) surface. These only need the app
 * running — no database or OpenAI calls — so they are safe to run anywhere.
 */

test('landing page renders the hero and primary CTAs', async ({ page }) => {
  await page.goto('/');
  await expect(
    page.getByRole('heading', { name: /soul of a place/i }),
  ).toBeVisible();
  await expect(
    page.getByRole('link', { name: /get started/i }).first(),
  ).toBeVisible();
});

test('sign-in navigates to the login screen', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: /^sign in$/i }).first().click();
  await expect(page).toHaveURL(/\/login/);
  await expect(page.getByText(/welcome back/i)).toBeVisible();
});

test('get started navigates to the register screen', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: /get started/i }).first().click();
  await expect(page).toHaveURL(/\/register/);
  await expect(page.getByLabel(/full name/i)).toBeVisible();
});
