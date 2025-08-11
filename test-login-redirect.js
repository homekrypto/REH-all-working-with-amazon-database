const { chromium } = require('playwright');

async function testLoginRedirect() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    console.log('🔍 Testing login redirect issue...');
    
    // Navigate directly to login page
    console.log('1. Navigating to /auth/login...');
    await page.goto('http://127.0.0.1:3000/auth/login');
    await page.waitForTimeout(2000);

    console.log('Current URL after navigation:', page.url());

    // Fill in login form
    console.log('2. Filling login form...');
    await page.fill('input[type="email"]', 'me@p.pl');
    await page.fill('input[type="password"]', 'testpassword123');

    // Listen for navigation
    page.on('response', async response => {
      if (response.url().includes('/api/auth/callback/credentials')) {
        console.log('Auth callback response:', response.status());
      }
    });

    // Submit form and wait for navigation
    console.log('3. Submitting login form...');
    await page.click('button[type="submit"]');
    
    // Wait for potential redirects
    await page.waitForTimeout(5000);
    
    console.log('Final URL after login:', page.url());
    
    // Check if we're on a 404 page
    const pageContent = await page.content();
    if (pageContent.includes('404') || pageContent.includes('Not Found')) {
      console.log('🚨 ISSUE: Landed on 404 page');
      console.log('Page title:', await page.title());
    } else if (page.url().includes('/dashboard')) {
      console.log('✅ Successfully redirected to dashboard');
    } else {
      console.log('⚠️ Redirected to unexpected page:', page.url());
    }

    // Take screenshot for debugging
    await page.screenshot({ path: 'login-redirect-test.png' });
    console.log('📸 Screenshot saved as login-redirect-test.png');

  } catch (error) {
    console.error('Test error:', error.message);
  }

  await browser.close();
}

testLoginRedirect();
