const { chromium } = require('playwright');

async function testCompleteLoginFlow() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // First, ensure we have a test user
    console.log('Setting up test user...');
    await page.goto('http://127.0.0.1:3000/api/test-setup');
    await page.waitForTimeout(2000);

    // Navigate to dashboard (should redirect to login)
    console.log('Navigating to dashboard...');
    await page.goto('http://127.0.0.1:3000/dashboard');
    await page.waitForTimeout(3000);

    console.log('Current URL after dashboard navigation:', page.url());

    // If redirected to NextAuth signin, navigate to our custom login
    if (page.url().includes('/api/auth/signin')) {
      console.log('Redirected to NextAuth signin, going to custom login...');
      await page.goto('http://127.0.0.1:3000/auth/login');
      await page.waitForTimeout(3000);
    }

    // Check if we're on the login page
    if (page.url().includes('/auth/login')) {
      console.log('✅ On login page');
      
      // Take screenshot of login page
      await page.screenshot({ path: 'login-page.png' });
      
      // Check if login form exists
      const hasEmailInput = await page.locator('input[type="email"], input[name="email"]').count() > 0;
      const hasPasswordInput = await page.locator('input[type="password"], input[name="password"]').count() > 0;
      const hasSubmitButton = await page.locator('button[type="submit"], button:has-text("sign in"), button:has-text("login")').count() > 0;
      
      console.log('Login form elements:');
      console.log('- Email input:', hasEmailInput ? '✅' : '❌');
      console.log('- Password input:', hasPasswordInput ? '✅' : '❌');
      console.log('- Submit button:', hasSubmitButton ? '✅' : '❌');

      if (hasEmailInput && hasPasswordInput && hasSubmitButton) {
        console.log('✅ Login form is complete and ready for testing');
      } else {
        console.log('⚠️ Login form may be missing some elements');
      }

    } else {
      console.log('❌ Not on login page. Current URL:', page.url());
    }

    // Now test if we can access dashboard directly (simulating logged-in state)
    console.log('Testing dashboard access without authentication...');
    const dashboardResponse = await page.goto('http://127.0.0.1:3000/dashboard');
    await page.waitForTimeout(2000);
    
    if (page.url().includes('/dashboard') && !page.url().includes('/auth/') && !page.url().includes('/api/auth/')) {
      // We're on dashboard, check for UserProvider error
      const pageText = await page.locator('body').textContent();
      if (pageText.includes('useUser must be used within a UserProvider')) {
        console.log('🚨 UserProvider error still exists!');
      } else {
        console.log('✅ No UserProvider error found on dashboard');
      }
    } else {
      console.log('✅ Dashboard correctly requires authentication');
    }

    await page.screenshot({ path: 'final-test.png' });

  } catch (error) {
    console.error('Test error:', error.message);
  }

  await browser.close();
}

testCompleteLoginFlow();
