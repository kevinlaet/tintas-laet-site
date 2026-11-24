// Status do WhatsApp (1080x1920) da Black Friday · sexta 27/11/2026 · UM pacote só, igual pra todas as lojas (6 imagens).
// Mesmo visual do carrossel encarte (../../conteudo/black-friday-carrossel-2026-11-24/gerar-encarte.js), reaproveitado
// daqui. 01–05 sem citar loja nenhuma (rodapé: responde o status + site + Instagram). Lojas e endereços só no
// último status (06-lojas), pedido do Kevin 24/11.
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
const BOTOES = `<div style="display:flex;gap:20px">
    <div style="flex:1;height:96px;border-radius:20px;background:#F5B800;color:#0A0A0F;display:flex;align-items:center;justify-content:center;gap:14px;font-family:'Montserrat';font-weight:900;font-size:38px;letter-spacing:-.02em">${GLOBO}tintaslaet.com</div>
    <div style="flex:1;height:96px;border-radius:20px;background:#fff;color:#0A0A0F;display:flex;align-items:center;justify-content:center;gap:14px;font-family:'Montserrat';font-weight:900;font-size:38px;letter-spacing:-.02em">${INSTA}@tintaslaet</div></div>`;
const LEG = `<div style="text-align:center;font-size:18px;font-weight:500;line-height:1.45;color:rgba(255,255,255,.6)">${LEGAL}</div>`;
// rodapé único (serve pra qualquer loja): responde o status + site + Instagram
const rodape = `<div style="position:absolute;left:60px;right:60px;bottom:200px;display:flex;flex-direction:column;gap:20px">
  <div style="text-align:center;font-size:28px;font-weight:600">Responde este status que a gente <span class="am">te atende</span></div>${BOTOES}${LEG}</div>`;
const fundo = `<div class="bg"></div><div class="raios"></div><div class="grao"></div>`;
const html = (c) => `<!doctype html><html><head><meta charset="utf-8"><link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@800;900&family=Poppins:wght@500;600&display=swap" rel="stylesheet"><style>${CSS9}</style></head><body>${fundo}${c}</body></html>`;
const pagina = (miolo, capa) => html(`<div style="position:absolute;left:0;top:${capa ? 122 : 200}px;width:1080px;height:1350px;${capa ? "transform:scale(.92);transform-origin:50% 0" : ""}">${miolo}</div>${rodape}`);

// último status: as 6 lojas (bairro, endereço, WhatsApp de cada). Sem brinde (Kevin, 24/11).
const lojas = html(`<div class="fita" style="top:184px;transform:rotate(-2.5deg)">${rep("BLACK FRIDAY LAET • SÓ SEXTA 27/11")}</div>
  <img class="logo" src="${IMG.logo}" style="left:60px;top:300px;height:84px">${selo(948, 346, 92, "SÓ SEXTA", "27/11", 10)}
  <div class="m" style="position:absolute;left:60px;top:420px;font-size:92px;line-height:.9">Vem pra <span class="am">loja</span></div>
  <div style="position:absolute;left:60px;top:520px;font-size:28px;font-weight:600;color:rgba(255,255,255,.75)">6 lojas Laet no ABC e Zona Leste</div>
  <div style="position:absolute;left:60px;right:60px;top:580px;display:flex;flex-direction:column;gap:12px">
  ${Object.entries(LOJAS).map(([n, l]) => `<div style="height:118px;border-radius:20px;padding:0 26px;display:flex;align-items:center;justify-content:space-between;gap:16px;background:linear-gradient(180deg,#1E1E27,#141419);border:2px solid rgba(245,184,0,.22)">
    <div style="min-width:0"><div style="font-family:'Montserrat';font-weight:900;font-size:19px;letter-spacing:.1em;color:#F5B800">LOJA ${n} · ${l.cidade.toUpperCase()}</div>
      <div style="font-family:'Montserrat';font-weight:900;font-size:34px;letter-spacing:-.02em;margin-top:2px;white-space:nowrap">${l.bairro}</div>
      <div style="font-size:20px;font-weight:500;opacity:.78;white-space:nowrap">${l.end}</div></div>
    <div style="flex:none;text-align:right"><div style="font-size:17px;font-weight:600;opacity:.7">WhatsApp</div><div style="font-family:'Montserrat';font-weight:900;font-size:27px;white-space:nowrap">${l.zap}</div></div></div>`).join("")}</div>
  <div style="position:absolute;left:60px;right:60px;bottom:200px;display:flex;flex-direction:column;gap:20px">
    <div style="text-align:center;font-size:28px;font-weight:600">Responde este status que a gente <span class="am">te atende</span></div>${BOTOES}${LEG}</div>`);

const STATUS = { "01-capa": pagina(capa, true), "02-massas": pagina(massas), "03-vinil-gesso": pagina(dupla("vinil", "gesso")), "04-standard-lavavel": pagina(dupla("standard", "lavavel")), "05-epoxi-pisos": pagina(dupla("epoxi", "pisos")), "06-lojas": lojas };
const PEDIDO = { corrida: "32,99", acrilica: "49,99", vinil: "64,99", gesso: "139,99", standard: "159,99", lavavel: "229,99", epoxi: "99,99", pisos: "149,99" };
for (const [k, v] of Object.entries(PEDIDO)) if (P[k].preco !== v) throw new Error("PREÇO ERRADO " + k);
if (P.corrida.barrica !== "40,99" || P.acrilica.barrica !== "57,99") throw new Error("PREÇO BARRICA ERRADO");
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  const out = _path.join(__dirname, "todas-as-lojas"); _fs.mkdirSync(out, { recursive: true });
  for (const [nome, h] of Object.entries(STATUS)) {
    await p.setContent(h, { waitUntil: "networkidle" }); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(200);
    await p.screenshot({ path: _path.join(out, nome + ".png") });
  }
  await b.close(); console.log("ok, 6 status iguais pra todas as lojas, preços conferidos");
})();
