const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const outDir = path.join(__dirname, 'instagram');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1080, height: 1350 });

  const fileUrl = 'file:///' + path.resolve(__dirname, 'post.html').replace(/\\/g, '/');
  await page.goto(fileUrl, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);
  await page.evaluate(async () => {
    const imgs = Array.from(document.querySelectorAll('img'));
    await Promise.all(imgs.map(img => img.decode ? img.decode().catch(() => {}) : Promise.resolve()));
  });
  await page.waitForTimeout(1000);

  const el = await page.$('.post');
  const out = path.join(outDir, 'post.png');
  await el.screenshot({ path: out });
  console.log('✓ post.png');

  await browser.close();
  console.log('\n✅ Post renderizado em instagram/\n');
})();
