const { chromium } = require('playwright');

async function testActualLogin() {
  console.log('🔐 Testing Actual Login Functionality...\n');

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
    
    // Wait for navigation or error
    await page.waitForTimeout(3000);
    
    const currentUrl = page.url();
    console.log(`   📍 Current URL after login: ${currentUrl}`);
    
    // Check if redirected to dashboard
    if (currentUrl.includes('/dashboard')) {
      console.log('   ✅ Successfully logged in and redirected to dashboard');
      
      // Check if user info is displayed
      await page.waitForTimeout(2000);
      const pageContent = await page.content();
      
      if (pageContent.includes('Agent Dashboard') || pageContent.includes('me@p.pl') || pageContent.includes('Dashboard')) {
        console.log('   ✅ Dashboard content loaded successfully');
      } else {
        console.log('   ⚠️  Dashboard loaded but content might not be fully ready');
      }
      
    } else if (currentUrl.includes('/auth/login')) {
      console.log('   ❌ Login failed - still on login page');
      
      // Check for error messages
      const pageText = await page.textContent('body');
      if (pageText.includes('Invalid') || pageText.includes('error') || pageText.includes('failed')) {
        console.log('   📄 Error message found on page');
      } else {
        console.log('   📄 No obvious error message visible');
      }
    } else {
      console.log(`   ⚠️  Unexpected redirect to: ${currentUrl}`);
    }

    // Test logout if logged in
    if (currentUrl.includes('/dashboard')) {
      console.log('\n3. Testing logout functionality...');
      
      // Look for logout button or menu
      const logoutButton = await page.locator('text=Logout').first();
      const signOutButton = await page.locator('text=Sign out').first();
      
      if (await logoutButton.isVisible()) {
        await logoutButton.click();
        console.log('   🚪 Clicked logout button');
      } else if (await signOutButton.isVisible()) {
        await signOutButton.click();
        console.log('   🚪 Clicked sign out button');
      } else {
        console.log('   ⚠️  Logout button not found');
      }
      
      await page.waitForTimeout(2000);
      const logoutUrl = page.url();
      console.log(`   📍 URL after logout: ${logoutUrl}`);
    }

    console.log('\n✅ Login functionality test complete!');

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  } finally {
    await browser.close();
  }
}

testActualLogin();
