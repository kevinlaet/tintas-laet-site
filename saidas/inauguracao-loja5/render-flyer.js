const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1024, height: 1536 });

  const filePath = path.resolve(__dirname, 'flyer-v3.html');
  await page.goto(`file:///${filePath}`);
  await page.waitForTimeout(1500);
  await page.evaluate(async () => {
    const imgs = Array.from(document.querySelectorAll('img'));
    await Promise.all(imgs.map(img => img.decode ? img.decode().catch(() => {}) : Promise.resolve()));
  });
  await page.waitForTimeout(500);

  await page.screenshot({ path: path.resolve(__dirname, 'flyer-v3-final.png'), fullPage: false });
  console.log('✓ flyer-v3-final.png gerado');
  await browser.close();
})();
