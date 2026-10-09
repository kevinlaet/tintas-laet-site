// Gera o orçamento visual (PNG pra WhatsApp + PDF) no padrão Tintas Laet, com número sequencial.
// Uso: node scripts/orcamento/gerar.js orcamento.json [--teste]
//   --teste = não gasta número do contador (pra conferir o visual)
// JSON de entrada:
// { "cliente": "Mara", "whatsappCliente": "(11) 91234-5678",
//   "vendedor": "Kevin", "whatsappLoja": "(11) 97714-0964",
//   "itens": [ { "produto": "Standard", "cor": "Tangerina", "tamanho": "Galão 3,4L", "qtd": 1, "unit": 79.90 } ],
//   "desconto": 0, "obs": "" }
const fs = require('fs');
const path = require('path');

const rod = require('./rodape');
const RAIZ = path.resolve(__dirname, '../..');
const CONTADOR = path.join(__dirname, 'contador.json');       // versionado: só o último número, sem dado de cliente
const REGISTRO_DIR = path.join(RAIZ, 'dados', 'orcamentos');  // dados/ é privado (gitignored): histórico com nome de cliente
const brl = (n) => 'R$ ' + n.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const b64 = (f) => 'data:image/png;base64,' + fs.readFileSync(path.join(RAIZ, f)).toString('base64');
const soDigitos = (s) => String(s || '').replace(/\D/g, '');

