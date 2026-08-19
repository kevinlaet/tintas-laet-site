const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const htmlPath = path.resolve(__dirname, 'carrossel.html');
  await page.goto('file://' + htmlPath);

  await page.waitForTimeout(1000);
  await page.evaluate(async () => {
    const imgs = Array.from(document.querySelectorAll('img'));
    await Promise.all(imgs.map((img) => img.decode ? img.decode().catch(() => {}) : Promise.resolve()));
  });
  await page.waitForTimeout(1000);

  const outDir = path.resolve(__dirname, 'instagram');
  fs.mkdirSync(outDir, { recursive: true });

  const slides = await page.$$('.slide');
  for (let i = 0; i < slides.length; i++) {
    const num = String(i + 1).padStart(2, '0');
    await slides[i].screenshot({ path: path.join(outDir, `slide-${num}.png`) });
  }

  await browser.close();
  console.log(`✓ ${slides.length} slide(s) renderizado(s) em ${outDir}`);
})();
