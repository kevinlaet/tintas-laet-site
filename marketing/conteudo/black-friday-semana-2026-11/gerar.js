// Feed da semana da Black Friday (23 a 27/11/2026) — 1080x1350, padrão preto/amarelo limpo dos stories bf-01..10.
// Reaproveita o "kit" de ../../stories/2026-11/20-black-friday-produtos/gerar.js (mesmas fontes, cores, embalagens).
// REGRA FIXA: preços de Black valem SOMENTE em 27/11/2026. Antes disso, nenhuma peça mostra preço.
// Uso: PW_MOD=... PW_EXEC=... node gerar.js
const fs = require('fs');
const path = require('path');
const { chromium } = require(process.env.PW_MOD || 'playwright');
const K = require('../../stories/2026-11/20-black-friday-produtos/gerar.js');
const { P, Y, stroke, NEON, combo, slideDuo, head, foot, LOJAS, WA, CSS_F } = K;
const DIR = __dirname, OUT = path.join(DIR, 'saida');

const ICO = {
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
  gift: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M5 12v8h14v-8M12 8v12M12 8S10.5 3.5 8 4.2C6 4.8 6.6 8 12 8zm0 0s1.5-4.5 4-3.8C18 4.8 17.4 8 12 8z"/></svg>',
  seta: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
};
const RODAPE = `<div class="rodape">@Tintaslaet <i>·</i> (11) 97714-0964 <i>·</i> tintaslaet.com</div>`;
const CSS = CSS_F + `
.rodape { position:absolute; left:0; right:0; bottom:54px; text-align:center; z-index:9; font:700 26px/1 'Montserrat',sans-serif; color:#fff; }
.rodape i { font-style:normal; color:rgba(255,255,255,.4); margin:0 6px; }
.kick { position:absolute; left:0; right:0; text-align:center; z-index:9; font:800 28px/1 'Montserrat',sans-serif; letter-spacing:.32em; color:${Y}; padding-left:.32em; }
.ttl { position:absolute; left:30px; right:30px; text-align:center; z-index:9; transform:skewX(-8deg); padding-top:12px; font-family:'Bebas Neue',sans-serif; font-weight:400; line-height:.86; }
.ttl b { color:${Y}; font-weight:400; }
.pgn { position:absolute; right:60px; top:78px; z-index:9; font:700 24px/1 'Montserrat',sans-serif; color:rgba(255,255,255,.45); letter-spacing:.1em; }
.pill { position:absolute; left:60px; top:78px; z-index:9; font:800 24px/1 'Montserrat',sans-serif; letter-spacing:.16em; color:${Y}; }
.halo { position:absolute; border-radius:50%; z-index:3; background:radial-gradient(ellipse, rgba(245,184,0,.2) 0%, rgba(245,184,0,.05) 50%, rgba(0,0,0,0) 72%); }
`;
const prod = (f, cx, bottom, w, extra = '') => `<img src="img/${f}" style="position:absolute;left:${cx}px;bottom:${1350 - bottom}px;width:${w}px;transform:translateX(-50%) ${extra};z-index:6;filter:drop-shadow(0 24px 28px rgba(0,0,0,.9))">`;

// ---------------- 23/11 · Vem aí ----------------
function vemAi() {
  return head('Vem aí', CSS + `
.big { top:290px; font-size:236px; }
.laet { position:absolute; left:0; right:0; top:790px; z-index:9; display:flex; align-items:center; justify-content:center; gap:26px; }
.laet i { width:150px; height:3px; background:${Y}; box-shadow:0 0 12px rgba(245,184,0,.8); }
.laet b { font:400 104px/1 'Bebas Neue',sans-serif; color:${Y}; letter-spacing:.08em; transform:skewX(-8deg); padding-top:8px; }
.data { position:absolute; left:50%; top:950px; transform:translateX(-50%) rotate(-2deg); z-index:9; background:${Y}; color:#0A0A0A; padding:20px 56px 12px; border-radius:10px; white-space:nowrap;
  font:400 104px/1 'Bebas Neue',sans-serif; letter-spacing:.04em; box-shadow:0 0 50px rgba(245,184,0,.35), 0 20px 40px rgba(0,0,0,.6); }
.olho { position:absolute; left:0; right:0; top:1130px; z-index:9; text-align:center; font:700 44px/1 'Poppins',sans-serif; color:#fff; }
.olho b { color:${Y}; }
`) + `${NEON(1080, 1350)}
<div class="logo"><img src="img/logo-branco.png" alt="Tintas Laet"></div>
<div class="halo" style="left:40px;top:250px;width:1000px;height:640px"></div>
<div class="kick" style="top:240px">VEM AÍ</div>
<div class="ttl big">BLACK<br>FRIDAY</div>
<div class="laet"><i></i><b>LAET</b><i></i></div>
<div class="data">SEXTA · 27/11</div>
<div class="olho">Fique de olho. <b>Vem preço de Black.</b></div>
${RODAPE}` + foot;
}

