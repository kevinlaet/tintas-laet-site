// Banners da Loja 6 — 60 x 100 cm (1 px de desenho = 0,5 mm; 1200 x 2000).
// Saída: PDF no tamanho real (vetorial, texto nítido) + PNG 150 dpi + prévia.
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const A = path.join(__dirname, "assets"); // embalagens/fotos copiadas de identidade/ e marketing/imagem das lojas/
const uri = (f) => `data:image/${f.endsWith(".jpg") ? "jpeg" : "png"};base64,${fs.readFileSync(path.join(A, f)).toString("base64")}`;
const OUT = process.argv[2] || path.join(__dirname, "saida");
fs.mkdirSync(OUT, { recursive: true });

const ZAP_LOJA6 = "(11) 91875-5095";
const TAMANHOS = {};
for (const f of fs.readdirSync(A).filter((x) => x.startsWith("rec-"))) {
  const b = fs.readFileSync(path.join(A, f)); TAMANHOS[f] = [b.readUInt32BE(16), b.readUInt32BE(20)];
}
const ICONE = {
  zap: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1-1.4-.7-2.4-1.4-3.3-3-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.5l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.2s1 2.6 1.1 2.7c.1.2 1.9 2.9 4.6 4.1 1.7.7 2.4.8 3.2.7.5-.1 1.5-.6 1.8-1.2.2-.6.2-1.1.1-1.2l-.1-.7z"/></svg>`,
  insta: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 8.2a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4zM17.3 5.5a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4zM21.9 7.1c-.1-1.6-.4-3-1.6-4.2S17.6 1.3 16 1.2C14.3 1.1 9.7 1.1 8 1.2c-1.6.1-3 .4-4.2 1.6S2.2 5.5 2.1 7.1C2 8.8 2 13.4 2.1 15.1c.1 1.6.4 3 1.6 4.2s2.6 1.5 4.2 1.6c1.7.1 6.3.1 8 0 1.6-.1 3-.4 4.2-1.6s1.5-2.6 1.6-4.2c.1-1.7.1-6.3.2-8zm-2.2 10.3a3.3 3.3 0 0 1-1.8 1.8c-1.3.5-4.3.4-5.9.4s-4.6.1-5.9-.4a3.3 3.3 0 0 1-1.8-1.8c-.5-1.3-.4-4.3-.4-5.9s-.1-4.6.4-5.9a3.3 3.3 0 0 1 1.8-1.8c1.3-.5 4.3-.4 5.9-.4s4.6-.1 5.9.4a3.3 3.3 0 0 1 1.8 1.8c.5 1.3.4 4.3.4 5.9s.1 4.6-.4 5.9z"/></svg>`,
  site: `<svg viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2" d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM2 12h20M12 2c2.8 3 4 6.3 4 10s-1.2 7-4 10c-2.8-3-4-6.3-4-10s1.2-7 4-10z"/></svg>`,
  ok: `<svg viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round" d="M5 12.5l4.5 4.5L19 7.5"/></svg>`,
  pin: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"/></svg>`,
};

// Diagonal: sobe da esquerda (yE) pra direita (yD).
const seam = (yE, yD) => ({ yE, yD, ang: (Math.atan2(yD - yE, 1200) * 180) / Math.PI, meio: (yE + yD) / 2 });

