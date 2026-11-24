// Carrossel Black Friday Laet · sexta 27/11/2026 · 6 slides 1080x1350.
// Faixa de tinta contínua (faixa.png, feita por pincelada.py) atravessa os 6 slides. Embalagens = fotos reais.
const { chromium } = require("playwright"); const fs = require("fs"), path = require("path");
const D = __dirname, E = D + "/emb/";
const uri = (p) => "data:image/png;base64," + fs.readFileSync(p).toString("base64");
const IMG = {}; for (const k of ["lavavel", "emborrachada", "standard", "gesso", "vinil", "epoxi", "pisos", "barrica", "saco", "logo"]) IMG[k] = uri(E + k + ".png");
const FAIXA = uri(D + "/faixa.png");

// Preços do Kevin (24/11/2026). Conferidos no fim do script contra esta mesma lista.
const P = {
  corrida:  { nome: "Massa Corrida", tam: "Saco 23kg", preco: "32,99", barrica: "40,99", ben: "Nivela a parede de quarto e sala." },
  acrilica: { nome: "Massa Acrílica", tam: "Saco 23kg", preco: "49,99", barrica: "57,99", ben: "Pra banheiro, cozinha e área externa." },
  vinil:    { nome: "Básica Interna Vinil", tam: "18L · branca", preco: "64,99", img: "vinil", ben: "Econômica, pra parede interna." },
  gesso:    { nome: "Direto no Gesso", tam: "18L · branca", preco: "139,99", img: "gesso", ben: "Não precisa de fundo preparador." },
  standard: { nome: "Standard", tam: "18L · branca", preco: "159,99", img: "standard", ben: "Concentrada e com boa cobertura." },
  lavavel:  { nome: "Premium Lavável", tam: "18L · branca", preco: "229,99", img: "lavavel", ben: "Fácil de limpar. Dentro e fora de casa." },
  epoxi:    { nome: "Epóxi Base Água", tam: "3,6L · branco", preco: "99,99", img: "epoxi", ben: "Renova o azulejo sem quebrar nada.", h: 360 },
  pisos:    { nome: "Premium Pisos", tam: "17L · 13 cores do catálogo", preco: "149,99", img: "pisos", ben: "Aguenta carro, chuva e sol." },
};
const LOJAS = [[1, "Sapopemba", "São Paulo"], [2, "Jd. São João", "Mauá"], [3, "Jd. Santa Cecília", "Mauá"], [4, "Vila Luzita", "Santo André"], [5, "Jd. Itapark", "Mauá"], [6, "Santa Terezinha", "São Bernardo do Campo"]];
const LEGAL = "Válido só sexta 27/11 · Preços para tinta branca (Pisos: 13 cores do catálogo) · Parcele em até 12x sem juros (consulte as condições)";
// cartela (cores da paleta oficial, identidade/cores/paleta-oficial.json)
const CARTELA = ["#DD5047", "#FAA628", "#EDB946", "#4FAF65", "#3C93F8", "#6B24A2"];

const GRAO = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;
const ZAP = '<svg viewBox="0 0 24 24" width="1em" height="1em"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm4.5 12.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1-1.4-.7-2.4-1.4-3.3-3-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.5l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.2s1 2.6 1.1 2.7c.1.2 1.9 2.9 4.6 4.1 1.7.7 2.4.8 3.2.7.5-.1 1.5-.6 1.8-1.2.2-.6.2-1.1.1-1.2l-.1-.7z"/></svg>';
const SALVAR = '<svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M6 3h12v18l-6-4.5L6 21z"/></svg>';
const PRESENTE = '<svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M5 12v9h14v-9M12 8v13M12 8S10.5 3 8 3.6C5.8 4.2 7 8 12 8zm0 0s1.5-5 4-4.4C18.2 4.2 17 8 12 8z"/></svg>';

