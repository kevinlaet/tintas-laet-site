// Carrossel Black Friday Laet · sexta 27/11/2026 · estilo ENCARTE DE VAREJO (escolha do Kevin, 24/11).
// Capa + 4 slides de preço (2 produtos cada) com CTA. 1080x1350. Embalagens = fotos reais (emb/).
const { chromium } = require("playwright"); const fs = require("fs"), path = require("path");
const D = __dirname, E = D + "/emb/";
const uri = (p) => "data:image/png;base64," + fs.readFileSync(p).toString("base64");
const IMG = {}; for (const k of ["lavavel", "emborrachada", "standard", "gesso", "vinil", "epoxi", "pisos", "barrica", "saco", "logo"]) IMG[k] = uri(E + k + ".png");

// Preços do Kevin (24/11/2026) — conferidos no fim do script.
const P = {
  corrida:  { nome: "Massa Corrida", tam: "Saco 23kg", preco: "32,99", barrica: "40,99" },
  acrilica: { nome: "Massa Acrílica", tam: "Saco 23kg", preco: "49,99", barrica: "57,99" },
  vinil:    { nome: "Básica Interna Vinil", tam: "18L · branca", preco: "64,99", img: "vinil" },
  gesso:    { nome: "Direto no Gesso", tam: "18L · branca", preco: "139,99", img: "gesso" },
  standard: { nome: "Standard", tam: "18L · branca", preco: "159,99", img: "standard" },
  lavavel:  { nome: "Premium Lavável", tam: "18L · branca", preco: "229,99", img: "lavavel" },
  epoxi:    { nome: "Epóxi Base Água", tam: "3,6L · branco", preco: "99,99", img: "epoxi", h: 380 },
  pisos:    { nome: "Premium Pisos", tam: "17L · 13 cores do catálogo", preco: "149,99", img: "pisos" },
};
const LEGAL = "Válido só sexta 27/11 · Preços para tinta branca (Pisos: 13 cores do catálogo) · Parcele em até 12x sem juros (consulte as condições)";
const ZAP = '<svg viewBox="0 0 24 24" width="1em" height="1em"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm4.5 12.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1-1.4-.7-2.4-1.4-3.3-3-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.5l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.2s1 2.6 1.1 2.7c.1.2 1.9 2.9 4.6 4.1 1.7.7 2.4.8 3.2.7.5-.1 1.5-.6 1.8-1.2.2-.6.2-1.1.1-1.2l-.1-.7z"/></svg>';
const SALVAR = '<svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round"><path d="M6 3h12v18l-6-4.5L6 21z"/></svg>';
const GRAO = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

// estrela de oferta (selo de encarte)
const estrela = (r, pontas = 22) => { let pts = []; for (let i = 0; i < pontas * 2; i++) { const a = Math.PI * i / pontas, rr = i % 2 ? r * .84 : r; pts.push(`${(r + rr * Math.cos(a)).toFixed(1)},${(r + rr * Math.sin(a)).toFixed(1)}`); } return `<svg width="${2 * r}" height="${2 * r}" style="position:absolute;inset:0"><polygon points="${pts.join(" ")}" fill="#F5B800"/></svg>`; };
const selo = (x, y, r, l1, l2, rot = 10) => `<div style="position:absolute;left:${x - r}px;top:${y - r}px;width:${2 * r}px;height:${2 * r}px;transform:rotate(${rot}deg);z-index:12;filter:drop-shadow(0 10px 18px rgba(0,0,0,.55))">${estrela(r)}
  <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#0A0A0F;font-family:'Montserrat';font-weight:900;text-align:center;line-height:.95">
  <span style="font-size:${Math.round(r * .26)}px;letter-spacing:.02em">${l1}</span><span style="font-size:${Math.round(r * .44)}px;letter-spacing:-.03em">${l2}</span></div></div>`;