const CSS = `
  @page { size: 1200px 2000px; margin: 0; }
  * { margin:0; padding:0; box-sizing:border-box; }
  html, body { width:1200px; height:2000px; overflow:hidden; }
  body { position:relative; font-family:'Montserrat',sans-serif; background:#F4F6FA; -webkit-print-color-adjust:exact; print-color-adjust:exact; }
  .escuro { position:absolute; inset:0; z-index:1;
    background:
      radial-gradient(ellipse 760px 620px at 76% 34%, rgba(64,140,255,.55), transparent 70%),
      radial-gradient(ellipse 900px 500px at 10% 0%, rgba(30,100,220,.45), transparent 70%),
      linear-gradient(170deg,#0D47A1 0%,#0A3C8C 38%,#062B63 78%,#041D47 100%); }
  .escuro::after { content:""; position:absolute; inset:0;
    background: repeating-linear-gradient(115deg, rgba(255,255,255,.035) 0 2px, transparent 2px 26px); }
  .claro { position:absolute; inset:0; z-index:0;
    background:
      radial-gradient(ellipse 700px 560px at 26% 70%, rgba(13,71,161,.16), transparent 70%),
      linear-gradient(180deg,#FFFFFF 0%,#EEF2F8 60%,#E3E9F3 100%); }
  .claro::after { content:""; position:absolute; inset:0;
    background: repeating-linear-gradient(115deg, rgba(13,71,161,.035) 0 2px, transparent 2px 26px); }
  .fita { position:absolute; left:-200px; width:1600px; height:74px; z-index:6; background:linear-gradient(180deg,#FFD54F,#FFC107 55%,#F2AE00);
    box-shadow:0 10px 28px rgba(0,0,0,.35); display:flex; align-items:center; overflow:hidden; white-space:nowrap;
    font-family:'Bebas Neue',sans-serif; font-size:40px; letter-spacing:.14em; color:#062B63; transform-origin:center; }
  .fita.fina { height:16px; background:#fff; box-shadow:none; opacity:.9; }
  .logo { position:absolute; left:50%; transform:translateX(-50%); z-index:8; filter:drop-shadow(0 8px 22px rgba(0,0,0,.35)); }
  .pote { position:absolute; z-index:7; filter:drop-shadow(0 34px 34px rgba(0,0,0,.45)); }
  .sombra { position:absolute; z-index:5; border-radius:50%; background:radial-gradient(ellipse, rgba(0,0,0,.45), transparent 70%); }
  .brilho { position:absolute; z-index:4; border-radius:50%; }
  .bloco { position:absolute; z-index:8; display:flex; flex-direction:column; }
  .chip { align-self:flex-start; font-family:'Bebas Neue',sans-serif; font-size:40px; letter-spacing:.08em; padding:12px 26px 6px; border-radius:10px; transform:rotate(-2deg); box-shadow:0 10px 22px rgba(0,0,0,.22); }
  .chip.am { background:linear-gradient(180deg,#FFD54F,#FFB300); color:#062B63; }
  .chip.az { background:linear-gradient(180deg,#1257C2,#0D47A1); color:#fff; }
  .tinta { font-family:'Bebas Neue',sans-serif; font-size:62px; line-height:1; letter-spacing:.1em; margin-top:20px; }
  .nome { font-family:'Bebas Neue',sans-serif; line-height:.86; text-transform:uppercase; white-space:nowrap; }
  .nome.am { padding-top:.16em; margin-top:-.16em; background:linear-gradient(180deg,#FFEA8F 8%,#FFC107 55%,#F29B00 100%); -webkit-background-clip:text; background-clip:text; color:transparent; filter:drop-shadow(0 12px 28px rgba(0,0,0,.30)); }
  .nome.az { color:#0D47A1; }
  .frase { font-weight:900; font-size:46px; line-height:1.08; margin-top:20px; letter-spacing:-.01em; }
  .frase em { font-style:normal; }
  .lista { margin-top:20px; display:flex; flex-direction:column; gap:13px; }
  .item { display:flex; align-items:center; gap:16px; font-family:'Poppins',sans-serif; font-weight:700; font-size:31px; line-height:1.15; }
  .item i { flex:none; width:46px; height:46px; border-radius:50%; display:flex; align-items:center; justify-content:center; }
  .item i svg { width:28px; height:28px; }
  .esc .item i { background:#FFC107; color:#062B63; }
  .clr .item i { background:#0D47A1; color:#fff; }
  .esc { color:#fff; } .esc .frase em { color:#FFC107; }
  .clr { color:#062B63; } .clr .frase em { color:#0D47A1; background:linear-gradient(180deg,transparent 58%,#FFE082 58%); }
  .rodape { position:absolute; left:0; right:0; bottom:0; height:230px; z-index:9; background:linear-gradient(180deg,#0A3C8C,#062B63); color:#fff;
    display:flex; flex-direction:column; align-items:center; justify-content:flex-start; padding-top:34px; gap:16px; border-top:8px solid #FFC107; }
  .rodape .linha { display:flex; align-items:center; gap:34px; font-family:'Poppins',sans-serif; font-weight:700; font-size:34px; white-space:nowrap; }
  .rodape .linha span { display:flex; align-items:center; gap:12px; }
  .rodape .linha svg { width:40px; height:40px; color:#FFC107; }
  .rodape .loja { font-family:'Bebas Neue',sans-serif; font-size:40px; letter-spacing:.16em; color:#FFE082; }
`;

