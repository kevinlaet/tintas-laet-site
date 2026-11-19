// Black Friday Laet — 8 stories por produto (bf-01..08) + bf-09 pós-Black (story + feed).
// Versão limpa (19/11/2026): logo pequeno > BLACK FRIDAY > produto grande > nome + medida > PREÇO > faixa "SÓ DIA 27/11".
// REGRA FIXA: promoções valem SOMENTE em 27/11/2026.
// Uso: PW_EXEC=<chrome> node gerar.js [N]   -> saida/*.jpg + folha-de-contato.jpg
const fs = require('fs');
const path = require('path');
const { chromium } = require(process.env.PW_MOD || 'playwright');
const DIR = __dirname, OUT = path.join(DIR, 'saida');

// Preços do Kevin. ben = no máximo 4 palavras, só fato aprovado.
const P = [
  { slug: 'massa-corrida', img: 'combo', nome: 'Massa Corrida', medida: 'Saco 23 kg', preco: '32,99', extra: 'Barrica: R$ 40,99', ben: '', w: 620, top: 560 },
  { slug: 'massa-acrilica', img: 'combo', nome: 'Massa Acrílica', medida: 'Saco 23 kg', preco: '49,99', extra: 'Barrica: R$ 57,99', ben: '', w: 620, top: 560 },
  { slug: 'direto-no-gesso', img: 'gesso.png', nome: 'Direto no Gesso', medida: '18L · Branca', preco: '139,99', ben: 'Dispensa fundo preparador', w: 640, top: 520 },
  { slug: 'epoxi', img: 'epoxi.png', nome: 'Epóxi Base Água', medida: '3,6L · Branco', preco: '99,99', ben: 'Renova sem quebrar', w: 620, top: 530 },
  { slug: 'pisos', img: 'pisos.png', nome: 'Premium Pisos', medida: '17L · 13 cores', preco: '149,99', ben: 'Rende até 300 m²', w: 640, top: 520 },
  { slug: 'standard', img: 'standard.png', nome: 'Standard', medida: '18L · Branca', preco: '159,99', ben: 'Rende até 300 m²', w: 640, top: 520 },
  { slug: 'premium-lavavel', img: 'lavavel.png', nome: 'Premium Lavável', medida: '18L · Branca', preco: '229,99', ben: 'Rende até 200 m²', w: 540, top: 505 },
  { slug: 'vinil', img: 'vinil.png', nome: 'Básica Interna Vinil', medida: '18L · Branca', preco: '64,99', ben: 'Econômica, uso interno', w: 640, top: 520 },
];

const Y = '#F5B800';
const FONTS = `
@font-face { font-family:'Bebas Neue'; src:url('fonts/bebas-neue-latin-400-normal.woff2') format('woff2'); }
@font-face { font-family:'Montserrat'; font-weight:700; src:url('fonts/montserrat-latin-700-normal.woff2') format('woff2'); }
@font-face { font-family:'Montserrat'; font-weight:800; src:url('fonts/montserrat-latin-800-normal.woff2') format('woff2'); }
@font-face { font-family:'Poppins'; font-weight:600; src:url('fonts/poppins-latin-600-normal.woff2') format('woff2'); }
@font-face { font-family:'Poppins'; font-weight:700; src:url('fonts/poppins-latin-700-normal.woff2') format('woff2'); }
*,*::before,*::after { margin:0; padding:0; box-sizing:border-box; }`;

const BASE = `${FONTS}
html,body { background:#000; }
.s { position:relative; overflow:hidden; color:#fff;
  background:radial-gradient(ellipse 760px 700px at 50% 42%, #1e1a10 0%, #0b0b0b 55%, #050505 100%); }
.grain { position:absolute; inset:0; z-index:40; pointer-events:none; opacity:.08; mix-blend-mode:overlay;
  background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='260' height='260'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 .9 0'/></filter><rect width='260' height='260' filter='url(%23n)'/></svg>"); }
.neon { position:absolute; z-index:2; pointer-events:none; }
.logo { position:absolute; left:0; right:0; text-align:center; z-index:10; }
.logo img { filter:drop-shadow(0 4px 12px rgba(0,0,0,.6)); }
.bf { position:absolute; left:0; right:0; z-index:8; text-align:center; white-space:nowrap; transform:skewX(-8deg); padding-top:12px;
  font:400 var(--bfs) / .9 'Bebas Neue',sans-serif; color:#fff; letter-spacing:.01em; }
.bf b { color:${Y}; font-weight:400; }
.stroke { position:absolute; z-index:7; }
`;