// ---------------- 24/11 · Monte sua lista (3 slides) ----------------
function lista1() {
  const imgs = prod('standard.png', 540, 1230, 460) + prod('pisos.png', 260, 1250, 360, 'rotate(-7deg)') + prod('lavavel.png', 820, 1250, 320, 'rotate(7deg)');
  return head('Lista 1', CSS + `
.t1 { top:200px; font-size:176px; }
.sub { position:absolute; left:0; right:0; top:560px; text-align:center; z-index:9; font:600 36px/1.3 'Poppins',sans-serif; color:rgba(255,255,255,.85); }
.fade { position:absolute; left:0; right:0; bottom:0; height:300px; z-index:8; background:linear-gradient(180deg, rgba(5,5,5,0), #050505 70%); }
.arr { position:absolute; right:60px; bottom:58px; z-index:9; display:flex; align-items:center; gap:12px; font:700 26px/1 'Poppins',sans-serif; }
.arr svg { width:40px; height:40px; color:${Y}; }
.dt { position:absolute; left:60px; bottom:62px; z-index:9; font:700 24px/1 'Montserrat',sans-serif; letter-spacing:.14em; color:rgba(255,255,255,.55); }
`) + `${NEON(1080, 1350)}<div class="logo"><img src="img/logo-branco.png" alt="Tintas Laet"></div><div class="pgn">01/03</div>
<div class="ttl t1">MONTE SUA<br><b>LISTA DA OBRA</b></div>
${stroke(340, 528, 400, 22)}
<div class="sub">Anota o que falta pra pintar a casa.<br>Sexta é dia de comprar.</div>
<div class="halo" style="left:90px;top:760px;width:900px;height:560px"></div>${imgs}<div class="fade"></div>
<div class="dt">BLACK FRIDAY LAET · 27/11</div><div class="arr">Veja a lista ${ICO.seta}</div>` + foot;
}
function lista2() {
  const item = (n, img, t, d) => `<div class="it"><div class="ck">${ICO.check}</div><div class="pi">${img}</div><div class="tx"><span>${n}</span><b>${t}</b><p>${d}</p></div></div>`;
  return head('Lista 2', CSS + `
.t2 { top:176px; font-size:120px; }
.its { position:absolute; left:60px; right:60px; top:350px; z-index:9; display:flex; flex-direction:column; gap:22px; }
.it { position:relative; height:270px; display:flex; align-items:center; gap:28px; padding:0 34px 0 30px; border:1.5px solid rgba(245,184,0,.35); border-radius:24px; background:rgba(255,255,255,.035); }
.ck { flex:none; width:58px; height:58px; border-radius:12px; background:${Y}; color:#0A0A0A; padding:11px; }
.pi { flex:none; width:260px; height:240px; display:flex; align-items:center; justify-content:center; }
.pi img { max-width:100%; max-height:100%; filter:drop-shadow(0 16px 18px rgba(0,0,0,.85)); }
.tx span { display:block; font:800 22px/1 'Montserrat',sans-serif; letter-spacing:.2em; color:${Y}; }
.tx b { display:block; margin-top:8px; font:400 72px/.95 'Bebas Neue',sans-serif; letter-spacing:.02em; padding-top:6px; }
.tx p { margin-top:8px; font:600 27px/1.25 'Poppins',sans-serif; color:rgba(255,255,255,.75); }
`) + `${NEON(1080, 1350)}<div class="logo"><img src="img/logo-branco.png" alt="Tintas Laet"></div><div class="pgn">02/03</div>
<div class="ttl t2">SUA LISTA <b>DA OBRA</b></div>
<div class="its">
${item('1º · PREPARA', '<img src="img/barrica.png">', 'MASSA', 'Nivela e corrige a parede<br>antes de pintar.')}
${item('2º · PINTA', '<img src="img/lavavel.png" style="max-height:230px">', 'TINTA', 'A cor nova da casa, do quarto<br>à fachada.')}
${item('3º · RENOVA', '<img src="img/pisos.png">', 'PISO', 'Garagem, quintal e calçada<br>com cara de nova.')}
</div>
${RODAPE}` + foot;
}
function lista3() {
  return head('Lista 3', CSS + `
.t3 { top:330px; font-size:160px; }
.sx { position:absolute; left:50%; top:690px; transform:translateX(-50%) rotate(-2deg); z-index:9; background:${Y}; color:#0A0A0A; padding:18px 50px 10px; border-radius:10px; white-space:nowrap; font:400 92px/1 'Bebas Neue',sans-serif; letter-spacing:.04em; box-shadow:0 0 50px rgba(245,184,0,.35); }
.cta { position:absolute; left:110px; right:110px; top:870px; z-index:9; text-align:center; font:600 36px/1.35 'Poppins',sans-serif; color:rgba(255,255,255,.88); }
.cta b { color:#fff; }
.pp { position:absolute; left:0; right:0; top:1050px; z-index:9; text-align:center; font:600 24px/1 'Poppins',sans-serif; color:rgba(255,255,255,.55); }
`) + `${NEON(1080, 1350)}<div class="logo"><img src="img/logo-branco.png" alt="Tintas Laet"></div><div class="pgn">03/03</div>
<div class="halo" style="left:40px;top:300px;width:1000px;height:600px"></div>
<div class="kick" style="top:270px">LISTA PRONTA?</div>
<div class="ttl t3">SEXTA TEM<br><b>PREÇO DE BLACK</b></div>
<div class="sx">SÓ NA SEXTA · 27/11</div>
<div class="cta">Leva a lista na <b>loja mais perto de você</b><br>ou manda no WhatsApp.</div>
<div class="pp">Parcele em até 12x sem juros (consulte as condições)</div>
${RODAPE}` + foot;
}

