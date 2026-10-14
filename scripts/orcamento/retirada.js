// Gera a AUTORIZAÇÃO DE RETIRADA (PNG + PDF) no mesmo design do orçamento, com número sequencial próprio.
// Uso: node scripts/orcamento/retirada.js retirada.json [--teste] [--numero N]
// JSON: { "cliente":"", "whatsappCliente":"", "vendedor":"Kevin", "loja":"Loja 3 — Mauá (Av. Ayrton Senna)" (OBRIGATÓRIO),
//         "whatsappLoja":"(11) 97714-0964",
//         "itens":[{"produto":"Super Profissional","cor":"Cinza Medieval","tamanho":"Balde 18L","qtd":1,"unit":149.90}],
//         "pago":60, "formaPagamento":"", "retirada":{"data":"09/10/2026","periodo":"Tarde"} }
const fs = require('fs');
const path = require('path');
const rod = require('./rodape');

const RAIZ = path.resolve(__dirname, '../..');
const CONTADOR = path.join(__dirname, 'contador.json'); // mesmo contador do orçamento: pedidos e retiradas dividem a numeração
const REGISTRO_DIR = path.join(RAIZ, 'dados', 'orcamentos');
const brl = (n) => 'R$ ' + n.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const b64 = (f) => 'data:image/png;base64,' + fs.readFileSync(path.join(RAIZ, f)).toString('base64');

