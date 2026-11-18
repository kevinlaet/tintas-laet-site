// 8 stories de Black Friday (1080x1920), um por produto — no padrão da arte "Vem aí Black Friday Laet"
// (fundo preto texturizado, escorrido de tinta preta, linhas neon #F5B800, pincelada amarela, tipografia branca itálica forte).
// Uso: PW_EXEC=<chrome> node gerar.js   -> saida/bf-0N-*.jpg + saida/folha-de-contato.jpg
const fs = require('fs');
const path = require('path');
const { chromium } = require(process.env.PW_MOD || 'playwright');
const DIR = __dirname, OUT = path.join(DIR, 'saida');

// Preços passados pelo Kevin (18/11/2026). Benefício: só fato aprovado (aulas do Kevin / texto da própria embalagem / site).
// w = largura da embalagem na tela; top = posição vertical (a área do produto vai de ~600 a ~1180)
const P = [
  { slug: 'massa-corrida', img: 'massa.png', nome: 'Massa Corrida', medida: 'Saco 23 kg', preco: '32,99', ben: 'Nivela e corrige a parede antes de pintar.', w: 470, top: 640 },
  { slug: 'massa-acrilica', img: 'massa.png', nome: 'Massa Acrílica', medida: 'Saco 23 kg', preco: '49,99', ben: 'Pra banheiro, cozinha e área externa.', w: 470, top: 640 },
  { slug: 'direto-no-gesso', img: 'gesso.png', nome: 'Direto no Gesso', medida: '18L · Branca', preco: '139,99', ben: 'Vai direto no gesso, sem fundo preparador.', w: 549, top: 645 },
  { slug: 'epoxi', img: 'epoxi.png', nome: 'Epóxi Base Água', medida: '3,6L · Branco', preco: '99,99', ben: 'Renova o azulejo sem quebrar nada.', w: 540, top: 650 },
  { slug: 'pisos', img: 'pisos.png', nome: 'Premium Pisos', medida: '17L · 13 cores', preco: '149,99', ben: 'Pra piso e fachada, em 13 cores prontas.', w: 549, top: 645 },
  { slug: 'standard', img: 'standard.png', nome: 'Standard', medida: '18L · Branca', preco: '159,99', ben: 'Concentrada e com ótima cobertura.', w: 549, top: 645 },
  { slug: 'premium-lavavel', img: 'lavavel.png', nome: 'Premium Lavável', medida: '18L · Branca', preco: '229,99', ben: 'Rende até 200 m² no balde de 18L.', w: 450, top: 630 },
  { slug: 'vinil', img: 'vinil.png', nome: 'Básica Interna Vinil', medida: '18L · Branca', preco: '64,99', ben: 'Opção econômica pra parede de dentro.', w: 549, top: 645 },
];