// pincelada amarela fina sob o título (um só elemento gráfico de destaque)
function stroke(left, top, w, h) {
  return `<svg class="stroke" style="left:${left}px;top:${top}px" width="${w}" height="${h}" viewBox="0 0 600 40" preserveAspectRatio="none">
<defs><filter id="r" x="-5%" y="-50%" width="110%" height="200%"><feTurbulence type="fractalNoise" baseFrequency="0.02 0.5" numOctaves="3" seed="5" result="t"/>
<feDisplacementMap in="SourceGraphic" in2="t" scale="10" xChannelSelector="R" yChannelSelector="G"/></filter></defs>
<path filter="url(#r)" d="M8,14 C150,8 420,6 592,12 L590,28 C420,34 160,34 10,30 Z" fill="${Y}"/></svg>`;
}
// 1 linha neon discreta em cada lado
const NEON = (W, H) => `<svg class="neon" style="left:0;top:0" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
<defs><filter id="g" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
<g filter="url(#g)" stroke="${Y}" stroke-width="3" stroke-linecap="round" opacity=".75">
<path d="M${W + 10},${H * .2} L${W - 190},${H * .5}"/><path d="M-10,${H * .78} L190,${H * .48}"/></g></svg>`;


// Saco + barrica lado a lado (mesma altura visual, saco um pouco à frente). Recorte pelo conteúdo real de cada PNG.
const CROP = { barrica: ['barrica.png', 1254, 1254, 164, 40, 924, 1150], saco: ['saco.png', 1024, 941, 68, 42, 926, 862] };
function peca(nome, left, top, h, z) {
  const [f, iw, ih, l, t, cw, ch] = CROP[nome]; const k = h / ch;
  return `<div style="position:absolute;left:${left}px;top:${top}px;width:${cw * k}px;height:${h}px;z-index:${z};background:url('img/${f}') no-repeat;background-size:${iw * k}px ${ih * k}px;background-position:${-l * k}px ${-t * k}px;filter:drop-shadow(0 28px 30px rgba(0,0,0,.9))"></div>`;
}
function combo(cx, bottom, hb) {
  const kb = hb / 1150, bw = 924 * kb, hs = hb * .86, ws = 926 * (hs / 862), ov = bw * .14;
  const left = cx - (bw + ws - ov) / 2;
  return peca('barrica', left, bottom - hb, hb, 6) + peca('saco', left + bw - ov, bottom - hs + 6, hs, 7)
    + `<div style="position:absolute;left:${left}px;top:${bottom + 8}px;width:${bw}px;text-align:center;z-index:8;font:700 ${Math.round(hb * .045)}px/1 Montserrat,sans-serif;letter-spacing:.2em;color:rgba(255,255,255,.55)">BARRICA</div>`
    + `<div style="position:absolute;left:${left + bw - ov}px;top:${bottom + 8}px;width:${ws}px;text-align:center;z-index:8;font:700 ${Math.round(hb * .045)}px/1 Montserrat,sans-serif;letter-spacing:.2em;color:${Y}">SACO 23 KG</div>`;
}

