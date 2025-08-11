const { test, expect } = require('@playwright/test');

test('Login and Dashboard Access Test', async ({ page }) => {
  // Navigate to login page
  await page.goto('http://localhost:3000/auth/login');
  
  // Fill login form
  await page.fill('input[type="email"]', 'me@p.pl');
  await page.fill('input[type="password"]', 'testpassword123');
  
  // Click login button
  await page.click('button[type="submit"]');
  
  // Wait for redirect and check we're on dashboard
  await page.waitForURL('**/dashboard', { timeout: 10000 });
  
  // Check that we're actually on the dashboard page
  expect(page.url()).toContain('/dashboard');
  
  // Check that the page loads correctly (not 404)
  const pageContent = await page.content();
  expect(pageContent).not.toContain('404');
  expect(pageContent).not.toContain('Page Not Found');
  
  // Check for dashboard content
  await expect(page.locator('text=dashboard', { ignoreCase: true })).toBeVisible({ timeout: 5000 });
  
  console.log('✅ Login successful and dashboard loaded properly');
  console.log('Current URL:', page.url());
});
