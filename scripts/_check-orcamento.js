const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', (err) => errors.push(err.message));
  page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()); });

  await page.goto('http://localhost:8765/orcamento.html');
  await page.fill('#gatePass', 'laet2026');
  await page.click('button:has-text("Entrar")');
  await page.waitForSelector('#itemsList .item-card', { timeout: 10000 });

  const produtoSel = await page.$('#itemsList [data-f="produto"]');
  const produtoOptions = await produtoSel.evaluate(el => Array.from(el.options).map(o => o.value).filter(Boolean));
  console.log('Total produtos no select:', produtoOptions.length);

  for (const target of ['latex-vinil', 'textura-lisa']) {
    await produtoSel.selectOption(target);
    await page.waitForTimeout(300);
    const varianteSel = await page.$('#itemsList [data-f="variante"]');
    const opts = await varianteSel.evaluate(el => Array.from(el.options).map(o => ({ value: o.value, text: o.textContent })));
    console.log(`\n=== ${target} — opções de variante (${opts.length}) ===`);
    opts.forEach(o => console.log(' ', o.text));
  }

  console.log('\n=== erros de console/página ===');
  console.log(errors.length ? errors : 'nenhum');

  await browser.close();
})();