const CSS_P = `${BASE}
html,body,.s { width:1080px; height:1920px; }
.logo { top:150px; } .logo img { height:96px; }
.bf { top:282px; --bfs:150px; }
.halo { position:absolute; left:50%; top:520px; width:780px; height:700px; transform:translateX(-50%); z-index:3; border-radius:50%;
  background:radial-gradient(ellipse, rgba(245,184,0,.20) 0%, rgba(245,184,0,.05) 48%, rgba(0,0,0,0) 72%); }
.floor { position:absolute; left:50%; top:1150px; width:600px; height:80px; transform:translateX(-50%); z-index:4; border-radius:50%;
  background:radial-gradient(ellipse, rgba(0,0,0,.95) 0%, rgba(0,0,0,0) 70%); }
.prod { position:absolute; left:50%; transform:translateX(-50%); z-index:6; filter:drop-shadow(0 30px 34px rgba(0,0,0,.9)); }
.nome { position:absolute; left:0; right:0; top:1206px; z-index:9; text-align:center; white-space:nowrap; padding-top:12px;
  font:400 var(--fs,96px)/.9 'Bebas Neue',sans-serif; letter-spacing:.02em; }
.med { position:absolute; left:0; right:0; top:1318px; z-index:9; text-align:center; font:700 30px/1 'Montserrat',sans-serif; letter-spacing:.24em; color:rgba(255,255,255,.7); }
.preco { position:absolute; left:0; right:0; top:1350px; z-index:9; display:flex; justify-content:center; align-items:flex-start; gap:12px; }
.preco small { font:800 58px/1 'Montserrat',sans-serif; color:${Y}; margin-top:46px; }
.preco span { font:400 232px/.8 'Bebas Neue',sans-serif; color:${Y}; padding-top:30px; letter-spacing:.005em; text-shadow:0 0 40px rgba(245,184,0,.25); }
.sub { position:absolute; left:0; right:0; top:1590px; z-index:9; text-align:center; font:600 32px/1 'Poppins',sans-serif; color:rgba(255,255,255,.8); }
.sub b { color:#fff; font-weight:700; }
.data { position:absolute; left:0; right:0; top:1652px; height:104px; z-index:12; background:${Y}; display:flex; align-items:center; justify-content:center; gap:22px;
  box-shadow:0 0 40px rgba(245,184,0,.35); }
.data span { font:400 82px/1 'Bebas Neue',sans-serif; color:#0A0A0A; letter-spacing:.04em; padding-top:8px; }
.data i { width:14px; height:14px; border-radius:50%; background:#0A0A0A; }
.rod { position:absolute; left:0; right:0; top:1784px; z-index:9; text-align:center; font:600 24px/1.5 'Poppins',sans-serif; color:rgba(255,255,255,.62); }
.rod b { color:#fff; font:700 30px/1.4 'Montserrat',sans-serif; display:block; }
`;

function story(p) {
  const fs_ = p.nome.length > 16 ? 86 : 100;
  const sub = p.extra ? `<div class="sub"><b>${p.extra}</b></div>` : (p.ben ? `<div class="sub">${p.ben}</div>` : '');
  return `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><title>BF ${p.nome}</title><style>${CSS_P}</style></head><body>
<div class="s">
${NEON(1080, 1920)}
<div class="logo"><img src="img/logo-branco.png" alt="Tintas Laet"></div>
<div class="bf">BLACK <b>FRIDAY</b></div>
${stroke(330, 416, 420, 26)}
<div class="halo"></div><div class="floor"></div>
${p.img === 'combo' ? combo(540, 1130, 540) : `<img class="prod" src="img/${p.img}" style="width:${p.w}px;top:${p.top}px" alt="${p.nome}">`}
<div class="nome" style="--fs:${fs_}px">${p.nome.toUpperCase()}</div>
<div class="med">${p.medida.toUpperCase()}</div>
<div class="preco"><small>R$</small><span>${p.preco}</span></div>
${sub}
<div class="data"><i></i><span>PREÇO VÁLIDO SÓ NA SEXTA 27/11</span><i></i></div>
<div class="rod"><b>tintaslaet.com</b>12x sem juros (consulte as condições)</div>
<div class="grain"></div>
</div></body></html>`;
}

// ---------- bf-09: pós-Black (28/11) ----------
const LOJAS = [
  [1, 'Vila Bela', 'São Paulo', 'Av. Sapopemba, 25.723', '(11) 98082-0686'],
  [2, 'Jd. São João', 'Mauá', 'Rua do Britador, 2', '(11) 97750-4434'],
  [3, 'Jd. Santa Cecília', 'Mauá', 'Av. Ayrton Senna da Silva, 235', '(11) 97749-8813'],
  [4, 'Vila Luzita', 'Santo André', 'Av. São Bernardo do Campo, 757', '(11) 94855-1977'],
  [5, 'Jd. Itapark', 'Mauá', 'Av. Itapark, 4377', '(11) 91433-4875'],
  [6, 'Santa Terezinha', 'São Bernardo do Campo', 'Av. Luís Pequini, 899', '(11) 91875-5095'],
];
const WA = '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.5.1l-.7.9c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.7-1.6c-.2-.4-.4-.3-.5-.3h-.4a.8.8 0 0 0-.6.3 2.5 2.5 0 0 0-.8 1.9 4.4 4.4 0 0 0 .9 2.3 10 10 0 0 0 3.8 3.4c1.4.6 1.9.7 2.6.6a2.2 2.2 0 0 0 1.5-1.1 1.8 1.8 0 0 0 .1-1.1c-.1-.1-.2-.2-.4-.3z"/></svg>';