// ---------------- 25/11 · Faltam 2 dias ----------------
function faltam2() {
  const col = (html, cx, nome, med) => `${html}
<div class="nm" style="left:${cx - 170}px">${nome}</div><div class="md" style="left:${cx - 170}px">${med}</div>
<div class="tg" style="left:${cx - 110}px"><small>R$</small><span>?</span></div>`;
  return head('Faltam 2', CSS + `
.f1 { top:196px; font-size:150px; }
.f1 em { font-style:normal; color:${Y}; font-size:1.5em; display:inline-block; transform:translateY(.06em); }
.nm, .md { position:absolute; width:340px; text-align:center; z-index:9; }
.nm { top:900px; font:400 52px/1 'Bebas Neue',sans-serif; letter-spacing:.02em; padding-top:6px; }
.md { top:956px; font:700 19px/1 'Montserrat',sans-serif; letter-spacing:.2em; color:rgba(255,255,255,.65); }
.tg { position:absolute; top:996px; width:220px; height:118px; z-index:9; border:3px dashed ${Y}; border-radius:18px; display:flex; align-items:center; justify-content:center; gap:8px; background:rgba(245,184,0,.08); }
.tg small { font:800 30px/1 'Montserrat',sans-serif; color:${Y}; margin-bottom:24px; }
.tg span { font:400 110px/1 'Bebas Neue',sans-serif; color:${Y}; padding-top:12px; }
.so { position:absolute; left:50%; top:1158px; transform:translateX(-50%); z-index:9; white-space:nowrap; font:400 52px/1 'Bebas Neue',sans-serif; letter-spacing:.05em; background:${Y}; color:#0A0A0A; padding:12px 34px 6px; border-radius:8px; }
`) + `${NEON(1080, 1350)}<div class="logo"><img src="img/logo-branco.png" alt="Tintas Laet"></div>
<div class="ttl f1">FALTAM <em>2</em> DIAS!</div>
<div class="halo" style="left:40px;top:430px;width:1000px;height:560px"></div>
${col(prod('lavavel.png', 190, 880, 300), 190, 'PREMIUM LAVÁVEL', '18L · BRANCA')}
${col(prod('pisos.png', 540, 880, 350), 540, 'PREMIUM PISOS', '17L · 13 CORES')}
${col(prod('barrica.png', 890, 880, 290), 890, 'MASSA CORRIDA', 'SACO OU BARRICA')}
<div class="so">O PREÇO? SÓ NA SEXTA, 27/11</div>
${RODAPE}` + foot;
}

