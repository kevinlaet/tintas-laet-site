// Panfletos A5 (148x210 mm + 3 mm de sangria) — Tinta Super Profissional 18L
// Uso: node gerar.js [loja...] [--sem-feriado]
//   ex.: node gerar.js 6        -> só Loja 6
//        node gerar.js          -> todas
// Saída: ../panfleto-m1-lojaN.pdf / .png e ../panfleto-m2-lojaN.pdf / .png
const fs = require('fs');
const path = require('path');
const QR = require('qrcode');
const { chromium } = require(process.env.PW_MOD || 'playwright');

const DIR = __dirname;
const OUT = path.resolve(DIR, '..');
const args = process.argv.slice(2);
const SEM_FERIADO = args.includes('--sem-feriado');
const pedidas = args.filter(a => /^\d$/.test(a)).map(Number);

// ---------- dados reais (site/lojas.html + regra do Kevin) ----------
const LOJAS = {
  1: { bairro: 'Vila Bela', cidade: 'São Paulo', end: 'Av. Sapopemba, 25.723', wa: '5511980820686', brinde: false },
  2: { bairro: 'Jardim São João', cidade: 'Mauá', end: 'Rua do Britador, 2', wa: '5511977504434', brinde: false },
  3: { bairro: 'Jardim Santa Cecília', cidade: 'Mauá', end: 'Av. Ayrton Senna da Silva, 235', wa: '5511977498813', brinde: true },
  4: { bairro: 'Vila Luzita', cidade: 'Santo André', end: 'Av. São Bernardo do Campo, 757', wa: '5511948551977', brinde: false },
  5: { bairro: 'Jardim Itapark', cidade: 'Mauá', end: 'Av. Itapark, 4377', wa: '5511914334875', brinde: false },
  6: { bairro: 'Santa Terezinha', cidade: 'São Bernardo do Campo', end: 'Av. Luís Pequini, 899', wa: '5511918755095', brinde: true },
};
const fone = wa => `(${wa.slice(2, 4)}) ${wa.slice(4, 9)}-${wa.slice(9)}`;

// Cores claras pedidas pelo Kevin, hex da paleta oficial (identidade/cores/paleta-oficial.json)
const CORES = [
  ['Cinza', '#BCBCBA'],       // Névoa (Super Profissional) — cinza claro mais próximo
  ['Areia', '#DCD5C2'],       // Areia (Super Profissional)
  ['Bege', '#EAD7B9'],        // Linho Americano (Super Profissional)
  ['Azulzinho', '#AADAFE'],   // Azul Laet (Super Profissional)
  ['Rosa Bebê', '#FFC9F0'],   // Rosa Bebê (paleta oficial)
  ['Crômio', '#DDDDDD'],      // Crômio (paleta oficial)
  ['Camurça', '#C5B9A3'],     // Camurça (Super Profissional)
];

// ---------- ícones ----------
const I = {
  wa: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.5.1l-.7.9c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.7-1.6c-.2-.4-.4-.3-.5-.3h-.4a.8.8 0 0 0-.6.3 2.5 2.5 0 0 0-.8 1.9 4.4 4.4 0 0 0 .9 2.3 10 10 0 0 0 3.8 3.4c1.4.6 1.9.7 2.6.6a2.2 2.2 0 0 0 1.5-1.1 1.8 1.8 0 0 0 .1-1.1c-.1-.1-.2-.2-.4-.3z"/></svg>',
  pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.6"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="12" r="9.2"/><path d="M12 7v5.2l3.4 2.1"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
  card: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="5" width="19" height="14" rx="2.5"/><path d="M2.5 9.5h19M6 15h4"/></svg>',
  tag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.6 13.4l-7.2 7.2a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8z"/><circle cx="7.5" cy="7.5" r="1.6"/></svg>',
  user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c1.2-4 4.3-6 8-6s6.8 2 8 6"/><path d="M17.5 4.5l1.5 1.5 2.5-2.5"/></svg>',
  ig: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.3" cy="6.7" r="1" fill="currentColor"/></svg>',
  gift: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M5 12v8h14v-8M12 8v12M12 8S10.5 3.5 8 4.2C6 4.8 6.6 8 12 8zm0 0s1.5-4.5 4-3.8C18 4.8 17.4 8 12 8z"/></svg>',
};

