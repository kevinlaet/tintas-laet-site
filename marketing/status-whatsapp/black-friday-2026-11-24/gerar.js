// Status do WhatsApp (1080x1920) da Black Friday · sexta 27/11/2026 · um pacote por loja (6 lojas x 5 imagens).
// Mesmo visual do carrossel encarte (../../conteudo/black-friday-carrossel-2026-11-24/gerar-encarte.js), reaproveitado
// daqui: o miolo de cada slide entra no meio do 9:16 e o rodapé vira o da loja (site + Instagram + WhatsApp DA LOJA).
// Topo (160px) e base (200px) livres por causa da barra do WhatsApp.
const _fs = require("fs"), _path = require("path");
const SRC = _path.join(__dirname, "../../conteudo/black-friday-carrossel-2026-11-24/gerar-encarte.js");
let src = _fs.readFileSync(SRC, "utf8");
src = src.slice(0, src.indexOf("const SLIDES"))
  .replace("const D = __dirname", "const D = " + JSON.stringify(_path.dirname(SRC)))
  .replace(/const pag = \(c\) => `[^\n]*\n/, "const pag = (c) => c;\n")
  .replace(/const CTA = `[^\n]*\n/, 'const CTA = "";\n')
  .replace(/<div style="position:absolute;left:0;right:0;top:1186px;[\s\S]*?<\/span><\/div>`\);/,
    '<div style="position:absolute;left:0;right:0;top:1180px;text-align:center;font-size:28px;font-weight:600">Os preços estão nos <span class="am">próximos status</span> →</div>`);');
eval(src.replace(/^const /gm, "var "));

const LOJAS = {
  1: { bairro: "Vila Bela", cidade: "São Paulo", end: "Av. Sapopemba, 25.723", zap: "(11) 98082-0686" },
  2: { bairro: "Jardim São João", cidade: "Mauá", end: "Rua do Britador, 2", zap: "(11) 97750-4434" },
  3: { bairro: "Jardim Santa Cecília", cidade: "Mauá", end: "Av. Ayrton Senna da Silva, 235", zap: "(11) 97749-8813", brinde: true },
  4: { bairro: "Vila Luzita", cidade: "Santo André", end: "Av. São Bernardo do Campo, 757", zap: "(11) 94855-1977" },
  5: { bairro: "Jardim Itapark", cidade: "Mauá", end: "Av. Itapark, 4377", zap: "(11) 91433-4875" },
  6: { bairro: "Santa Terezinha", cidade: "São Bernardo do Campo", end: "Av. Luís Pequini, 899", zap: "(11) 91875-5095", brinde: true },
};
const PRESENTE = '<svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M5 12v9h14v-9M12 8v13M12 8S10.5 3 8 3.6C5.8 4.2 7 8 12 8zm0 0s1.5-5 4-4.4C18.2 4.2 17 8 12 8z"/></svg>';
const GLOBO = '<svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.8 3 2.8 15 0 18M12 3c-2.8 3-2.8 15 0 18"/></svg>';
const INSTA = '<svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4.2"/><circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none"/></svg>';

const CSS9 = CSS.replace("html,body{width:1080px;height:1350px;", "html,body{width:1080px;height:1920px;")
  .replace("at 50% 44%,rgba(245,184,0,.22)", "at 50% 34%,rgba(245,184,0,.22)").replace(/at 50% 44%/g, "at 50% 34%");