// ---------------- 26/11 · É amanhã + lojas ----------------
function amanha() {
  const ord = [3, 6, 1, 2, 4, 5].map(n => LOJAS.find(l => l[0] === n)).map(l => l[0] === 6 ? [6, l[1], 'S. B. do Campo'.replace('S. B. do Campo','São Bernardo do C.'), l[3], l[4]] : l);
  const lj = ord.map(([n, b, c, e, w]) => { const br = n === 3 || n === 6; return `<div class="lj${br ? ' br' : ''}">${br ? `<div class="gf">${ICO.gift}BRINDE</div>` : ''}
<div class="t"><span class="n">LOJA ${n}</span><span class="b">${b}</span></div><div class="e">${c} · ${e}</div><div class="w">${WA}${w}</div></div>`; }).join('');
  return head('É amanhã', CSS + `
.a1 { top:168px; font-size:176px; }
.sb { position:absolute; left:0; right:0; top:350px; text-align:center; z-index:9; font:600 32px/1.2 'Poppins',sans-serif; color:rgba(255,255,255,.85); }
.sb b { color:${Y}; }
.brd { position:absolute; left:60px; right:60px; top:420px; z-index:9; display:flex; align-items:center; justify-content:center; gap:16px; background:${Y}; color:#0A0A0A; border-radius:16px; padding:18px 20px; font:800 31px/1.1 'Montserrat',sans-serif; }
.brd svg { width:40px; height:40px; flex:none; }
.grid { position:absolute; left:60px; right:60px; top:528px; z-index:9; display:grid; grid-template-columns:minmax(0,1fr) minmax(0,1fr); gap:14px; }
.lj { position:relative; border:1.5px solid rgba(255,255,255,.18); border-radius:18px; padding:24px 20px; background:rgba(255,255,255,.035); }
.lj.br { border:3px solid ${Y}; background:rgba(245,184,0,.08); padding:28px 20px; }
.gf { position:absolute; right:16px; bottom:22px; display:flex; align-items:center; gap:6px; background:${Y}; color:#0A0A0A; border-radius:20px; padding:6px 12px; font:800 17px/1 'Montserrat',sans-serif; }
.gf svg { width:20px; height:20px; }
.t { display:flex; align-items:center; gap:10px; white-space:nowrap; }
.n { background:${Y}; color:#0A0A0A; font:400 36px/1 'Bebas Neue',sans-serif; padding:5px 10px 1px; border-radius:6px; letter-spacing:.03em; }
.b { font:700 25px/1 'Montserrat',sans-serif; }
.e { margin-top:12px; font:600 18px/1.2 'Poppins',sans-serif; color:rgba(255,255,255,.72); white-space:nowrap; }
.w { margin-top:12px; display:flex; align-items:center; gap:8px; font:800 33px/1 'Montserrat',sans-serif; white-space:nowrap; }
.w svg { width:32px; height:32px; color:#25D366; }
.hr { position:absolute; left:0; right:0; top:1170px; text-align:center; z-index:9; font:600 24px/1.4 'Poppins',sans-serif; color:rgba(255,255,255,.62); }
.hr b { color:#fff; }
`) + `<div class="logo"><img src="img/logo-branco.png" alt="Tintas Laet"></div>
<div class="ttl a1">É <b>AMANHÃ!</b></div>
<div class="sb">Black Friday Laet · <b>sexta, 27/11</b> · nas 6 lojas</div>
<div class="brd">${ICO.gift}Brinde em compras acima de R$ 100 nas Lojas 3 e 6</div>
<div class="grid">${lj}</div>
<div class="hr"><b>Seg a sex 8h às 18h · Sáb 8h às 14h</b><br>Parcele em até 12x sem juros (consulte as condições)</div>
${RODAPE}` + foot;
}

