// Black Friday Laet · sexta 27/11/2026 · carrossel de preços (6), tabela feed e tabela story.
// Preços passados pelo Kevin em 24/11/2026 — conferir aqui antes de qualquer mudança.
const { chromium } = require("playwright"); const fs = require("fs"), path = require("path");
const E = __dirname + "/emb/";   // embalagens reais recortadas no conteúdo (de identidade/embalagens)
const uri = (p) => "data:image/" + (p.endsWith(".png") ? "png" : "jpeg") + ";base64," + fs.readFileSync(p).toString("base64");
const LOGO = uri("/home/user/tintas-laet-site/identidade/logotipo branco-remove-bg-io.png");
const ZAP = '<svg viewBox="0 0 24 24" width="1em" height="1em"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm4.5 12.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1-1.4-.7-2.4-1.4-3.3-3-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.5l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.2s1 2.6 1.1 2.7c.1.2 1.9 2.9 4.6 4.1 1.7.7 2.4.8 3.2.7.5-.1 1.5-.6 1.8-1.2.2-.6.2-1.1.1-1.2l-.1-.7z"/></svg>';

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
const LOJAS = [[1, "Sapopemba · Vila Bela", "São Paulo"], [2, "Jardim São João", "Mauá"], [3, "Jardim Santa Cecília", "Mauá"], [4, "Vila Luzita", "Santo André"], [5, "Jardim Itapark", "Mauá"], [6, "Santa Terezinha", "São Bernardo do Campo"]];

const CSS = (W, H) => `*{margin:0;padding:0;box-sizing:border-box}html,body{width:${W}px;height:${H}px;overflow:hidden}
body{background:#0A0A0F;color:#fff;font-family:'Poppins',sans-serif;position:relative}
body::before{content:"";position:absolute;inset:0;background:radial-gradient(ellipse 900px 600px at 80% 0%,rgba(245,184,0,.10),transparent 70%)}
.m{font-family:'Montserrat',sans-serif;font-weight:800;letter-spacing:-.02em}
.am{color:#F5B800}
.tag{display:inline-block;background:#F5B800;color:#0A0A0F;font-family:'Montserrat';font-weight:800;font-size:26px;letter-spacing:.12em;padding:12px 22px 10px;border-radius:10px}
.logo{position:absolute;width:auto}
.preco{display:flex;align-items:flex-start;gap:8px;line-height:.9}
.preco small{font-family:'Montserrat';font-weight:800;font-size:.32em;margin-top:.22em;color:#F5B800}
.preco b{font-family:'Montserrat';font-weight:800;color:#F5B800;letter-spacing:-.03em}
.rod{position:absolute;left:64px;right:64px;color:rgba(255,255,255,.72);font-size:21px;line-height:1.45;text-align:center}
.rod b{color:#fff;font-weight:600}
.cta{position:absolute;left:64px;right:64px;display:flex;align-items:center;justify-content:center;gap:14px;background:#F5B800;color:#0A0A0F;border-radius:999px;font-family:'Montserrat';font-weight:800}
.cta svg{flex:none}
.linha{height:1px;background:rgba(255,255,255,.14)}`;
const pag = (W, H, corpo) => `<!doctype html><html><head><meta charset="utf-8"><link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@800&family=Poppins:wght@400;600;700&display=swap" rel="stylesheet"><style>${CSS(W, H)}</style></head><body>${corpo}</body></html>`;
const AVISO = `Preços válidos <b>só na sexta 27/11</b> · Preços para tinta branca<br>Parcele em até 12x sem juros (consulte as condições)`;
const ctaF = (bottom) => `<div class="cta" style="bottom:${bottom}px;padding:22px;font-size:34px">${ZAP}<span>Chama no WhatsApp ou passa na loja</span></div>`;
const contatos = (bottom) => `<div class="rod" style="bottom:${bottom}px;font-size:22px;color:#fff"><b>(11) 97714-0964</b> · @tintaslaet · tintaslaet.com</div>`;