const Y = '#F5B800';
const CSS = `
@font-face { font-family:'Bebas Neue'; src:url('fonts/bebas-neue-latin-400-normal.woff2') format('woff2'); }
@font-face { font-family:'Montserrat'; font-weight:700; src:url('fonts/montserrat-latin-700-normal.woff2') format('woff2'); }
@font-face { font-family:'Montserrat'; font-weight:800; src:url('fonts/montserrat-latin-800-normal.woff2') format('woff2'); }
@font-face { font-family:'Poppins'; font-weight:600; src:url('fonts/poppins-latin-600-normal.woff2') format('woff2'); }
@font-face { font-family:'Poppins'; font-weight:700; src:url('fonts/poppins-latin-700-normal.woff2') format('woff2'); }
*,*::before,*::after { margin:0; padding:0; box-sizing:border-box; }
html,body { width:1080px; height:1920px; background:#000; }
.s { position:relative; width:1080px; height:1920px; overflow:hidden; color:#fff;
  background:
    radial-gradient(ellipse 620px 560px at 14% 6%, #2c2c2c 0%, rgba(20,20,20,0) 70%),
    radial-gradient(ellipse 700px 620px at 50% 46%, rgba(245,184,0,.13) 0%, rgba(245,184,0,.03) 45%, rgba(0,0,0,0) 72%),
    linear-gradient(115deg, #0b0b0b 0%, #111 30%, #070707 55%, #0d0d0d 75%, #050505 100%); }
/* faixas diagonais escuras (como no modelo) */
.panes { position:absolute; inset:0; z-index:1; pointer-events:none;
  background:
    linear-gradient(118deg, transparent 0 58%, rgba(255,255,255,.035) 58% 70%, transparent 70% 100%),
    linear-gradient(118deg, transparent 0 74%, rgba(255,255,255,.025) 74% 82%, transparent 82% 100%),
    linear-gradient(118deg, transparent 0 8%, rgba(255,255,255,.02) 8% 18%, transparent 18% 100%); }
.grain { position:absolute; inset:0; z-index:40; pointer-events:none; opacity:.13; mix-blend-mode:overlay;
  background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='260' height='260'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 .9 0'/></filter><rect width='260' height='260' filter='url(%23n)'/></svg>"); }
.vig { position:absolute; inset:0; z-index:39; pointer-events:none; background:radial-gradient(ellipse 760px 1150px at 50% 50%, transparent 58%, rgba(0,0,0,.7) 100%); }
.fx { position:absolute; inset:0; z-index:2; pointer-events:none; }

.logo { position:absolute; left:0; right:0; top:118px; text-align:center; z-index:10; }
.logo img { height:150px; filter:drop-shadow(0 6px 16px rgba(0,0,0,.6)); }

.splash { position:absolute; left:30px; top:300px; width:1020px; height:230px; z-index:5; }
.bf { position:absolute; left:0; right:0; top:318px; z-index:8; text-align:center; white-space:nowrap;
  font:400 196px/.9 'Bebas Neue',sans-serif; letter-spacing:.005em; transform:skewX(-9deg);
  background:linear-gradient(180deg,#FFFFFF 0%,#FFFFFF 55%,#D9D9D9 100%); -webkit-background-clip:text; background-clip:text; color:transparent;
  filter:drop-shadow(0 6px 0 rgba(0,0,0,.55)) drop-shadow(0 18px 28px rgba(0,0,0,.7)); padding-top:14px; }
.laet { position:absolute; left:0; right:0; top:530px; z-index:8; display:flex; align-items:center; justify-content:center; gap:26px; }
.laet i { width:110px; height:3px; background:${Y}; box-shadow:0 0 12px rgba(245,184,0,.8); }
.laet b { font:400 92px/1 'Bebas Neue',sans-serif; color:${Y}; letter-spacing:.06em; transform:skewX(-9deg); padding-top:8px;
  text-shadow:0 0 22px rgba(245,184,0,.45), 0 6px 0 rgba(0,0,0,.5); }

.halo { position:absolute; left:50%; top:660px; width:760px; height:620px; transform:translateX(-50%); z-index:3; border-radius:50%;
  background:radial-gradient(ellipse, rgba(255,214,90,.22) 0%, rgba(245,184,0,.07) 45%, rgba(0,0,0,0) 72%); }
.floor { position:absolute; left:50%; top:1128px; width:640px; height:90px; transform:translateX(-50%); z-index:4; border-radius:50%;
  background:radial-gradient(ellipse, rgba(0,0,0,.95) 0%, rgba(0,0,0,.5) 45%, rgba(0,0,0,0) 72%); }
.prod { position:absolute; left:50%; transform:translateX(-50%); z-index:6;
  filter:drop-shadow(0 34px 34px rgba(0,0,0,.9)) drop-shadow(0 0 40px rgba(245,184,0,.16)); }

.nome { position:absolute; left:0; right:0; top:1196px; z-index:9; text-align:center; white-space:nowrap; padding-top:16px;
  font:400 var(--fs,118px)/.9 'Bebas Neue',sans-serif; color:#fff; letter-spacing:.01em; transform:skewX(-9deg);
  text-shadow:0 8px 24px rgba(0,0,0,.8); }
.med { position:absolute; left:50%; top:1328px; z-index:9; transform:translateX(-50%) skewX(-12deg); background:${Y}; padding:11px 34px 10px;
  box-shadow:0 10px 24px rgba(0,0,0,.6); white-space:nowrap; }
.med span { display:block; transform:skewX(12deg); font:800 34px/1 'Montserrat',sans-serif; color:#0A0A0A; letter-spacing:.08em; }
.preco { position:absolute; left:0; right:0; top:1394px; z-index:9; display:flex; justify-content:center; align-items:flex-start; gap:14px; transform:skewX(-9deg); }
.preco small { font:800 62px/1 'Montserrat',sans-serif; color:${Y}; margin-top:48px; }
.preco span { font:400 214px/.8 'Bebas Neue',sans-serif; color:${Y}; padding-top:30px; letter-spacing:.005em;
  text-shadow:0 0 34px rgba(245,184,0,.35), 0 8px 0 rgba(0,0,0,.55); }
.ben { position:absolute; left:60px; right:60px; top:1612px; z-index:9; text-align:center; font:600 37px/1.2 'Poppins',sans-serif; color:#fff; }
.btn { position:absolute; left:50%; top:1670px; transform:translateX(-50%); z-index:9; background:${Y}; color:#0A0A0A; border-radius:22px; padding:18px 70px 17px;
  font:800 44px/1 'Montserrat',sans-serif; box-shadow:0 14px 30px rgba(0,0,0,.6), 0 0 30px rgba(245,184,0,.25); white-space:nowrap; }
.l1 { position:absolute; left:0; right:0; top:1766px; z-index:9; text-align:center; font:700 26px/1 'Poppins',sans-serif; color:#fff; }
.l2 { position:absolute; left:0; right:0; top:1802px; z-index:9; text-align:center; font:700 27px/1 'Poppins',sans-serif; color:#fff; }
.l2 b { color:#F5B800; }
`;

