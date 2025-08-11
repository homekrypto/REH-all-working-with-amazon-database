const { chromium } = require('playwright');

async function testLoginWithWait() {
  console.log('🔐 Testing Login with Extended Wait...\n');

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Navigate to login page
    console.log('1. Navigating to login page...');
    await page.goto('http://localhost:3000/auth/login');
    await page.waitForLoadState('networkidle');
    console.log('   ✅ Login page loaded');

    // Test with the test user credentials
    console.log('\n2. Testing login with test user (me@p.pl)...');
    await page.fill('input[type="email"]', 'me@p.pl');
    await page.fill('input[type="password"]', 'testpassword123');
    
    console.log('   📝 Filled login credentials');
    
    // Submit the form
    await page.click('button[type="submit"]');
    console.log('   🚀 Submitted login form');
    
    // Wait longer for navigation
    console.log('   ⏳ Waiting for navigation...');
    
    try {
      // Wait for either dashboard or login page
      await page.waitForURL(['**/dashboard**', '**/auth/login**'], { timeout: 10000 });
    } catch (timeoutError) {
      console.log('   ⚠️  No URL change detected, checking current state...');
    }
    
    await page.waitForTimeout(2000); // Additional wait for any async operations
    
    const currentUrl = page.url();
    console.log(`   📍 Final URL: ${currentUrl}`);
    
    // Check if redirected to dashboard
    if (currentUrl.includes('/dashboard')) {
      console.log('   ✅ Successfully logged in and redirected to dashboard');
      
      // Check if dashboard content is visible
      const dashboardElement = await page.locator('text=Dashboard').first();
      const agentElement = await page.locator('text=Agent').first();
      
      if (await dashboardElement.isVisible() || await agentElement.isVisible()) {
        console.log('   ✅ Dashboard content is visible');
      } else {
        console.log('   ⚠️  Dashboard loaded but content not fully visible yet');
      }
      
    } else if (currentUrl.includes('/auth/login')) {
      console.log('   ❌ Still on login page');
      
      // Check for any error messages or loading states
      const pageText = await page.textContent('body');
      if (pageText.includes('Invalid') || pageText.includes('error') || pageText.includes('failed')) {
        console.log('   📄 Error message detected');
      } else if (pageText.includes('Signing in') || pageText.includes('Loading')) {
        console.log('   📄 Loading state detected');
      } else {
        console.log('   📄 No obvious error or loading state');
      }
    } else {
      console.log(`   ⚠️  Unexpected location: ${currentUrl}`);
    }

    console.log('\n✅ Extended login test complete!');

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  } finally {
    await browser.close();
  }
}

testLoginWithWait();