const fontes = `<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Montserrat:wght@700;800;900&family=Poppins:wght@500;600;700&display=swap" rel="stylesheet">`;

function fita(s, texto, fina = false) {
  const rep = `${texto}  ★  `.repeat(14);
  return `<div class="fita${fina ? " fina" : ""}" style="top:${s.meio - (fina ? 8 : 37)}px; transform:rotate(${s.ang}deg)">${fina ? "" : `<span>${rep}</span>`}</div>`;
}

function itens(lista) {
  return `<div class="lista">${lista.map((t) => `<div class="item"><i>${ICONE.ok}</i><span>${t}</span></div>`).join("")}</div>`;
}

function rodapeProduto() {
  return `<div class="rodape">
    <div class="loja">Loja 6 · Santa Terezinha · São Bernardo do Campo</div>
    <div class="linha"><span>${ICONE.insta}@Tintaslaet</span><span>${ICONE.zap}${ZAP_LOJA6}</span><span>${ICONE.site}tintaslaet.com</span></div>
  </div>`;
}

// Banner de 2 produtos: A em cima (escuro), B embaixo (claro).
// Balde "pertencente" à peça: pedestal na cor da marca, sombra de contato no
// pedestal, anel de luz atrás e luz suave — todos no mesmo tamanho.
function palco({ cx, base, h, img, tema }) {
  const [iw, ih] = TAMANHOS[img];
  const w = Math.round((h * iw) / ih);
  const W = Math.round(Math.max(w * 1.18, 420));
  const esc = tema === "esc";
  const topo = esc ? "linear-gradient(180deg,#FFE58A 0%,#FFC107 70%,#F2AE00 100%)" : "linear-gradient(180deg,#2C74D6 0%,#0D47A1 80%)";
  const lado = esc ? "linear-gradient(180deg,#E9A600,#A86F00)" : "linear-gradient(180deg,#0A3C8C,#041D47)";
  const anel = esc ? "rgba(255,213,79,.32)" : "rgba(13,71,161,.16)";
  const luz = esc ? "rgba(110,170,255,.55)" : "rgba(13,71,161,.16)";
  const cy = base - h * 0.52, d = Math.round(h * 1.22);
  return `
    <div style="position:absolute; z-index:2; left:${cx - d * 0.62}px; top:${cy - d * 0.62}px; width:${d * 1.24}px; height:${d * 1.24}px; border-radius:50%; background:radial-gradient(circle, ${luz}, transparent 64%)"></div>
    <div style="position:absolute; z-index:3; left:${cx - d / 2}px; top:${cy - d / 2}px; width:${d}px; height:${d}px; border-radius:50%; border:3px solid ${anel}"></div>
    <div style="position:absolute; z-index:3; left:${cx - d * 0.42}px; top:${cy - d * 0.42}px; width:${d * 0.84}px; height:${d * 0.84}px; border-radius:50%; border:2px solid ${anel}; opacity:.6"></div>
    <div style="position:absolute; z-index:4; left:${cx - W / 2}px; top:${base}px; width:${W}px; height:46px; background:${lado}; border-radius:0 0 50% 50% / 0 0 36px 36px; box-shadow:0 26px 40px rgba(0,0,0,${esc ? ".45" : ".25"})"></div>
    <div style="position:absolute; z-index:5; left:${cx - W / 2}px; top:${base - 36}px; width:${W}px; height:72px; border-radius:50%; background:${topo}; box-shadow:inset 0 3px 0 rgba(255,255,255,.45)"></div>
    <div style="position:absolute; z-index:6; left:${cx - w * 0.52}px; top:${base - 20}px; width:${w * 1.04}px; height:34px; border-radius:50%; background:radial-gradient(ellipse, rgba(0,0,0,.55), rgba(0,0,0,.25) 45%, transparent 72%)"></div>
    <img src="${uri(img)}" style="position:absolute; z-index:7; left:${cx - w / 2}px; top:${base - h + 2}px; height:${h}px; width:${w}px; filter:drop-shadow(0 14px 22px rgba(0,0,0,${esc ? ".35" : ".22"}))">`;
}

