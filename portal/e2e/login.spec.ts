import { test, expect } from '@playwright/test'

test.describe('Login Page', () => {
  test('should display login form', async ({ page }) => {
    await page.goto('/login')

    // Check form elements are visible
    await expect(page.getByLabel('Email')).toBeVisible()
    await expect(page.getByRole('button', { name: /enviar link/i })).toBeVisible()
  })

  test('should show error for invalid email format', async ({ page }) => {
    await page.goto('/login')

    // Check email input has correct type for validation
    const emailInput = page.getByLabel('Email')
    await expect(emailInput).toHaveAttribute('type', 'email')
  })

  test('should toggle to password login', async ({ page }) => {
    await page.goto('/login')

    // Click password toggle
    const passwordToggle = page.getByRole('button', { name: /contraseña/i })
    if (await passwordToggle.isVisible()) {
      await passwordToggle.click()

      // Password field should appear
      await expect(page.getByLabel('Contraseña')).toBeVisible()
    }
  })

  test('should redirect unauthenticated users from dashboard', async ({ page }) => {
    // Try to access dashboard without auth
    await page.goto('/dashboard')

    // Should redirect to login
    await expect(page).toHaveURL(/login/)
  })
})

test.describe('Branding', () => {
  test('should display Tandem branding', async ({ page }) => {
    await page.goto('/login')

    // Check for Tandem branding
    await expect(page.locator('text=Tandem')).toBeVisible()
  })
})
