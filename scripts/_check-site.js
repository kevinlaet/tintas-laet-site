const { chromium } = require('playwright');

const pages = [
  '/index.html',
  '/produtos.html',
  '/produto.html?id=latex-vinil',
  '/produto.html?id=textura-lisa',
  '/produto.html?id=standard',
  '/produto.html?id=super-profissional',
  '/produto.html?id=piso-fachada',
  '/produto.html?id=premium-lavavel',
  '/catalogo/latex-vinil.html',
  '/catalogo/standard.html',
  '/catalogo/super-profissional.html',
  '/catalogo/premium-lavavel.html',
  '/catalogo/emborrachada.html',
  '/catalogo/piso-fachada.html',
  '/orcamento.html',
];

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const results = [];

  page.on('pageerror', (err) => results.push({ type: 'pageerror', msg: err.message }));
  page.on('console', (msg) => {
    if (msg.type() === 'error') results.push({ type: 'console.error', msg: msg.text() });
  });

  for (const path of pages) {
    results.length = 0;
    const resp = await page.goto(`http://localhost:8765${path}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);
    console.log(`\n=== ${path} — HTTP ${resp.status()} ===`);
    if (results.length === 0) {
      console.log('  sem erros de console');
    } else {
      results.forEach(r => console.log(`  [${r.type}] ${r.msg}`));
    }
  }

  await browser.close();
})();
