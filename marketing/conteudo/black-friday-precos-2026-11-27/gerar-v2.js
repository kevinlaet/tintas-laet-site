// Black Friday Laet · sexta 27/11/2026 · v2 (redesenho): cartões de produto com etiqueta de preço,
// luz de vitrine, fitas da campanha (mesmo DNA do story "Black Friday vem aí" de 28/10), rodapé numa linha.
const { chromium } = require("playwright"); const fs = require("fs"), path = require("path");
const E = __dirname + "/emb/";
const uri = (p) => "data:image/" + (p.endsWith(".png") ? "png" : "jpeg") + ";base64," + fs.readFileSync(p).toString("base64");
const LOGO = uri("/home/user/tintas-laet-site/identidade/logotipo branco-remove-bg-io.png");
const ZAP = '<svg viewBox="0 0 24 24" width="1em" height="1em"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm4.5 12.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1-1.4-.7-2.4-1.4-3.3-3-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.5l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.2s1 2.6 1.1 2.7c.1.2 1.9 2.9 4.6 4.1 1.7.7 2.4.8 3.2.7.5-.1 1.5-.6 1.8-1.2.2-.6.2-1.1.1-1.2l-.1-.7z"/></svg>';

// Preços do Kevin (24/11/2026) — iguais à v1, conferidos por script.
const P = {
  corrida:  { nome: "Massa Corrida", tam: "Saco 23kg", preco: "32,99", extra: ["Barrica", "40,99"], img: "barrica+plastico.png" },
  acrilica: { nome: "Massa Acrílica", tam: "Saco 23kg", preco: "49,99", extra: ["Barrica", "57,99"], img: "barrica+plastico.png" },
  gesso:    { nome: "Direto no Gesso", tam: "18L branca", preco: "139,99", img: "direto no gesso-remove-bg-io.png" },
  epoxi:    { nome: "Epóxi Base Água", tam: "3,6L branco", preco: "99,99", img: "epoxibaseagua.png" },
  pisos:    { nome: "Premium Pisos", tam: "17L · 13 cores", preco: "149,99", img: "pisos efachadas-remove-bg-io.png" },
  standard: { nome: "Standard", tam: "18L branca", preco: "159,99", img: "standard-remove-bg-io.png" },
  lavavel:  { nome: "Premium Lavável", tam: "18L branca", preco: "229,99", img: "premiumlavavel-remove-bg-io.png" },
  vinil:    { nome: "Básica Interna Vinil", tam: "18L branca", preco: "64,99", img: "vinil-remove-bg-io.png" },
};
const ORDEM = ["corrida", "acrilica", "gesso", "epoxi", "pisos", "standard", "lavavel", "vinil"];
const LOJAS = [[1, "Sapopemba", "São Paulo"], [2, "Jd. São João", "Mauá"], [3, "Jd. Santa Cecília", "Mauá"], [4, "Vila Luzita", "Santo André"], [5, "Jd. Itapark", "Mauá"], [6, "Santa Terezinha", "São Bernardo do Campo"]];