// --- slide de 2 produtos
const item = (k) => {
  const p = P[k];
  return `<div style="display:flex;align-items:center;gap:40px;height:430px">
    <div style="flex:none;width:360px;height:420px;display:flex;align-items:center;justify-content:center;background:radial-gradient(circle at 50% 55%,rgba(255,255,255,.08),transparent 68%)">
      <img src="${uri(E + p.img)}" style="max-width:350px;max-height:400px;filter:drop-shadow(0 24px 30px rgba(0,0,0,.6))"></div>
    <div style="flex:1;min-width:0">
      <div class="m" style="font-size:52px;line-height:1.02">${p.nome}</div>
      <div style="font-size:30px;color:rgba(255,255,255,.75);margin-top:8px">${p.tam}</div>
      <div class="preco" style="font-size:132px;margin-top:18px"><small>R$</small><b>${p.preco}</b></div>
      ${p.extra ? `<div style="margin-top:16px;font-size:30px;color:#fff"><span style="color:rgba(255,255,255,.7)">${p.extra[0]}</span> <span class="m am" style="font-size:40px">R$ ${p.extra[1]}</span></div>` : ""}
    </div></div>`;
};
const topo = (n) => `<div style="position:absolute;left:64px;right:64px;top:56px;display:flex;align-items:center;justify-content:space-between">
  <div class="tag">BLACK FRIDAY · SEXTA 27/11</div><img src="${LOGO}" style="height:96px"></div>
  ${n ? `<div style="position:absolute;right:64px;top:166px;font-size:22px;color:rgba(255,255,255,.45);font-weight:600">${n}/6</div>` : ""}`;
const dupla = (a, b, n) => pag(1080, 1350, `${topo(n)}
  <div style="position:absolute;left:64px;right:64px;top:215px">${item(a)}<div class="linha" style="margin:22px 0"></div>${item(b)}</div>
  ${ctaF(150)}<div class="rod" style="bottom:46px">${AVISO}</div>`);

// --- capa
const capa = pag(1080, 1350, `<img src="${LOGO}" class="logo" style="left:50%;transform:translateX(-50%);top:70px;height:170px">
  <div style="position:absolute;left:0;right:0;top:300px;text-align:center">
    <div class="m" style="font-size:150px;line-height:.92">BLACK<br><span class="am">FRIDAY</span></div>
    <div class="m" style="font-size:56px;margin-top:22px">LAET</div>
    <div style="display:inline-block;margin-top:34px;border:3px solid #F5B800;border-radius:18px;padding:16px 34px">
      <div class="m am" style="font-size:64px">SEXTA 27/11</div>
      <div style="font-size:32px;font-weight:600;margin-top:4px">Preços só nesse dia</div></div>
  </div>
  <div style="position:absolute;left:0;right:0;top:1000px;display:flex;justify-content:center;align-items:flex-end;gap:10px">
    ${["epoxi", "lavavel", "standard", "pisos", "gesso"].map((k, i) => `<img src="${uri(E + P[k].img)}" style="height:${[170, 210, 230, 210, 170][i]}px;filter:drop-shadow(0 18px 22px rgba(0,0,0,.6))">`).join("")}</div>
  <div class="rod" style="bottom:46px">${AVISO}</div>
  <div style="position:absolute;right:64px;top:70px;font-size:22px;color:rgba(255,255,255,.45);font-weight:600">1/6</div>`);

// --- final: lojas + brinde
const final = pag(1080, 1350, `${topo(6)}
  <div style="position:absolute;left:64px;right:64px;top:200px"><div class="m" style="font-size:68px;line-height:1.02">Sexta tem preço<br>assim nas <span class="am">6 lojas</span>.</div></div>
  <div style="position:absolute;left:64px;right:64px;top:400px;display:grid;grid-template-columns:1fr 1fr;gap:16px">
   ${LOJAS.map(([n, b, c]) => `<div style="border-radius:18px;padding:20px 22px;${n === 3 || n === 6 ? "background:#F5B800;color:#0A0A0F" : "background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.14)"}">
     <div class="m" style="font-size:26px;letter-spacing:.08em;${n === 3 || n === 6 ? "" : "color:#F5B800"}">LOJA ${n}</div>
     <div style="font-size:28px;font-weight:700;margin-top:4px;line-height:1.15">${b}</div><div style="font-size:23px;opacity:.75">${c}</div>
     ${n === 3 || n === 6 ? `<div style="margin-top:8px;font-size:22px;font-weight:700">+ brinde acima de R$ 100</div>` : ""}</div>`).join("")}</div>
  <div style="position:absolute;left:64px;right:64px;top:1010px;text-align:center;font-size:27px;font-weight:600"><span class="am">Lojas 3 e 6:</span> compra acima de R$ 100 ganha um brinde.</div>
  ${ctaF(150)}<div class="rod" style="bottom:46px">${AVISO}<br>(11) 97714-0964 · @tintaslaet · tintaslaet.com</div>`);