function pos(W, H) {
  const story = H === 1920;
  const k = story ? 1 : .84;
  const lojas = LOJAS.map(([n, b, c, e, w]) => `<div class="lj"><div class="t"><span class="n">LOJA ${n}</span><span class="b">${b}</span></div>
    <div class="e">${c + " · " + e}</div><div class="w">${WA}${w}</div></div>`).join('');
  return `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><title>Pós Black</title><style>${BASE}
html,body,.s { width:${W}px; height:${H}px; }
.logo { top:${story ? 150 : 70}px; } .logo img { height:${story ? 96 : 80}px; }
.tag { position:absolute; left:0; right:0; top:${story ? 300 : 186}px; text-align:center; z-index:9; }
.tag span { display:inline-block; font:800 ${26 * k + 2}px/1 'Montserrat',sans-serif; letter-spacing:.3em; color:${Y}; padding-left:.3em; }
.h1 { position:absolute; left:60px; right:60px; top:${story ? 340 : 224}px; z-index:9; text-align:center; transform:skewX(-8deg); padding-top:12px;
  font:400 ${story ? 150 : 128}px/.9 'Bebas Neue',sans-serif; letter-spacing:.01em; }
.h1 b { color:${Y}; font-weight:400; }
.txt { position:absolute; left:110px; right:110px; top:${story ? 684 : 494}px; z-index:9; text-align:center; font:600 ${story ? 40 : 34}px/1.3 'Poppins',sans-serif; color:rgba(255,255,255,.88); }
.txt b { color:${Y}; font-weight:700; }
.cta { position:absolute; left:0; right:0; top:${story ? 834 : 612}px; z-index:9; text-align:center; }
.cta span { display:inline-block; background:${Y}; color:#0A0A0A; font:800 ${story ? 40 : 32}px/1 'Montserrat',sans-serif; padding:${story ? '20px 44px' : '15px 36px'}; border-radius:14px; }
.grid { position:absolute; left:${story ? 70 : 60}px; right:${story ? 70 : 60}px; top:${story ? 948 : 702}px; z-index:9; display:grid; grid-template-columns:${story ? 'minmax(0,1fr)' : 'minmax(0,1fr) minmax(0,1fr)'}; gap:${story ? 16 : 14}px; }
.lj { position:relative; border:1.5px solid rgba(245,184,0,.35); border-radius:18px; padding:${story ? '16px 26px' : '14px 18px'}; background:rgba(255,255,255,.035); }
${story ? '.lj .w { position:absolute; right:26px; top:50%; transform:translateY(-50%); margin:0 !important; }' : ''}
.lj .t { display:flex; align-items:center; gap:12px; white-space:nowrap; }
.lj .n { background:${Y}; color:#0A0A0A; font:400 ${story ? 36 : 28}px/1 'Bebas Neue',sans-serif; padding:5px 10px 1px; border-radius:6px; letter-spacing:.03em; }
.lj .b { font:700 ${story ? 25 : 20}px/1 'Montserrat',sans-serif; }
.lj .e { margin-top:${story ? 12 : 7}px; font:600 ${story ? 23 : 18}px/1.2 'Poppins',sans-serif; color:rgba(255,255,255,.72); white-space:nowrap; }
.lj .w { margin-top:${story ? 10 : 6}px; display:flex; align-items:center; gap:10px; font:800 ${story ? 32 : 25}px/1 'Montserrat',sans-serif; white-space:nowrap; }
.lj .w svg { width:${story ? 32 : 25}px; height:${story ? 32 : 25}px; color:#25D366; }
.rod { position:absolute; left:0; right:0; top:${story ? 1790 : 1278}px; z-index:9; text-align:center; font:700 ${story ? 30 : 24}px/1 'Montserrat',sans-serif; color:#fff; }
.rod span { color:rgba(255,255,255,.55); font-weight:700; }
</style></head><body><div class="s">
<div class="logo"><img src="img/logo-branco.png" alt="Tintas Laet"></div>
<div class="tag"><span>OBRIGADO, CLIENTE LAET</span></div>
<div class="h1">NOSSA BLACK<br>FOI UM <b>SUCESSO!</b></div>
${stroke(W / 2 - 200, story ? 638 : 462, 400, 22)}
<div class="txt">E os preços da Tintas Laet continuam <b>os melhores da região!</b></div>
<div class="cta"><span>Chame a loja mais próxima de você!</span></div>
<div class="grid">${lojas}</div>
<div class="rod">@Tintaslaet <span>·</span> tintaslaet.com</div>
<div class="grain"></div>
</div></body></html>`;
}


