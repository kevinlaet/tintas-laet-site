const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const outDir = path.join(__dirname, 'instagram');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.setViewportSize({ width: 1080, height: 1920 });

  const fileUrl = 'file:///' + path.resolve(__dirname, 'story.html').replace(/\\/g, '/');
  await page.goto(fileUrl, { waitUntil: 'networkidle' });

  // Aguarda fontes carregarem
  await page.waitForTimeout(2500);

  const slides = await page.$$('.slide');
  console.log(`\n${slides.length} slide(s) encontrado(s).\n`);

  for (let i = 0; i < slides.length; i++) {
    const num = String(i + 1).padStart(2, '0');
    const out = path.join(outDir, `slide-${num}.png`);
    await slides[i].screenshot({ path: out });
    console.log(`✓ slide-${num}.png`);
  }

  await browser.close();
  console.log('\n✅ Stories renderizadas em instagram/\n');
})();
