// Gera o PDF de impressão (303 x 216 mm, com 3 mm de sangria) e PNGs de prévia.
// Uso: node render.js   (numa sessão de nuvem: PW_EXEC=/opt/pw-browsers/chromium-1194/chrome-linux/chrome node render.js)
const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch(process.env.PW_EXEC ? { executablePath: process.env.PW_EXEC } : {});
  const page = await browser.newPage();
  const url = 'file:///' + path.resolve(__dirname, 'folder.html').replace(/\\/g, '/');
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(800);

  await page.pdf({ path: path.join(__dirname, 'folder-impressao.pdf'), width: '303mm', height: '216mm', printBackground: true, preferCSSPageSize: true });
  console.log('✓ folder-impressao.pdf');

  // prévias em PNG (~300 dpi)
  await page.setViewportSize({ width: 1146, height: 817 });
  const pages = await page.$$('.page');
  const nomes = ['previa-lado-de-fora.png', 'previa-lado-de-dentro.png'];
  for (let i = 0; i < pages.length; i++) {
    await pages[i].screenshot({ path: path.join(__dirname, nomes[i]), scale: 'device' });
    console.log('✓ ' + nomes[i]);
  }
  await browser.close();
})();