const FONTES = `
@font-face { font-family:'Bebas Neue'; src:url('fonts/bebas-neue-latin-400-normal.woff2') format('woff2'); }
@font-face { font-family:'Montserrat'; font-weight:700; src:url('fonts/montserrat-latin-700-normal.woff2') format('woff2'); }
@font-face { font-family:'Montserrat'; font-weight:800; src:url('fonts/montserrat-latin-800-normal.woff2') format('woff2'); }
@font-face { font-family:'Poppins'; font-weight:600; src:url('fonts/poppins-latin-600-normal.woff2') format('woff2'); }
@font-face { font-family:'Poppins'; font-weight:700; src:url('fonts/poppins-latin-700-normal.woff2') format('woff2'); }`;

// Tela de trabalho em px a 300 dpi: 154 x 216 mm (A5 + 3 mm de sangria) = 1819 x 2551
// Sangria = 35 px; margem de segurança 5 mm = 59 px -> nada importante fora de 94 px da borda.
const BASE = `${FONTES}
*,*::before,*::after { margin:0; padding:0; box-sizing:border-box; }
html,body { width:1819px; height:2551px; background:#fff; -webkit-print-color-adjust:exact; print-color-adjust:exact; }
.pg { position:relative; width:1819px; height:2551px; overflow:hidden; font-family:'Poppins',sans-serif; color:#062B63; }
.abs { position:absolute; }
svg { display:block; }
.selo { position:absolute; width:340px; height:340px; z-index:30; transform:rotate(10deg); filter:drop-shadow(0 18px 26px rgba(0,0,0,.35)); }
.selo .in { position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; color:#062B63; padding:0 40px; }
.selo .in .ic { width:64px; height:64px; margin-bottom:6px; }
.selo .in .t1 { font:800 30px/1.08 'Montserrat',sans-serif; }
.selo .in .t2 { font:400 76px/.9 'Bebas Neue',sans-serif; margin-top:6px; letter-spacing:.01em; }
/* guias (só no modo --guias) */
.guia { position:absolute; z-index:99; pointer-events:none; }
`;

function selo(x, y) {
  const n = 22, R = 170, r = 152;
  let pts = [];
  for (let i = 0; i < n * 2; i++) {
    const a = (Math.PI * i) / n - Math.PI / 2, rr = i % 2 ? r : R;
    pts.push(`${170 + Math.cos(a) * rr},${170 + Math.sin(a) * rr}`);
  }
  return `<div class="selo" style="left:${x}px;top:${y}px">
  <svg width="340" height="340" viewBox="0 0 340 340"><polygon points="${pts.join(' ')}" fill="#FFC107"/>
  <circle cx="170" cy="170" r="134" fill="none" stroke="#062B63" stroke-width="3" stroke-dasharray="2 9" stroke-linecap="round"/></svg>
  <div class="in"><div class="ic">${I.gift}</div><div class="t1">Compra acima<br>de R$ 100?</div><div class="t2">GANHA UM<br>BRINDE</div></div></div>`;
}

const guias = args.includes('--guias') ? `
<div class="guia" style="inset:35px;border:2px dashed rgba(255,0,0,.8)"></div>
<div class="guia" style="inset:94px;border:2px dashed rgba(0,200,0,.8)"></div>` : '';

const horario = 'Seg a sex 8h às 18h · Sáb 8h às 14h';
const feriado = 'Sexta 20/11 (feriado): 8h às 13h';