// --- tabela (feed e story): tudo em coluna, sem sobreposição
const tabela = (W, H, story) => {
  const f = story ? { row: 96, nome: 36, tam: 25, pr: 50, ex: 28, hd: 22 } : { row: 78, nome: 30, tam: 22, pr: 42, ex: 24, hd: 19 };
  const rows = ORDEM.map((k, i) => {
    const p = P[k];
    return `<div style="display:grid;grid-template-columns:1.5fr .9fr 1.1fr;align-items:center;height:${f.row}px;padding:0 24px;${i % 2 ? "" : "background:rgba(255,255,255,.055);"}border-radius:12px">
      <div class="m" style="font-size:${f.nome}px;line-height:1.05">${p.nome}</div>
      <div style="font-size:${f.tam}px;color:rgba(255,255,255,.75);line-height:1.2">${p.tam}${p.extra ? `<br>${p.extra[0]}` : ""}</div>
      <div style="text-align:right;line-height:1.02"><span class="m am" style="font-size:${f.pr}px">R$ ${p.preco}</span>${p.extra ? `<br><span class="m" style="font-size:${f.ex}px">R$ ${p.extra[1]}</span>` : ""}</div></div>`;
  }).join("");
  const pad = story ? "230px 40px 240px" : "52px 40px 34px";
  return pag(W, H, `<div style="position:absolute;inset:0;padding:${pad};display:flex;flex-direction:column">
    <div style="padding:0 24px;display:flex;align-items:center;justify-content:space-between"><div class="tag">BLACK FRIDAY · SEXTA 27/11</div><img src="${LOGO}" style="height:${story ? 110 : 90}px"></div>
    <div style="padding:0 24px;margin-top:${story ? 40 : 22}px"><div class="m" style="font-size:${story ? 66 : 52}px;line-height:1">Preços da <span class="am">Black Friday</span></div>
      <div style="font-size:${story ? 30 : 25}px;margin-top:8px;color:rgba(255,255,255,.8)">Salva e mostra no balcão.</div></div>
    <div style="margin-top:${story ? 36 : 22}px;display:grid;grid-template-columns:1.5fr .9fr 1.1fr;padding:0 24px 10px;font-size:${f.hd}px;letter-spacing:.14em;color:rgba(255,255,255,.5);font-weight:600"><div>PRODUTO</div><div>TAMANHO</div><div style="text-align:right">PREÇO</div></div>
    <div>${rows}</div>
    <div style="flex:1"></div>
    <div style="text-align:center;font-size:${story ? 30 : 24}px;font-weight:600;margin-bottom:${story ? 26 : 16}px"><span class="am">Lojas 3 e 6:</span> compra acima de R$ 100 ganha um brinde.</div>
    <div style="display:flex;align-items:center;justify-content:center;gap:14px;background:#F5B800;color:#0A0A0F;border-radius:999px;font-family:Montserrat;font-weight:800;padding:${story ? 26 : 20}px;font-size:${story ? 38 : 32}px">${ZAP}<span>Chama no WhatsApp ou passa na loja</span></div>
    <div style="margin-top:${story ? 22 : 14}px;text-align:center;color:rgba(255,255,255,.72);font-size:${story ? 24 : 19}px;line-height:1.45">${AVISO}<br>(11) 97714-0964 · @tintaslaet · tintaslaet.com</div>
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
  const b = await chromium.launch(); fs.mkdirSync(path.join(__dirname, "final"), { recursive: true });
  for (const [n, [h, W, H]] of Object.entries(SAIDA)) {
    const p = await b.newPage({ viewport: { width: W, height: H } });
    await p.setContent(h, { waitUntil: "networkidle" }); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(250);
    await p.screenshot({ path: path.join(__dirname, "final", n + ".png") }); await p.close();
  }
  await b.close(); console.log("ok");
})();
