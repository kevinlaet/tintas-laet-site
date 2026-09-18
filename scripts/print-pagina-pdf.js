const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const pdfPath = path.resolve(process.argv[2]);
  const pageNum = process.argv[3];
  const zoom = process.argv[4] || '70';
  const outPath = process.argv[5];
  const wait = parseInt(process.argv[6] || '5000', 10);
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage({ viewport: { width: 1000, height: 1400 } });
  const url = 'file:///' + pdfPath.replace(/\\/g, '/').replace(/ /g, '%20') + '#page=' + pageNum + '&zoom=' + zoom;
  try {
    await page.goto(url, { waitUntil: 'load', timeout: 20000 });
  } catch (e) {
    console.error('goto error (continuing):', e.message);
  }
  await page.waitForTimeout(wait);
  await page.screenshot({ path: outPath });
  await browser.close();
})();
