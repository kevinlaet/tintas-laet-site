// Preenche os preços do modelo.html com os valores atuais do site e renderiza os 3 stories.
// Uso: node marketing/stories/2026-10/02-precos-folder/montar.js
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const RAIZ = path.resolve(__dirname, '../../../..');
const s = fs.readFileSync(path.join(RAIZ, 'site/produto.html'), 'utf8');
const ctx = {}; new Function('ctx', s.slice(s.indexOf('const produtos = {'), s.indexOf('const upsellMap')).replace('const produtos', 'ctx.produtos'))(ctx);
const WA = '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#25D366"/><path fill="#fff" d="M17.2 14.3c-.3-.1-1.6-.8-1.8-.9-.3-.1-.4-.1-.6.1l-.8 1c-.2.2-.3.2-.6.1-.3-.1-1.1-.4-2.1-1.3-.8-.7-1.3-1.6-1.5-1.8-.1-.3 0-.4.1-.5l.4-.5.3-.4v-.5l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.2s.9 2.6 1.1 2.7c.1.2 1.9 2.9 4.6 4 .6.3 1.1.4 1.5.5.6.2 1.2.2 1.7.1.5-.1 1.6-.6 1.8-1.3.2-.6.2-1.2.2-1.3-.1-.1-.3-.2-.6-.3z"/></svg>';
const erros = [];
let html = fs.readFileSync(path.join(__dirname, 'modelo.html'), 'utf8')
  .replace(/%WA%/g, WA)
  .replace(/(data-preco="([^"|]+)\|([^"]+)"[^>]*>)[^<]*(<)/g, (_, a, id, desc, f) => {
    const l = ctx.produtos[id] && (ctx.produtos[id].precos || []).find((x) => x.desc === desc);
    if (!l) { erros.push(`${id} | ${desc}`); return a + '???' + f; }
    return a + l.valor + f;
  });
if (erros.length) { console.error('Preço não encontrado no site:\n  ' + erros.join('\n  ')); process.exit(1); }
fs.writeFileSync(path.join(__dirname, 'stories.html'), html);
(async () => {
  const exe = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
  const b = await chromium.launch(fs.existsSync(exe) ? { executablePath: exe } : {});
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  await p.goto('file://' + path.join(__dirname, 'stories.html'), { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(600);
  fs.mkdirSync(path.join(__dirname, 'instagram'), { recursive: true });
  const sl = await p.$$('.slide');
  for (let i = 0; i < sl.length; i++) await sl[i].screenshot({ path: path.join(__dirname, 'instagram', `story-0${i + 1}.png`) });
  await b.close(); console.log(`✓ ${sl.length} stories em instagram/`);
})();
