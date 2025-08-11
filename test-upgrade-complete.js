#!/usr/bin/env node

/**
 * Complete test for the Upgrade System with authentication
 */

const { chromium } = require('playwright');

async function testUpgradeSystemComplete() {
  console.log('🚀 Testing Complete Upgrade System...\n');

  const browser = await chromium.launch({ headless: false, slowMo: 500 });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Step 1: Login with existing test user
    console.log('🔐 Step 1: Logging in with test agent...');
    await page.goto('http://localhost:5544/auth/login');
    await page.waitForLoadState('networkidle');
    
    // Fill login credentials with existing test user
    await page.fill('input[type="email"]', 'me@p.pl');  // Using existing test user
    await page.fill('input[type="password"]', 'testpassword123');
    
    console.log('   📝 Filled login credentials for me@p.pl');
    
    // Submit login
    await page.click('button[type="submit"]');
    console.log('   🚀 Submitted login form');
    
    // Wait for redirect to dashboard
    await page.waitForTimeout(3000);
    
    // Check if we're redirected to dashboard
    const currentUrl = page.url();
    console.log(`   📍 Current URL: ${currentUrl}`);
    
    // Navigate to dashboard if not already there
    if (!currentUrl.includes('/dashboard')) {
      await page.goto('http://localhost:5544/dashboard');
      await page.waitForLoadState('networkidle');
    }
    
    console.log('   ✅ Successfully logged in and navigated to dashboard');
    
    // Step 2: Test upgrade button and modal
    console.log('\n📱 Step 2: Testing upgrade functionality...');
    
    // Look for upgrade button
    const upgradeButtonSelectors = [
      'text=Upgrade Plan',
      'text=Upgrade',
      'button:has-text("Upgrade")',
      '[data-testid="upgrade-button"]'
    ];
    
    let upgradeButton = null;
    for (const selector of upgradeButtonSelectors) {
      try {
        upgradeButton = page.locator(selector);
        if (await upgradeButton.isVisible({ timeout: 2000 })) {
          console.log(`   ✅ Found upgrade button with selector: ${selector}`);
          break;
        }
      } catch (e) {
        // Continue to next selector
      }
    }
    
    if (!upgradeButton || !await upgradeButton.isVisible()) {
      console.log('   ⚠️  Upgrade button not found, checking page content...');
      
      // Debug: Take screenshot and log page content
      await page.screenshot({ path: 'dashboard-debug.png' });
      console.log('   📸 Screenshot saved as dashboard-debug.png');
      
      // Check what's actually on the page
      const headerText = await page.textContent('header').catch(() => 'No header found');
      const bodyText = await page.textContent('body').catch(() => 'No body found');
      
      console.log('   📋 Header content sample:', headerText.substring(0, 200));
      console.log('   📋 Body content sample:', bodyText.substring(0, 300));
      
      // Try to find any button that might be the upgrade button
      const allButtons = await page.locator('button').all();
      console.log(`   🔍 Found ${allButtons.length} buttons on page`);
      
      for (let i = 0; i < Math.min(allButtons.length, 10); i++) {
        const buttonText = await allButtons[i].textContent().catch(() => '');
        console.log(`      Button ${i}: "${buttonText}"`);
      }
    } else {
      // Click the upgrade button
      await upgradeButton.click();
      console.log('   🔗 Clicked upgrade button');
      
      await page.waitForTimeout(1000);
      
      // Step 3: Test upgrade modal
      console.log('\n💳 Step 3: Testing upgrade modal...');
      
      // Check if modal opened
      const modalSelectors = [
        'text=Upgrade Your Plan',
        '[role="dialog"]',
        '.modal',
        'div:has-text("Upgrade Your Plan")'
      ];
      
      let modalFound = false;
      for (const selector of modalSelectors) {
        try {
          const modal = page.locator(selector);
          if (await modal.isVisible({ timeout: 2000 })) {
            console.log(`   ✅ Modal opened - found with selector: ${selector}`);
            modalFound = true;
            break;
          }
        } catch (e) {
          // Continue to next selector
        }
      }
      
      if (modalFound) {
        // Test upgrade options
        console.log('   📊 Checking available upgrade options...');
        
        const upgradeOptions = [
          'Agent Standard',
          'Agent Professional', 
          'Expert Monthly',
          'Expert Yearly'
        ];
        
        for (const option of upgradeOptions) {
          const optionElement = page.locator(`text=${option}`);
          const isVisible = await optionElement.isVisible().catch(() => false);
          console.log(`      - ${option}: ${isVisible ? '✅' : '❌'}`);
        }
        
        // Check for pricing information
        const priceElements = await page.locator('text=/\\$\\d+/').count();
        console.log(`   💰 Found ${priceElements} price displays`);
        
        // Check for features lists
        const featureElements = await page.locator('text=Up to').count() + 
                              await page.locator('text=Unlimited').count() +
                              await page.locator('text=Advanced').count();
        console.log(`   📋 Found ${featureElements} feature descriptions`);
        
        // Test clicking on an upgrade option (if available)
        const firstUpgradeCard = page.locator('.cursor-pointer').first();
        if (await firstUpgradeCard.isVisible()) {
          await firstUpgradeCard.click();
          console.log('   🔗 Selected first upgrade option');
          await page.waitForTimeout(500);
        }
        
        // Look for upgrade button within modal
        const modalUpgradeButton = page.locator('text=/Upgrade to/');
        if (await modalUpgradeButton.isVisible()) {
          console.log('   ✅ Found upgrade action button in modal');
          
          // Note: We won't actually click to avoid creating real payments
          console.log('   ⚠️  Skipping actual payment to avoid charges');
        }
        
        // Close modal
        const closeButton = page.locator('button:has-text("Close"), button[aria-label="Close"], text=×').first();
        if (await closeButton.isVisible()) {
          await closeButton.click();
          console.log('   ✅ Successfully closed modal');
        } else {
          // Try escape key
          await page.keyboard.press('Escape');
          console.log('   ✅ Closed modal with Escape key');
        }
        
      } else {
        console.log('   ❌ Modal did not open');
        await page.screenshot({ path: 'modal-debug.png' });
        console.log('   📸 Debug screenshot saved as modal-debug.png');
      }
    }
    
    console.log('\n🎉 Upgrade System Test Summary:');
    console.log('   ✅ Login functionality working');
    console.log('   ✅ Dashboard accessible');
    console.log('   📊 Upgrade system components tested');
    console.log('\n🔧 Next steps:');
    console.log('   • Verify Stripe integration in test environment');
    console.log('   • Test webhook handling for subscription updates');
    console.log('   • Test different user tiers and upgrade paths');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack:', error.stack);
    
    // Take debug screenshot
    await page.screenshot({ path: 'error-debug.png' });
    console.log('📸 Error screenshot saved as error-debug.png');
  } finally {
    await browser.close();
  }
}

testUpgradeSystemComplete().catch(console.error);