const GRAO = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.5'/%3E%3C/svg%3E")`;
const CSS = (W, H) => `*{margin:0;padding:0;box-sizing:border-box}html,body{width:${W}px;height:${H}px;overflow:hidden}
body{background:#0A0A0F;color:#fff;font-family:'Poppins',sans-serif;position:relative}
.bg{position:absolute;inset:0;background:radial-gradient(ellipse 760px 520px at 50% 46%,rgba(245,184,0,.16),transparent 70%),radial-gradient(ellipse 1200px 700px at 50% 110%,rgba(255,255,255,.06),transparent 70%),linear-gradient(180deg,#111118 0%,#0A0A0F 55%,#050508 100%)}
.bg::after{content:"";position:absolute;inset:0;background-image:${GRAO};opacity:.08;mix-blend-mode:overlay}
.raios{position:absolute;inset:0;background:repeating-conic-gradient(from 0deg at 50% 44%,rgba(245,184,0,.045) 0deg 6deg,transparent 6deg 18deg);-webkit-mask-image:radial-gradient(circle at 50% 44%,#000 0,transparent 62%);mask-image:radial-gradient(circle at 50% 44%,#000 0,transparent 62%)}
.m{font-family:'Montserrat',sans-serif;font-weight:900;letter-spacing:-.03em}
.am{color:#F5B800}
.fita{position:absolute;left:-80px;right:-80px;height:66px;background:#F5B800;color:#0A0A0F;display:flex;align-items:center;white-space:nowrap;overflow:hidden;font-family:'Montserrat';font-weight:900;font-size:30px;letter-spacing:.12em;box-shadow:0 14px 34px rgba(0,0,0,.55);z-index:6}
.fita.br{background:#fff}
.logo{position:absolute;left:50%;transform:translateX(-50%);z-index:7;filter:drop-shadow(0 6px 18px rgba(0,0,0,.6))}
/* cartão de produto */
.card{position:relative;border-radius:34px;background:linear-gradient(180deg,#1B1B24 0%,#111117 100%);border:1px solid rgba(255,255,255,.10);box-shadow:0 30px 60px rgba(0,0,0,.55),inset 0 1px 0 rgba(255,255,255,.08);overflow:visible}
.card .luz{position:absolute;left:50%;top:40px;width:420px;height:300px;transform:translateX(-50%);background:radial-gradient(ellipse,rgba(245,184,0,.22),transparent 68%)}
.card .chao{position:absolute;left:50%;transform:translateX(-50%);width:70%;height:40px;border-radius:50%;background:radial-gradient(ellipse,rgba(0,0,0,.75),transparent 70%)}
.card img{position:absolute;left:50%;transform:translateX(-50%);filter:drop-shadow(0 22px 26px rgba(0,0,0,.65))}
.nome{font-family:'Montserrat';font-weight:800;letter-spacing:-.01em;line-height:1.05}
.tam{color:rgba(255,255,255,.68);font-weight:500}
/* etiqueta de preço */
.tag{position:relative;display:inline-flex;align-items:flex-start;gap:6px;background:#F5B800;color:#0A0A0F;border-radius:14px 22px 22px 14px;padding:10px 24px 8px 44px;max-width:392px;box-shadow:0 14px 26px rgba(0,0,0,.45);clip-path:polygon(22px 0,100% 0,100% 100%,22px 100%,0 50%)}
.tag::before{content:"";position:absolute;left:20px;top:50%;width:14px;height:14px;margin-top:-7px;border-radius:50%;background:#1B1B24}
.tag small{font-family:'Montserrat';font-weight:900;font-size:.34em;margin-top:.3em}
.tag b{font-family:'Montserrat';font-weight:900;letter-spacing:-.04em;line-height:.92}
.cta{position:absolute;display:flex;align-items:center;justify-content:center;gap:14px;background:#F5B800;color:#0A0A0F;border-radius:999px;font-family:'Montserrat';font-weight:900;box-shadow:0 14px 34px rgba(245,184,0,.22)}
.legal{position:absolute;left:0;right:0;text-align:center;color:rgba(255,255,255,.62);font-weight:500;white-space:nowrap}
.legal b{color:#F5B800;font-weight:700}
.pag{position:absolute;right:56px;font-family:'Montserrat';font-weight:800;color:rgba(255,255,255,.4);z-index:8}`;
const pag = (W, H, c) => `<!doctype html><html><head><meta charset="utf-8"><link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@800;900&family=Poppins:wght@500;600;700&display=swap" rel="stylesheet"><style>${CSS(W, H)}</style></head><body><div class="bg"></div>${c}</body></html>`;
const rep = (t, n = 10) => `<span>${(t + "  ·  ").repeat(n)}</span>`;
const LEGAL = `Válido <b>só na sexta 27/11</b> · preços para tinta branca · parcele em até 12x sem juros (consulte as condições)`;
const legal = (bottom, fs = 19) => `<div class="legal" style="bottom:${bottom}px;font-size:${fs}px">${LEGAL}</div>`;
const cta = (bottom, w = 720, fs = 32) => `<div class="cta" style="left:50%;transform:translateX(-50%);width:${w}px;bottom:${bottom}px;padding:22px 0;font-size:${fs}px">${ZAP}Chama no WhatsApp ou passa na loja</div>`;
const tag = (preco, fs) => `<div class="tag"><small style="font-size:${Math.round(fs*0.34)}px;margin-top:${Math.round(fs*0.12)}px">R$</small><b style="font-size:${fs}px">${preco}</b></div>`;

// cartão vertical (2 por slide, lado a lado)
const card = (k) => {
  const p = P[k];
  return `<div class="card" style="width:456px;height:${p.extra ? 800 : 730}px">
    <div class="luz"></div>
    <div class="chao" style="top:${p.extra ? 404 : 420}px"></div>
    <img src="${uri(E + p.img)}" style="top:${p.extra ? 26 : 46}px;height:${p.extra ? 410 : 384}px">
    <div style="position:absolute;left:34px;right:30px;top:470px">
      <div class="nome" style="font-size:${p.nome.length > 15 ? 38 : 44}px">${p.nome}</div>
      <div class="tam" style="font-size:26px;margin-top:6px">${p.tam}</div>
      <div style="margin-top:20px">${tag(p.preco, p.preco.length > 5 ? 84 : 96)}</div>
      ${p.extra ? `<div style="margin-top:18px;display:flex;align-items:center;gap:14px"><span class="tam" style="font-size:26px">${p.extra[0]}</span><span class="m" style="font-size:44px;color:#fff">R$ ${p.extra[1]}</span></div>` : ""}
    </div></div>`;
};
const topoSlide = (n) => `<div class="fita" style="top:40px;transform:rotate(-2.5deg)">${rep("BLACK FRIDAY LAET · SÓ SEXTA 27/11")}</div>
  <div class="pag" style="top:128px;font-size:22px">${n}/6</div>`;
