// Apresentação de preços e variações dos produtos (PDF + prévias PNG), com foto, tamanhos e preços
// puxados SEMPRE de site/produto.html (nunca digitar preço à mão). Não é orçamento: não tem número nem total.
// Uso: node scripts/apresentacao/gerar.js apresentacao.json
// JSON: { "cliente": "Nome (opcional)", "titulo": "Produtos e preços",
//         "itens": [ { "id": "standard", "obs": "texto curto opcional" }, ... ] }   (id = chave em site/produto.html)
const fs = require('fs');
const path = require('path');
const rod = require('../orcamento/rodape');

const RAIZ = path.resolve(__dirname, '../..');
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const MIME = { png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', jfif: 'image/jpeg', webp: 'image/webp' };
const img64 = (rel) => {
  const f = path.join(RAIZ, 'site', rel);
  if (!fs.existsSync(f)) return null;
  return `data:${MIME[path.extname(f).slice(1).toLowerCase()] || 'image/png'};base64,` + fs.readFileSync(f).toString('base64');
};
const num = (v) => parseFloat(String(v).replace(/[^\d,]/g, '').replace(',', '.'));
const brl = (n) => 'R$ ' + n.toFixed(2).replace('.', ',');

function carregarProdutos() {
  const s = fs.readFileSync(path.join(RAIZ, 'site', 'produto.html'), 'utf8');
  const ini = s.indexOf('const produtos = {'), fim = s.indexOf('const upsellMap');
  if (ini < 0 || fim < 0) throw new Error('Não achei `produtos` em site/produto.html');
  const ctx = {};
  new Function('ctx', s.slice(ini, fim).replace('const produtos', 'ctx.produtos'))(ctx);
  return ctx.produtos;
}

// Faixa de preço por tamanho entre as cores (produtos com preço por cor)
function faixasCores(p) {
  const cores = (p.cores || []).filter((c) => !/^branc/i.test(c.nome));
  const out = [];
  for (const [chave, rotulo, def] of [['preco_balde', 'Balde', p.tam_balde_default], ['preco_galao', 'Galão', p.tam_galao_default], ['preco_quarto', 'Quarto', null]]) {
    const v = cores.map((c) => num(c[chave])).filter((n) => !isNaN(n));
    if (!v.length) continue;
    const tam = { '17L': '17/18L', '3,4L': '3,4/3,6L' }[def] || def;   // cor clara vem em 18L/3,6L, cor média/forte em 17L/3,4L (mesmo preço)
    out.push({ rotulo: tam ? `${rotulo} ${tam}` : rotulo, min: Math.min(...v), max: Math.max(...v) });
  }
  return { n: cores.length, faixas: out };
}

(async () => {
  const arq = process.argv[2];
  if (!arq) { console.error('Uso: node scripts/apresentacao/gerar.js apresentacao.json'); process.exit(1); }
  const d = JSON.parse(fs.readFileSync(arq, 'utf8'));
  const produtos = carregarProdutos();
  const erros = d.itens.filter((i) => !produtos[i.id]).map((i) => `produto "${i.id}" não existe no site`);
  if (erros.length) { console.error('✗ ' + erros.join('\n✗ ')); process.exit(1); }

  const hoje = new Date(new Date().getTime() - 3 * 3600e3);
  const data = hoje.toISOString().slice(0, 10).split('-').reverse().join('/');

  const cards = d.itens.map((i) => {
    const p = produtos[i.id];
    const foto = p.imagem ? img64(p.imagem) : null;
    const linhas = (p.precos || []).map((x) => `<div class="v"><span>${esc(x.desc)}</span><b>${esc(x.valor.replace(/\s+/g, ' '))}</b></div>`).join('');
    let cores = '';
    if (p.cores_precificadas || (p.cores || []).some((c) => c.preco_balde || c.preco_galao)) {
      const f = faixasCores(p);
      if (f.n) cores = `<div class="cores"><div class="ct">${f.n} cores — o preço varia conforme a cor</div>${f.faixas.map((x) => `<div class="v"><span>${esc(x.rotulo)}</span><b>${x.min === x.max ? brl(x.min) : brl(x.min) + ' a ' + brl(x.max)}</b></div>`).join('')}</div>`;
    } else if ((p.cores || []).length > 1) {
      cores = `<div class="cores"><div class="ct">${p.cores.length} cores disponíveis</div></div>`;
    }
    return `<div class="card">
      <div class="foto">${foto ? `<img src="${foto}">` : ''}</div>
      <div class="info">
        <div class="nome">${esc(p.nome)}</div>
        <div class="desc">${esc(p.desc_curta || '')}</div>
        ${i.obs ? `<div class="obs">${esc(i.obs)}</div>` : ''}
        <div class="vars">${linhas}</div>${cores}
      </div></div>`;
  }).join('');

  const html = `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Montserrat:wght@700;800&family=Poppins:wght@400;500;600&display=swap" rel="stylesheet">
<style>
:root{--az:#0D47A1;--azesc:#062B63;--am:#FFC107;--cinza:#F0F2F5;--graf:#212529}
*{box-sizing:border-box;margin:0;padding:0}
body{width:1080px;background:#fff;font-family:Poppins,sans-serif;color:var(--graf);-webkit-print-color-adjust:exact;print-color-adjust:exact}
.topo{background:var(--az);color:#fff;padding:44px 56px;display:flex;align-items:center;justify-content:space-between}
.topo img{height:190px;margin:-18px 0}
.topo h1{font:400 78px 'Bebas Neue',sans-serif;letter-spacing:2px;line-height:1;text-align:right}
.topo .p{text-align:right;font-size:25px;margin-top:10px;opacity:.95}
.topo .p b{background:var(--am);color:var(--azesc);padding:4px 16px;border-radius:6px;font:800 25px Montserrat,sans-serif;display:inline-block;transform:rotate(-2deg)}
.lista{padding:30px 56px 10px}
.card{display:flex;gap:30px;align-items:center;padding:26px 0;border-bottom:1px solid #dde1e6;break-inside:avoid;page-break-inside:avoid}
.foto{flex:none;width:230px;height:230px;background:#fff;border:1px solid #e3e6ea;border-radius:10px;display:flex;align-items:center;justify-content:center;padding:12px}
.foto img{max-width:100%;max-height:100%;object-fit:contain}
.info{flex:1}
.nome{font:800 34px Montserrat,sans-serif;color:var(--az);line-height:1.15}
.desc{font-size:22px;color:#5b6470;margin:6px 0 10px;line-height:1.4}
.obs{font-size:21px;background:var(--cinza);border-left:5px solid var(--am);padding:8px 14px;border-radius:4px;margin-bottom:10px}
.v{display:flex;justify-content:space-between;gap:16px;font-size:25px;padding:7px 0;border-bottom:1px dashed #dde1e6}
.v b{font:700 28px Montserrat,sans-serif;white-space:nowrap}
.cores{margin-top:12px;background:var(--cinza);border-radius:8px;padding:10px 16px}
.cores .ct{font:600 20px Poppins,sans-serif;color:#5b6470;text-transform:uppercase;letter-spacing:.5px;margin-bottom:4px}
.nota{margin:14px 56px 28px;font-size:21px;color:#5b6470;line-height:1.5}
${rod.css}
.rodape{break-inside:avoid;page-break-inside:avoid}
</style></head><body>
<div class="topo"><img src="${img64('images/logo-branco.png') || ''}"><div><h1>${esc(d.titulo || 'PRODUTOS E PREÇOS')}</h1><div class="p">${d.cliente ? 'Preparado para <b>' + esc(d.cliente) + '</b> · ' : ''}${data}</div></div></div>
<div class="lista">${cards}</div>
<div class="nota">Preços de ${data}. Parcelamento em até 12x sem juros (consulte as condições). Valores sujeitos a alteração sem aviso prévio.</div>
${rod.html('Quer fechar? Fale com a gente', '(11) 97714-0964')}
</body></html>`;

  const slug = (d.cliente || 'geral').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const dest = path.join(RAIZ, 'saidas', 'apresentacoes', `${slug}-${hoje.toISOString().slice(0, 10)}`);
  fs.mkdirSync(dest, { recursive: true });
  const htmlPath = path.join(dest, 'apresentacao.html');
  fs.writeFileSync(htmlPath, html);

  const { chromium } = require('playwright');
  const exec = process.env.PW_EXEC || (fs.existsSync('/opt/pw-browsers/chromium-1194/chrome-linux/chrome') ? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' : null);
  const br = await chromium.launch(exec ? { executablePath: exec } : {});
  const pg = await br.newPage({ viewport: { width: 1080, height: 1528 } });
  await pg.goto('file://' + htmlPath, { waitUntil: 'networkidle' }).catch(() => {});
  await pg.evaluate(() => document.fonts.ready);
  await pg.waitForTimeout(500);
  await pg.screenshot({ path: path.join(dest, 'previa.png'), fullPage: true });
  const h = await pg.evaluate(() => document.documentElement.scrollHeight);   // página única e longa: lê bem no celular
  await pg.pdf({ path: path.join(dest, 'apresentacao.pdf'), width: '1080px', height: h + 'px', printBackground: true });
  await br.close();
  console.log(`✅ Apresentação gerada: saidas/apresentacoes/${path.basename(dest)}/apresentacao.pdf (+ previa.png) — ${d.itens.length} produtos, preços de ${data}`);
})();
