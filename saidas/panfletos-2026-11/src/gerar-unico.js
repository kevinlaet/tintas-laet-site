// Panfleto ÚNICO frente e verso para todas as lojas — A5 + 3 mm de sangria (154 x 216 mm), 300 dpi
// Frente: Massa Corrida saco 23 kg R$ 37,90 · Verso: Super Profissional 18L R$ 139,90 + 6 lojas
// Uso: node gerar-unico.js [--sem-feriado] [--guias]
const fs = require('fs');
const path = require('path');
const QR = require('qrcode');
const { chromium } = require(process.env.PW_MOD || 'playwright');
const DIR = __dirname, OUT = path.resolve(DIR, '..');
const args = process.argv.slice(2);
const SEM_FERIADO = args.includes('--sem-feriado');
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

// Selo do brinde avisando que vale só nas Lojas 3 e 6
function seloBrinde(x, y) {
  return selo(x, y).replace('<div class="t2">GANHA UM<br>BRINDE</div>', '<div class="t2">GANHA UM<br>BRINDE</div><div class="t3">nas Lojas 3 e 6</div>');
}

// Lojas (site/lojas.html; Lojas 3 a 6 conferidas com a lista do Kevin em 18/11)
const LOJAS = [
  { n: 1, bairro: 'Vila Bela', cidade: 'São Paulo', end: 'Av. Sapopemba, 25.723', wa: '(11) 98082-0686' },
  { n: 2, bairro: 'Jd. São João', cidade: 'Mauá', end: 'Rua do Britador, 2', wa: '(11) 97750-4434' },
  { n: 3, bairro: 'Jd. Santa Cecília', cidade: 'Mauá', end: 'Av. Ayrton Senna da Silva, 235', wa: '(11) 97749-8813', brinde: true },
  { n: 4, bairro: 'Vila Luzita', cidade: 'Santo André', end: 'Av. São Bernardo do Campo, 757', wa: '(11) 94855-1977' },
  { n: 5, bairro: 'Jd. Itapark', cidade: 'Mauá', end: 'Av. Itapark, 4377', wa: '(11) 91433-4875' },
  { n: 6, bairro: 'Santa Terezinha', cidade: 'São Bernardo do Campo', end: 'Av. Luís Pequini, 899', wa: '(11) 91875-5095', brinde: true },
];
// Cores claras — nomes e hex EXATOS do catálogo da Super Profissional (identidade/cores/paleta-oficial.json)
const CORES = [
  ['Névoa', '#BCBCBA'], ['Areia', '#DCD5C2'], ['Linho Americano', '#EAD7B9'], ['Palha', '#E7E1C1'],
  ['Camurça', '#C5B9A3'], ['Azul Laet', '#AADAFE'], ['Papel de Bala', '#FFD3EA'],
];
const horario = 'Seg a sex 8h às 18h · Sáb 8h às 14h';
const feriado = 'Feriado sexta 20/11: 8h às 13h';