const CSS = `*{margin:0;padding:0;box-sizing:border-box}html,body{width:1080px;height:1350px;overflow:hidden}
body{background:#0A0A0F;color:#fff;font-family:'Poppins',sans-serif;position:relative}
.bg{position:absolute;inset:0;background:radial-gradient(ellipse 820px 640px at 50% 44%,rgba(245,184,0,.22),transparent 70%),linear-gradient(180deg,#121219 0%,#0A0A0F 60%,#050507 100%)}
.raios{position:absolute;inset:0;background:repeating-conic-gradient(from 0deg at 50% 44%,rgba(245,184,0,.09) 0deg 5deg,transparent 5deg 15deg);-webkit-mask-image:radial-gradient(circle at 50% 44%,#000 0,transparent 66%);mask-image:radial-gradient(circle at 50% 44%,#000 0,transparent 66%)}
.grao{position:absolute;inset:0;background-image:${GRAO};opacity:.07;mix-blend-mode:overlay}
.m{font-family:'Montserrat',sans-serif;font-weight:900;letter-spacing:-.03em;text-transform:uppercase}
.am{color:#F5B800}
.fita{position:absolute;left:-90px;right:-90px;height:72px;background:#F5B800;color:#0A0A0F;display:flex;align-items:center;white-space:nowrap;overflow:hidden;font-family:'Montserrat';font-weight:900;font-size:32px;letter-spacing:.1em;box-shadow:0 14px 30px rgba(0,0,0,.6);z-index:10}
.fita.br{background:#fff}
.logo{position:absolute;z-index:11;filter:drop-shadow(0 6px 16px rgba(0,0,0,.6))}
.card{position:absolute;border-radius:30px;background:radial-gradient(ellipse 380px 300px at 50% 28%,#2A2A35 0%,#17171E 60%,#111116 100%);border:2px solid rgba(245,184,0,.28);box-shadow:0 26px 50px rgba(0,0,0,.55)}
.lata{position:absolute;left:50%;transform:translateX(-50%);filter:drop-shadow(0 24px 24px rgba(0,0,0,.6));z-index:5}
.sombra{position:absolute;left:50%;transform:translateX(-50%);height:34px;border-radius:50%;background:radial-gradient(ellipse,rgba(0,0,0,.85),transparent 70%);z-index:4}
.nome{font-family:'Montserrat';font-weight:900;text-transform:uppercase;letter-spacing:-.02em;line-height:1}
.tam{font-weight:600;color:rgba(255,255,255,.72)}
.tag{position:absolute;display:flex;align-items:flex-start;background:#F5B800;color:#0A0A0F;border-radius:16px;padding:14px 26px 6px 22px;font-family:'Montserrat';font-weight:900;letter-spacing:-.05em;line-height:.86;box-shadow:0 16px 30px rgba(0,0,0,.55);z-index:8}
.tag .rs{font-size:.3em;letter-spacing:0;margin:.12em .14em 0 0}.tag .cent{font-size:.42em;letter-spacing:-.02em;margin-top:.04em;border-bottom:.07em solid #0A0A0F;padding-bottom:.02em}
.tag::after{content:"PREÇO BLACK";position:absolute;left:22px;top:-26px;background:#0A0A0F;color:#F5B800;font-size:17px;letter-spacing:.14em;padding:6px 12px 4px;border-radius:8px 8px 0 0;line-height:1}
.cta{position:absolute;left:60px;right:60px;top:1104px;height:86px;border-radius:20px;background:#F5B800;color:#0A0A0F;display:flex;align-items:center;justify-content:center;gap:16px;font-family:'Montserrat';font-weight:900;font-size:35px;letter-spacing:-.02em;text-transform:uppercase;box-shadow:0 14px 30px rgba(245,184,0,.2)}
.contato{position:absolute;left:0;right:0;top:1204px;text-align:center;font-size:23px;font-weight:600}
.rod{position:absolute;left:70px;right:70px;bottom:44px;text-align:center;font-size:16px;font-weight:500;line-height:1.45;color:rgba(255,255,255,.6)}`;
const pag = (c) => `<!doctype html><html><head><meta charset="utf-8"><link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@800;900&family=Poppins:wght@500;600&display=swap" rel="stylesheet"><style>${CSS}</style></head><body><div class="bg"></div><div class="raios"></div><div class="grao"></div>${c}<div class="rod">${LEGAL}</div></body></html>`;
const rep = (t, n = 8) => `<span>${(t + "  •  ").repeat(n)}</span>`;
const tag = (v, fs, x, y, rot = -3) => { const [a, b] = v.split(","); return `<div class="tag" style="left:${x}px;top:${y}px;font-size:${fs}px;transform:rotate(${rot}deg)"><span class="rs">R$</span>${a}<span class="cent">,${b}</span></div>`; };
const lata = (img, h, cx, base) => `<div class="sombra" style="left:${cx}px;top:${base - 20}px;width:${Math.round(h * .78)}px"></div><img class="lata" src="${IMG[img]}" style="left:${cx}px;top:${base - h}px;height:${h}px">`;
const topo = `<div class="fita" style="top:34px;transform:rotate(-2.5deg)">${rep("BLACK FRIDAY LAET • SÓ SEXTA 27/11")}</div>
  <img class="logo" src="${IMG.logo}" style="left:64px;top:150px;height:84px">${selo(948, 196, 92, "SÓ SEXTA", "27/11", 10)}`;
const CTA = `<div class="cta">${ZAP}Chama no WhatsApp ou passa na loja</div><div class="contato">(11) 97714-0964 · @tintaslaet · tintaslaet.com</div>`;

