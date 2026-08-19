const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1400, height: 1200 });

  const filePath = path.resolve(__dirname, 'composite.html');
  await page.goto(`file:///${filePath}`);
  await page.waitForTimeout(400);
  await page.evaluate(async () => {
    const imgs = Array.from(document.querySelectorAll('img'));
    await Promise.all(imgs.map(img => img.decode ? img.decode().catch(() => {}) : Promise.resolve()));
    document.fonts && await document.fonts.ready;
  });
  await page.waitForTimeout(300);

  const targets = [
    { id: '#desktop', out: 'hero-banner-3-desktop.png' },
    { id: '#mobile', out: 'hero-banner-3-mobile.png' },
    { id: '#desktop', out: path.resolve(__dirname, '../../site/images/hero banners/hero banner 3.jpg'), jpeg: true },
    { id: '#mobile', out: path.resolve(__dirname, '../../site/images/hero banners/banner mobile 2.jpg'), jpeg: true },
  ];

  for (const t of targets) {
    const el = await page.$(t.id);
    const outPath = t.jpeg ? t.out : path.resolve(__dirname, t.out);
    const opts = { path: outPath };
    if (t.jpeg) { opts.type = 'jpeg'; opts.quality = 92; }
    await el.screenshot(opts);
    console.log(`✓ ${outPath}`);
  }

  await browser.close();
})();