const CSS = `${BASE}
.pg { page-break-after:always; break-after:page; }
.selo .in .t3 { margin-top:8px; background:#062B63; color:#FFC107; font:800 22px/1 'Montserrat',sans-serif; padding:7px 12px; border-radius:20px; white-space:nowrap; }
.selo .in .t1 { font-size:27px; } .selo .in .t2 { font-size:66px; }

/* ---------- FRENTE ---------- */
.f-foto { position:absolute; left:0; top:0; width:1819px; height:1720px; background:url('img/sala-areia.webp') no-repeat; background-size:auto 1720px; background-position:82% 0; }
.f-foto::after { content:''; position:absolute; inset:0; background:linear-gradient(90deg, rgba(245,236,215,.55) 0%, rgba(245,236,215,.15) 45%, rgba(245,236,215,0) 65%); }
.f-logo { position:absolute; left:94px; top:96px; height:200px; z-index:5; }
.f-tit { position:absolute; left:90px; top:400px; z-index:5; font:400 238px/.84 'Bebas Neue',sans-serif; color:#062B63; letter-spacing:.005em; }
.f-tit em { font-style:normal; color:#0D47A1; }
.f-prod { position:absolute; left:50px; top:850px; width:600px; z-index:12; filter:drop-shadow(0 40px 40px rgba(0,0,0,.42)) drop-shadow(0 8px 14px rgba(0,0,0,.28)); }
.f-tag { position:absolute; left:660px; top:1150px; z-index:13; background:#FFC107; color:#062B63; border-radius:28px; padding:24px 36px 20px; box-shadow:0 20px 40px rgba(0,0,0,.35); transform:rotate(-3deg); }
.f-tag .a { font:400 82px/.9 'Bebas Neue',sans-serif; letter-spacing:.02em; }
.f-tag .a2 { font:800 30px/1.1 'Montserrat',sans-serif; letter-spacing:.03em; margin-top:4px; }
.f-tag .b { display:flex; align-items:flex-start; gap:6px; margin-top:8px; }
.f-tag .b small { font:800 46px/1 'Montserrat',sans-serif; margin-top:22px; }
.f-tag .b span { font:400 176px/.8 'Bebas Neue',sans-serif; padding-top:16px; }
.f-tag .c { font:700 27px/1 'Poppins',sans-serif; margin-top:4px; }
.f-band { position:absolute; left:0; top:1560px; width:1819px; height:991px; z-index:10;
  background:radial-gradient(ellipse 900px 600px at 90% 30%, rgba(64,140,255,.35) 0%, rgba(13,71,161,0) 70%), linear-gradient(180deg,#0A3C8C 0%,#062B63 45%,#041F4A 100%);
  clip-path:polygon(0 110px, 100% 0, 100% 100%, 0 100%); }
.f-band::before { content:''; position:absolute; inset:0; background:linear-gradient(90deg,#FFC107,#FFE082); clip-path:polygon(0 110px, 100% 0, 100% 12px, 0 122px); }
.f-info { position:absolute; left:94px; right:94px; top:1770px; z-index:15; color:#fff; }
.f-l1 { display:flex; align-items:center; gap:26px; white-space:nowrap; }
.f-l1 .n { background:#FFC107; color:#062B63; font:400 110px/1 'Bebas Neue',sans-serif; padding:12px 30px 4px; border-radius:16px; letter-spacing:.03em; }
.f-l1 .b { font:400 132px/.9 'Bebas Neue',sans-serif; letter-spacing:.01em; padding-top:10px; }
.f-l2 { margin-top:16px; font:700 40px/1.2 'Poppins',sans-serif; color:#FFE082; white-space:nowrap; }
.f-wa { margin-top:34px; display:inline-flex; align-items:center; gap:22px; background:linear-gradient(180deg,#FFD54F,#FFC107); color:#062B63; border-radius:90px; padding:22px 56px 22px 40px;
  font:800 92px/1 'Montserrat',sans-serif; box-shadow:0 18px 40px rgba(0,0,0,.45), inset 0 3px 0 rgba(255,255,255,.5); white-space:nowrap; }
.f-wa svg { width:96px; height:96px; }
.f-l3 { margin-top:26px; display:flex; align-items:center; gap:22px; font:600 33px/1 'Poppins',sans-serif; color:rgba(255,255,255,.92); white-space:nowrap; }
.fer { background:rgba(255,193,7,.16); border:2px solid rgba(255,193,7,.7); color:#FFE082; border-radius:40px; padding:9px 20px; font:700 27px/1 'Poppins',sans-serif; white-space:nowrap; }
.f-l4 { margin-top:18px; font:700 30px/1 'Poppins',sans-serif; color:#FFE082; }
.f-qr { position:absolute; right:94px; top:2040px; z-index:16; text-align:center; }
.f-qr .box { width:270px; height:270px; background:#fff; border-radius:22px; padding:16px; box-shadow:0 14px 30px rgba(0,0,0,.4); }
.f-qr .box svg { width:238px; height:238px; }
.f-qr .c { margin-top:12px; font:800 24px/1.15 'Montserrat',sans-serif; color:#FFC107; }

/* ---------- VERSO ---------- */
.v-hero { position:absolute; left:0; top:0; width:1819px; height:1150px; overflow:hidden;
  background:radial-gradient(ellipse 900px 820px at 78% 52%, rgba(64,140,255,.55) 0%, rgba(13,71,161,0) 70%), radial-gradient(ellipse 700px 500px at 10% 0%, rgba(255,255,255,.10) 0%, rgba(255,255,255,0) 70%), linear-gradient(160deg,#0D47A1 0%,#0A3C8C 35%,#062B63 75%,#041F4A 100%); }
.v-hero::before { content:''; position:absolute; inset:0; opacity:.07;
  background-image:linear-gradient(rgba(255,255,255,1) 1.5px, transparent 1.5px), linear-gradient(90deg, rgba(255,255,255,1) 1.5px, transparent 1.5px);
  background-size:64px 64px; -webkit-mask-image:radial-gradient(ellipse 900px 700px at 75% 50%, #000 0%, transparent 75%); mask-image:radial-gradient(ellipse 900px 700px at 75% 50%, #000 0%, transparent 75%); }
.ring { position:absolute; left:990px; top:250px; width:760px; height:760px; border-radius:50%; border:2px solid rgba(255,224,130,.22); }
.ring.b { left:1050px; top:310px; width:640px; height:640px; border-color:rgba(255,255,255,.10); }
.v-logo { position:absolute; left:94px; top:96px; height:170px; }
.v-urg { position:absolute; left:94px; top:308px; display:flex; align-items:center; gap:18px; background:#FFC107; color:#062B63; border-radius:60px; padding:16px 36px 16px 24px; font:800 38px/1 'Montserrat',sans-serif; letter-spacing:.04em; box-shadow:0 12px 30px rgba(0,0,0,.3); }
.v-urg i { width:20px; height:20px; border-radius:50%; background:#C62828; box-shadow:0 0 0 7px rgba(198,40,40,.22); }
.v-kick { position:absolute; left:98px; top:420px; font:800 50px/1 'Montserrat',sans-serif; letter-spacing:.28em; color:#FFE082; }
.v-nome { position:absolute; left:90px; top:474px; font:400 176px/.84 'Bebas Neue',sans-serif; color:#fff; text-shadow:0 10px 30px rgba(0,0,0,.35); }
.v-sub { position:absolute; left:98px; top:786px; display:flex; gap:34px; font:600 40px/1 'Poppins',sans-serif; color:#fff; white-space:nowrap; }
.v-sub div { display:flex; align-items:center; gap:14px; }
.v-sub .ck { width:44px; height:44px; border-radius:50%; background:rgba(255,193,7,.16); border:2px solid #FFC107; color:#FFC107; padding:7px; flex:none; }
.v-preco { position:absolute; left:94px; top:900px; display:flex; align-items:flex-start; gap:10px; }
.v-preco .lb { position:absolute; left:6px; top:-30px; font:700 28px/1 'Montserrat',sans-serif; color:rgba(255,255,255,.8); letter-spacing:.14em; white-space:nowrap; }
.v-preco .rs { font:800 70px/1 'Montserrat',sans-serif; color:#FFC107; margin-top:34px; }
.v-preco .v { font:400 230px/.8 'Bebas Neue',sans-serif; background:linear-gradient(180deg,#FFF3C4 0%,#FFE082 30%,#FFC107 75%,#F2B200 100%); -webkit-background-clip:text; background-clip:text; color:transparent; padding-top:20px;
  filter:drop-shadow(0 7px 0 #041F4A) drop-shadow(0 16px 26px rgba(0,0,0,.35)); }
.v-balde { position:absolute; left:990px; top:250px; width:760px; height:760px; z-index:5; filter:drop-shadow(0 46px 46px rgba(0,0,0,.5)) drop-shadow(0 10px 18px rgba(0,0,0,.35)); }
.v-chao { position:absolute; left:1060px; top:960px; width:640px; height:100px; border-radius:50%; background:radial-gradient(ellipse, rgba(0,0,0,.55), rgba(0,0,0,0) 70%); z-index:4; }
.v-mid { position:absolute; left:0; top:1150px; width:1819px; height:640px; background:linear-gradient(180deg,#F5F7FB 0%,#EDF1F8 100%); }
.v-mid h3 { position:absolute; left:0; right:0; top:46px; text-align:center; font:400 88px/1 'Bebas Neue',sans-serif; color:#062B63; letter-spacing:.02em; }
.v-mid h3 span { color:#0D47A1; }
.v-mid .h3s { position:absolute; left:0; right:0; top:136px; text-align:center; font:600 31px/1 'Poppins',sans-serif; color:#4A5878; }
.chips { position:absolute; left:96px; top:192px; width:1627px; display:flex; justify-content:space-between; }
.chip { width:216px; background:#fff; border-radius:20px; padding:11px 11px 0; box-shadow:0 12px 26px rgba(6,43,99,.12), 0 2px 6px rgba(6,43,99,.08); }
.chip .sw { height:140px; border-radius:12px; box-shadow:inset 0 0 0 2px rgba(6,43,99,.08), inset 0 -16px 26px rgba(0,0,0,.05); }
.chip .nm { height:74px; display:flex; align-items:center; justify-content:center; text-align:center; font:800 25px/1.1 'Montserrat',sans-serif; color:#062B63; }
.difs { position:absolute; left:96px; top:462px; width:1627px; display:flex; justify-content:space-between; }
.dif { width:526px; height:128px; display:flex; align-items:center; gap:20px; padding:0 22px; background:#062B63; border-radius:22px; color:#fff; box-shadow:0 12px 26px rgba(6,43,99,.22); }
.dif .ic { flex:none; width:84px; height:84px; border-radius:50%; background:#FFC107; color:#062B63; padding:19px; }
.dif b { display:block; font:800 33px/1.05 'Montserrat',sans-serif; white-space:nowrap; }
.dif span { display:block; font:600 26px/1.15 'Poppins',sans-serif; color:#FFE082; margin-top:5px; white-space:nowrap; }
.v-nota { position:absolute; left:98px; top:1756px; font:600 22px/1 'Poppins',sans-serif; color:#6B7896; }
.v-lojas { position:absolute; left:0; top:1790px; width:1819px; height:761px; color:#fff;
  background:radial-gradient(ellipse 800px 400px at 85% 0%, rgba(64,140,255,.30) 0%, rgba(13,71,161,0) 70%), linear-gradient(180deg,#062B63 0%,#041F4A 100%); }
.v-lojas::before { content:''; position:absolute; left:0; top:0; width:100%; height:10px; background:linear-gradient(90deg,#FFC107,#FFE082,#FFC107); }
.v-lh { position:absolute; left:94px; right:94px; top:34px; display:flex; align-items:center; justify-content:space-between; white-space:nowrap; }
.v-lh h4 { font:400 76px/1 'Bebas Neue',sans-serif; letter-spacing:.02em; padding-top:6px; }
.v-lh h4 span { color:#FFC107; }
.v-lh .h { display:flex; align-items:center; gap:18px; font:600 29px/1 'Poppins',sans-serif; color:rgba(255,255,255,.92); }
.v-lh .h svg { width:36px; height:36px; color:#FFC107; }
.grid { position:absolute; left:94px; top:128px; width:1631px; display:grid; grid-template-columns:repeat(3,1fr); gap:14px; }
.lj { position:relative; background:rgba(255,255,255,.07); border:2px solid rgba(255,255,255,.14); border-radius:20px; padding:14px 20px 13px; }
.lj .t { display:flex; align-items:center; gap:12px; white-space:nowrap; }
.lj .t .n { background:#FFC107; color:#062B63; font:400 40px/1 'Bebas Neue',sans-serif; padding:6px 12px 2px; border-radius:8px; letter-spacing:.03em; }
.lj .t .b { font:400 42px/1 'Bebas Neue',sans-serif; letter-spacing:.02em; padding-top:4px; }
.lj .c { margin-top:7px; font:700 23px/1.2 'Poppins',sans-serif; color:#FFE082; }
.lj .e { margin-top:3px; font:600 23px/1.25 'Poppins',sans-serif; color:rgba(255,255,255,.9); white-space:nowrap; }
.lj .w { margin-top:8px; display:flex; align-items:center; gap:10px; font:800 31px/1 'Montserrat',sans-serif; color:#fff; white-space:nowrap; }
.lj .w svg { width:32px; height:32px; color:#25D366; }
.lj .gift { position:absolute; right:14px; bottom:14px; display:flex; align-items:center; gap:6px; background:#FFC107; color:#062B63; border-radius:20px; padding:6px 12px; font:800 18px/1 'Montserrat',sans-serif; }
.lj .gift svg { width:22px; height:22px; }
.v-foot { position:absolute; left:94px; right:94px; top:524px; display:flex; align-items:center; gap:28px; }
.v-foot .box { flex:none; width:136px; height:136px; background:#fff; border-radius:14px; padding:9px; }
.v-foot .box svg { width:118px; height:118px; }
.v-foot .t1 { font:800 27px/1.1 'Montserrat',sans-serif; color:#FFC107; }
.v-foot .t2 { display:flex; align-items:center; gap:12px; margin-top:8px; font:800 52px/1 'Montserrat',sans-serif; white-space:nowrap; }
.v-foot .t2 svg { width:52px; height:52px; color:#25D366; }
.v-foot .t3 { margin-top:10px; font:700 27px/1 'Poppins',sans-serif; color:#FFE082; white-space:nowrap; }
.v-foot .fer { margin-left:auto; }
`;