const rodape = (n) => { const l = LOJAS[n]; return `<div style="position:absolute;left:60px;right:60px;bottom:200px;display:flex;flex-direction:column;gap:20px">
  ${l.brinde ? `<div style="display:flex;align-items:center;justify-content:center;gap:12px;border:3px solid #F5B800;border-radius:18px;height:72px;font-size:28px;font-weight:600"><span class="am" style="font-size:34px;display:flex">${PRESENTE}</span>Nesta loja, compra acima de R$ 100 ganha brinde</div>` : ""}
  <div style="display:flex;gap:20px">
    <div style="flex:1;height:96px;border-radius:20px;background:#F5B800;color:#0A0A0F;display:flex;align-items:center;justify-content:center;gap:14px;font-family:'Montserrat';font-weight:900;font-size:38px;letter-spacing:-.02em">${GLOBO}tintaslaet.com</div>
    <div style="flex:1;height:96px;border-radius:20px;background:#fff;color:#0A0A0F;display:flex;align-items:center;justify-content:center;gap:14px;font-family:'Montserrat';font-weight:900;font-size:38px;letter-spacing:-.02em">${INSTA}@tintaslaet</div></div>
  <div style="border-radius:22px;background:linear-gradient(180deg,#1E1E27,#141419);border:2px solid rgba(245,184,0,.3);padding:22px 30px;display:flex;align-items:center;justify-content:space-between;gap:20px">
    <div style="min-width:0"><div style="display:inline-block;background:#F5B800;color:#0A0A0F;font-family:'Montserrat';font-weight:900;font-size:22px;letter-spacing:.1em;padding:6px 14px 4px;border-radius:8px;white-space:nowrap">LOJA ${n} · ${l.cidade.toUpperCase()}</div>
      <div class="m" style="font-size:40px;margin-top:10px;white-space:nowrap;text-transform:none;letter-spacing:-.02em">${l.bairro}</div>
      <div style="font-size:24px;font-weight:500;color:rgba(255,255,255,.75);margin-top:2px">${l.end}</div></div>
    <div style="flex:none;text-align:right"><div style="font-size:20px;font-weight:600;color:rgba(255,255,255,.7)">WhatsApp da loja</div><div class="am" style="font-family:'Montserrat';font-weight:900;font-size:32px;white-space:nowrap;margin-top:4px">${l.zap}</div></div></div>
  <div style="text-align:center;font-size:18px;font-weight:500;line-height:1.45;color:rgba(255,255,255,.6)">${LEGAL}</div></div>`; };
const pagina = (miolo, n, capa) => `<!doctype html><html><head><meta charset="utf-8"><link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@800;900&family=Poppins:wght@500;600&display=swap" rel="stylesheet"><style>${CSS9}</style></head><body>
<div class="bg"></div><div class="raios"></div><div class="grao"></div><div style="position:absolute;left:0;top:${capa ? 122 : 150}px;width:1080px;height:1350px;${capa ? "transform:scale(.92);transform-origin:50% 0" : ""}">${miolo}</div>${rodape(n)}</body></html>`;

const MIOLO = { "01-capa": capa, "02-massas": massas, "03-vinil-gesso": dupla("vinil", "gesso"), "04-standard-lavavel": dupla("standard", "lavavel"), "05-epoxi-pisos": dupla("epoxi", "pisos") };
const PEDIDO = { corrida: "32,99", acrilica: "49,99", vinil: "64,99", gesso: "139,99", standard: "159,99", lavavel: "229,99", epoxi: "99,99", pisos: "149,99" };
for (const [k, v] of Object.entries(PEDIDO)) if (P[k].preco !== v) throw new Error("PREÇO ERRADO " + k);
if (P.corrida.barrica !== "40,99" || P.acrilica.barrica !== "57,99") throw new Error("PREÇO BARRICA ERRADO");
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  for (const n of Object.keys(LOJAS)) {
    const out = _path.join(__dirname, `loja-${n}`); _fs.mkdirSync(out, { recursive: true });
    for (const [nome, m] of Object.entries(MIOLO)) {
      await p.setContent(pagina(m, n, nome === "01-capa"), { waitUntil: "networkidle" }); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(150);
      await p.screenshot({ path: _path.join(out, nome + ".png") });
    }
  }
  await b.close(); console.log("ok, 6 lojas x 5 status, preços conferidos");
})();
