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

  // prévias em PNG — página nova (depois do page.pdf a tela fica em modo impressão e o
  // screenshot de elemento sai cortado). Captura cada lado pela posição dele na página.
  const prev = await browser.newPage({ viewport: { width: 1146, height: 817 } });
  await prev.goto(url, { waitUntil: 'networkidle' });
  await prev.evaluate(() => document.fonts.ready);
  await prev.waitForTimeout(800);
  const caixas = await prev.$$eval('.page', (els) => els.map((e) => { const r = e.getBoundingClientRect(); return { x: r.x, y: r.y + window.scrollY, width: r.width, height: r.height }; }));
  const nomes = ['previa-lado-de-fora.png', 'previa-lado-de-dentro.png'];
  for (let i = 0; i < caixas.length; i++) {
    await prev.screenshot({ path: path.join(__dirname, nomes[i]), clip: caixas[i], fullPage: true });
    console.log('✓ ' + nomes[i]);
  }
  await browser.close();
})();
