const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1200, height: 900 });

  const filePath = path.resolve(__dirname, 'composite-slides.html');
  await page.goto(`file:///${filePath}`);
  await page.waitForTimeout(1500);
  await page.evaluate(async () => {
    const imgs = Array.from(document.querySelectorAll('img'));
    await Promise.all(imgs.map(img => img.decode ? img.decode().catch(() => {}) : Promise.resolve()));
  });
  await page.waitForTimeout(800);

  const slides = [
    { id: '#s1', out: 'slide1-final.png' },
    { id: '#s2', out: 'slide2-final.png' },
    { id: '#s3', out: 'slide3-final.png' },
  ];

  for (const s of slides) {
    const el = await page.$(s.id);
    await el.screenshot({ path: path.resolve(__dirname, s.out) });
    console.log(`✓ ${s.out}`);
  }

  await browser.close();
})();