function frente(qr) {
  return `<div class="pg">
<div class="f-foto"></div>
<img class="f-logo" src="img/logo-azul.png" alt="Tintas Laet">
<div class="f-tit">CASA NOVA,<br><em>GASTANDO</em><br>POUCO.</div>
${seloBrinde(1400, 110)}
<div class="f-band"></div>
<img class="f-prod" src="img/barrica-massa-corrida.png" alt="Massa Corrida Laet">
<div class="f-tag"><div class="a">MASSA CORRIDA</div><div class="a2">SACO DE 23 KG</div><div class="b"><small>R$</small><span>37,90</span></div><div class="c">Enquanto durar o estoque</div></div>
<div class="f-info">
  <div class="f-l1"><div class="n">6 LOJAS</div><div class="b">NO ABC E ZONA LESTE</div></div>
  <div class="f-l2">Mauá · Santo André · São Bernardo do Campo · São Paulo</div>
  <div class="f-wa">${I.wa}(11) 97714-0964</div>
  <div class="f-l3">${horario}${SEM_FERIADO ? '' : `<span class="fer">${feriado}</span>`}</div>
  <div class="f-l4">@Tintaslaet · tintaslaet.com · endereços no verso</div>
</div>
<div class="f-qr"><div class="box">${qr}</div><div class="c">Chame no<br>WhatsApp</div></div>
${guias}</div>`;
}

