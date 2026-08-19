const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1400, height: 2000 });

  const filePath = path.resolve(__dirname, 'composite.html');
  await page.goto(`file:///${filePath}`);
  await page.waitForTimeout(500);
  await page.evaluate(async () => {
    const imgs = Array.from(document.querySelectorAll('img'));
    await Promise.all(imgs.map(img => img.decode ? img.decode().catch(() => {}) : Promise.resolve()));
  });
  await page.waitForTimeout(500);

  const slides = [
    { id: '#s1', out: 'hero-banner-1.png' },
    { id: '#s2', out: 'hero-banner-2.png' },
    { id: '#s3', out: 'hero-banner-3.png' },
  ];

  for (const s of slides) {
    const el = await page.$(s.id);
    await el.screenshot({ path: path.resolve(__dirname, s.out) });
    console.log(`✓ ${s.out}`);
  }

  await browser.close();
})();