// =====================================================================
// MODELO 1 · DIRETO
// =====================================================================
function modelo1(n, L, qr) {
  const chips = CORES.map(([nome, hex]) => `
    <div class="chip"><div class="sw" style="background:${hex}"></div><div class="nm">${nome}</div></div>`).join('');
  return `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><title>Panfleto M1 Loja ${n}</title><style>${BASE}
.hero { position:absolute; left:0; top:0; width:1819px; height:1330px; overflow:hidden;
  background:
    radial-gradient(ellipse 900px 820px at 78% 52%, rgba(64,140,255,.55) 0%, rgba(13,71,161,0) 70%),
    radial-gradient(ellipse 700px 500px at 10% 0%, rgba(255,255,255,.10) 0%, rgba(255,255,255,0) 70%),
    linear-gradient(160deg,#0D47A1 0%,#0A3C8C 35%,#062B63 75%,#041F4A 100%); }
.hero::before { content:''; position:absolute; inset:0; opacity:.07;
  background-image:linear-gradient(rgba(255,255,255,1) 1.5px, transparent 1.5px), linear-gradient(90deg, rgba(255,255,255,1) 1.5px, transparent 1.5px);
  background-size:64px 64px; -webkit-mask-image:radial-gradient(ellipse 900px 700px at 75% 50%, #000 0%, transparent 75%); mask-image:radial-gradient(ellipse 900px 700px at 75% 50%, #000 0%, transparent 75%); }
.big18 { position:absolute; right:40px; top:150px; font:400 980px/.8 'Bebas Neue',sans-serif; color:transparent; -webkit-text-stroke:4px rgba(255,255,255,.07); letter-spacing:-.01em; }
.ring { position:absolute; left:930px; top:330px; width:840px; height:840px; border-radius:50%; border:2px solid rgba(255,224,130,.22); }
.ring.b { left:990px; top:390px; width:720px; height:720px; border-color:rgba(255,255,255,.10); }
.logo { position:absolute; left:94px; top:104px; height:190px; }
.urg { position:absolute; left:94px; top:352px; display:flex; align-items:center; gap:18px; background:#FFC107; color:#062B63; border-radius:60px; padding:18px 38px 18px 26px;
  font:800 40px/1 'Montserrat',sans-serif; letter-spacing:.04em; box-shadow:0 12px 30px rgba(0,0,0,.3); }
.urg i { width:20px; height:20px; border-radius:50%; background:#C62828; box-shadow:0 0 0 7px rgba(198,40,40,.22); }
.kick { position:absolute; left:98px; top:474px; font:800 54px/1 'Montserrat',sans-serif; letter-spacing:.28em; color:#FFE082; }
.nome { position:absolute; left:90px; top:530px; font:400 192px/.84 'Bebas Neue',sans-serif; color:#fff; letter-spacing:.005em; text-shadow:0 10px 30px rgba(0,0,0,.35); }
.sub { position:absolute; left:98px; top:872px; display:flex; flex-direction:column; gap:14px; font:600 44px/1.1 'Poppins',sans-serif; color:#fff; }
.sub div { display:flex; align-items:center; gap:16px; }
.sub .ck { width:46px; height:46px; border-radius:50%; background:rgba(255,193,7,.16); border:2px solid #FFC107; color:#FFC107; padding:7px; flex:none; }
.preco { position:absolute; left:94px; top:1062px; display:flex; align-items:flex-start; gap:10px; }
.preco .rs { font:800 80px/1 'Montserrat',sans-serif; color:#FFC107; margin-top:40px; }
.preco .v { font:400 290px/.8 'Bebas Neue',sans-serif; letter-spacing:.005em;
  background:linear-gradient(180deg,#FFF3C4 0%,#FFE082 30%,#FFC107 75%,#F2B200 100%); -webkit-background-clip:text; background-clip:text; color:transparent; padding-top:24px;
  filter:drop-shadow(0 8px 0 #041F4A) drop-shadow(0 18px 30px rgba(0,0,0,.35)); }
.preco .lb { position:absolute; left:6px; top:-34px; font:700 32px/1 'Montserrat',sans-serif; color:rgba(255,255,255,.8); letter-spacing:.14em; }
.balde { position:absolute; left:930px; top:330px; width:840px; height:840px; z-index:5; filter:drop-shadow(0 50px 50px rgba(0,0,0,.5)) drop-shadow(0 10px 18px rgba(0,0,0,.35)); }
.chao { position:absolute; left:960px; top:1150px; width:760px; height:110px; border-radius:50%; background:radial-gradient(ellipse, rgba(0,0,0,.55), rgba(0,0,0,0) 70%); z-index:4; }

.mid { position:absolute; left:0; top:1330px; width:1819px; height:700px; background:linear-gradient(180deg,#F5F7FB 0%,#EDF1F8 100%); }
.mid h3 { position:absolute; left:0; right:0; top:58px; text-align:center; font:400 96px/1 'Bebas Neue',sans-serif; color:#062B63; letter-spacing:.02em; }
.mid h3 span { color:#0D47A1; }
.mid .h3s { position:absolute; left:0; right:0; top:156px; text-align:center; font:600 34px/1 'Poppins',sans-serif; color:#4A5878; }
.chips { position:absolute; left:96px; top:222px; width:1627px; display:flex; justify-content:space-between; }
.chip { width:212px; background:#fff; border-radius:22px; padding:12px 12px 0; box-shadow:0 14px 30px rgba(6,43,99,.12), 0 2px 6px rgba(6,43,99,.08); }
.chip .sw { height:168px; border-radius:14px; box-shadow:inset 0 0 0 2px rgba(6,43,99,.08), inset 0 -18px 30px rgba(0,0,0,.05); }
.chip .nm { height:62px; display:flex; align-items:center; justify-content:center; font:800 29px/1 'Montserrat',sans-serif; color:#062B63; white-space:nowrap; }
.difs { position:absolute; left:96px; top:520px; width:1627px; display:flex; justify-content:space-between; }
.dif { width:524px; height:150px; display:flex; align-items:center; gap:22px; padding:0 26px; background:#062B63; border-radius:24px; color:#fff; box-shadow:0 14px 30px rgba(6,43,99,.22); }
.dif .ic { flex:none; width:96px; height:96px; border-radius:50%; background:#FFC107; color:#062B63; padding:22px; }
.dif b { display:block; font:800 38px/1.05 'Montserrat',sans-serif; }
.dif span { display:block; font:600 29px/1.15 'Poppins',sans-serif; color:#FFE082; margin-top:6px; }

.loja { position:absolute; left:0; top:2030px; width:1819px; height:521px;
  background:radial-gradient(ellipse 800px 400px at 85% 0%, rgba(64,140,255,.35) 0%, rgba(13,71,161,0) 70%), linear-gradient(180deg,#062B63 0%,#041F4A 100%); color:#fff; }
.loja::before { content:''; position:absolute; left:0; top:0; width:100%; height:10px; background:linear-gradient(90deg,#FFC107,#FFE082,#FFC107); }
.lj1 { position:absolute; left:94px; top:58px; display:flex; align-items:center; gap:22px; white-space:nowrap; }
.lj1 .n { background:#FFC107; color:#062B63; font:400 66px/1 'Bebas Neue',sans-serif; padding:10px 24px 4px; border-radius:12px; letter-spacing:.04em; }
.lj1 .b { font:400 92px/1 'Bebas Neue',sans-serif; letter-spacing:.02em; padding-top:6px; }
.lj2 { position:absolute; left:96px; top:150px; font:700 36px/1 'Montserrat',sans-serif; color:#FFE082; letter-spacing:.06em; }
.lin { position:absolute; left:96px; display:flex; align-items:center; gap:16px; font:600 33px/1.15 'Poppins',sans-serif; white-space:nowrap; }
.lin .ic { width:40px; height:40px; color:#FFC107; flex:none; }
.wa { position:absolute; left:94px; top:206px; display:flex; align-items:center; gap:18px; font:800 68px/1 'Montserrat',sans-serif; color:#FFC107; white-space:nowrap; }
.wa svg { width:70px; height:70px; color:#25D366; }
.fer { position:absolute; left:96px; top:398px; background:rgba(255,193,7,.16); border:2px solid rgba(255,193,7,.7); color:#FFE082; border-radius:40px; padding:9px 22px; font:700 27px/1 'Poppins',sans-serif; white-space:nowrap; }
.foto { position:absolute; left:996px; top:84px; width:350px; height:320px; border-radius:22px; overflow:hidden; border:6px solid #fff; box-shadow:0 20px 40px rgba(0,0,0,.45); transform:rotate(-2deg);
  background:url('img/fachada-loja${n}.png') no-repeat; background-size:${L.fotoSize || '160% auto'}; background-position:${L.fotoPos || '49% 12%'}; }
.foto span { position:absolute; left:0; right:0; bottom:0; padding:30px 10px 10px; text-align:center; font:700 22px/1 'Poppins',sans-serif; color:#fff; background:linear-gradient(180deg,rgba(0,0,0,0),rgba(0,0,0,.7)); }
.qr { position:absolute; left:1384px; top:50px; width:340px; text-align:center; }
.qr .box { width:300px; height:300px; margin:0 auto; background:#fff; border-radius:24px; padding:18px; box-shadow:0 18px 36px rgba(0,0,0,.4); }
.qr .box svg { width:264px; height:264px; }
.qr .c1 { margin-top:16px; font:800 27px/1.1 'Montserrat',sans-serif; color:#FFC107; }
.qr .c2 { margin-top:10px; font:700 23px/1.2 'Poppins',sans-serif; color:rgba(255,255,255,.85); white-space:nowrap; }
.nota { position:absolute; left:96px; top:2004px; font:600 22px/1 'Poppins',sans-serif; color:#6B7896; z-index:2; }
</style></head><body><div class="pg">
<div class="hero">
  <div class="big18">18L</div><div class="ring"></div><div class="ring b"></div>
  <img class="logo" src="img/logo-branco.png" alt="Tintas Laet">
  <div class="urg"><i></i>ENQUANTO DURAR O ESTOQUE</div>
  <div class="kick">TINTA</div>
  <div class="nome">SUPER<br>PROFISSIONAL</div>
  <div class="sub"><div><span class="ck">${I.check}</span>Balde de 18 litros</div><div><span class="ck">${I.check}</span>Cobertura garantida</div></div>
  <div class="preco"><div class="lb">O BALDE DE 18L</div><div class="rs">R$</div><div class="v">139,90</div></div>
  <div class="chao"></div>
  <img class="balde" src="img/balde-super-profissional.png" alt="Balde 18L Tinta Super Profissional Laet">
</div>
${L.brinde ? selo(1400, 96) : ''}
<div class="mid">
  <h3>CORES CLARAS <span>EM ESTOQUE</span></h3>
  <div class="h3s">Mesmo preço do balde de 18L, na cor que você escolher.</div>
  <div class="chips">${chips}</div>
  <div class="difs">
    <div class="dif"><div class="ic">${I.card}</div><div><b>12x sem juros*</b><span>sem valor mínimo</span></div></div>
    <div class="dif"><div class="ic">${I.tag}</div><div><b>Melhores preços</b><span>da região</span></div></div>
    <div class="dif"><div class="ic">${I.user}</div><div><b>Atendimento</b><span>personalizado</span></div></div>
  </div>
</div>
<div class="nota">*Consulte as condições.</div>
<div class="loja">
  <div class="lj1"><div class="n">LOJA ${n}</div><div class="b">${L.bairro.toUpperCase()}</div></div>
  <div class="lj2">${L.cidade.toUpperCase()}</div>
  <div class="wa">${I.wa}${fone(L.wa)}</div>
  <div class="lin" style="top:296px"><span class="ic">${I.pin}</span>${L.end} — ${L.bairro}</div>
  <div class="lin" style="top:348px"><span class="ic">${I.clock}</span>${horario}</div>
  ${SEM_FERIADO ? '' : `<div class="fer">${feriado}</div>`}
  <div class="foto"></div>
  <div class="qr"><div class="box">${qr}</div><div class="c1">Aponte a câmera e<br>chame no WhatsApp</div><div class="c2">@Tintaslaet · tintaslaet.com</div></div>
</div>
${guias}
</div></body></html>`;
}

