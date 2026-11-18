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
// Padrão único das lojas (v2): fachada INTEIRA (placa + loja) dentro do quadro, sem corte; sobra lateral preenchida
// com a própria foto desfocada. Recortes prontos em recorte-lojaN.jpg (do topo da placa até a calçada).
const loja = (n, titulo, diaHora, hora, apoio, brinde) => {
  const l = LOJA[n]; const rec = uri(__dirname + `/recorte-loja${n}.jpg`);
  return pag(`<div class="foto" style="background-image:url('${rec}');background-position:center;filter:blur(30px) brightness(.42) saturate(1.1);transform:scale(1.2)"></div>
  ${grad("linear-gradient(180deg,rgba(4,24,58,.86) 0%,rgba(4,24,58,.55) 50%,rgba(4,24,58,.94) 100%)")}
  <img class="logo" src="${LOGO}">
  <div style="position:absolute;left:70px;right:70px;top:440px;height:236px;display:flex;flex-direction:column;justify-content:flex-end"><div class="t" style="font-size:80px">${titulo}</div><div class="sub" style="font-size:38px;margin-top:12px">${apoio}</div></div>
  <div style="position:absolute;left:70px;right:70px;top:700px;height:${brinde ? 516 : 580}px;border-radius:30px;overflow:hidden;border:6px solid #fff;box-shadow:0 26px 60px rgba(0,0,0,.5)">
    <div style="position:absolute;inset:-30px;background:url('${rec}') center/cover;filter:blur(18px) brightness(.8)"></div>
    <img src="${rec}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:contain">
  </div>
  ${brinde ? `<div style="position:absolute;left:70px;right:70px;top:1232px;background:#FFC107;color:#062B63;border-radius:18px;text-align:center;padding:16px 10px 14px;font-weight:900;font-size:38px;letter-spacing:-.015em;white-space:nowrap;box-shadow:0 12px 26px rgba(0,0,0,.35)">Compra acima de R$ 100? Ganha um brinde.</div>` : ""}
  <div style="position:absolute;left:70px;right:70px;top:${brinde ? 1330 : 1308}px">
    <div style="display:inline-block;background:#FFC107;color:#062B63;font-weight:900;font-size:30px;letter-spacing:.1em;padding:10px 22px;border-radius:12px;white-space:nowrap">LOJA ${n} · ${l.cidade.toUpperCase()}</div>
    <div class="t" style="font-size:58px;margin-top:14px;white-space:nowrap">${l.bairro}</div>
    <div style="display:flex;align-items:center;justify-content:space-between;gap:16px;margin-top:8px">
      <div class="sub" style="font-size:34px">${l.end}</div>
      <div style="flex:none;display:flex;align-items:center;gap:10px"><span class="sub" style="font-size:32px;opacity:.9">${diaHora}</span><span style="background:#fff;color:#062B63;font-weight:900;font-size:42px;padding:2px 16px;border-radius:12px">${hora}</span></div>
    </div>
  </div>
  <div class="zap" style="bottom:200px">${ZAP}${l.zap}</div><div class="mini" style="bottom:150px">WhatsApp da Loja ${n}</div>`);
};

const V = {
  // SÁBADO 21/11 · 6h30
  // foco: horário de sábado
  "sab-1": A(F + "prateleira-tintas-1.jpg", "center 35%", "Hoje tem loja até as <em>14h</em>.", selo("Sábado", "8h às 14h", 10)),
  // foco: parcelamento
  "sab-2": topo(H + "/ia-sab-pintando.png", "center 40%", "Obra grande? <em>Divide</em> em 12x.", subl("Pinta agora e paga aos poucos."), DOZE),
  // foco: ferramenta esquecida
  "sab-3": topo(F + "parede-ferramentas.jpg", "center 45%", "Esqueceu o <em>rolo</em>? Acontece.", subl("Rolo, fita e lixa te esperando."), "@tintaslaet · tintaslaet.com"),
  // SEGUNDA 23/11 · 6h30
  // foco: planejar a semana (interação)
  "seg-1": A(H + "/ia-seg-pintor.png", "center 40%", "Semana nova, <em>parede nova</em>?", "Conta pra gente o que vai pintar."),
  // foco: dica de pintura
  "seg-2": pag(`${foto(H + "/ia-seg-fita.png", "center 80%")}${grad("linear-gradient(180deg,rgba(4,24,58,.92) 0%,rgba(4,24,58,.72) 30%,rgba(4,24,58,0) 50%)")}<img class="logo" src="${LOGO}">
  <div style="position:absolute;left:70px;right:70px;top:470px"><div class="t" style="font-size:112px">Fita crepe <em>salva</em> sua pintura.</div><div class="sub" style="margin-top:24px">Cola no rodapé e no batente antes.</div></div>`),
  // foco: enquete
  "seg-3": B(V2 + "ia-seg-rolo.png", "center 60%", ["Você pinta", "sozinho ou", "chama pintor?"], "am"),
  // LOJAS
  // foco: loja perto de casa + brinde
  "loja6-qui19": loja(6, "Mora em <em>São Bernardo</em>?", "Hoje", "8h às 18h", "A Loja 6 fica no seu caminho.", true),
  // foco: horário especial do feriado + brinde
  "loja3-sex20": loja(3, "Feriado? Loja 3 <em>aberta</em>.", "Hoje até", "13h", "Aproveita a folga pra resolver a obra.", true),
  // foco: o brinde como gancho do sábado
  "loja6-sab21": loja(6, "Sábado com <em>brinde</em> na Loja 6.", "Hoje", "8h às 14h", "Vale só nas lojas 6 e 3.", true),
  // foco: atendimento de quem entende
  "loja5-sab21": loja(5, "Dúvida de tinta? <em>Pergunta</em>.", "Hoje", "8h às 14h", "Na Loja 5 quem atende entende de obra.", false),
  // foco: calcular quantos litros no Whats + brinde
  "loja3-seg23": loja(3, "Quantos <em>litros</em> você precisa?", "Hoje", "8h às 18h", "Manda a medida no Whats que a gente calcula.", true),
  // foco: parcelamento (segunda abordagem: reforma)
  "loja5-ter24": loja(5, "Reforma pesada? <em>Parcela</em>.", "Hoje", "8h às 18h", "Em até 12x sem juros (consulte as condições).", false),
  // foco: perto de casa (outra abordagem: bairro)
  "loja4-qua25": loja(4, "Tem Laet na <em>esquina</em> da Vila Luzita.", "Hoje", "8h às 18h", "Pertinho, sem pegar trânsito.", false),
  // foco: indicar a tinta pela foto + brinde
  "loja6-qui26": loja(6, "Manda a <em>foto</em> da parede.", "Hoje", "8h às 18h", "A Loja 6 indica a tinta certa.", true),
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
