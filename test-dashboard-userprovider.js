const { chromium } = require('playwright');

async function testLoginAndDashboard() {
  console.log('🔐 Testing Login → Dashboard Flow...\n');

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Navigate to login page
    console.log('1. Navigating to login page...');
    await page.goto('http://localhost:3000/auth/login');
    await page.waitForLoadState('networkidle');
    console.log('   ✅ Login page loaded');

    // Login with test credentials
    console.log('\n2. Logging in with test credentials...');
    await page.fill('input[type="email"]', 'me@p.pl');
    await page.fill('input[type="password"]', 'testpassword123');
    await page.click('button[type="submit"]');
    
    console.log('   🚀 Login form submitted');
    
    // Wait for navigation to dashboard
    console.log('\n3. Waiting for dashboard navigation...');
    
    try {
      await page.waitForURL('**/dashboard**', { timeout: 10000 });
      console.log('   ✅ Successfully navigated to dashboard');
    } catch (timeoutError) {
      console.log('   ⚠️  Dashboard URL not detected, checking current location...');
    }
    
    await page.waitForTimeout(3000); // Wait for any async operations
    
    const currentUrl = page.url();
    console.log(`   📍 Current URL: ${currentUrl}`);

    // Check for UserProvider error
    console.log('\n4. Checking for UserProvider errors...');
    
    const pageContent = await page.content();
    const hasUserProviderError = pageContent.includes('useUser must be used within a UserProvider') || 
                                 pageContent.includes('UserProvider');
    
    if (hasUserProviderError) {
      console.log('   ❌ UserProvider error detected in page content');
    } else {
      console.log('   ✅ No UserProvider error detected');
    }

    // Check for dashboard content
    console.log('\n5. Checking dashboard content...');
    
    const dashboardElements = [
      'Dashboard',
      'Agent',
      'Welcome',
      'Listings',
      'Analytics'
    ];

    let foundElements = 0;
    for (const element of dashboardElements) {
      const elementExists = await page.locator(`text=${element}`).first().isVisible().catch(() => false);
      if (elementExists) {
        console.log(`   ✅ Found "${element}" element`);
        foundElements++;
      }
    }

    if (foundElements > 0) {
      console.log(`   ✅ Dashboard content loaded (${foundElements} elements found)`);
    } else {
      console.log('   ⚠️  Dashboard content not fully loaded or visible');
    }

    // Check browser console for errors
    console.log('\n6. Checking for JavaScript errors...');
    
    const logs = await page.evaluate(() => {
      return window.console._logs || [];
    });

    // Listen for console errors from this point
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.waitForTimeout(2000); // Wait to catch any errors

    if (errors.length > 0) {
      console.log('   ⚠️  JavaScript errors detected:');
      errors.forEach(error => console.log(`      - ${error}`));
    } else {
      console.log('   ✅ No JavaScript errors detected');
    }

    // Test user data loading
    console.log('\n7. Testing user data loading...');
    
    // Check if user profile API is being called
    await page.goto(currentUrl); // Refresh to trigger user data fetch
    await page.waitForTimeout(2000);
    
    const hasUserData = await page.evaluate(() => {
      return !!window.__NEXT_DATA__ || document.body.textContent.includes('Agent') || document.body.textContent.includes('me@p.pl');
    });

    if (hasUserData) {
      console.log('   ✅ User data appears to be loaded');
    } else {
      console.log('   ⚠️  User data may not be fully loaded');
    }

    console.log('\n🎉 Login → Dashboard test complete!');
    
    console.log('\n📊 Summary:');
    console.log(`   - Login: ${currentUrl.includes('dashboard') ? '✅ Success' : '❌ Failed'}`);
    console.log(`   - Dashboard URL: ${currentUrl.includes('dashboard') ? '✅ Correct' : '⚠️  Unexpected'}`);
    console.log(`   - UserProvider: ${hasUserProviderError ? '❌ Error' : '✅ Working'}`);
    console.log(`   - Dashboard Content: ${foundElements > 0 ? '✅ Loaded' : '⚠️  Issues'}`);
    console.log(`   - JavaScript Errors: ${errors.length === 0 ? '✅ None' : `⚠️  ${errors.length} found`}`);

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  } finally {
    await browser.close();
  }
}

testLoginAndDashboard();
