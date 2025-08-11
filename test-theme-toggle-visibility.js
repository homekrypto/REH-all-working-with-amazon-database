const { chromium } = require('playwright');

async function testThemeToggleVisibility() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    const testPages = [
      { url: 'http://127.0.0.1:3000/', name: 'Homepage', shouldShow: true },
      { url: 'http://127.0.0.1:3000/agents', name: 'Agents', shouldShow: true },
      { url: 'http://127.0.0.1:3000/properties', name: 'Properties', shouldShow: false },
      { url: 'http://127.0.0.1:3000/blog', name: 'Blog', shouldShow: false },
      { url: 'http://127.0.0.1:3000/community', name: 'Community', shouldShow: false },
      { url: 'http://127.0.0.1:3000/register', name: 'Register', shouldShow: false },
    ];

    for (const testPage of testPages) {
      console.log(`\\n🔍 Testing ${testPage.name} page...`);
      
      try {
        await page.goto(testPage.url);
        await page.waitForTimeout(2000);

        // Look for theme toggle button by checking navigation buttons
        const themeToggle = await page.locator('nav button').filter({
          has: page.locator('.sr-only').getByText('Toggle theme')
        }).first();
        const isVisible = await themeToggle.isVisible().catch(() => false);

        if (testPage.shouldShow) {
          if (isVisible) {
            console.log(`✅ ${testPage.name}: Theme toggle correctly visible`);
          } else {
            console.log(`❌ ${testPage.name}: Theme toggle should be visible but is not`);
          }
        } else {
          if (!isVisible) {
            console.log(`✅ ${testPage.name}: Theme toggle correctly hidden`);
          } else {
            console.log(`❌ ${testPage.name}: Theme toggle should be hidden but is visible`);
          }
        }
      } catch (error) {
        console.log(`⚠️ ${testPage.name}: Could not load page - ${error.message}`);
      }
    }

    // Test theme functionality on allowed pages
    console.log('\\n🎨 Testing theme functionality on homepage...');
    await page.goto('http://127.0.0.1:3000/');
    await page.waitForTimeout(2000);

    const themeToggle = await page.locator('nav button').filter({
      has: page.locator('.sr-only').getByText('Toggle theme')
    }).first();
    if (await themeToggle.isVisible()) {
      // Get initial theme
      const initialBodyClass = await page.getAttribute('html', 'class');
      const initialIsDark = initialBodyClass && initialBodyClass.includes('dark');
      
      console.log(`Initial theme: ${initialIsDark ? 'Dark' : 'Light'}`);
      
      // Click theme toggle
      await themeToggle.click();
      await page.waitForTimeout(2000); // Wait longer for theme change
      
      // Check if theme changed
      const newBodyClass = await page.getAttribute('html', 'class');
      const newIsDark = newBodyClass && newBodyClass.includes('dark');
      
      console.log(`New theme: ${newIsDark ? 'Dark' : 'Light'}`);
      console.log(`HTML class after toggle: ${newBodyClass}`);
      
      if (initialIsDark !== newIsDark) {
        console.log('✅ Theme toggle working correctly');
      } else {
        console.log('❌ Theme toggle not working');
        // Try clicking again
        console.log('Trying second click...');
        await themeToggle.click();
        await page.waitForTimeout(2000);
        
        const finalBodyClass = await page.getAttribute('html', 'class');
        const finalIsDark = finalBodyClass && finalBodyClass.includes('dark');
        console.log(`Final theme: ${finalIsDark ? 'Dark' : 'Light'}`);
        console.log(`Final HTML class: ${finalBodyClass}`);
        
        if (initialIsDark !== finalIsDark) {
          console.log('✅ Theme toggle working on second try');
        } else {
          console.log('❌ Theme toggle still not working');
        }
      }
    } else {
      console.log('❌ Theme toggle not found on homepage');
    }

    await page.screenshot({ path: 'theme-toggle-test.png' });

  } catch (error) {
    console.error('Test error:', error.message);
  }

  await browser.close();
}

testThemeToggleVisibility();