const CSS = `*{margin:0;padding:0;box-sizing:border-box}html,body{width:1080px;height:1350px;overflow:hidden}
body{background:#0A0A0F;color:#fff;font-family:'Poppins',sans-serif;position:relative}
.faixa{position:absolute;inset:0;background-size:6480px 1350px;background-repeat:no-repeat}
.vin{position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.45) 0%,rgba(0,0,0,0) 16%,rgba(0,0,0,0) 82%,rgba(0,0,0,.5) 100%)}
.grao{position:absolute;inset:0;background-image:${GRAO};opacity:.07;mix-blend-mode:overlay}
.logo{position:absolute;left:80px;top:80px;height:64px;z-index:9}
.t{font-family:'Montserrat',sans-serif;font-weight:800;text-transform:uppercase;letter-spacing:-.02em;line-height:.92}
.am{color:#F5B800}
.nome{position:absolute;left:0;right:0;top:180px;height:112px;display:flex;align-items:flex-end;font-family:'Montserrat';font-weight:800;text-transform:uppercase;font-size:40px;line-height:1.02;letter-spacing:-.01em}
.lata{position:absolute;left:50%;transform:translateX(-50%);filter:drop-shadow(0 18px 22px rgba(0,0,0,.45)) drop-shadow(0 2px 3px rgba(0,0,0,.35))}
.refl{position:absolute;left:50%;transform:translateX(-50%) scaleY(-1);opacity:.16;-webkit-mask-image:linear-gradient(0deg,#000 0%,transparent 22%);mask-image:linear-gradient(0deg,#000 0%,transparent 22%)}
.sombra{position:absolute;left:50%;transform:translateX(-50%);height:30px;border-radius:50%;background:radial-gradient(ellipse,rgba(40,25,0,.75) 0%,rgba(40,25,0,.35) 45%,transparent 72%)}
.preco{position:absolute;left:0;top:782px;display:flex;align-items:flex-start;font-family:'Bebas Neue',sans-serif;color:#F5B800;line-height:.82}
.preco .rs{font-size:46px;margin:12px 8px 0 0}.preco .int{font-size:176px;letter-spacing:-.01em}.preco .cent{font-size:76px;margin-top:8px}
.tam{position:absolute;left:0;top:952px;font-size:24px;font-weight:500;color:rgba(255,255,255,.68)}
.ben{position:absolute;left:0;right:10px;font-size:26px;font-weight:500;line-height:1.3}
.rod{position:absolute;left:80px;right:80px;bottom:80px;font-size:17px;font-weight:500;line-height:1.45;color:rgba(255,255,255,.58)}
.salva{position:absolute;left:80px;top:1160px;display:flex;align-items:center;gap:10px;font-size:22px;font-weight:600;color:#FFE082}`;
const pag = (i, c) => `<!doctype html><html><head><meta charset="utf-8"><link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Montserrat:wght@800&family=Poppins:wght@500;600&display=swap" rel="stylesheet"><style>${CSS}</style></head><body>
<div class="faixa" style="background-image:url('${FAIXA}');background-position:${-i * 1080}px 0"></div><div class="vin"></div><div class="grao"></div>
<img class="logo" src="${IMG.logo}">${c}
<div class="salva">${SALVAR}<span>Salva pra lembrar na sexta</span></div>
<div class="rod">${LEGAL}</div></body></html>`;

const preco = (v, top) => { const [a, b] = v.split(","); return `<div class="preco"${top ? ` style="top:${top}px"` : ""}><span class="rs">R$</span><span class="int">${a}</span><span class="cent">,${b}</span></div>`; };
// lata real em estúdio: sombra de contato + reflexo curto. base = y do pé da lata.
const lata = (img, h, cx, base, z = 2) => `<div class="sombra" style="left:${cx}px;top:${base - 18}px;width:${Math.round(h * .72)}px;z-index:${z}"></div>
  <img class="refl" src="${IMG[img]}" style="left:${cx}px;top:${base}px;height:${h}px;z-index:${z}">
  <img class="lata" src="${IMG[img]}" style="left:${cx}px;top:${base - h}px;height:${h}px;z-index:${z + 1}">`;
const BASE = 748;
const coluna = (k, x) => { const p = P[k]; return `<div style="position:absolute;left:${x}px;top:0;width:440px;height:1350px">
  <div class="nome">${p.nome}</div>${lata(p.img, p.h || 420, 220, BASE)}
  ${preco(p.preco)}<div class="tam">${p.tam}</div><div class="ben" style="top:996px">${p.ben}</div></div>`; };
const dupla = (i, a, b) => pag(i, coluna(a, 80) + coluna(b, 560));

const capa = pag(0, `<div class="t" style="position:absolute;left:80px;top:178px;font-size:136px">Black<br>Friday<br><span class="am">Laet</span></div>
  <div style="position:absolute;left:80px;top:566px;font-size:30px;font-weight:500;color:rgba(255,255,255,.88)">Sexta, 27/11 · Preços que só valem nesse dia</div>
  ${lata("lavavel", 318, 282, 1028, 2)}${lata("standard", 318, 798, 1028, 2)}${lata("emborrachada", 392, 540, 1034, 5)}
  <div style="position:absolute;right:80px;top:1160px;font-size:22px;font-weight:600;color:#fff;display:flex;align-items:center;gap:10px">Arrasta e veja os preços <span style="color:#F5B800;font-size:28px;line-height:1">→</span></div>`);