function bannerProdutos({ a, b }) {
  const s = seam(1075, 905);
  const clip = `clip-path:polygon(0 0,1200px 0,1200px ${s.yD}px,0 ${s.yE}px)`;
  const nomeA = a.nome.map((l, i) => `<div class="nome am" style="font-size:${a.tam[i]}px">${l}</div>`).join("");
  const nomeB = b.nome.map((l, i) => `<div class="nome az" style="font-size:${b.tam[i]}px">${l}</div>`).join("");
  return `<!DOCTYPE html><html><head><meta charset="utf-8">${fontes}<style>${CSS}</style></head><body>
    <div class="claro"></div>
    <div class="escuro" style="${clip}"></div>
    <img class="logo" src="${uri("logo-branco.png")}" style="top:78px; width:420px">

    ${palco({ cx: 885, base: 838, h: 500, img: a.img, tema: "esc" })}
    <div class="bloco esc" style="left:64px; top:330px; width:600px">
      <div class="chip am">${a.chip}</div>
      <div class="tinta">${a.tinta}</div>
      ${nomeA}
      <div class="frase">${a.frase}</div>
      ${itens(a.itens)}
    </div>

    ${fita(s, "A TINTA NOBRE DA COMUNIDADE")}

    ${palco({ cx: 300, base: 1668, h: 470, img: b.img, tema: "clr" })}
    <div class="bloco clr" style="right:56px; top:${b.texto}px; width:540px">
      <div class="chip az">${b.chip}</div>
      <div class="tinta">${b.tinta}</div>
      ${nomeB}
      <div class="frase">${b.frase}</div>
      ${itens(b.itens)}
    </div>
    ${rodapeProduto()}
  </body></html>`;
}

const LOJAS = [
  { n: 1, nome: "Sapopemba", cidade: "São Paulo", end: "Av. Sapopemba, 25.723 — Vila Bela", zap: "(11) 98082-0686" },
  { n: 2, nome: "Jardim São João", cidade: "Mauá", end: "Rua do Britador, 2 — Jd. São João", zap: "(11) 97750-4434" },
  { n: 3, nome: "Jd. Santa Cecília", cidade: "Mauá", end: "Av. Ayrton Senna da Silva, 235", zap: "(11) 97749-8813" },
  { n: 4, nome: "Vila Luzita", cidade: "Santo André", end: "Av. São Bernardo do Campo, 757", zap: "(11) 94855-1977" },
  { n: 5, nome: "Jardim Itapark", cidade: "Mauá", end: "Av. Itapark, 4377", zap: "(11) 91433-4875" },
  { n: 6, nome: "Santa Terezinha", cidade: "São Bernardo do Campo", end: "Av. Luís Pequini, 899", zap: "(11) 91875-5095", aqui: true },
];