// cartão de produto: lata estoura o topo do cartão, nome, tamanho, etiqueta de preço
const cartao = (k, x) => { const p = P[k], h = p.h || 440, tamNome = p.nome.length > 15 ? 42 : 48; return `<div class="card" style="left:${x}px;top:330px;width:460px;height:740px"></div>
  ${lata(p.img, h, x + 230, 330 + 420)}
  <div style="position:absolute;left:${x + 34}px;width:400px;top:772px;height:96px;display:flex;flex-direction:column;justify-content:flex-end"><div class="nome" style="font-size:${tamNome}px">${p.nome}</div></div>
  <div class="tam" style="position:absolute;left:${x + 34}px;top:878px;font-size:24px">${p.tam}</div>
  ${tag(p.preco, p.preco.length > 5 ? 118 : 132, x + 26, 948)}`; };
const dupla = (a, b) => pag(`${topo}${cartao(a, 60)}${cartao(b, 560)}${CTA}`);

const massas = pag(`${topo}
  <div class="card" style="left:60px;top:700px;width:460px;height:370px"></div><div class="card" style="left:560px;top:700px;width:460px;height:370px"></div>
  ${lata("barrica", 420, 470, 732)}<div class="sombra" style="left:640px;top:716px;width:200px"></div><img class="lata" src="${IMG.saco}" style="left:650px;top:478px;height:258px;z-index:6">
  ${["corrida", "acrilica"].map((k, j) => { const p = P[k], x = 60 + j * 500; return `
    <div class="nome" style="position:absolute;left:${x + 34}px;top:750px;font-size:46px">${p.nome}</div>
    <div class="tam" style="position:absolute;left:${x + 34}px;top:806px;font-size:24px">${p.tam}</div>
    ${tag(p.preco, 128, x + 26, 872)}
    <div style="position:absolute;left:${x + 34}px;top:1014px;display:flex;align-items:baseline;gap:10px;z-index:9"><span class="tam" style="font-size:22px">Barrica</span><span class="m" style="font-size:36px;letter-spacing:-.02em;white-space:nowrap">R$ ${p.barrica}</span></div>`; }).join("")}
  ${CTA}`);

const capa = pag(`<div class="fita" style="top:40px;transform:rotate(-2.5deg)">${rep("BLACK FRIDAY LAET • SÓ SEXTA 27/11")}</div>
  <img class="logo" src="${IMG.logo}" style="left:64px;top:150px;height:96px">
  <div style="position:absolute;left:0;right:0;top:276px;text-align:center;z-index:6"><div class="m" style="font-size:190px;line-height:.84">Black</div><div class="m am" style="font-size:190px;line-height:.84">Friday</div></div>
  ${selo(940, 196, 98, "SÓ SEXTA", "27/11", 12)}
  <div style="position:absolute;left:0;right:0;top:620px;height:440px;z-index:5">
    ${[["gesso", 150, 250], ["lavavel", 310, 300], ["standard", 770, 300], ["pisos", 930, 250], ["emborrachada", 540, 380]].map(([k, cx, h]) => `<div class="sombra" style="left:${cx}px;top:${404}px;width:${Math.round(h * .8)}px"></div><img class="lata" src="${IMG[k]}" style="left:${cx}px;top:${424 - h}px;height:${h}px;z-index:${h}">`).join("")}</div>
  <div class="fita br" style="top:1066px;transform:rotate(2deg);height:80px;font-size:34px">${rep("PREÇOS QUE SÓ VALEM NESSE DIA")}</div>
  <div style="position:absolute;left:0;right:0;top:1186px;display:flex;justify-content:space-between;padding:0 64px;font-size:24px;font-weight:600;align-items:center">
    <span style="display:flex;align-items:center;gap:10px;color:#FFE082">${SALVAR}Salva pra lembrar na sexta</span>
    <span style="display:flex;align-items:center;gap:10px">Arrasta e veja os preços <b class="am" style="font-size:32px">→</b></span></div>`);

const SLIDES = { "01": capa, "02": massas, "03": dupla("vinil", "gesso"), "04": dupla("standard", "lavavel"), "05": dupla("epoxi", "pisos") };

const PEDIDO = { corrida: "32,99", acrilica: "49,99", vinil: "64,99", gesso: "139,99", standard: "159,99", lavavel: "229,99", epoxi: "99,99", pisos: "149,99" };
for (const [k, v] of Object.entries(PEDIDO)) if (P[k].preco !== v) throw new Error("PREÇO ERRADO " + k);
if (P.corrida.barrica !== "40,99" || P.acrilica.barrica !== "57,99") throw new Error("PREÇO BARRICA ERRADO");

(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  const out = path.join(D, "final-encarte"); fs.mkdirSync(out, { recursive: true });
  for (const [n, h] of Object.entries(SLIDES)) {
    await p.setContent(h, { waitUntil: "networkidle" }); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(250);
    await p.screenshot({ path: path.join(out, n + ".png") });
  }
  await b.close(); console.log("ok, preços conferidos");
})();