// ======================= CARROSSEL bf-09 (feed 1080x1350, post de 28/11) =======================
const CSS_F = `${BASE}
html,body,.s { width:1080px; height:1350px; }
.logo { top:64px; } .logo img { height:74px; }
`;
const head = (t, css) => `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><title>${t}</title><style>${css}</style></head><body><div class="s">`;
const foot = `<div class="grain"></div></div></body></html>`;
const SETA = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

function capa() {
  const prods = ['gesso.png', 'pisos.png', 'standard.png', 'lavavel.png', 'epoxi.png'];
  const pos = [[90, 860, -10, 300], [300, 820, -4, 330], [540, 800, 0, 360], [790, 820, 5, 330], [1000, 860, 11, 300]];
  const imgs = prods.map((f, i) => { const [cx, t, r, w] = pos[i]; return `<img src="img/${f}" style="position:absolute;left:${cx - w / 2}px;top:${t}px;width:${w}px;transform:rotate(${r}deg);z-index:${i === 2 ? 6 : (i === 1 || i === 3 ? 5 : 4)};filter:drop-shadow(0 26px 26px rgba(0,0,0,.9))">`; }).join('');
  return head('Capa', CSS_F + `
.tag { position:absolute; left:0; right:0; top:206px; text-align:center; z-index:9; font:800 28px/1 'Montserrat',sans-serif; letter-spacing:.32em; color:${Y}; padding-left:.32em; }
.h1 { position:absolute; left:40px; right:40px; top:250px; text-align:center; z-index:9; transform:skewX(-8deg); padding-top:12px; font:400 172px/.86 'Bebas Neue',sans-serif; }
.h1 b { color:${Y}; font-weight:400; }
.glow { position:absolute; left:50%; top:780px; width:1100px; height:560px; transform:translateX(-50%); border-radius:50%; z-index:3;
  background:radial-gradient(ellipse, rgba(245,184,0,.28) 0%, rgba(245,184,0,.06) 50%, rgba(0,0,0,0) 72%); }
.fade { position:absolute; left:0; right:0; bottom:0; height:260px; z-index:8; background:linear-gradient(180deg, rgba(5,5,5,0), #050505 70%); }
.arr { position:absolute; right:60px; bottom:58px; z-index:9; display:flex; align-items:center; gap:12px; font:700 26px/1 'Poppins',sans-serif; color:#fff; }
.arr svg { width:40px; height:40px; color:${Y}; }
.data { position:absolute; left:60px; bottom:62px; z-index:9; font:700 26px/1 'Montserrat',sans-serif; letter-spacing:.14em; color:rgba(255,255,255,.6); }`)
  + `${NEON(1080, 1350)}<div class="logo"><img src="img/logo-branco.png" alt="Tintas Laet"></div>
<div class="tag">OBRIGADO, CLIENTE LAET</div>
<div class="h1">NOSSA BLACK<br>FOI UM <b>SUCESSO!</b></div>
${stroke(340, 572, 400, 24)}
<div class="glow"></div>${imgs}<div class="fade"></div>
<div class="data">BLACK FRIDAY · 27/11/2026</div>
<div class="arr">Veja como foi ${SETA}</div>` + foot;
}