function bannerLojas() {
  const s = seam(905, 735);
  const clip = `clip-path:polygon(0 0,1200px 0,1200px ${s.yD}px,0 ${s.yE}px)`;
  const cards = LOJAS.map((l) => `
    <div class="card${l.aqui ? " aqui" : ""}">
      <div class="foto" style="background-image:url('${uri(`loja-${l.n}.jpg`)}')"><b>${l.n}</b></div>
      <div class="info">
        ${l.aqui ? `<div class="voce">${ICONE.pin}Você está aqui</div>` : ""}
        <div class="bairro">${l.nome}</div>
        <div class="cid">${l.cidade}</div>
        <div class="end">${l.end}</div>
        <div class="zap">${ICONE.zap}${l.zap}</div>
      </div>
    </div>`).join("");
  const css = `
    .grade { position:absolute; left:46px; right:46px; top:930px; z-index:8; display:grid; grid-template-columns:1fr 1fr; gap:22px 22px; }
    .card { height:252px; border-radius:26px; background:#fff; box-shadow:0 14px 34px rgba(6,43,99,.16); border:2px solid rgba(13,71,161,.12); display:flex; align-items:center; gap:22px; padding:0 22px; position:relative; overflow:hidden; }
    .card::before { content:""; position:absolute; left:0; top:0; bottom:0; width:10px; background:#FFC107; }
    .card.aqui { background:linear-gradient(160deg,#0D47A1,#062B63); border-color:#FFC107; border-width:4px; }
    .foto { flex:none; width:178px; height:178px; border-radius:50%; background-size:cover; background-position:center; position:relative; border:6px solid #FFC107; box-shadow:0 10px 20px rgba(0,0,0,.25); }
    .foto b { position:absolute; right:-10px; bottom:-6px; width:66px; height:66px; border-radius:50%; background:#062B63; color:#FFC107; border:4px solid #FFC107; font-family:'Bebas Neue',sans-serif; font-weight:400; font-size:48px; line-height:62px; text-align:center; }
    .aqui .foto b { background:#FFC107; color:#062B63; border-color:#fff; }
    .info { min-width:0; display:flex; flex-direction:column; }
    .voce { align-self:flex-start; display:flex; align-items:center; gap:6px; background:#FFC107; color:#062B63; font-family:'Bebas Neue',sans-serif; font-size:28px; letter-spacing:.08em; padding:4px 14px 0; border-radius:8px; margin-bottom:6px; }
    .voce svg { width:24px; height:24px; margin-top:-4px; }
    .bairro { font-family:'Bebas Neue',sans-serif; font-size:54px; line-height:.95; color:#062B63; white-space:nowrap; }
    .cid { font-family:'Montserrat',sans-serif; font-weight:800; font-size:21px; color:#0D47A1; letter-spacing:.02em; text-transform:uppercase; margin-top:2px; line-height:1.15; }
    .end { font-family:'Poppins',sans-serif; font-weight:500; font-size:21px; color:#333; margin-top:8px; line-height:1.2; }
    .zap { display:flex; align-items:center; gap:8px; font-family:'Poppins',sans-serif; font-weight:700; font-size:27px; color:#062B63; margin-top:8px; white-space:nowrap; }
    .zap svg { width:30px; height:30px; color:#1FA855; }
    .aqui .bairro, .aqui .end, .aqui .zap { color:#fff; } .aqui .cid { color:#FFE082; }
    .titulo { position:absolute; left:0; right:0; top:345px; z-index:8; text-align:center; }
    .seis { font-family:'Bebas Neue',sans-serif; font-size:290px; padding-top:.12em; margin-top:-.12em; line-height:.82; background:linear-gradient(180deg,#FFEA8F 8%,#FFC107 55%,#F29B00 100%); -webkit-background-clip:text; background-clip:text; color:transparent; filter:drop-shadow(0 14px 30px rgba(0,0,0,.32)); }
    .perto { font-family:'Bebas Neue',sans-serif; font-size:96px; line-height:1; color:#fff; letter-spacing:.06em; margin-top:6px; text-shadow:0 8px 24px rgba(0,0,0,.4); }
    .regiao { font-family:'Poppins',sans-serif; font-weight:600; font-size:34px; color:#FFE082; margin-top:6px; }
    .redes { position:absolute; left:0; right:0; bottom:0; height:250px; z-index:9; background:linear-gradient(180deg,#0A3C8C,#062B63); border-top:8px solid #FFC107; display:flex; flex-direction:column; align-items:center; justify-content:flex-start; padding-top:34px; gap:12px; color:#fff; }
    .redes .dica { font-family:'Bebas Neue',sans-serif; font-size:40px; letter-spacing:.16em; color:#FFE082; }
    .redes .linha { display:flex; gap:56px; font-family:'Poppins',sans-serif; font-weight:700; font-size:50px; white-space:nowrap; }
    .redes .linha span { display:flex; align-items:center; gap:16px; }
    .redes svg { width:56px; height:56px; color:#FFC107; }
  `;
  return `<!DOCTYPE html><html><head><meta charset="utf-8">${fontes}<style>${CSS}${css}</style></head><body>
    <div class="claro"></div>
    <div class="escuro" style="${clip}"></div>
    <img class="logo" src="${uri("logo-branco.png")}" style="top:78px; width:440px">
    <div class="titulo">
      <div class="seis">6 LOJAS</div>
      <div class="perto">PERTO DE VOCÊ</div>
    </div>
    ${fita(s, "ABC E ZONA LESTE DE SP")}
    <div class="grade">${cards}</div>
    <div class="redes">
      <div class="dica">Siga e confira</div>
      <div class="linha"><span>${ICONE.insta}@Tintaslaet</span><span>${ICONE.site}tintaslaet.com</span></div>
    </div>
  </body></html>`;
}

