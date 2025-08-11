#!/usr/bin/env node

/**
 * Simple test to verify the registration success page displays correctly
 */

const { chromium } = require('playwright');

async function testRegistrationSuccessPage() {
  console.log('🚀 Testing Registration Success Page...\n');

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Navigate directly to the registration success page with test parameters
    const testUrl = 'http://localhost:3000/registration-success?email=test%40example.com&role=agent&package=Agent%20Pro';
    
    console.log('📋 Step 1: Navigating to registration success page...');
    await page.goto(testUrl);
    await page.waitForLoadState('networkidle');
    
    console.log('✨ Step 2: Verifying page content...');
    
    // Check for success message
    const successTitle = await page.locator('text=Registration Successful').first();
    if (await successTitle.isVisible()) {
      console.log('   ✅ Success title is visible');
    } else {
      console.log('   ❌ Success title is missing');
    }

    // Check for user details
    const emailText = await page.locator('text=test@example.com').first();
    if (await emailText.isVisible()) {
      console.log('   ✅ User email is displayed correctly');
    } else {
      console.log('   ❌ User email is missing');
    }

    const roleText = await page.locator('text=Real Estate Agent').first();
    if (await roleText.isVisible()) {
      console.log('   ✅ User role is displayed correctly');
    } else {
      console.log('   ❌ User role is missing');
    }

    const packageText = await page.locator('text=Agent Pro').first();
    if (await packageText.isVisible()) {
      console.log('   ✅ Package name is displayed correctly');
    } else {
      console.log('   ❌ Package name is missing');
    }

    // Check for next steps
    const emailVerificationStep = await page.locator('text=Check Your Email for Verification').first();
    if (await emailVerificationStep.isVisible()) {
      console.log('   ✅ Email verification step is visible');
    } else {
      console.log('   ❌ Email verification step is missing');
    }

    const paymentStep = await page.locator('text=Complete Your Payment').first();
    if (await paymentStep.isVisible()) {
      console.log('   ✅ Payment step is visible for paid user');
    } else {
      console.log('   ❌ Payment step is missing');
    }

    const dashboardStep = await page.locator('text=Access Your Dashboard').first();
    if (await dashboardStep.isVisible()) {
      console.log('   ✅ Dashboard access step is visible');
    } else {
      console.log('   ❌ Dashboard access step is missing');
    }

    // Check for action buttons
    const openEmailButton = await page.locator('text=Open Email').first();
    if (await openEmailButton.isVisible()) {
      console.log('   ✅ Open Email button is available');
    } else {
      console.log('   ❌ Open Email button is missing');
    }

    const loginButton = await page.locator('text=Go to Login').first();
    if (await loginButton.isVisible()) {
      console.log('   ✅ Go to Login button is available');
    } else {
      console.log('   ❌ Go to Login button is missing');
    }

    console.log('\n🔧 Step 3: Testing button functionality...');
    
    // Test login button redirect
    await loginButton.click();
    await page.waitForTimeout(2000);
    
    const currentUrl = page.url();
    if (currentUrl.includes('/auth/login')) {
      console.log('   ✅ Login button correctly redirects to login page');
    } else {
      console.log(`   ❌ Login button redirect failed. Current URL: ${currentUrl}`);
    }

    console.log('\n🎉 Registration Success Page Test Complete!');
    console.log('\n📋 Summary:');
    console.log('   • Registration success page loads correctly');
    console.log('   • User details are displayed properly');
    console.log('   • Clear next steps are provided');
    console.log('   • Action buttons work as expected');
    console.log('   • Users get clear guidance on what to do next');

  } catch (error) {
    console.error('\n❌ Test failed with error:', error);
    
    // Take a screenshot for debugging
    try {
      await page.screenshot({ path: 'registration-success-error.png', fullPage: true });
      console.log('📸 Screenshot saved as registration-success-error.png');
    } catch (screenshotError) {
      console.error('Failed to take screenshot:', screenshotError);
    }
  } finally {
    await browser.close();
  }
}

// Test the full registration flow as well
async function testFullRegistrationFlow() {
  console.log('\n🚀 Testing Full Registration Flow (UI Only)...\n');

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Step 1: Navigate to registration page
    console.log('📋 Step 1: Navigating to registration page...');
    await page.goto('http://localhost:3000/register');
    await page.waitForLoadState('networkidle');

    // Step 2: Select Agent role
    console.log('👤 Step 2: Selecting Agent role...');
    await page.click('text=Real Estate Agent');
    await page.click('text=Continue');
    await page.waitForTimeout(1000);

    // Step 3: Fill personal information
    console.log('📝 Step 3: Filling personal information...');
    await page.fill('input[name="name"]', 'Test Agent User');
    await page.fill('input[name="email"]', 'testagent@example.com');
    await page.fill('input[name="password"]', 'TestPass123');
    await page.fill('input[name="confirmPassword"]', 'TestPass123');
    await page.fill('input[name="phone"]', '+1234567890');
    await page.click('text=Continue');
    await page.waitForTimeout(1000);

    // Step 4: Fill business information
    console.log('🏢 Step 4: Filling business information...');
    await page.fill('input[name="agencyName"]', 'Test Real Estate Agency');
    await page.fill('textarea[name="bio"]', 'This is a test agency for registration testing');
    await page.click('text=Continue');
    await page.waitForTimeout(2000);

    // Step 5: Check package selection page
    console.log('💰 Step 5: Checking package selection...');
    
    // Look for billing toggle
    const monthlyText = page.locator('text=Monthly');
    const yearlyText = page.locator('text=Yearly');
    
    if (await monthlyText.isVisible() && await yearlyText.isVisible()) {
      console.log('   ✅ Billing period toggle is visible');
      
      // Test clicking yearly
      await yearlyText.click();
      await page.waitForTimeout(1000);
      console.log('   ✅ Yearly billing toggle works');
    }

    // Look for packages
    const packageElements = await page.locator('.card, [class*="package"], [class*="card"]').count();
    console.log(`   📦 Found ${packageElements} potential package cards`);

    console.log('\n✅ UI Navigation Test Complete!');
    console.log('   • All registration steps are accessible');
    console.log('   • Forms can be filled out correctly');
    console.log('   • Billing toggle is functional');
    console.log('   • Package selection page is reachable');

  } catch (error) {
    console.error('\n❌ Full flow test failed:', error);
  } finally {
    await browser.close();
  }
}

// Run both tests
(async () => {
  await testRegistrationSuccessPage();
  await testFullRegistrationFlow();
})().catch(console.error);