const dupla = (a, b, n, titulo) => pag(1080, 1350, `<div class="raios"></div>${topoSlide(n)}
  <img class="logo" src="${LOGO}" style="top:116px;height:118px">
  <div style="position:absolute;left:56px;right:56px;top:276px;display:flex;justify-content:space-between;align-items:flex-start">${card(a)}${card(b)}</div>
  ${cta(96)}${legal(40)}`);

// capa
const capa = pag(1080, 1350, `<div class="raios"></div>
  <div class="fita" style="top:58px;transform:rotate(-3deg)">${rep("BLACK FRIDAY · LAET")}</div>
  <img class="logo" src="${LOGO}" style="top:160px;height:150px">
  <div style="position:absolute;left:0;right:0;top:330px;text-align:center;z-index:5">
    <div class="m" style="font-size:176px;line-height:.86">BLACK</div>
    <div class="m am" style="font-size:176px;line-height:.86">FRIDAY</div>
  </div>
  <div style="position:absolute;left:50%;top:640px;transform:translateX(-50%) rotate(-3deg);z-index:6;background:#fff;color:#0A0A0F;border-radius:16px;padding:14px 34px 12px;text-align:center;box-shadow:0 16px 34px rgba(0,0,0,.5)">
    <div class="m" style="font-size:58px;line-height:1">SÓ SEXTA 27/11</div>
    <div style="font-size:26px;font-weight:700;margin-top:2px">Preços só nesse dia</div></div>
  <div style="position:absolute;left:0;right:0;top:800px;height:340px;z-index:4">
    <div style="position:absolute;left:50%;bottom:6px;width:900px;height:70px;transform:translateX(-50%);border-radius:50%;background:radial-gradient(ellipse,rgba(0,0,0,.85),transparent 70%)"></div>
    ${[["epoxi", 150, 230], ["gesso", 300, 270], ["lavavel", 540, 330], ["standard", 780, 270], ["pisos", 930, 230]].map(([k, cx, h]) => `<img src="${uri(E + P[k].img)}" style="position:absolute;left:${cx}px;bottom:20px;height:${h}px;transform:translateX(-50%);filter:drop-shadow(0 20px 24px rgba(0,0,0,.7));z-index:${h}">`).join("")}
  </div>
  ${cta(96)}${legal(40)}
  <div class="pag" style="top:150px;font-size:22px">1/6</div>`);

// final: lojas + brinde
const final = pag(1080, 1350, `${topoSlide(6)}
  <img class="logo" src="${LOGO}" style="top:122px;height:100px">
  <div style="position:absolute;left:56px;right:56px;top:250px;text-align:center"><div class="m" style="font-size:72px;line-height:1">Nas <span class="am">6 lojas</span> Laet</div>
    <div style="font-size:28px;color:rgba(255,255,255,.75);margin-top:10px">ABC e Zona Leste · sexta, 27/11</div></div>
  <div style="position:absolute;left:56px;right:56px;top:420px;display:grid;grid-template-columns:1fr 1fr;gap:18px">
   ${LOJAS.map(([n, b, c]) => { const d = n === 3 || n === 6; return `<div style="height:150px;border-radius:24px;padding:22px 26px;display:flex;flex-direction:column;justify-content:center;${d ? "background:#F5B800;color:#0A0A0F;box-shadow:0 16px 30px rgba(245,184,0,.18)" : "background:linear-gradient(180deg,#1B1B24,#111117);border:1px solid rgba(255,255,255,.10)"}">
     <div class="m" style="font-size:22px;letter-spacing:.12em;${d ? "" : "color:#F5B800"}">LOJA ${n}${d ? " · COM BRINDE" : ""}</div>
     <div class="nome" style="font-size:34px;margin-top:6px">${b}</div><div style="font-size:22px;opacity:.75;font-weight:600">${c}</div></div>`; }).join("")}</div>
  <div style="position:absolute;left:56px;right:56px;top:950px;border:2px dashed rgba(245,184,0,.6);border-radius:22px;padding:20px;text-align:center">
    <div class="m" style="font-size:31px;white-space:nowrap">🎁 Lojas 3 e 6: <span class="am">compra acima de R$ 100 ganha brinde.</span></div></div>
  ${cta(150)}
  <div class="legal" style="bottom:96px;font-size:22px;color:#fff;font-weight:600">(11) 97714-0964 · @tintaslaet · tintaslaet.com</div>${legal(40)}`);