const BANNERS = {
  "banner-1-emborrachada-pisos": bannerProdutos({
    a: { img: "rec-emborrachada-remove-bg-io.png", topo: 300, altura: 640, direita: 30, chip: "Laje · telha · muro", tinta: "TINTA", nome: ["EMBORRACHADA"], tam: [116],
      frase: "Adeus, <em>infiltração.</em>", itens: ["Resolve até 100% da infiltração", "Resiste a sol e chuva", "Rende até 200 m² (balde 18 L)"] },
    b: { img: "rec-pisos-efachadas-remove-bg-io.png", topo: 1150, altura: 570, esquerda: 24, texto: 1090, chip: "Garagem · calçada · fachada", tinta: "TINTA", nome: ["PISOS &", "FACHADAS"], tam: [118, 118],
      frase: "Aguenta o <em>dia a dia.</em>", itens: ["Resiste ao tráfego de carros", "Resiste a chuva e sol", "Rende até 300 m² por demão"] },
  }),
  "banner-2-lavavel-epoxi": bannerProdutos({
    a: { img: "rec-premiumlavavel-remove-bg-io.png", topo: 300, altura: 640, direita: 30, chip: "Dentro e fora de casa", tinta: "TINTA", nome: ["PREMIUM", "LAVÁVEL"], tam: [132, 132],
      frase: "Sujou? <em>Limpa fácil.</em>", itens: ["Fácil de limpar", "Anti-mofo e anti-fungos", "Rende até 200 m² (balde 18 L)"] },
    b: { img: "rec-epoxibaseagua.png", topo: 1150, altura: 570, esquerda: 24, texto: 1090, chip: "Azulejo · cozinha · banheiro", tinta: "TINTA", nome: ["EPÓXI", "BASE ÁGUA"], tam: [118, 118],
      frase: "Renove <em>sem quebrar.</em>", itens: ["Pinta azulejo sem obra", "Secagem rápida", "Sem cheiro forte"] },
  }),
  "banner-3-lojas": bannerLojas(),
};

(async () => {
  const b = await chromium.launch();
  for (const [nome, html] of Object.entries(BANNERS)) {
    fs.writeFileSync(path.join(OUT, `${nome}.html`), html);
    const ctx = await b.newContext({ viewport: { width: 1200, height: 2000 }, deviceScaleFactor: 2.9528 });
    const p = await ctx.newPage();
    await p.setContent(html, { waitUntil: "networkidle" });
    await p.evaluate(() => document.fonts.ready);
    await p.waitForTimeout(500);
    await p.screenshot({ path: path.join(OUT, `${nome}-150dpi.png`) });
    // PDF feito da própria imagem em 150 dpi: sai idêntico à prévia, no tamanho real (60 x 100 cm).
    require("child_process").execFileSync("python3", ["-c", "import sys; from PIL import Image; Image.open(sys.argv[1]).convert('RGB').save(sys.argv[2], resolution=150.0, quality=95)", path.join(OUT, `${nome}-150dpi.png`), path.join(OUT, `${nome}-60x100cm.pdf`)]);
    const prev = await b.newContext({ viewport: { width: 1200, height: 2000 }, deviceScaleFactor: 0.5 });
    const pp = await prev.newPage();
    await pp.setContent(html, { waitUntil: "networkidle" });
    await pp.evaluate(() => document.fonts.ready);
    await pp.waitForTimeout(300);
    await pp.screenshot({ path: path.join(OUT, `${nome}-previa.png`) });
    await ctx.close(); await prev.close();
    console.log("ok", nome);
  }
  await b.close();
})();
