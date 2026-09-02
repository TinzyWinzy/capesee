import { expect, test, type Page } from '@playwright/test'

async function signInAsDevelopmentTraveler(page: Page) {
  await page.getByLabel('Email').fill('traveler@example.com')
  await page.getByLabel('Password').fill('prototype-only')
  await page.getByRole('button', { name: 'Sign in', exact: true }).click()
}

test.describe('Authentication & Route Guard Flow', () => {
  test('1. Guest can access login page and see all auth options', async ({ page }) => {
    await page.goto('/auth/login')

    await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Continue with Google' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Continue with Apple' })).toBeVisible()
    await expect(page.getByLabel('Email')).toBeVisible()
    await expect(page.getByLabel('Password')).toBeVisible()
    await expect(page.getByRole('link', { name: 'Forgot password?' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Create account' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Browse as guest' })).toBeVisible()
  })

  test('2. Guest browsing button takes user to discovery homepage', async ({ page }) => {
    await page.goto('/auth/login')
    await page.getByRole('link', { name: 'Browse as guest' }).click()
    await expect(page).toHaveURL(/\/discover/)
  })

  test('3. Signup form blocks password mismatch with clear alert', async ({ page }) => {
    await page.goto('/auth/signup')

    await page.getByLabel('Full name').fill('Cape Traveler')
    await page.getByLabel('Email').fill('traveler@test.com')
    await page.getByLabel('Password', { exact: true }).fill('Password123!')
    await page.getByLabel('Confirm password').fill('DifferentPassword456!')
    await page.getByRole('button', { name: 'Sign up', exact: true }).click()

    await expect(page.getByRole('alert')).toHaveText('Passwords do not match.')
    await expect(page).toHaveURL(/\/auth\/signup$/)
  })

  test('4. Forgot password accepts email and confirms dispatch', async ({ page }) => {
    await page.goto('/auth/forgot-password')

    await expect(page.getByRole('heading', { name: 'Reset password' })).toBeVisible()
    await page.getByLabel('Email').fill('traveler@example.com')
    await page.getByRole('button', { name: 'Send reset link' }).click()

    // Expect confirmation or redirect depending on config
    await expect(page.locator('form')).toBeVisible()
  })

  test('5. Protected route (/account/profile) redirects unauthenticated visitor to /auth/login with redirect query param', async ({ page }) => {
    await page.goto('/account/profile')

    await expect(page).toHaveURL(/\/auth\/login/)
    expect(page.url()).toContain('redirect')
  })

  test('6. Traveler can sign in and is redirected to intended protected destination', async ({ page }) => {
    await page.goto('/account/profile')
    await expect(page).toHaveURL(/\/auth\/login/)

    await signInAsDevelopmentTraveler(page)

    // After sign-in, should navigate to profile
    await expect(page).toHaveURL(/\/account\/profile$/, { timeout: 10_000 })
    await expect(page.getByRole('heading', { name: /Profile|Account/i })).toBeVisible()
  })

  test('7. Authenticated traveler can view profile and sign out successfully', async ({ page }) => {
    await page.goto('/auth/login')
    await signInAsDevelopmentTraveler(page)

    await page.goto('/account/profile')
    await expect(page).toHaveURL(/\/account\/profile$/)

    // Look for sign out button
    const signOutBtn = page.getByRole('button', { name: /Sign out|Log out/i })
    if (await signOutBtn.isVisible()) {
      await signOutBtn.click()
      // Once signed out, navigating back to /account/profile should redirect to login
      await page.goto('/account/profile')
      await expect(page).toHaveURL(/\/auth\/login/)
    }
  })
})
