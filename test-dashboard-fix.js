const { chromium } = require('playwright');

async function testDashboardFix() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Navigate directly to dashboard (should redirect to login if not authenticated)
    console.log('Navigating to dashboard...');
    await page.goto('http://127.0.0.1:3000/dashboard');
    await page.waitForTimeout(3000);

    console.log('Current URL:', page.url());

    // Check if we're redirected to login
    if (page.url().includes('/auth/login') || page.url().includes('/api/auth/signin')) {
      console.log('✅ Correctly redirected to login page');
      
      // Try to find login form (even if we can't test it)
      const pageContent = await page.content();
      if (pageContent.includes('sign') || pageContent.includes('login') || pageContent.includes('email')) {
        console.log('✅ Login page seems to be working');
      } else {
        console.log('⚠️ Login page content might be missing');
      }
    } else if (page.url().includes('/dashboard')) {
      console.log('✅ Directly accessible dashboard (user might be logged in)');
      
      // Check for UserProvider error in the page
      const pageText = await page.locator('body').textContent();
      if (pageText.includes('useUser must be used within a UserProvider')) {
        console.log('🚨 UserProvider error found in dashboard');
      } else {
        console.log('✅ No UserProvider error found');
      }
    }

    // Take screenshot
    await page.screenshot({ path: 'dashboard-fix-test.png' });
    console.log('📸 Screenshot saved as dashboard-fix-test.png');

  } catch (error) {
    console.error('Test error:', error.message);
  }

  await browser.close();
}

testDashboardFix();