const massas = pag(1, `${["corrida", "acrilica"].map((k, j) => { const p = P[k]; return `<div style="position:absolute;left:${80 + j * 480}px;top:0;width:440px;height:1350px">
    <div class="nome" style="top:150px">${p.nome}</div>${preco(p.preco)}<div class="tam">${p.tam}</div>
    <div style="position:absolute;left:0;top:992px;display:flex;align-items:baseline;gap:10px"><span style="font-size:24px;font-weight:500;color:rgba(255,255,255,.68)">Barrica</span><span style="font-family:'Bebas Neue';font-size:50px;color:#fff;line-height:1">R$ ${p.barrica}</span></div>
    <div class="ben" style="top:1052px;font-size:24px">${p.ben}</div></div>`; }).join("")}
  ${lata("barrica", 400, 478, BASE, 2)}${lata("saco", 236, 668, BASE + 6, 4)}`);

const lojas = pag(5, `<div style="position:absolute;right:96px;top:70px;width:220px;height:250px">${CARTELA.map((c, j) => `<div style="position:absolute;left:84px;bottom:0;width:58px;height:236px;border-radius:9px;background:#F4F2EC;box-shadow:0 8px 18px rgba(0,0,0,.45);transform-origin:50% 92%;transform:rotate(${-34 + j * 11}deg);overflow:hidden"><div style="height:176px;background:${c}"></div></div>`).join("")}
    <div style="position:absolute;left:96px;bottom:8px;width:34px;height:34px;border-radius:50%;background:#2a2a30;border:3px solid #F4F2EC"></div></div>
  <div class="t" style="position:absolute;left:80px;top:182px;font-size:116px">Vem pra<br><span class="am">loja</span></div>
  <div style="position:absolute;left:80px;top:410px;font-size:28px;font-weight:500;color:rgba(255,255,255,.75)">6 lojas no ABC e Zona Leste</div>
  <div style="position:absolute;left:80px;right:80px;top:478px">${LOJAS.map(([n, b, c]) => `<div style="display:flex;align-items:center;height:70px;border-top:1px solid rgba(255,255,255,.12)${n === 6 ? ";border-bottom:1px solid rgba(255,255,255,.12)" : ""}">
      <span style="font-family:'Bebas Neue';font-size:44px;color:#F5B800;width:70px;line-height:1">0${n}</span>
      <span style="font-family:'Montserrat';font-weight:800;font-size:29px;letter-spacing:-.01em">${b}</span><span style="font-size:22px;font-weight:500;color:rgba(255,255,255,.6);margin-left:14px">${c}</span>
      ${n === 3 || n === 6 ? `<span style="margin-left:auto;background:#F5B800;color:#0A0A0F;font-weight:600;font-size:18px;letter-spacing:.08em;padding:5px 12px 3px;border-radius:8px">BRINDE</span>` : ""}</div>`).join("")}</div>
  <div style="position:absolute;left:80px;right:80px;top:924px;display:flex;align-items:center;justify-content:center;gap:12px;border:2px solid #F5B800;border-radius:14px;height:62px;font-size:24px;font-weight:600"><span style="color:#F5B800;font-size:28px;display:flex">${PRESENTE}</span>Lojas 3 e 6: compra acima de R$ 100 ganha brinde</div>
  <div style="position:absolute;left:80px;right:80px;top:1006px;height:92px;border-radius:999px;background:#F5B800;color:#0A0A0F;display:flex;align-items:center;justify-content:center;gap:16px;font-family:'Montserrat';font-weight:800;font-size:34px;letter-spacing:-.01em">${ZAP}Chama no WhatsApp ou passa na loja</div>
  <div style="position:absolute;left:80px;right:80px;top:1110px;text-align:center;font-size:22px;font-weight:600">(11) 97714-0964 · @tintaslaet · tintaslaet.com</div>`.replace('<div class="salva">', ""));

const SLIDES = { "01": capa, "02": massas, "03": dupla(2, "vinil", "gesso"), "04": dupla(3, "standard", "lavavel"), "05": dupla(4, "epoxi", "pisos"), "06": lojas };

// conferência dos preços contra a lista do pedido
const PEDIDO = { corrida: "32,99", acrilica: "49,99", vinil: "64,99", gesso: "139,99", standard: "159,99", lavavel: "229,99", epoxi: "99,99", pisos: "149,99" };
for (const [k, v] of Object.entries(PEDIDO)) if (P[k].preco !== v) throw new Error("PREÇO ERRADO " + k);
if (P.corrida.barrica !== "40,99" || P.acrilica.barrica !== "57,99") throw new Error("PREÇO BARRICA ERRADO");

(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 1 });
  const out = path.join(D, "final"); fs.mkdirSync(out, { recursive: true });
  for (const [n, h] of Object.entries(SLIDES)) {
    await p.setContent(h, { waitUntil: "networkidle" }); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(250);
    await p.screenshot({ path: path.join(out, n + ".png") });
  }
  await b.close(); console.log("ok, preços conferidos");
})();