// tabela com miniatura (feed e story)
const tabela = (W, H, story) => {
  const r = story ? { h: 118, img: 92, nome: 34, tam: 22, pr: 54, ex: 26 } : { h: 96, img: 76, nome: 30, tam: 20, pr: 46, ex: 22 };
  const linhas = ORDEM.map((k) => {
    const p = P[k];
    return `<div style="display:flex;align-items:center;gap:20px;height:${r.h}px;padding:0 22px 0 14px;border-radius:20px;background:linear-gradient(180deg,#1B1B24,#121218);border:1px solid rgba(255,255,255,.08);margin-bottom:10px">
      <div style="flex:none;width:${r.img}px;height:${r.img}px;display:flex;align-items:center;justify-content:center"><img src="${uri(E + p.img)}" style="max-width:${r.img}px;max-height:${r.img}px;filter:drop-shadow(0 8px 10px rgba(0,0,0,.6))"></div>
      <div style="flex:1;min-width:0"><div class="nome" style="font-size:${r.nome}px">${p.nome}</div><div class="tam" style="font-size:${r.tam}px;margin-top:2px">${p.tam}${p.extra ? ` · ${p.extra[0]} R$ ${p.extra[1]}` : ""}</div></div>
      <div class="m am" style="flex:none;font-size:${r.pr}px;line-height:1;white-space:nowrap"><span style="font-size:.42em;vertical-align:.9em;margin-right:4px">R$</span>${p.preco}</div></div>`;
  }).join("");
  const pad = story ? "250px 52px 250px" : "120px 52px 30px";
  return pag(W, H, `${story ? `<div class="fita" style="top:120px;transform:rotate(-2.5deg)">${rep("BLACK FRIDAY LAET · SÓ SEXTA 27/11")}</div>` : `<div class="fita" style="top:30px;transform:rotate(-2deg)">${rep("BLACK FRIDAY LAET · SÓ SEXTA 27/11")}</div>`}
    <div style="position:absolute;inset:0;padding:${pad};display:flex;flex-direction:column">
      <div style="display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:${story ? 34 : 22}px">
        <div><div class="m" style="font-size:${story ? 70 : 58}px;line-height:.95">Tabela da<br><span class="am">Black Friday</span></div>
        <div style="font-size:${story ? 28 : 23}px;color:rgba(255,255,255,.75);margin-top:10px;font-weight:600">Salva e mostra no balcão 📌</div></div>
        <img src="${LOGO}" style="height:${story ? 120 : 96}px;filter:drop-shadow(0 6px 18px rgba(0,0,0,.6))"></div>
      ${linhas}
      <div style="flex:1"></div>
      <div style="text-align:center;font-size:${story ? 28 : 22}px;font-weight:700;margin:${story ? 10 : 4}px 0 ${story ? 22 : 14}px">🎁 <span class="am">Lojas 3 e 6:</span> compra acima de R$ 100 ganha um brinde.</div>
      <div style="display:flex;align-items:center;justify-content:center;gap:14px;background:#F5B800;color:#0A0A0F;border-radius:999px;font-family:Montserrat;font-weight:900;padding:${story ? 26 : 20}px;font-size:${story ? 36 : 30}px">${ZAP}Chama no WhatsApp ou passa na loja</div>
      <div style="text-align:center;color:rgba(255,255,255,.62);font-size:${story ? 22 : 17}px;margin-top:${story ? 18 : 12}px;line-height:1.5;font-weight:500">${LEGAL}<br><span style="color:#fff;font-weight:600">(11) 97714-0964 · @tintaslaet · tintaslaet.com</span></div>
    </div>`);
};

const SAIDA = {
  "01-carrossel-capa": [capa, 1080, 1350],
  "02-carrossel-massas": [dupla("corrida", "acrilica", 2), 1080, 1350],
  "03-carrossel-gesso-standard": [dupla("gesso", "standard", 3), 1080, 1350],
  "04-carrossel-lavavel-pisos": [dupla("lavavel", "pisos", 4), 1080, 1350],
  "05-carrossel-epoxi-vinil": [dupla("epoxi", "vinil", 5), 1080, 1350],
  "06-carrossel-lojas": [final, 1080, 1350],
  "07-tabela-feed": [tabela(1080, 1350, false), 1080, 1350],
  "08-tabela-story": [tabela(1080, 1920, true), 1080, 1920],
};
(async () => {
  const b = await chromium.launch(); const out = path.join(__dirname, "final-v2"); fs.mkdirSync(out, { recursive: true });
  for (const [n, [h, W, H]] of Object.entries(SAIDA)) {
    const p = await b.newPage({ viewport: { width: W, height: H } });
    await p.setContent(h, { waitUntil: "networkidle" }); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(250);
    await p.screenshot({ path: path.join(out, n + ".png") }); await p.close();
  }
  await b.close(); console.log("ok");
})();
