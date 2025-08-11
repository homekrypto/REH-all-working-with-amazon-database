const { chromium } = require('playwright');

async function testUserProviderFix() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Navigate to login page
    console.log('Navigating to login page...');
    await page.goto('http://127.0.0.1:3000/auth/login');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Fill in login credentials
    console.log('Filling login form...');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');

    // Submit the form
    console.log('Submitting login form...');
    await page.click('button[type="submit"]');

    // Wait for potential redirect
    await page.waitForTimeout(3000);
    console.log('Current URL after login:', page.url());

    // Check if we're on dashboard
    if (page.url().includes('/dashboard')) {
      console.log('✅ Successfully redirected to dashboard');
      
      // Wait for dashboard to load and check for errors
      await page.waitForTimeout(3000);
      
      // Check for console errors
      const logs = [];
      page.on('console', msg => {
        if (msg.type() === 'error') {
          logs.push(msg.text());
          console.log('🚨 Console Error:', msg.text());
        }
      });

      // Check if the dashboard content loads
      const dashboardContent = await page.locator('body').textContent();
      
      if (dashboardContent.includes('useUser must be used within a UserProvider')) {
        console.log('🚨 Found UserProvider error in page content');
      } else if (dashboardContent.includes('Loading dashboard')) {
        console.log('⏳ Dashboard is loading...');
        await page.waitForTimeout(5000);
        
        // Check again after loading
        const finalContent = await page.locator('body').textContent();
        if (finalContent.includes('useUser must be used within a UserProvider')) {
          console.log('🚨 UserProvider error persists after loading');
        } else {
          console.log('✅ Dashboard loaded successfully without UserProvider error');
        }
      } else {
        console.log('✅ No UserProvider error found in dashboard');
      }

    } else {
      console.log('❌ Not redirected to dashboard. Current URL:', page.url());
    }

    // Take a screenshot for debugging
    await page.screenshot({ path: 'dashboard-test.png' });
    console.log('📸 Screenshot saved as dashboard-test.png');

  } catch (error) {
    console.error('Test failed:', error);
  }

  await browser.close();
}

testUserProviderFix();
