const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1080, height: 1600 });

  const fileUrl = 'file:///' + path.resolve(__dirname, 'panfleto.html').replace(/\\/g, '/');
  await page.goto(fileUrl, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  await page.evaluate(async () => {
    const imgs = Array.from(document.querySelectorAll('img'));
    await Promise.all(imgs.map(img => img.decode ? img.decode().catch(() => {}) : Promise.resolve()));
  });
  await page.waitForTimeout(1000);

  const el = await page.$('.panfleto');
  const out = path.join(__dirname, 'panfleto.png');
  await el.screenshot({ path: out });
  console.log('✅ panfleto.png gerado');

  await browser.close();
})();