// ---------------- 27/11 · Preços só hoje (capa + 4 slides de 2 produtos) ----------------
function hojeCapa() {
  const ps = ['gesso.png', 'pisos.png', 'standard.png', 'lavavel.png', 'epoxi.png'];
  const pos = [[100, 1160, -10, 300], [310, 1140, -4, 330], [540, 1130, 0, 370], [780, 1140, 5, 330], [990, 1160, 11, 290]];
  const imgs = ps.map((f, i) => { const [cx, b, r, w] = pos[i]; return prod(f, cx, b, w, `rotate(${r}deg)`).replace('z-index:6', `z-index:${i === 2 ? 7 : 6}`); }).join('');
  return head('Hoje', CSS + `
.h1 { top:204px; font-size:176px; }
.band { position:absolute; left:0; right:0; top:560px; height:108px; z-index:12; background:${Y}; display:flex; align-items:center; justify-content:center; gap:20px; box-shadow:0 0 50px rgba(245,184,0,.35); }
.band span { font:400 84px/1 'Bebas Neue',sans-serif; color:#0A0A0A; letter-spacing:.04em; padding-top:8px; }
.band i { width:13px; height:13px; border-radius:50%; background:#0A0A0A; }
.fade { position:absolute; left:0; right:0; bottom:0; height:250px; z-index:8; background:linear-gradient(180deg, rgba(5,5,5,0), #050505 72%); }
.arr { position:absolute; right:60px; bottom:58px; z-index:9; display:flex; align-items:center; gap:12px; font:700 26px/1 'Poppins',sans-serif; }
.arr svg { width:40px; height:40px; color:${Y}; }
.dt { position:absolute; left:60px; bottom:62px; z-index:9; font:700 24px/1 'Montserrat',sans-serif; letter-spacing:.14em; color:rgba(255,255,255,.55); }
`) + `${NEON(1080, 1350)}<div class="logo"><img src="img/logo-branco.png" alt="Tintas Laet"></div>
<div class="kick" style="top:168px">BLACK FRIDAY LAET</div>
<div class="ttl h1">PREÇOS<br><b>SÓ HOJE</b></div>
<div class="band"><i></i><span>VÁLIDO SÓ NA SEXTA 27/11</span><i></i></div>
<div class="halo" style="left:40px;top:740px;width:1000px;height:560px"></div>${imgs}<div class="fade"></div>
<div class="dt">8 PRODUTOS · 6 LOJAS</div><div class="arr">Veja os preços ${ICO.seta}</div>` + foot;
}
const hojeDuo = (par, idx) => slideDuo(par, idx)
  .replace('FOI ASSIM NA BLACK', 'BLACK FRIDAY LAET')
  .replace(/Na Black saiu por/g, 'Só hoje')
  .replace(/\/07<\/div>/, '/05</div>')
  .replace('<b>BLACK FRIDAY ENCERRADA</b><span>Preços válidos só em 27/11/2026</span>', '<b>VÁLIDO SÓ NA SEXTA 27/11</b><span>Parcele em até 12x sem juros (consulte as condições)</span>');

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch(process.env.PW_EXEC ? { executablePath: process.env.PW_EXEC } : {});
  const page = await browser.newPage({ viewport: { width: 1080, height: 1350 } });
  const files = [];
  const shot = async (nome, html) => {
    const src = path.join(DIR, nome + '.html'); fs.writeFileSync(src, html);
    await page.goto('file://' + src, { waitUntil: 'networkidle' }); await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(250);
    await page.screenshot({ path: path.join(OUT, nome + '.jpg'), type: 'jpeg', quality: 94 }); files.push(nome + '.jpg'); console.log('✓', nome);
  };
  await shot('feed-23-vem-ai', vemAi());
  await shot('feed-24-lista-01', lista1()); await shot('feed-24-lista-02', lista2()); await shot('feed-24-lista-03', lista3());
  await shot('feed-25-faltam-2-dias', faltam2());
  await shot('feed-26-e-amanha', amanha());
  await shot('feed-27-precos-so-hoje-01', hojeCapa());
  for (let k = 0; k < 4; k++) await shot(`feed-27-precos-so-hoje-0${k + 2}`, hojeDuo([P[k * 2], P[k * 2 + 1]], k + 2));
  // folha de contato
  const cells = files.map(f => `<div class="c"><img src="saida/${f}"><span>${f}</span></div>`).join('');
  fs.writeFileSync(path.join(DIR, 'folha.html'), `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>${K.FONTS}
body{width:2400px;background:#111;padding:60px;color:#fff} h1{font:800 54px/1 'Montserrat',sans-serif;margin-bottom:12px} p{font:600 28px/1 'Poppins',sans-serif;color:#aaa;margin-bottom:40px}
.g{display:grid;grid-template-columns:repeat(4,1fr);gap:30px} .c img{width:100%;display:block;border-radius:12px} .c span{display:block;margin-top:10px;font:600 21px/1 'Poppins',sans-serif;color:#ddd;text-align:center}
</style></head><body><h1>Semana Black Friday Laet · feed 23 a 27/11</h1><p>1080 x 1350 · preços só no post de sexta 27/11</p><div class="g">${cells}</div></body></html>`);
  await page.setViewportSize({ width: 2400, height: 1000 });
  await page.goto('file://' + path.join(DIR, 'folha.html'), { waitUntil: 'networkidle' }); await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(OUT, 'folha-de-contato.jpg'), type: 'jpeg', quality: 90, fullPage: true });
  console.log('✓ folha-de-contato');
  await browser.close();
})();
