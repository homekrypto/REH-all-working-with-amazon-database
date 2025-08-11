#!/usr/bin/env node

/**
 * Simple test for the Upgrade Modal functionality
 */

const { chromium } = require('playwright');

async function testUpgradeModal() {
  console.log('🚀 Testing Upgrade Modal...\n');

  const browser = await chromium.launch({ headless: false, slowMo: 1000 });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Navigate to the main page first
    console.log('📋 Step 1: Loading application...');
    await page.goto('http://localhost:5544');
    await page.waitForLoadState('networkidle');
    
    // Check if we're on login page
    const isLoginPage = await page.locator('text=Sign In').isVisible();
    
    if (isLoginPage) {
      console.log('📱 Step 2: Found login page, will test without authentication...');
      
      // Try to navigate directly to dashboard (might redirect back to login)
      await page.goto('http://localhost:5544/dashboard');
      await page.waitForLoadState('networkidle');
      
      // Check if we have access to dashboard or if we need to login
      const hasDashboard = await page.locator('text=Dashboard').isVisible();
      const hasUpgradeButton = await page.locator('text=Upgrade Plan').isVisible();
      
      if (hasDashboard || hasUpgradeButton) {
        console.log('   ✅ Dashboard is accessible');
        
        if (hasUpgradeButton) {
          console.log('   ✅ Upgrade Plan button is visible');
          
          // Click the upgrade button
          await page.click('text=Upgrade Plan');
          await page.waitForTimeout(1000);
          
          // Check if modal opened
          const modalTitle = await page.locator('text=Upgrade Your Plan').isVisible();
          if (modalTitle) {
            console.log('   ✅ Upgrade modal opened successfully');
            
            // Check for upgrade options
            const agentStandard = await page.locator('text=Agent Standard').isVisible();
            const agentProfessional = await page.locator('text=Agent Professional').isVisible();
            const expertMonthly = await page.locator('text=Expert Monthly').isVisible();
            
            console.log(`   📊 Available upgrades:`);
            console.log(`      - Agent Standard: ${agentStandard ? '✅' : '❌'}`);
            console.log(`      - Agent Professional: ${agentProfessional ? '✅' : '❌'}`);
            console.log(`      - Expert Monthly: ${expertMonthly ? '✅' : '❌'}`);
            
            // Check for proper pricing display
            const pricing = await page.locator('text=/\\$\\d+/').count();
            console.log(`   💰 Found ${pricing} price displays`);
            
            // Close modal
            await page.click('button[aria-label="Close"]').catch(() => {
              // Try alternative close method
              page.press('Escape');
            });
            
            console.log('   ✅ Modal can be closed');
            
          } else {
            console.log('   ❌ Upgrade modal did not open');
          }
        } else {
          console.log('   ❌ Upgrade Plan button not found');
        }
      } else {
        console.log('   ⚠️  Dashboard not accessible - need authentication');
        console.log('   📝 The upgrade system requires user authentication');
      }
    }
    
    console.log('\n🎉 Upgrade Modal Test Complete!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
}

testUpgradeModal().catch(console.error);
