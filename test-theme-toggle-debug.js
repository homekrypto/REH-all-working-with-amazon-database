const puppeteer = require('puppeteer');

async function testThemeToggle() {
  let browser;
  try {
    console.log('🔧 Testing theme toggle on /add-listing page...');
    
    browser = await puppeteer.launch({ 
      headless: false,
      defaultViewport: null,
      args: ['--start-maximized']
    });
    
    const page = await browser.newPage();
    
    // Navigate to add-listing page
    console.log('📄 Navigating to add-listing page...');
    await page.goto('http://localhost:5544/add-listing', { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });
    
    // Wait for page to load
    await page.waitForTimeout(3000);
    
    // Check if theme toggle button exists
    console.log('🔍 Checking for theme toggle button...');
    const themeToggleExists = await page.$('[aria-label="Toggle theme"], button:has(svg[class*="sun"]), button:has(svg[class*="moon"])');
    
    if (!themeToggleExists) {
      console.log('❌ Theme toggle button not found on page');
      
      // Check if navigation exists
      const navExists = await page.$('nav');
      console.log('🧭 Navigation exists:', !!navExists);
      
      // Check for any buttons in navigation
      const navButtons = await page.$$('nav button');
      console.log('🔘 Buttons in navigation:', navButtons.length);
      
      // Take a screenshot for debugging
      await page.screenshot({ path: 'theme-toggle-debug.png', fullPage: true });
      console.log('📸 Screenshot saved as theme-toggle-debug.png');
      
      return;
    }
    
    console.log('✅ Theme toggle button found');
    
    // Get current theme class
    const bodyClass = await page.$eval('body', el => el.className);
    console.log('🎨 Current body classes:', bodyClass);
    
    // Click theme toggle
    console.log('🖱️ Clicking theme toggle...');
    await themeToggleExists.click();
    
    // Wait for theme change
    await page.waitForTimeout(1000);
    
    // Check if theme changed
    const newBodyClass = await page.$eval('body', el => el.className);
    console.log('🎨 New body classes:', newBodyClass);
    
    if (bodyClass !== newBodyClass) {
      console.log('✅ Theme toggle is working! Classes changed.');
    } else {
      console.log('❌ Theme toggle may not be working - no class change detected');
    }
    
    // Take final screenshot
    await page.screenshot({ path: 'theme-toggle-final.png', fullPage: true });
    console.log('📸 Final screenshot saved as theme-toggle-final.png');
    
  } catch (error) {
    console.error('❌ Error during theme toggle test:', error.message);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

testThemeToggle();
