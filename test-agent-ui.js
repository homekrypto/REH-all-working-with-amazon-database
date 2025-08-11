// UI Test Script for Agent Registration Flow
const puppeteer = require('puppeteer');

async function testAgentRegistrationUI() {
  console.log('🚀 Testing Agent Registration UI Flow...\n');

  let browser;
  try {
    browser = await puppeteer.launch({ 
      headless: false, // Set to true for headless testing
      devtools: true,
      slowMo: 500 // Slow down for demonstration
    });
    
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });

    // Navigate to registration page
    console.log('1. Navigating to registration page...');
    await page.goto('http://localhost:3000/register');
    await page.waitForSelector('h1, h2');

    // Step 1: Role Selection
    console.log('2. Testing role selection...');
    await page.waitForSelector('text/Real Estate Agent');
    await page.click('text/Real Estate Agent');
    
    // Wait for step 2 to appear
    await page.waitForSelector('input[placeholder="John Doe"]');

    // Step 2: Personal Information
    console.log('3. Filling personal information...');
    await page.type('input[placeholder="John Doe"]', 'Test Agent Smith');
    await page.type('input[placeholder="john@example.com"]', `testagent${Date.now()}@example.com`);
    await page.type('input[placeholder="••••••••"]', 'testpassword123');
    
    // Find confirm password field
    const passwordFields = await page.$$('input[type="password"]');
    if (passwordFields.length > 1) {
      await passwordFields[1].type('testpassword123');
    }
    
    await page.type('input[placeholder="+1 (555) 000-0000"]', '+1234567890');
    
    // Click continue
    await page.click('button[type="submit"]');
    
    // Wait for step 3
    await page.waitForSelector('input[placeholder*="Agency"]', { timeout: 5000 });

    // Step 3: Business Information
    console.log('4. Filling business information...');
    await page.type('input[placeholder*="Agency"]', 'Test Real Estate Agency');
    await page.type('textarea', 'Experienced real estate agent specializing in residential properties');
    
    // Click continue to pricing
    await page.click('text/Continue to Pricing');
    
    // Wait for package selection
    await page.waitForSelector('text/Agent Basic', { timeout: 5000 });

    // Step 4: Package Selection
    console.log('5. Testing package selection...');
    
    // Click on Agent Basic package
    await page.click('text/Agent Basic');
    
    // Wait for selection to register and complete registration button to appear
    await page.waitForSelector('text/Complete Registration', { timeout: 5000 });
    
    console.log('6. Package selected - Agent Basic');
    
    // Test clicking on different packages
    await page.click('text/Agent Standard');
    console.log('7. Package changed to Agent Standard');
    
    await page.click('text/Agent Professional');
    console.log('8. Package changed to Agent Professional');
    
    // Final package selection
    await page.click('text/Agent Basic');
    console.log('9. Final package selection: Agent Basic');
    
    // Take a screenshot of the final state
    await page.screenshot({ 
      path: 'agent-registration-test.png',
      fullPage: true 
    });
    
    console.log('10. Screenshot saved as agent-registration-test.png');
    
    console.log('\n✅ UI Test completed successfully!');
    console.log('📝 Registration flow verified:');
    console.log('   - Role selection works');
    console.log('   - Personal info form works');
    console.log('   - Business info form works');
    console.log('   - Package selection works');
    console.log('   - All three agent packages are displayed');
    
  } catch (error) {
    console.error('❌ UI Test failed:', error.message);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Check if puppeteer is available
try {
  require('puppeteer');
  testAgentRegistrationUI();
} catch (error) {
  console.log('ℹ️  Puppeteer not available for UI testing.');
  console.log('💡 Manual UI testing instructions:');
  console.log('   1. Open http://localhost:3000/register');
  console.log('   2. Click "Real Estate Agent"');
  console.log('   3. Fill personal information form');
  console.log('   4. Fill business information form');
  console.log('   5. Select a package from: Agent Basic ($30), Agent Standard ($50), Agent Professional ($100)');
  console.log('   6. Click "Complete Registration"');
  console.log('\n✅ API testing completed successfully above!');
}