// =====================================================================
// MODELO 2 · VISUAL
// =====================================================================
function modelo2(n, L, qr) {
  return `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><title>Panfleto M2 Loja ${n}</title><style>${BASE}
.foto { position:absolute; left:0; top:0; width:1819px; height:1720px; background:url('img/sala-areia.webp') no-repeat; background-size:auto 1720px; background-position:82% 0; }
.foto::after { content:''; position:absolute; inset:0; background:linear-gradient(90deg, rgba(245,236,215,.55) 0%, rgba(245,236,215,.15) 45%, rgba(245,236,215,0) 65%); }
.logo { position:absolute; left:94px; top:96px; height:200px; z-index:5; }
.tit { position:absolute; left:90px; top:400px; z-index:5; font:400 238px/.84 'Bebas Neue',sans-serif; color:#062B63; letter-spacing:.005em; }
.tit em { font-style:normal; color:#0D47A1; position:relative; }

.balde { position:absolute; left:40px; top:1000px; width:760px; height:760px; z-index:12; filter:drop-shadow(0 40px 40px rgba(0,0,0,.45)) drop-shadow(0 8px 14px rgba(0,0,0,.3)); }
.tag { position:absolute; left:740px; top:1235px; z-index:13; background:#FFC107; color:#062B63; border-radius:28px; padding:22px 34px 18px; box-shadow:0 20px 40px rgba(0,0,0,.35); transform:rotate(-3deg); }
.tag .a { font:800 30px/1.1 'Montserrat',sans-serif; letter-spacing:.04em; }
.tag .b { display:flex; align-items:flex-start; gap:6px; margin-top:4px; }
.tag .b small { font:800 44px/1 'Montserrat',sans-serif; margin-top:22px; }
.tag .b span { font:400 168px/.8 'Bebas Neue',sans-serif; padding-top:16px; }
.tag .c { font:700 26px/1 'Poppins',sans-serif; margin-top:2px; }
.urg { position:absolute; left:94px; top:1700px; z-index:14; }
.band { position:absolute; left:0; top:1560px; width:1819px; height:991px; z-index:10;
  background:radial-gradient(ellipse 900px 600px at 90% 30%, rgba(64,140,255,.35) 0%, rgba(13,71,161,0) 70%), linear-gradient(180deg,#0A3C8C 0%,#062B63 45%,#041F4A 100%);
  clip-path:polygon(0 110px, 100% 0, 100% 100%, 0 100%); }
.band::before { content:''; position:absolute; left:0; top:0; width:100%; height:100%; background:linear-gradient(90deg,#FFC107,#FFE082); clip-path:polygon(0 110px, 100% 0, 100% 12px, 0 122px); }
.info { position:absolute; left:0; right:0; top:1830px; z-index:15; color:#fff; padding:0 94px; }
.l1 { display:flex; align-items:center; gap:26px; }
.l1 .n { background:#FFC107; color:#062B63; font:400 96px/1 'Bebas Neue',sans-serif; padding:12px 30px 4px; border-radius:16px; letter-spacing:.04em; white-space:nowrap; }
.l1 .b { font:400 ${L.bairro.length > 16 ? 132 : 158}px/.9 'Bebas Neue',sans-serif; letter-spacing:.01em; padding-top:10px; white-space:nowrap; }
.l2 { margin-top:22px; font:700 46px/1.2 'Poppins',sans-serif; white-space:nowrap; }
.l2 b { color:#FFE082; font-weight:700; }
.wa { margin-top:36px; display:inline-flex; align-items:center; gap:22px; background:linear-gradient(180deg,#FFD54F,#FFC107); color:#062B63; border-radius:90px; padding:22px 56px 22px 40px;
  font:800 96px/1 'Montserrat',sans-serif; box-shadow:0 18px 40px rgba(0,0,0,.45), inset 0 3px 0 rgba(255,255,255,.5); white-space:nowrap; }
.wa svg { width:100px; height:100px; }
.l3 { margin-top:26px; display:flex; align-items:center; gap:26px; font:600 34px/1 'Poppins',sans-serif; color:rgba(255,255,255,.92); white-space:nowrap; }
.l3 .fer { background:rgba(255,193,7,.16); border:2px solid rgba(255,193,7,.7); color:#FFE082; border-radius:40px; padding:9px 20px; font:700 28px/1 'Poppins',sans-serif; }
.l4 { margin-top:18px; font:700 30px/1 'Poppins',sans-serif; color:#FFE082; }
.qr { position:absolute; right:94px; top:2110px; z-index:16; width:250px; height:250px; background:#fff; border-radius:20px; padding:14px; box-shadow:0 14px 30px rgba(0,0,0,.4); }
.qr svg { width:222px; height:222px; }
</style></head><body><div class="pg">
<div class="foto"></div>
<img class="logo" src="img/logo-azul.png" alt="Tintas Laet">
<div class="tit">CASA NOVA,<br><em>GASTANDO</em><br>POUCO.</div>
${L.brinde ? selo(1400, 110) : ''}
<div class="band"></div>
<img class="balde" src="img/balde-super-profissional.png" alt="Balde 18L Tinta Super Profissional Laet">
<div class="tag"><div class="a">SUPER PROFISSIONAL 18L</div><div class="b"><small>R$</small><span>139,90</span></div><div class="c">Enquanto durar o estoque</div></div>
<div class="info">
  <div class="l1"><div class="n">LOJA ${n}</div><div class="b">${L.bairro.toUpperCase()}</div></div>
  <div class="l2">${L.end} · <b>${L.cidade}</b></div>
  <div class="wa">${I.wa}${fone(L.wa)}</div>
  <div class="l3">${horario}${SEM_FERIADO ? '' : `<span class="fer">${feriado}</span>`}</div>
  <div class="l4">@Tintaslaet · tintaslaet.com</div>
</div>
<div class="qr">${qr}</div>
${guias}
</div></body></html>`;
}