function verso(qr) {
  const chips = CORES.map(([nome, hex]) => `<div class="chip"><div class="sw" style="background:${hex}"></div><div class="nm">${nome}</div></div>`).join('');
  const lojas = LOJAS.map(l => `<div class="lj">${l.brinde ? `<div class="gift">${I.gift}BRINDE</div>` : ''}
    <div class="t"><span class="n">LOJA ${l.n}</span><span class="b">${l.bairro.toUpperCase()}</span></div>
    <div class="c">${l.cidade}</div><div class="e">${l.end}</div><div class="w">${I.wa}${l.wa}</div></div>`).join('');
  return `<div class="pg">
<div class="v-hero"><div class="ring"></div><div class="ring b"></div>
  <img class="v-logo" src="img/logo-branco.png" alt="Tintas Laet">
  <div class="v-urg"><i></i>ENQUANTO DURAR O ESTOQUE</div>
  <div class="v-kick">TINTA</div>
  <div class="v-nome">SUPER<br>PROFISSIONAL</div>
  <div class="v-sub"><div><span class="ck">${I.check}</span>Balde de 18 litros</div><div><span class="ck">${I.check}</span>Cobertura garantida</div></div>
  <div class="v-preco"><div class="lb">O BALDE DE 18L</div><div class="rs">R$</div><div class="v">139,90</div></div>
  <div class="v-chao"></div>
  <img class="v-balde" src="img/balde-super-profissional.png" alt="Balde 18L Tinta Super Profissional Laet">
</div>
<div class="v-mid">
  <h3>CORES CLARAS <span>EM ESTOQUE</span></h3>
  <div class="h3s">Mesmo preço do balde de 18L, na cor que você escolher.</div>
  <div class="chips">${chips}</div>
  <div class="difs">
    <div class="dif"><div class="ic">${I.card}</div><div><b>12x sem juros*</b><span>sem valor mínimo</span></div></div>
    <div class="dif"><div class="ic">${I.tag}</div><div><b>Melhores preços</b><span>da região</span></div></div>
    <div class="dif"><div class="ic">${I.user}</div><div><b>Atendimento</b><span>personalizado</span></div></div>
  </div>
</div>
<div class="v-nota">*12x sem juros, sem valor mínimo: consulte as condições.</div>
<div class="v-lojas">
  <div class="v-lh"><h4>NOSSAS <span>6 LOJAS</span></h4><div class="h">${I.clock}${horario}</div></div>
  <div class="grid">${lojas}</div>
  <div class="v-foot"><div class="box">${qr}</div>
    <div><div class="t1">WhatsApp central · aponte a câmera</div><div class="t2">${I.wa}(11) 97714-0964</div><div class="t3">@Tintaslaet · tintaslaet.com</div></div>
    ${SEM_FERIADO ? '' : `<span class="fer">${feriado}</span>`}</div>
</div>
${guias}</div>`;
}