// Pincelada seca amarela atrás do "BLACK FRIDAY" (SVG: forma + fibras nas pontas + textura), sem IA
function splash() {
  let fib = '';
  let s = 3; const r = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  for (let i = 0; i < 70; i++) {
    const y = 60 + r() * 180, len = 60 + r() * 220, w = 1 + r() * 4.5, op = .35 + r() * .6;
    if (r() < .5) fib += `<rect x="${40 - len * .6 + r() * 60}" y="${y}" width="${len}" height="${w}" rx="${w / 2}" opacity="${op}"/>`;
    else fib += `<rect x="${1000 - len * .4 - r() * 60}" y="${y}" width="${len}" height="${w}" rx="${w / 2}" opacity="${op}"/>`;
  }
  return `<svg class="splash" viewBox="0 0 1040 300" style="transform:rotate(-7deg)">
<defs><filter id="dry" x="-10%" y="-30%" width="120%" height="160%">
<feTurbulence type="fractalNoise" baseFrequency="0.012 0.35" numOctaves="4" seed="11" result="t"/>
<feDisplacementMap in="SourceGraphic" in2="t" scale="38" xChannelSelector="R" yChannelSelector="G" result="d"/>
<feTurbulence type="fractalNoise" baseFrequency="0.004 0.9" numOctaves="2" seed="4" result="s"/>
<feColorMatrix in="s" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.1 1.55" result="m"/>
<feComposite in="d" in2="m" operator="in"/></filter>
<linearGradient id="yl" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFCF33"/><stop offset=".5" stop-color="${Y}"/><stop offset="1" stop-color="#D99A00"/></linearGradient>
<radialGradient id="glw" cx=".5" cy=".5" r=".6"><stop offset="0" stop-color="${Y}" stop-opacity=".35"/><stop offset="1" stop-color="${Y}" stop-opacity="0"/></radialGradient></defs>
<ellipse cx="520" cy="150" rx="520" ry="150" fill="url(#glw)"/>
<g filter="url(#dry)" fill="url(#yl)">
<path d="M90,70 C260,42 520,38 760,50 C860,55 940,62 990,80 C1000,130 996,190 980,232 C820,250 560,256 330,250 C210,247 120,240 70,226 C52,180 56,110 90,70 Z"/>
${fib}
</g></svg>`;
}

// Escorrido de tinta preta brilhante no canto superior esquerdo + linhas neon diagonais
const DRIPS = (() => {
  // [x, comprimento, largura]
  const drips = [[22, 330, 30], [70, 190, 22], [118, 420, 34], [168, 250, 24], [214, 150, 18], [256, 310, 28], [304, 120, 16], [346, 200, 22]];
  let d = 'M0,0 L400,0 L400,38 ';
  drips.slice().reverse().forEach(([x, h, w]) => { const a = w / 2;
    d += `C${x + a + 14},52 ${x + a},70 ${x + a},${h - a} C${x + a},${h + a * 1.2} ${x - a},${h + a * 1.2} ${x - a},${h - a} C${x - a},70 ${x - a - 14},52 ${x - a - 26},46 `; });
  d += 'L0,52 Z';
  const hl = drips.map(([x, h, w]) => `<path d="M${x - w * .18},78 L${x - w * .18},${h - w * .7}" stroke="rgba(255,255,255,.38)" stroke-width="${Math.max(2, w * .12)}" fill="none" stroke-linecap="round"/><ellipse cx="${x - w * .2}" cy="${h - w * .1}" rx="${w * .16}" ry="${w * .26}" fill="rgba(255,255,255,.6)"/>`).join('');
  return `<svg class="fx" viewBox="0 0 1080 1920"><defs>
<linearGradient id="ink" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3a3a3a"/><stop offset=".45" stop-color="#121212"/><stop offset="1" stop-color="#000"/></linearGradient>
<filter id="nglow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
<filter id="dsh"><feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#000" flood-opacity=".8"/></filter></defs>
<g filter="url(#dsh)"><path d="${d}" fill="url(#ink)"/>${hl}</g>
<g filter="url(#nglow)" stroke="${Y}" fill="none" stroke-linecap="round">
<path d="M1100,330 L760,1010" stroke-width="4.5"/><path d="M1100,520 L840,1040" stroke-width="2" opacity=".6"/>
<path d="M1100,1150 L960,1430" stroke-width="4"/><path d="M1100,1300 L1010,1480" stroke-width="2" opacity=".6"/>
<path d="M-20,1480 L200,1040" stroke-width="3.5"/><path d="M-20,1560 L120,1280" stroke-width="2" opacity=".55"/>
</g></svg>`;
})();