(async () => {
  const lojas = pedidas.length ? pedidas : [1, 2, 3, 4, 5, 6];
  const browser = await chromium.launch(process.env.PW_EXEC ? { executablePath: process.env.PW_EXEC } : {});
  const page = await browser.newPage({ viewport: { width: 1819, height: 2551 } });
  for (const n of lojas) {
    const L = LOJAS[n];
    const msg = encodeURIComponent(`Olá! Vi o panfleto da Tinta Super Profissional 18L e quero saber mais (Loja ${n}).`);
    const qr = await QR.toString(`https://wa.me/${L.wa}?text=${msg}`, { type: 'svg', margin: 0, errorCorrectionLevel: 'M', color: { dark: '#062B63', light: '#FFFFFF' } });
    for (const [m, fn] of [['m1', modelo1], ['m2', modelo2]]) {
      const html = path.join(DIR, `panfleto-${m}-loja${n}.html`);
      fs.writeFileSync(html, fn(n, L, qr));
      await page.goto('file://' + html, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(400);
      const base = path.join(OUT, `panfleto-${m}-loja${n}`);
      await page.screenshot({ path: base + '.png', fullPage: false });
      await page.pdf({ path: base + '.pdf', width: '154mm', height: '216mm', printBackground: true, scale: 154 / (1819 * 25.4 / 96), margin: { top: 0, right: 0, bottom: 0, left: 0 }, pageRanges: '1' });
      console.log('✓', path.basename(base));
    }
  }
  await browser.close();
})();