(async () => {
  const args = process.argv.slice(2);
  const teste = args.includes('--teste');
  const iN = args.indexOf('--numero');
  const refazer = iN >= 0 ? parseInt(args[iN + 1], 10) : null;
  const arq = args.find((a, i) => !a.startsWith('--') && args[i - 1] !== '--numero');
  if (!arq) { console.error('Uso: node scripts/orcamento/retirada.js retirada.json [--teste] [--numero N]'); process.exit(1); }
  const d = JSON.parse(fs.readFileSync(arq, 'utf8'));
  if (!d.cliente || !Array.isArray(d.itens) || !d.itens.length) { console.error('✗ Falta cliente ou itens.'); process.exit(1); }
  if (!d.loja) { console.error('✗ Falta a loja de retirada (campo "loja"). Pergunte ao Kevin.'); process.exit(1); }
  if (!d.retirada || !d.retirada.data) { console.error('✗ Falta a data prevista de retirada (campo "retirada"). Pergunte ao Kevin.'); process.exit(1); }

  const vendedor = d.vendedor || 'Kevin';
  const wLoja = d.whatsappLoja || '(11) 97714-0964';
  const total = d.itens.reduce((s, i) => s + i.qtd * i.unit, 0);
  const pago = d.pago || 0;
  const saldo = Math.max(total - pago, 0);
  const quitado = saldo === 0;

  const cont = fs.existsSync(CONTADOR) ? JSON.parse(fs.readFileSync(CONTADOR, 'utf8')) : { ultimo: 0 };
  const num = refazer || cont.ultimo + 1;
  const numero = String(num).padStart(4, '0');
  const hoje = new Date(new Date().getTime() - 3 * 3600e3);
  const data = hoje.toISOString().slice(0, 10).split('-').reverse().join('/');
  const hora = hoje.toISOString().slice(11, 16);

  const linhas = d.itens.map((i) => `
    <div class="item">
      <div class="desc"><b>${esc(i.produto)}</b><span>${i.cor ? 'Cor: ' + esc(i.cor) + ' · ' : ''}${esc(i.tamanho || '')}</span></div>
      <div class="qtd">${i.qtd}×</div>
      <div class="sub">${brl(i.qtd * i.unit)}</div>
    </div>`).join('');

  const html = `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Montserrat:wght@700;800&family=Poppins:wght@400;500;600&display=swap" rel="stylesheet">
<style>
:root{--az:#0D47A1;--azesc:#062B63;--am:#FFC107;--cinza:#F0F2F5;--graf:#212529}
*{box-sizing:border-box;margin:0;padding:0}
body{width:1080px;background:#fff;font-family:Poppins,sans-serif;color:var(--graf)}
.topo{background:var(--az);color:#fff;padding:48px 56px;display:flex;align-items:center;justify-content:space-between}
.topo img{height:210px;margin:-20px 0}
.topo .tit{text-align:right}
.topo .tit h1{font:400 70px 'Bebas Neue',sans-serif;letter-spacing:2px;line-height:1}
.topo .tit .n{display:inline-block;background:var(--am);color:var(--azesc);font:800 30px Montserrat,sans-serif;padding:6px 20px;border-radius:6px;margin-top:10px;transform:rotate(-2deg)}
.intro{padding:30px 56px 8px;font-size:25px;line-height:1.5}
.dados{background:var(--cinza);padding:30px 56px;margin-top:18px;display:grid;grid-template-columns:1fr 1fr;gap:18px 40px;font-size:25px}
.dados small{display:block;font-size:19px;color:#5b6470;text-transform:uppercase;letter-spacing:1px;font-weight:600}
.dados b{font-weight:600}.dados .full{grid-column:1/-1}
.lista{padding:30px 56px 6px}
.cab,.item{display:grid;grid-template-columns:1fr 100px 220px;gap:12px;align-items:center}
.cab{font-size:19px;color:#5b6470;text-transform:uppercase;letter-spacing:1px;font-weight:600;padding-bottom:12px;border-bottom:3px solid var(--az)}
.item{padding:22px 0;border-bottom:1px solid #dde1e6;font-size:26px}
.item .desc b{display:block;font:700 30px Montserrat,sans-serif}
.item .desc span{color:#5b6470;font-size:23px}
.qtd{text-align:center;font-weight:600}.sub{text-align:right;font-weight:600}
.cab div:nth-child(2){text-align:center}.cab div:nth-child(3){text-align:right}
.pag{padding:20px 56px 10px}
.lin{display:flex;justify-content:space-between;font-size:26px;padding:8px 0;color:#5b6470}
.lin b{color:var(--graf);font-weight:600}
.saldo{background:var(--az);color:#fff;border-radius:8px;display:flex;justify-content:space-between;align-items:center;padding:22px 32px;margin-top:14px}
.saldo span{font:700 28px Montserrat,sans-serif;line-height:1.25}
.saldo span small{display:block;font:500 21px Poppins,sans-serif;opacity:.85}
.saldo b{font:400 80px 'Bebas Neue',sans-serif;color:var(--am);letter-spacing:1px}
.aviso{margin:18px 56px 28px;font-size:22px;color:#5b6470;line-height:1.5}
${rod.css}
</style></head><body>
<div class="topo"><img src="${b64('identidade/logotipo branco-remove-bg-io.png')}"><div class="tit"><h1>AUTORIZAÇÃO DE<br>RETIRADA</h1><div class="n">Nº ${numero}</div></div></div>
<div class="intro">Autorizamos a retirada do produto abaixo na loja indicada${quitado ? '.' : ', mediante o pagamento do saldo restante.'}</div>
<div class="dados">
  <div><small>Cliente</small><b>${esc(d.cliente)}</b></div>
  <div><small>WhatsApp do cliente</small><b>${esc(d.whatsappCliente || '—')}</b></div>
  <div><small>Data da autorização</small><b>${data}</b></div>
  <div><small>Vendedor</small><b>${esc(vendedor)}</b></div>
  <div><small>Retirada prevista</small><b>${esc(d.retirada.data)}${d.retirada.periodo ? ' · ' + esc(d.retirada.periodo.toLowerCase()) : ''}</b></div>
  <div><small>Loja de retirada</small><b>${esc(d.loja)}</b></div>
</div>
<div class="lista"><div class="cab"><div>Produto</div><div>Qtd</div><div>Valor</div></div>${linhas}</div>
<div class="pag">
  <div class="lin"><span>Valor total</span><b>${brl(total)}</b></div>
  <div class="lin"><span>Valor já pago${d.formaPagamento ? ' (' + esc(d.formaPagamento) + ')' : ''}</span><b>${brl(pago)}</b></div>
  <div class="saldo"><span>${quitado ? 'PAGO — RETIRADA LIBERADA' : 'SALDO A PAGAR<small>na retirada, na loja</small>'}</span><b>${brl(saldo)}</b></div>
</div>
<div class="aviso">${quitado ? '' : 'A entrega do produto fica condicionada ao pagamento do saldo restante no momento da retirada. '}Apresente esta autorização ao atendente. Retirada feita pelo próprio cliente.</div>
${rod.html(quitado ? 'Dúvidas? Fale conosco' : 'Dúvidas sobre a retirada? Fale conosco', esc(wLoja))}
</body></html>`;

  const nomeCli = d.cliente.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const dest = path.join(RAIZ, 'saidas', 'orcamentos', `retirada-${numero}-${nomeCli}-${hoje.toISOString().slice(0, 10)}${teste ? '-teste' : ''}`);
  fs.mkdirSync(dest, { recursive: true });
  const htmlPath = path.join(dest, 'retirada.html');
  fs.writeFileSync(htmlPath, html);

  const { chromium } = require('playwright');
  const exec = process.env.PW_EXEC || (fs.existsSync('/opt/pw-browsers/chromium-1194/chrome-linux/chrome') ? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' : null);
  const br = await chromium.launch(exec ? { executablePath: exec } : {});
  const pg = await br.newPage({ viewport: { width: 1080, height: 1200 } });
  await pg.goto('file://' + htmlPath, { waitUntil: 'networkidle' }).catch(() => {});
  await pg.evaluate(() => document.fonts.ready);
  await pg.waitForTimeout(500);
  await pg.screenshot({ path: path.join(dest, 'retirada.png'), fullPage: true });
  const h = await pg.evaluate(() => document.documentElement.scrollHeight);
  await pg.pdf({ path: path.join(dest, 'retirada.pdf'), width: '1080px', height: h + 'px', printBackground: true });
  await br.close();

  if (!teste && !refazer) {
    fs.writeFileSync(CONTADOR, JSON.stringify({ ultimo: num }, null, 2) + '\n');
    fs.mkdirSync(REGISTRO_DIR, { recursive: true });
    const reg = path.join(REGISTRO_DIR, 'registro-retiradas.csv');
    if (!fs.existsSync(reg)) fs.writeFileSync(reg, 'numero;data;hora;vendedor;cliente;whatsapp_cliente;total;pago;saldo\n');
    fs.appendFileSync(reg, [numero, data, hora, vendedor, d.cliente, String(d.whatsappCliente || '').replace(/\D/g, ''), total.toFixed(2), pago.toFixed(2), saldo.toFixed(2)].join(';') + '\n');
  }
  console.log(`✅ Autorização de retirada Nº ${numero}${teste ? ' (TESTE — contador não avançou)' : ''} — total ${brl(total)}, pago ${brl(pago)}, saldo ${brl(saldo)}\n   ${path.relative(RAIZ, dest)}/retirada.png (+ .pdf)`);
})();