function slideProd(p, i) {
  const fs_ = p.nome.length > 16 ? 84 : 96;
  const img = p.img === 'combo' ? combo(540, 830, 460) : `<img src="img/${p.img}" style="position:absolute;left:50%;transform:translateX(-50%);top:${p.slug === 'premium-lavavel' ? 250 : 270}px;width:${Math.round(p.w * .82)}px;z-index:6;filter:drop-shadow(0 26px 30px rgba(0,0,0,.9))">`;
  return head(p.nome, CSS_F + `
.pill { position:absolute; left:60px; top:78px; z-index:9; font:800 24px/1 'Montserrat',sans-serif; letter-spacing:.16em; color:${Y}; }
.pg { position:absolute; right:60px; top:78px; z-index:9; font:700 24px/1 'Montserrat',sans-serif; color:rgba(255,255,255,.45); letter-spacing:.1em; }
.logo { top:56px; } .logo img { height:62px; }
.halo { position:absolute; left:50%; top:230px; width:760px; height:620px; transform:translateX(-50%); z-index:3; border-radius:50%;
  background:radial-gradient(ellipse, rgba(245,184,0,.18) 0%, rgba(245,184,0,.04) 50%, rgba(0,0,0,0) 72%); }
.selo { position:absolute; right:70px; top:200px; z-index:12; width:230px; height:230px; border-radius:50%; transform:rotate(12deg);
  border:4px solid ${Y}; background:#0A0A0A; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center;
  box-shadow:0 0 0 8px rgba(10,10,10,.85), 0 0 0 10px rgba(245,184,0,.5), 0 18px 34px rgba(0,0,0,.7); }
.selo .a { font:800 19px/1.15 'Montserrat',sans-serif; letter-spacing:.14em; color:#fff; }
.selo .b { font:400 54px/.9 'Bebas Neue',sans-serif; color:${Y}; letter-spacing:.03em; margin:6px 0 4px; padding-top:4px; }
.selo .c { font:700 18px/1 'Montserrat',sans-serif; letter-spacing:.12em; color:rgba(255,255,255,.7); }
.nome { position:absolute; left:0; right:0; top:${p.img === 'combo' ? 880 : 862}px; z-index:9; text-align:center; white-space:nowrap; padding-top:10px; font:400 ${fs_}px/.9 'Bebas Neue',sans-serif; letter-spacing:.02em; }
.med { position:absolute; left:0; right:0; top:${p.img === 'combo' ? 972 : 955}px; z-index:9; text-align:center; font:700 26px/1 'Montserrat',sans-serif; letter-spacing:.24em; color:rgba(255,255,255,.7); }
.lbl { position:absolute; left:0; right:0; top:1010px; z-index:9; text-align:center; font:700 24px/1 'Poppins',sans-serif; color:rgba(255,255,255,.6); }
.preco { position:absolute; left:0; right:0; top:1032px; z-index:9; display:flex; justify-content:center; align-items:flex-start; gap:10px; }
.preco small { font:800 48px/1 'Montserrat',sans-serif; color:${Y}; margin-top:38px; }
.preco span { font:400 186px/.8 'Bebas Neue',sans-serif; color:${Y}; padding-top:24px; }
.sub { position:absolute; left:0; right:0; top:1206px; z-index:9; text-align:center; font:700 28px/1 'Poppins',sans-serif; color:#fff; }
.band { position:absolute; left:0; right:0; bottom:0; height:76px; z-index:12; background:${Y}; display:flex; align-items:center; justify-content:center; gap:18px; }
.band span { font:400 50px/1 'Bebas Neue',sans-serif; color:#0A0A0A; letter-spacing:.05em; padding-top:6px; }
.band i { width:10px; height:10px; border-radius:50%; background:#0A0A0A; }`)
  + `${NEON(1080, 1350)}<div class="pill">FOI ASSIM NA BLACK</div><div class="logo"><img src="img/logo-branco.png" alt="Tintas Laet"></div><div class="pg">${String(i + 2).padStart(2, '0')}/11</div>
<div class="halo"></div>${img}
<div class="selo"><div class="a">BLACK FRIDAY</div><div class="b">ENCERRADA</div><div class="c">27/11/2026</div></div>
<div class="nome">${p.nome.toUpperCase()}</div><div class="med">${p.medida.toUpperCase()}</div>
<div class="lbl">Na Black saiu por</div>
<div class="preco"><small>R$</small><span>${p.preco}</span></div>
${p.extra ? `<div class="sub">${p.extra}</div>` : ''}
<div class="band"><i></i><span>BLACK FRIDAY ENCERRADA · PREÇOS VÁLIDOS SÓ EM 27/11</span><i></i></div>` + foot;
}