(async () => {
  const args = process.argv.slice(2);
  const teste = args.includes('--teste');
  const iN = args.indexOf('--numero');                       // refazer um orçamento já emitido, sem gastar número novo
  const refazer = iN >= 0 ? parseInt(args[iN + 1], 10) : null;
  const arq = args.find((a, i) => !a.startsWith('--') && args[i - 1] !== '--numero');
  if (!arq) { console.error('Uso: node scripts/orcamento/gerar.js orcamento.json [--teste]'); process.exit(1); }
  const d = JSON.parse(fs.readFileSync(arq, 'utf8'));
  if (!d.cliente || !Array.isArray(d.itens) || !d.itens.length) { console.error('✗ Falta cliente ou itens.'); process.exit(1); }

  const vendedor = d.vendedor || 'Kevin';
  const wLoja = d.whatsappLoja || '(11) 97714-0964';
  const subtotal = d.itens.reduce((s, i) => s + i.qtd * i.unit, 0);
  const desconto = d.desconto || 0;
  const total = subtotal - desconto;

  let num = 0;
  const cont = fs.existsSync(CONTADOR) ? JSON.parse(fs.readFileSync(CONTADOR, 'utf8')) : { ultimo: 0 };
  num = refazer || cont.ultimo + 1;
  const numero = String(num).padStart(4, '0');
  const hoje = new Date(new Date().getTime() - 3 * 3600e3);          // horário de Brasília
  const data = hoje.toISOString().slice(0, 10).split('-').reverse().join('/');
  const hora = hoje.toISOString().slice(11, 16);

  const linhas = d.itens.map((i) => `
    <div class="item">
      <div class="desc"><b>${esc(i.produto)}${i.cor ? ' · ' + esc(i.cor) : ''}</b><span>${esc(i.tamanho || '')}</span></div>
      <div class="qtd">${i.qtd}×</div>
      <div class="unit">${brl(i.unit)}</div>
      <div class="sub">${brl(i.qtd * i.unit)}</div>
    </div>`).join('');
  const msgCta = encodeURIComponent(`Olá! Quero fechar o orçamento nº ${numero}.`);
  const html = `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Montserrat:wght@700;800&family=Poppins:wght@400;500;600&display=swap" rel="stylesheet">
<style>
:root{--az:#0D47A1;--azesc:#062B63;--am:#FFC107;--cinza:#F0F2F5;--graf:#212529}
*{box-sizing:border-box;margin:0;padding:0}
body{width:1080px;background:#fff;font-family:Poppins,sans-serif;color:var(--graf)}
.topo{background:var(--az);color:#fff;padding:48px 56px;display:flex;align-items:center;justify-content:space-between}
.topo img{height:210px;margin:-20px 0}
.topo .tit{text-align:right}
.topo .tit h1{font:400 84px 'Bebas Neue',sans-serif;letter-spacing:2px;line-height:1}
.topo .tit .n{display:inline-block;background:var(--am);color:var(--azesc);font:800 30px Montserrat,sans-serif;padding:6px 20px;border-radius:6px;margin-top:10px;transform:rotate(-2deg)}
.dados{background:var(--cinza);padding:34px 56px;display:grid;grid-template-columns:1fr 1fr;gap:18px 40px;font-size:25px}
.dados small{display:block;font-size:19px;color:#5b6470;text-transform:uppercase;letter-spacing:1px;font-weight:600}
.dados b{font-weight:600}
.lista{padding:30px 56px 10px}
.cab,.item{display:grid;grid-template-columns:1fr 90px 170px 190px;gap:12px;align-items:center}
.cab{font-size:19px;color:#5b6470;text-transform:uppercase;letter-spacing:1px;font-weight:600;padding-bottom:12px;border-bottom:3px solid var(--az)}
.item{padding:22px 0;border-bottom:1px solid #dde1e6;font-size:26px}
.item .desc b{display:block;font:700 28px Montserrat,sans-serif}
.item .desc span{color:#5b6470;font-size:22px}
.qtd{text-align:center;font-weight:600}.unit,.sub{text-align:right}.sub{font-weight:600}
.cab div:nth-child(2){text-align:center}.cab div:nth-child(n+3){text-align:right}
.totais{padding:20px 56px 36px}
.lin{display:flex;justify-content:space-between;font-size:25px;padding:6px 0;color:#5b6470}
.total{background:var(--az);color:#fff;border-radius:8px;display:flex;justify-content:space-between;align-items:center;padding:22px 32px;margin-top:14px}
.total span{font:700 30px Montserrat,sans-serif}
.total b{font:400 76px 'Bebas Neue',sans-serif;color:var(--am);letter-spacing:1px}
.obs{margin:0 56px 26px;font-size:22px;color:#5b6470}
${rod.css}
</style></head><body>
<div class="topo"><img src="${b64('identidade/logotipo branco-remove-bg-io.png')}"><div class="tit"><h1>ORÇAMENTO</h1><div class="n">Nº ${numero}</div></div></div>
<div class="dados">
  <div><small>Cliente</small><b>${esc(d.cliente)}</b></div>
  <div><small>WhatsApp do cliente</small><b>${esc(d.whatsappCliente || '—')}</b></div>
  <div><small>Vendedor</small><b>${esc(vendedor)}</b></div>
  <div><small>Data</small><b>${data}</b></div>
  ${d.retirada ? `<div><small>Retirada prevista</small><b>${esc(d.retirada.data)}${d.retirada.periodo ? ' · ' + esc(d.retirada.periodo.toLowerCase()) : ''}</b></div>` : ''}
  ${d.loja ? `<div><small>Loja de retirada</small><b>${esc(d.loja)}</b></div>` : ''}
</div>
<div class="lista"><div class="cab"><div>Produto</div><div>Qtd</div><div>Unitário</div><div>Subtotal</div></div>${linhas}</div>
<div class="totais">
  ${desconto ? `<div class="lin"><span>Subtotal</span><span>${brl(subtotal)}</span></div><div class="lin"><span>Desconto</span><span>− ${brl(desconto)}</span></div>` : ''}
  <div class="total"><span>TOTAL</span><b>${brl(total)}</b></div>
</div>
${d.obs ? `<div class="obs">${esc(d.obs)}</div>` : ''}
<div class="obs">Parcelamento em até 12x sem juros (consulte as condições). Valores sujeitos a alteração sem aviso prévio.</div>
${rod.html('Para confirmar seu pedido, fale conosco', esc(wLoja))}
</body></html>`;

  const stamp = hoje.toISOString().slice(0, 10);
  const nomeCli = d.cliente.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const dest = path.join(RAIZ, 'saidas', 'orcamentos', `${numero}-${nomeCli}-${stamp}${teste ? '-teste' : ''}`);
  fs.mkdirSync(dest, { recursive: true });
  const htmlPath = path.join(dest, 'orcamento.html');
  fs.writeFileSync(htmlPath, html);

  const { chromium } = require('playwright');
  const exec = process.env.PW_EXEC || (fs.existsSync('/opt/pw-browsers/chromium-1194/chrome-linux/chrome') ? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' : null);
  const br = await chromium.launch(exec ? { executablePath: exec } : {});
  const pg = await br.newPage({ viewport: { width: 1080, height: 1200 }, deviceScaleFactor: 1 });
  await pg.goto('file://' + htmlPath, { waitUntil: 'networkidle' }).catch(() => {});
  await pg.evaluate(() => document.fonts.ready);
  await pg.waitForTimeout(500);
  await pg.screenshot({ path: path.join(dest, 'orcamento.png'), fullPage: true });
  const h = await pg.evaluate(() => document.documentElement.scrollHeight);
  await pg.pdf({ path: path.join(dest, 'orcamento.pdf'), width: '1080px', height: h + 'px', printBackground: true });
  await br.close();

  if (!teste && !refazer) {
    fs.writeFileSync(CONTADOR, JSON.stringify({ ultimo: num }, null, 2) + '\n');
    fs.mkdirSync(REGISTRO_DIR, { recursive: true });
    const reg = path.join(REGISTRO_DIR, 'registro.csv');
    if (!fs.existsSync(reg)) fs.writeFileSync(reg, 'numero;data;hora;vendedor;cliente;whatsapp_cliente;itens;total\n');
    fs.appendFileSync(reg, [numero, data, hora, vendedor, d.cliente, soDigitos(d.whatsappCliente), d.itens.reduce((s, i) => s + i.qtd, 0), total.toFixed(2)].join(';') + '\n');
  }
  console.log(`✅ Orçamento Nº ${numero}${teste ? ' (TESTE — contador não avançou)' : ''} — total ${brl(total)}\n   ${path.relative(RAIZ, dest)}/orcamento.png (+ .pdf)`);
  console.log(`   Link do botão: https://wa.me/55${soDigitos(wLoja)}?text=${msgCta}`);
})();