function html(p) {
  const fs_ = p.nome.length > 16 ? 100 : 118;
  return `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><title>BF ${p.nome}</title><style>${CSS}</style></head><body>
<div class="s">
<div class="panes"></div>
${DRIPS}
<div class="logo"><img src="img/logo-branco.png" alt="Tintas Laet"></div>
${splash()}
<div class="bf">BLACK FRIDAY</div>
<div class="laet"><i></i><b>LAET · 27/11</b><i></i></div>
<div class="halo"></div><div class="floor"></div>
<img class="prod" src="img/${p.img}" style="width:${p.w}px;top:${p.top}px" alt="${p.nome}">
<div class="nome" style="--fs:${fs_}px">${p.nome.toUpperCase()}</div>
<div class="med"><span>${p.medida.toUpperCase()}</span></div>
<div class="preco"><small>R$</small><span>${p.preco}</span></div>
<div class="ben">${p.ben}</div>
<div class="btn">tintaslaet.com</div>
<div class="l1">Parcele em até 12x sem juros (consulte as condições)</div>
<div class="l2">Preços válidos <b>somente em 27/11/2026</b></div>
<div class="vig"></div><div class="grain"></div>
</div></body></html>`;
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch(process.env.PW_EXEC ? { executablePath: process.env.PW_EXEC } : {});
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  const files = [];
  const so = process.argv[2] ? Number(process.argv[2]) : 0;
  for (const [i, p] of P.entries()) {
    if (so && so !== i + 1) continue;
    const nome = `bf-${String(i + 1).padStart(2, '0')}-${p.slug}`;
    const src = path.join(DIR, nome + '.html');
    fs.writeFileSync(src, html(p));
    await page.goto('file://' + src, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(OUT, nome + '.jpg'), type: 'jpeg', quality: 94 });
    files.push(nome + '.jpg'); console.log('✓', nome + '.jpg');
  }
  if (so) { await browser.close(); return; }
  const cells = files.map(f => `<div class="c"><img src="saida/${f}"><span>${f}</span></div>`).join('');
  const sheet = `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
@font-face { font-family:'Montserrat'; font-weight:800; src:url('fonts/montserrat-latin-800-normal.woff2') format('woff2'); }
@font-face { font-family:'Poppins'; font-weight:600; src:url('fonts/poppins-latin-600-normal.woff2') format('woff2'); }
*{margin:0;padding:0;box-sizing:border-box} body{width:2160px;background:#111;padding:60px;font-family:'Poppins',sans-serif;color:#fff}
h1{font:800 54px/1 'Montserrat',sans-serif;margin-bottom:12px} p{font:600 28px/1 'Poppins',sans-serif;color:#aaa;margin-bottom:40px}
.g{display:grid;grid-template-columns:repeat(4,1fr);gap:36px} .c img{width:100%;display:block;border-radius:14px} .c span{display:block;margin-top:12px;font:600 24px/1 'Poppins',sans-serif;color:#ddd;text-align:center}
</style></head><body><h1>Black Friday Laet · 8 stories</h1><p>1080 x 1920 · um por produto</p><div class="g">${cells}</div></body></html>`;
  const sp = path.join(DIR, 'folha-de-contato.html'); fs.writeFileSync(sp, sheet);
  await page.setViewportSize({ width: 2160, height: 1200 });
  await page.goto('file://' + sp, { waitUntil: 'networkidle' }); await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(OUT, 'folha-de-contato.jpg'), type: 'jpeg', quality: 90, fullPage: true });
  console.log('✓ folha-de-contato.jpg');
  await browser.close();
})();
