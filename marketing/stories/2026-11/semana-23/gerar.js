// Stories 19–26/11/2026: sábado (3), segunda (3) e stories das lojas (8). Mesmo visual do pacote 18–22.
// Helpers (A, B, Cz, foto, grad, zap, LOGO, CSS) vêm do gerar.js da semana 16–22.
const _fs = require("fs"), _path = require("path");
const BASE = _path.join(__dirname, "..", "semana-16-22-v2");
const src = _fs.readFileSync(_path.join(BASE, "gerar.js"), "utf8");
eval(src.slice(0, src.indexOf("const S = {")).replace(/const /g, "var "));
H = __dirname;
const V2 = BASE + "/";
const DOZE = "Parcele em até 12x sem juros (consulte as condições)";
const selo = (a, b, mt = 34) => `<div style="display:inline-flex;align-items:center;gap:22px;margin-top:${mt}px;background:#FFC107;color:#062B63;border-radius:24px;padding:22px 34px;box-shadow:0 14px 30px rgba(0,0,0,.35)"><span style="font-weight:800;font-size:44px">${a}</span><span style="font-weight:900;font-size:76px">${b}</span></div>`;
const topo = (img, pos, titulo, sub, extra, zapNum) => {
  let h = pag(`${foto(img, pos)}${grad(cima)}${grad("linear-gradient(180deg,rgba(4,24,58,0) 58%,rgba(4,24,58,.92) 100%)")}
  <img class="logo" src="${LOGO}"><div style="position:absolute;left:70px;right:70px;top:470px"><div class="t" style="font-size:104px">${titulo}</div>${sub}</div>${zap(extra)}`);
  return zapNum ? h.replace("(11) 97714-0964", zapNum) : h;
};
const subl = (t) => `<div class="sub" style="margin-top:26px">${t}</div>`;

// Lojas (endereço e WhatsApp de cada loja, iguais ao site e ao painel)
const LOJA = {
  3: { bairro: "Jardim Santa Cecília", cidade: "Mauá", end: "Av. Ayrton Senna da Silva, 235", zap: "(11) 97749-8813", foto: __dirname + "/fachada-loja3-limpa.jpg", pos: "center 30%" },
  4: { bairro: "Vila Luzita", cidade: "Santo André", end: "Av. São Bernardo do Campo, 757", zap: "(11) 94855-1977", foto: F + "fachada-loja4.jpg", pos: "center 38%" },
  5: { bairro: "Jardim Itapark", cidade: "Mauá", end: "Av. Itapark, 4377", zap: "(11) 91433-4875", foto: F + "fachada-loja5.jpg", pos: "center 40%" },
  6: { bairro: "Santa Terezinha", cidade: "São Bernardo do Campo", end: "Av. Luís Pequini, 899", zap: "(11) 91875-5095", foto: F + "fachada-loja6.jpg", pos: "center 35%" },
};
// Story de loja: fachada real cheia, gancho no alto, cartão com loja/endereço/horário e botão com o WhatsApp DA LOJA.
const loja = (n, titulo, diaHora, hora, pos) => {
  const l = LOJA[n];
  return pag(`<div class="foto" style="background-image:url('${uri(l.foto)}');background-position:${pos || l.pos};filter:blur(28px) brightness(.45) saturate(1.1);transform:scale(1.15)"></div>
  ${grad("linear-gradient(180deg,rgba(4,24,58,.85) 0%,rgba(4,24,58,.55) 50%,rgba(4,24,58,.92) 100%)")}
  <img class="logo" src="${LOGO}">
  <div style="position:absolute;left:70px;right:70px;top:450px"><div class="t" style="font-size:90px">${titulo}</div></div>
  <div style="position:absolute;left:70px;right:70px;top:770px;height:420px;border-radius:30px;overflow:hidden;box-shadow:0 26px 60px rgba(0,0,0,.5);border:6px solid #fff;background:url('${uri(l.foto)}') ${pos || l.pos}/cover"></div>
  <div style="position:absolute;left:70px;right:70px;top:1222px">
    <div style="display:inline-block;background:#FFC107;color:#062B63;font-weight:900;font-size:32px;letter-spacing:.1em;padding:10px 22px;border-radius:12px">LOJA ${n} · ${l.cidade.toUpperCase()}</div>
    <div class="t" style="font-size:60px;margin-top:16px">${l.bairro}</div>
    <div class="sub" style="font-size:38px;margin-top:6px">${l.end}</div>
    <div style="display:flex;align-items:center;gap:16px;margin-top:16px"><span class="sub" style="font-size:38px;opacity:.9">${diaHora}</span><span style="background:#fff;color:#062B63;font-weight:900;font-size:48px;padding:6px 20px;border-radius:14px">${hora}</span></div>
  </div>
  <div class="zap">${ZAP}${l.zap}</div><div class="mini">Passa aqui ou chama no Whats</div>`);
};

const V = {
  // SÁBADO 21/11 · 6h30
  "sab-1": A(F + "prateleira-tintas-1.jpg", "center 35%", "Hoje tem loja até as <em>14h</em>.", selo("Sábado", "8h às 14h", 10)),
  "sab-2": topo(H + "/ia-sab-pintando.png", "center 40%", "Vai pintar <em>hoje</em>?", subl("Faltou alguma coisa? Chama no Whats."), DOZE),
  "sab-3": topo(F + "parede-ferramentas.jpg", "center 45%", "Esqueceu o <em>rolo</em>? Acontece.", subl("Passa na loja até as 14h."), DOZE),
  // SEGUNDA 23/11 · 6h30
  "seg-1": A(H + "/ia-seg-pintor.png", "center 40%", "Semana nova, <em>parede nova</em>?", "Conta pra gente o que vai pintar."),
  "seg-2": A(H + "/ia-seg-fita.png", "center 45%", "Fita crepe <em>salva</em> sua pintura.", "Cola no rodapé e no batente antes."),
  "seg-3": B(V2 + "ia-seg-rolo.png", "center 60%", ["Você pinta", "sozinho ou", "chama pintor?"], "am"),
  // LOJAS
  "loja6-qui19": loja(6, "Mora em <em>São Bernardo</em>?", "Hoje", "8h às 18h"),
  "loja3-sex20": loja(3, "Feriado? Loja 3 <em>aberta</em>.", "Hoje até", "13h"),
  "loja6-sab21": loja(6, "Sábado de obra em <em>São Bernardo</em>?", "Hoje", "8h às 14h", "center 58%"),
  "loja5-sab21": loja(5, "Itapark, bora começar a <em>obra</em>?", "Hoje", "8h às 14h"),
  "loja3-seg23": loja(3, "Santa Cecília, a semana <em>começou</em>.", "Hoje", "8h às 18h"),
  "loja5-ter24": loja(5, "Faltou tinta no <em>meio da obra</em>?", "Hoje", "8h às 18h", "center 48%"),
  "loja4-qua25": loja(4, "Tem Laet na <em>esquina</em> da Vila Luzita.", "Hoje", "8h às 18h"),
  "loja6-qui26": loja(6, "Tinta acabou? A Loja 6 <em>tem</em>.", "Hoje", "8h às 18h", "center 46%"),
};

(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  const out = _path.join(__dirname, "final"); _fs.mkdirSync(out, { recursive: true });
  for (const [n, h] of Object.entries(V)) {
    await p.setContent(h, { waitUntil: "networkidle" }); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(200);
    await p.screenshot({ path: _path.join(out, n + ".png") });
  }
  await b.close(); console.log("ok", Object.keys(V).length);
})();
