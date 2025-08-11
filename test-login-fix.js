const { chromium } = require('playwright');

async function testLoginFix() {
  console.log('🧪 Testing Login Page Fix...\n');

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Test 1: Direct access to /auth/login
    console.log('1. Testing direct access to /auth/login...');
    await page.goto('http://localhost:3000/auth/login');
    await page.waitForLoadState('networkidle');
    
    const currentUrl = page.url();
    if (currentUrl.includes('/auth/login') && !currentUrl.includes('callbackUrl')) {
      console.log('   ✅ Login page loads directly without redirect loop');
    } else {
      console.log(`   ❌ Unexpected redirect. Current URL: ${currentUrl}`);
    }

    // Test 2: Check page content
    console.log('\n2. Testing login page content...');
    const title = await page.textContent('h2');
    if (title && title.includes('Sign in to GlobalRealEstate')) {
      console.log('   ✅ Login page title is correct');
    } else {
      console.log('   ❌ Login page title is missing or incorrect');
    }

    const emailInput = await page.locator('input[type="email"]');
    const passwordInput = await page.locator('input[type="password"]');
    const submitButton = await page.locator('button[type="submit"]');

    if (await emailInput.isVisible() && await passwordInput.isVisible() && await submitButton.isVisible()) {
      console.log('   ✅ Login form elements are present');
    } else {
      console.log('   ❌ Login form elements are missing');
    }

    // Test 3: Access protected route to trigger redirect
    console.log('\n3. Testing protected route redirect...');
    await page.goto('http://localhost:3000/dashboard');
    await page.waitForLoadState('networkidle');
    
    const dashboardUrl = page.url();
    if (dashboardUrl.includes('/auth/login') && dashboardUrl.includes('callbackUrl')) {
      console.log('   ✅ Protected route correctly redirects to login with callbackUrl');
      console.log(`   📍 Redirect URL: ${dashboardUrl}`);
    } else {
      console.log(`   ❌ Unexpected redirect behavior. Current URL: ${dashboardUrl}`);
    }

    // Test 4: Test login form submission with invalid credentials
    console.log('\n4. Testing login form with invalid credentials...');
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');
    
    // Wait for potential error message
    await page.waitForTimeout(2000);
    
    const finalUrl = page.url();
    if (finalUrl.includes('/auth/login')) {
      console.log('   ✅ Invalid login stays on login page (no redirect loop)');
    } else {
      console.log(`   ❌ Unexpected redirect after invalid login. URL: ${finalUrl}`);
    }

    // Test 5: Test navigation to register
    console.log('\n5. Testing navigation to register page...');
    const registerLink = await page.locator('a[href="/register"]');
    if (await registerLink.isVisible()) {
      console.log('   ✅ Register link is present');
      await registerLink.click();
      await page.waitForLoadState('networkidle');
      
      const registerUrl = page.url();
      if (registerUrl.includes('/register')) {
        console.log('   ✅ Register link correctly navigates to registration page');
      } else {
        console.log(`   ❌ Register link navigation failed. URL: ${registerUrl}`);
      }
    } else {
      console.log('   ❌ Register link is missing');
    }

    console.log('\n🎉 Login Fix Test Complete!');

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  } finally {
    await browser.close();
  }
}

testLoginFix();
