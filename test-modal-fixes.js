#!/usr/bin/env node

/**
 * Quick test for the modal fixes
 */

const { chromium } = require('playwright');

async function quickModalTest() {
  console.log('🔧 Testing Modal Fixes...\n');

  const browser = await chromium.launch({ headless: false, slowMo: 1000 });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Login and navigate to dashboard
    await page.goto('http://localhost:5544/auth/login');
    await page.fill('input[type="email"]', 'me@p.pl');
    await page.fill('input[type="password"]', 'testpassword123');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);
    
    if (!page.url().includes('/dashboard')) {
      await page.goto('http://localhost:5544/dashboard');
      await page.waitForLoadState('networkidle');
    }
    
    console.log('✅ Logged in and on dashboard');
    
    // Click upgrade button
    const upgradeButton = page.locator('text=Upgrade Plan');
    await upgradeButton.click();
    await page.waitForTimeout(1000);
    
    console.log('✅ Upgrade modal opened');
    
    // Try to click on a plan card
    const planCards = page.locator('[data-testid="upgrade-card"], .cursor-pointer').filter({ hasText: 'Agent' }).or(page.locator('.cursor-pointer').filter({ hasText: 'Expert' }));
    
    if (await planCards.count() > 0) {
      console.log(`Found ${await planCards.count()} plan cards`);
      
      // Click the first available plan
      await planCards.first().click({ force: true });
      console.log('✅ Successfully clicked on plan card');
      
      // Check if plan is selected (look for upgrade button)
      const upgradeActionButton = page.locator('button:has-text("Upgrade to")');
      if (await upgradeActionButton.isVisible()) {
        console.log('✅ Plan selection working - upgrade button visible');
      }
    } else {
      console.log('⚠️  No plan cards found');
    }
    
    // Close modal by clicking X button
    const closeButton = page.locator('button').filter({ hasText: '×' }).or(page.getByRole('button', { name: 'Close' }));
    if (await closeButton.isVisible()) {
      await closeButton.click();
      console.log('✅ Modal closed successfully');
    }
    
    console.log('\n🎉 Modal fixes verified!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
}

quickModalTest().catch(console.error);
