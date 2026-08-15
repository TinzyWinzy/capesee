import { expect, test, type Page } from '@playwright/test'

function captureConsoleErrors(page: Page) {
  const errors: string[] = []
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text())
  })
  return errors
}

async function signInAsDevelopmentTraveler(page: Page) {
  await page.getByLabel('Email').fill('traveler@example.com')
  await page.getByLabel('Password').fill('prototype-only')
  await page.getByRole('button', { name: 'Sign in', exact: true }).click()
}

test('public discovery renders live Supabase catalog content', async ({ page }) => {
  const consoleErrors = captureConsoleErrors(page)
  await page.goto('/discover')

  await expect(page.getByRole('heading', { name: /See the Cape.*beyond the postcard\./ })).toBeVisible({ timeout: 15_000 })
  await expect(page.locator('a[href="/book/tours/cape-peninsula-tour"]')).toBeVisible()
  await expect(page.getByRole('link', { name: 'Open the discovery map' })).toBeVisible()
  expect(consoleErrors).toEqual([])
})

test('protected checkout returns the traveler to the intended route after sign-in', async ({ page }) => {
  const consoleErrors = captureConsoleErrors(page)
  await page.goto('/checkout/details')

  await expect(page).toHaveURL(/\/auth\/login/)
  await signInAsDevelopmentTraveler(page)
  await expect(page).toHaveURL(/\/checkout\/details$/)
  await expect(page.getByRole('heading', { name: 'Who is traveling?' })).toBeVisible()
  expect(consoleErrors).toEqual([])
})

test('traveler can complete the guarded prototype booking journey', async ({ page }) => {
  const consoleErrors = captureConsoleErrors(page)
  await page.goto('/book/tours/stellenbosch-wine-experience')
  await expect(page.getByRole('heading', { name: 'Stellenbosch Wine Experience' })).toBeVisible()

  await page.getByRole('button', { name: 'Add to trip', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Build your Cape trip.' })).toBeVisible()
  await page.getByRole('button', { name: 'Continue to checkout', exact: true }).click()

  await signInAsDevelopmentTraveler(page)
  await expect(page).toHaveURL(/\/checkout\/details$/)

  await page.getByLabel('First name').fill('Tino')
  await page.getByLabel('Last name').fill('Traveler')
  await page.getByLabel('Email').fill('traveler@example.com')
  await page.getByLabel('Mobile / WhatsApp').fill('+27 71 000 0000')
  await page.getByLabel('I confirm these traveler details are correct and I agree to review the booking terms before payment.').check()
  await page.getByRole('button', { name: 'Continue to payment', exact: true }).click()

  const paymentButton = page.getByRole('button', { name: 'Continue with R 2 500', exact: true })
  await expect(paymentButton).toBeDisabled()
  await page.getByLabel('I have reviewed the trip details and understand the applicable cancellation terms.').check()
  await expect(paymentButton).toBeEnabled()
  await paymentButton.click()

  await expect(page).toHaveURL(/\/checkout\/success$/, { timeout: 10_000 })
  await expect(page.getByRole('heading', { name: 'Your Cape trip is ready, Tino.' })).toBeVisible()
  await expect(page.getByText('No real payment was taken.', { exact: false })).toBeVisible()
  expect(consoleErrors).toEqual([])
})

test('signup blocks mismatched passwords before contacting Supabase', async ({ page }) => {
  await page.goto('/auth/signup')
  await page.getByLabel('Full name').fill('Test Traveler')
  await page.getByLabel('Email').fill('test@example.com')
  await page.getByLabel('Password', { exact: true }).fill('strong-pass-1')
  await page.getByLabel('Confirm password').fill('strong-pass-2')
  await page.getByRole('button', { name: 'Sign up', exact: true }).click()

  await expect(page.getByRole('alert')).toHaveText('Passwords do not match.')
  await expect(page).toHaveURL(/\/auth\/signup$/)
})