// Sorteio: prêmios em cartões claros (as fotos têm fundo branco), sem inventar regras.
function sorteio(W, H) {
  const st = H === 1920;
  const cw = st ? 440 : 400, ch = st ? 560 : 420, top = st ? 760 : 545;
  return head('Sorteio', BASE + `
html,body,.s { width:${W}px; height:${H}px; }
.logo { top:${st ? 150 : 64}px; } .logo img { height:${st ? 96 : 74}px; }
.tag { position:absolute; left:0; right:0; top:${st ? 300 : 186}px; text-align:center; z-index:9; font:800 ${st ? 30 : 26}px/1 'Montserrat',sans-serif; letter-spacing:.32em; color:${Y}; padding-left:.32em; }
.h1 { position:absolute; left:40px; right:40px; top:${st ? 344 : 222}px; text-align:center; z-index:9; transform:skewX(-8deg); padding-top:12px; font:400 ${st ? 178 : 150}px/.86 'Bebas Neue',sans-serif; }
.h1 b { color:${Y}; font-weight:400; }
.glow { position:absolute; left:50%; top:${top - 80}px; width:1100px; height:${ch + 200}px; transform:translateX(-50%); border-radius:50%; z-index:3;
  background:radial-gradient(ellipse, rgba(245,184,0,.26) 0%, rgba(245,184,0,.05) 50%, rgba(0,0,0,0) 72%); }
.cards { position:absolute; left:0; right:0; top:${top}px; z-index:8; display:flex; justify-content:center; align-items:flex-start; gap:${st ? 40 : 60}px; }
.card { width:${cw}px; background:#fff; border-radius:28px; overflow:hidden; box-shadow:0 30px 60px rgba(0,0,0,.75), 0 0 0 4px rgba(245,184,0,.9); }
.card:first-child { transform:rotate(-3deg); } .card:last-child { transform:rotate(3deg); }
.card .ph { --bk:${ch - (st ? 150 : 130)}px; height:${ch - (st ? 150 : 130)}px; background:#fff center/contain no-repeat; margin:${st ? 20 : 16}px; }
.card .ph { position:relative; display:flex; justify-content:center; overflow:hidden; }
.bk { position:relative; flex:none; width:var(--bk); height:var(--bk); }
.bk img { position:absolute; inset:0; width:100%; height:100%; }
/* etiqueta "PROTEÇÃO" colada sobre o "FLEXÍVEL", como no balde da loja */
.stk { position:absolute; left:28.8%; top:39.2%; width:48%; height:8.6%; border-radius:3px; display:flex; align-items:center; justify-content:center;
  background:linear-gradient(90deg,#E9690E,#F07E17 55%,#EC720F); color:#fff; font:800 calc(var(--bk) * .068) / 1 'Montserrat',sans-serif; letter-spacing:.01em;
  text-shadow:0 1px 1px rgba(120,40,0,.35); box-shadow:0 1px 2px rgba(0,0,0,.35), inset 0 0 0 1px rgba(255,255,255,.18); transform:rotate(-.6deg); }
.card .nm { background:#0A0A0A; color:#fff; padding:${st ? '18px 16px 20px' : '14px 14px 16px'}; text-align:center; }
.card .nm b { display:block; font:400 ${st ? 46 : 40}px/1 'Bebas Neue',sans-serif; letter-spacing:.02em; color:${Y}; padding-top:4px; }
.card .nm span { display:block; margin-top:6px; font:700 ${st ? 23 : 20}px/1.2 'Poppins',sans-serif; color:rgba(255,255,255,.85); }
.mais { position:absolute; left:50%; top:${top + ch / 2 - 48}px; width:96px; height:96px; transform:translateX(-50%); z-index:10; border-radius:50%; background:${Y}; color:#0A0A0A;
  display:flex; align-items:center; justify-content:center; font:400 86px/1 'Bebas Neue',sans-serif; padding-top:6px; box-shadow:0 0 0 10px #0A0A0A, 0 14px 30px rgba(0,0,0,.6); }
.cta { position:absolute; left:0; right:0; top:${st ? 1430 : 1060}px; text-align:center; z-index:9; }
.cta span { display:inline-block; background:${Y}; color:#0A0A0A; font:400 ${st ? 96 : 76}px/1 'Bebas Neue',sans-serif; letter-spacing:.04em; padding:${st ? '18px 70px 10px' : '14px 60px 8px'}; border-radius:18px; box-shadow:0 0 40px rgba(245,184,0,.35); }
.rod { position:absolute; left:0; right:0; top:${st ? 1790 : 1270}px; text-align:center; z-index:9; font:700 ${st ? 30 : 24}px/1 'Montserrat',sans-serif; }`)
  + `${NEON(W, H)}<div class="logo"><img src="img/logo-branco.png" alt="Tintas Laet"></div>
<div class="tag">SORTEIO TINTAS LAET</div>
<div class="h1">ÚLTIMO SORTEIO<br><b>DO ANO!</b></div>
<div class="glow"></div>
<div class="cards">
 <div class="card"><div class="ph"><div class="bk"><img src="img/emborrachada-balde.png" alt="Proteção Emborrachada Laet"><div class="stk">PROTEÇÃO</div></div></div><div class="nm"><b>PROTEÇÃO EMBORRACHADA</b><span>Tinta 18 kg · Branca</span></div></div>
 <div class="card"><div class="ph" style="background-image:url('img/caixa.jpg')"></div><div class="nm"><b>SUPER CAIXA DE SOM</b><span>Mondial 250W</span></div></div>
</div>
<div class="mais">+</div>
<div class="cta"><span>PARTICIPE!</span></div>
<div class="rod">@Tintaslaet · tintaslaet.com</div>` + foot;
}

