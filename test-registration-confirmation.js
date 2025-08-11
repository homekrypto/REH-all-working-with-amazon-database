/**
 * Test Registration Confirmation Flow
 * 
 * This test verifies that users see proper confirmation after clicking "Complete Registration"
 * and checks that they are properly redirected to the confirmation page.
 */

const { chromium } = require('playwright');

async function testRegistrationConfirmation() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    console.log('Starting registration confirmation test...');
    
    // Navigate to registration page
    await page.goto('http://localhost:3000/register');
    
    // Step 1: Select Agent role
    console.log('Selecting Agent role...');
    await page.click('text=Real Estate Agent');
    await page.click('button:has-text("Continue")');
    
    // Wait for packages to load
    await page.waitForTimeout(2000);
    
    // Step 2: Fill personal information
    console.log('Filling personal information...');
    await page.fill('input[name="firstName"]', 'John');
    await page.fill('input[name="lastName"]', 'Doe');
    await page.fill('input[name="email"]', `john.doe.${Date.now()}@example.com`);
    await page.fill('input[name="password"]', 'SecurePassword123!');
    await page.fill('input[name="confirmPassword"]', 'SecurePassword123!');
    await page.fill('input[name="phone"]', '+1234567890');
    await page.click('button:has-text("Continue")');
    
    // Step 3: Fill business information
    console.log('Filling business information...');
    await page.fill('input[name="companyName"]', 'Test Real Estate Co.');
    await page.fill('input[name="licenseNumber"]', 'RE123456789');
    await page.fill('input[name="yearsExperience"]', '5');
    await page.fill('textarea[name="specializations"]', 'Residential properties, First-time buyers');
    await page.click('button:has-text("Continue")');
    
    // Wait for packages page
    await page.waitForTimeout(1000);
    
    // Step 4: Select a package
    console.log('Selecting a package...');
    const packageCards = await page.locator('.cursor-pointer').all();
    if (packageCards.length > 0) {
      await packageCards[0].click();
      await page.waitForTimeout(500);
    }
    
    // Step 5: Click Complete Registration and watch for feedback
    console.log('Clicking Complete Registration button...');
    
    // Take screenshot before clicking
    await page.screenshot({ path: 'before-registration.png' });
    
    const completeButton = page.locator('button:has-text("Complete Registration")');
    await completeButton.click();
    
    // Check for immediate loading state
    console.log('Checking for loading state...');
    const loadingButton = page.locator('button:has-text("Creating Account...")');
    if (await loadingButton.isVisible()) {
      console.log('✓ Loading state is visible');
    } else {
      console.log('⚠️ Loading state not visible');
    }
    
    // Wait for success state
    console.log('Waiting for success state...');
    try {
      await page.waitForSelector('button:has-text("Registration Complete! Redirecting...")', { timeout: 10000 });
      console.log('✓ Success state is visible');
      
      // Take screenshot of success state
      await page.screenshot({ path: 'registration-success-button.png' });
    } catch (e) {
      console.log('⚠️ Success state not found within 10 seconds');
      await page.screenshot({ path: 'registration-timeout.png' });
    }
    
    // Wait for redirect to confirmation page
    console.log('Waiting for redirect...');
    try {
      await page.waitForURL('**/registration-success**', { timeout: 15000 });
      console.log('✓ Successfully redirected to confirmation page');
      
      // Take screenshot of confirmation page
      await page.screenshot({ path: 'registration-confirmation-page.png' });
      
      // Check that confirmation page has proper content
      const successText = await page.textContent('h1');
      if (successText && successText.includes('Registration Successful')) {
        console.log('✓ Confirmation page shows success message');
      } else {
        console.log('⚠️ Confirmation page missing success message');
      }
      
    } catch (e) {
      console.log('⚠️ Failed to redirect to confirmation page within 15 seconds');
      console.log('Current URL:', page.url());
      await page.screenshot({ path: 'registration-failed-redirect.png' });
    }
    
    console.log('Registration confirmation test completed');
    
  } catch (error) {
    console.error('Test failed:', error);
    await page.screenshot({ path: 'registration-test-error.png' });
  } finally {
    await browser.close();
  }
}

if (require.main === module) {
  testRegistrationConfirmation().catch(console.error);
}

module.exports = { testRegistrationConfirmation };