(async () => {
  const qr = await QR.toString('https://wa.me/5511977140964?text=' + encodeURIComponent('Olá! Vi o panfleto da Tintas Laet e quero saber mais.'),
    { type: 'svg', margin: 0, errorCorrectionLevel: 'M', color: { dark: '#062B63', light: '#FFFFFF' } });
  const head = `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><title>Panfleto Tintas Laet</title><style>${CSS}</style></head><body>`;
  const pF = path.join(DIR, 'panfleto-frente.html'), pV = path.join(DIR, 'panfleto-verso.html'), pA = path.join(DIR, 'panfleto-frente-verso.html');
  fs.writeFileSync(pF, head + frente(qr) + '</body></html>');
  fs.writeFileSync(pV, head + verso(qr) + '</body></html>');
  fs.writeFileSync(pA, head.replace('html,body { width:1819px; height:2551px;', 'html,body { width:1819px;') + frente(qr) + verso(qr) + '</body></html>');
  const browser = await chromium.launch(process.env.PW_EXEC ? { executablePath: process.env.PW_EXEC } : {});
  const page = await browser.newPage({ viewport: { width: 1819, height: 2551 } });
  for (const [src, nome] of [[pF, 'panfleto-laet-frente'], [pV, 'panfleto-laet-verso']]) {
    await page.goto('file://' + src, { waitUntil: 'networkidle' }); await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(OUT, nome + '.png') }); console.log('✓', nome + '.png');
  }
  // PDF: cada lado vira UMA página exata de 154 x 216 mm (A5 + 3 mm de sangria) e depois junta as duas
  const { execFileSync } = require('child_process');
  const partes = [];
  for (const [src, nome] of [[pF, 'frente'], [pV, 'verso']]) {
    await page.goto('file://' + src, { waitUntil: 'networkidle' }); await page.evaluate(() => document.fonts.ready);
    await page.addStyleTag({ content: '@page { size:154mm 216mm; margin:0 } html { zoom:' + (154 / 25.4 * 96 / 1819) + ' } html,body { overflow:hidden }' });
    await page.waitForTimeout(400);
    const tmp = path.join(DIR, '_' + nome + '.pdf');
    await page.pdf({ path: tmp, preferCSSPageSize: true, printBackground: true, margin: { top: 0, right: 0, bottom: 0, left: 0 }, displayHeaderFooter: false, pageRanges: '1' });
    partes.push(tmp);
  }
  const final = path.join(OUT, 'panfleto-laet-frente-verso-A5.pdf');
  execFileSync('pdfunite', [...partes, final]);
  partes.forEach(f => fs.unlinkSync(f));
  console.log('✓ panfleto-laet-frente-verso-A5.pdf');
  await browser.close();
})();