function final11() {
  return pos(1080, 1350)
    .replace('</style>', `.h1 { font-size:104px !important; top:226px !important; }
.cta { top:584px !important; } .grid { top:680px !important; gap:16px !important; } .lj { padding:16px 20px !important; }
</style>`)
    .replace('<div class="h1">NOSSA BLACK<br>FOI UM <b>SUCESSO!</b></div>', '<div class="h1">OS PREÇOS DA TINTAS LAET<br>CONTINUAM <b>OS MELHORES</b><br><b>DA REGIÃO!</b></div>')
    .replace('<div class="txt">E os preços da Tintas Laet continuam <b>os melhores da região!</b></div>', '')
    .replace(/<svg class="stroke"[\s\S]*?<\/svg>/, '')
    .replace('<span>OBRIGADO, CLIENTE LAET</span>', '<span>OBRIGADO, CLIENTE LAET</span>');
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch(process.env.PW_EXEC ? { executablePath: process.env.PW_EXEC } : {});
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  const so = process.argv[2] ? Number(process.argv[2]) : 0;
  const shot = async (nome, html, W, H) => {
    const src = path.join(DIR, nome + '.html'); fs.writeFileSync(src, html);
    await page.setViewportSize({ width: W, height: H });
    await page.goto('file://' + src, { waitUntil: 'networkidle' }); await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(250);
    await page.screenshot({ path: path.join(OUT, nome + '.jpg'), type: 'jpeg', quality: 94 }); console.log('✓', nome + '.jpg');
    return nome + '.jpg';
  };
  const files = [];
  for (const [i, p] of P.entries()) {
    if (so && so !== i + 1) continue;
    files.push(await shot(`bf-${String(i + 1).padStart(2, '0')}-${p.slug}`, story(p), 1080, 1920));
  }
  if (!so || so === 9) {
    files.push(await shot('bf-09-carrossel-01', capa(), 1080, 1350));
    for (const [i, p] of P.entries()) files.push(await shot(`bf-09-carrossel-${String(i + 2).padStart(2, '0')}`, slideProd(p, i), 1080, 1350));
    files.push(await shot('bf-09-carrossel-10', sorteio(1080, 1350), 1080, 1350));
    files.push(await shot('bf-09-carrossel-11', final11(), 1080, 1350));
  }
  if (!so || so === 10) files.push(await shot('bf-10-sorteio-story', sorteio(1080, 1920), 1080, 1920));
  if (so) { await browser.close(); return; }
  const cells = files.map(f => `<div class="c"><img src="saida/${f}"><span>${f}</span></div>`).join('');
  const sheet = `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>${FONTS}
body{width:2400px;background:#111;padding:60px;color:#fff} h1{font:800 54px/1 'Montserrat',sans-serif;margin-bottom:12px} p{font:600 28px/1 'Poppins',sans-serif;color:#aaa;margin-bottom:40px}
.g{display:grid;grid-template-columns:repeat(5,1fr);gap:30px;align-items:start} .c img{width:100%;display:block;border-radius:12px} .c span{display:block;margin-top:10px;font:600 20px/1 'Poppins',sans-serif;color:#ddd;text-align:center}
</style></head><body><h1>Black Friday Laet · bf-01 a bf-10</h1><p>Stories 1080 x 1920 · bf-09 = carrossel de feed 1080 x 1350 (11 slides, post de 28/11) · preços só em 27/11/2026</p><div class="g">${cells}</div></body></html>`;
  const sp = path.join(DIR, 'folha-de-contato.html'); fs.writeFileSync(sp, sheet);
  await page.setViewportSize({ width: 2400, height: 1200 });
  await page.goto('file://' + sp, { waitUntil: 'networkidle' }); await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(OUT, 'folha-de-contato.jpg'), type: 'jpeg', quality: 90, fullPage: true });
  console.log('✓ folha-de-contato.jpg');
  await browser.close();
})();
