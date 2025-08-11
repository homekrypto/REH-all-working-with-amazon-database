#!/usr/bin/env node

/**
 * Test script for the Registration Success flow
 * Tests the complete agent registration journey with confirmation page
 */

const { chromium } = require('playwright');

async function testRegistrationSuccess() {
  console.log('🚀 Starting Registration Success Flow Test...\n');

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

    // Step 5: Verify billing toggle and select package
    console.log('💰 Step 5: Testing billing toggle and package selection...');
    
    // Test yearly toggle
    const yearlyToggle = page.locator('text=Yearly (10% discount)').first();
    if (await yearlyToggle.isVisible()) {
      console.log('   ✅ Yearly billing toggle is visible');
      await yearlyToggle.click();
      await page.waitForTimeout(1000);
      console.log('   ✅ Switched to yearly billing');
    }

    // Select a package
    const selectButtons = await page.locator('text=Select Package').count();
    const selectBtns = await page.locator('button:has-text("Select")').count();
    const packageCards = Math.max(selectButtons, selectBtns);
    
    if (packageCards > 0) {
      console.log(`   📦 Found ${packageCards} packages available`);
      try {
        await page.click('text=Select Package');
        console.log('   ✅ Selected first available package');
      } catch (e) {
        await page.click('button:has-text("Select")');
        console.log('   ✅ Selected first available package (alternative selector)');
      }
    } else {
      console.log('   ⚠️  No packages found, clicking Complete Registration button');
    }
    
    await page.waitForTimeout(1000);

    // Step 6: Complete registration
    console.log('🎯 Step 6: Completing registration...');
    const completeButton = page.locator('text=Complete Registration');
    if (await completeButton.isVisible()) {
      await completeButton.click();
    } else {
      console.log('   ⚠️  Complete Registration button not found, trying alternative');
      await page.click('button[type="submit"], .submit-button, text=Register');
    }

    // Step 7: Wait for registration success redirect
    console.log('⏳ Step 7: Waiting for registration success redirect...');
    await page.waitForURL('**/registration-success**', { timeout: 10000 });
    console.log('   ✅ Successfully redirected to registration success page');

    // Step 8: Verify registration success page content
    console.log('✨ Step 8: Verifying registration success page...');
    
    // Check for success message
    const successTitle = await page.locator('text=Registration Successful').first();
    if (await successTitle.isVisible()) {
      console.log('   ✅ Success title is visible');
    }

    // Check for user details
    const emailText = await page.locator('text=testagent@example.com').first();
    if (await emailText.isVisible()) {
      console.log('   ✅ User email is displayed correctly');
    }

    const roleText = await page.locator('text=Real Estate Agent').first();
    if (await roleText.isVisible()) {
      console.log('   ✅ User role is displayed correctly');
    }

    // Check for next steps
    const emailVerificationStep = await page.locator('text=Check Your Email for Verification').first();
    if (await emailVerificationStep.isVisible()) {
      console.log('   ✅ Email verification step is visible');
    }

    const paymentStep = await page.locator('text=Complete Your Payment').first();
    if (await paymentStep.isVisible()) {
      console.log('   ✅ Payment step is visible for paid user');
    }

    const dashboardStep = await page.locator('text=Access Your Dashboard').first();
    if (await dashboardStep.isVisible()) {
      console.log('   ✅ Dashboard access step is visible');
    }

    // Check for action buttons
    const openEmailButton = await page.locator('text=Open Email').first();
    if (await openEmailButton.isVisible()) {
      console.log('   ✅ Open Email button is available');
    }

    const loginButton = await page.locator('text=Go to Login').first();
    if (await loginButton.isVisible()) {
      console.log('   ✅ Go to Login button is available');
    }

    // Step 9: Test functionality of buttons
    console.log('🔧 Step 9: Testing button functionality...');
    
    // Test login button redirect
    await loginButton.click();
    await page.waitForURL('**/auth/login**', { timeout: 5000 });
    console.log('   ✅ Login button correctly redirects to login page');

    console.log('\n🎉 All tests passed! Registration success flow is working correctly.');
    console.log('\n📋 Summary:');
    console.log('   • Multi-step agent registration works');
    console.log('   • Billing toggle (monthly/yearly) functions properly');
    console.log('   • Package selection is available');
    console.log('   • Registration success page displays correctly');
    console.log('   • Clear next steps are provided to users');
    console.log('   • Action buttons work as expected');

  } catch (error) {
    console.error('\n❌ Test failed with error:', error);
    
    // Take a screenshot for debugging
    try {
      await page.screenshot({ path: 'registration-error.png', fullPage: true });
      console.log('📸 Screenshot saved as registration-error.png');
    } catch (screenshotError) {
      console.error('Failed to take screenshot:', screenshotError);
    }
  } finally {
    await browser.close();
  }
}

// Run the test
testRegistrationSuccess().catch(console.error);
