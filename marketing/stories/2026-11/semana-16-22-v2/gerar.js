// Stories v2 · semana 16–22/11/2026 · 1080x1920. Título grande (máx. ~10 palavras), sem colchetes na arte,
// área limpa onde vai figurinha (a lista está em stories.txt). Layouts variados (A foto cheia + título embaixo,
// B "tarja" estilo Instagram, C foto + faixa azul, D repost). Logo oficial pequeno.
const { chromium } = require("playwright"); const fs = require("fs"), path = require("path");
const H = __dirname, F = "/home/user/tintas-laet-painel/render-worker/assets/fotos-reais/";
const C = "/home/user/tintas-laet-site/marketing/conteudo/";
const uri = (p) => "data:image/" + (p.endsWith(".png") ? "png" : "jpeg") + ";base64," + fs.readFileSync(p).toString("base64");
const LOGO = uri("/home/user/tintas-laet-site/identidade/logotipo branco-remove-bg-io.png");
const ZAP = '<svg viewBox="0 0 24 24" width="1em" height="1em"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm4.5 12.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1-1.4-.7-2.4-1.4-3.3-3-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.5l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.2s1 2.6 1.1 2.7c.1.2 1.9 2.9 4.6 4.1 1.7.7 2.4.8 3.2.7.5-.1 1.5-.6 1.8-1.2.2-.6.2-1.1.1-1.2l-.1-.7z"/></svg>';
const CSS = `*{margin:0;padding:0;box-sizing:border-box}html,body{width:1080px;height:1920px;overflow:hidden}
body{font-family:'Montserrat',sans-serif;position:relative;color:#fff;background:#062B63}
.foto{position:absolute;inset:0;background-size:cover;background-position:center}
.t{font-weight:900;letter-spacing:-.025em;line-height:1.0}.t em{font-style:normal;color:#FFC107}
.sub{font-family:'Poppins',sans-serif;font-weight:600;font-size:46px;line-height:1.3}
.logo{position:absolute;top:240px;left:64px;height:190px;filter:drop-shadow(0 4px 14px rgba(0,0,0,.45));z-index:5}
.tarja{display:inline;background:#fff;color:#062B63;box-decoration-break:clone;-webkit-box-decoration-break:clone;padding:6px 22px;border-radius:14px;line-height:1.42}
.tarja.am{background:#FFC107}
.zap{position:absolute;left:70px;right:70px;bottom:250px;display:flex;align-items:center;justify-content:center;gap:18px;background:#FFC107;color:#062B63;border-radius:999px;padding:30px;font-weight:900;font-size:60px;box-shadow:0 14px 34px rgba(0,0,0,.35)}
.zap small{display:block}
.mini{position:absolute;left:0;right:0;bottom:190px;text-align:center;font-family:Poppins;font-weight:600;font-size:28px;color:rgba(255,255,255,.9);text-shadow:0 2px 8px rgba(0,0,0,.6)}`;
const pag = (c) => `<!doctype html><html><head><meta charset="utf-8"><link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@800;900&family=Poppins:wght@600;700&display=swap" rel="stylesheet"><style>${CSS}</style></head><body>${c}</body></html>`;
const foto = (img, pos = "center") => `<div class="foto" style="background-image:url('${uri(img)}');background-position:${pos}"></div>`;
const grad = (de) => `<div class="foto" style="background:${de}"></div>`;
const baixo = "linear-gradient(180deg,rgba(4,24,58,.45) 0%,rgba(4,24,58,0) 22%,rgba(4,24,58,0) 48%,rgba(4,24,58,.88) 74%,rgba(4,24,58,.97) 100%)";
const cima = "linear-gradient(180deg,rgba(4,24,58,.92) 0%,rgba(4,24,58,.7) 30%,rgba(4,24,58,0) 52%,rgba(4,24,58,0) 80%,rgba(4,24,58,.6) 100%)";
const zap = (extra = "") => `<div class="zap">${ZAP}(11) 97714-0964</div><div class="mini">${extra || "@tintaslaet · tintaslaet.com"}</div>`;

// A: foto cheia, título grande embaixo
const A = (img, pos, titulo, sub = "") => pag(`${foto(img, pos)}${grad(baixo)}<img class="logo" src="${LOGO}">
  <div style="position:absolute;left:70px;right:70px;bottom:300px"><div class="t" style="font-size:118px">${titulo}</div>${sub ? `<div class="sub" style="margin-top:26px">${sub}</div>` : ""}</div>`);
// B: tarja branca/amarela no alto (estilo texto do Instagram), espaço livre embaixo pra figurinha
const B = (img, pos, linhas, cor = "") => pag(`${foto(img, pos)}${grad("linear-gradient(180deg,rgba(4,24,58,.35) 0%,rgba(4,24,58,0) 35%)")}
  <div style="position:absolute;left:60px;right:60px;top:300px;font-weight:900;font-size:92px;letter-spacing:-.02em">${linhas.map((l, i) => `<span class="tarja ${i === linhas.length - 1 ? cor : ""}">${l}</span>`).join("<br>")}</div>
  <img src="${LOGO}" style="position:absolute;left:50%;transform:translateX(-50%);bottom:220px;height:200px;filter:drop-shadow(0 4px 14px rgba(0,0,0,.55))">`);
// C: título no alto com degradê, CTA WhatsApp embaixo
const Cz = (img, pos, titulo, extra) => pag(`${foto(img, pos)}${grad(cima)}${grad("linear-gradient(180deg,rgba(4,24,58,0) 60%,rgba(4,24,58,.9) 100%)")}
  <img class="logo" src="${LOGO}"><div style="position:absolute;left:70px;right:70px;top:470px"><div class="t" style="font-size:110px">${titulo}</div></div>${zap(extra)}`);
// D: repost de carrossel
const D = (capa, titulo) => pag(`${grad("radial-gradient(ellipse 900px 700px at 50% 45%,#0D47A1 0%,#062B63 60%,#04183A 100%)")}
  <img class="logo" src="${LOGO}"><div style="position:absolute;left:70px;right:70px;top:470px"><div style="display:inline-block;background:#FFC107;color:#062B63;font-weight:900;font-size:36px;letter-spacing:.12em;padding:12px 26px;border-radius:12px">POST NOVO</div>
  <div class="t" style="font-size:100px;margin-top:26px">${titulo}</div></div>
  <img src="${uri(capa)}" style="position:absolute;left:230px;top:900px;width:620px;border-radius:26px;box-shadow:0 34px 70px rgba(0,0,0,.55);transform:rotate(-3deg)">`);

const S = {
  "seg-1": A(H + "/ia-seg-bastidor.png", "center 40%", "Bom dia da <em>Laet</em>.", "Prateleira cheia pra sua obra."),
  "seg-2": B(H + "/ia-seg-rolo.png", "center 60%", ["Qual cômodo", "você quer", "pintar?"], "am"),
  "ter-1": D(C + "emborrachada-chuva-2026-11-17/slide-1.png", "Chega de <em>goteira</em>."),
  "ter-2": A(H + "/ia-ter-mofo.png", "65% 30%", "Parede <em>mofando</em> na chuva?", "A gente te ajuda a resolver."),
  "ter-3": B(H + "/ia-ter-balcao.png", "center 55%", ["Ficou com", "dúvida de tinta?", "Pergunta aqui"], "am"),
  "qua-1": A(H + "/ia-qua-corrida.png", "center 40%", "Massa <em>corrida</em>: só lugar seco e interno.", "Quarto e sala."),
  "qua-2": A(H + "/ia-qua-banheiro.png", "center 40%", "Banheiro ou área externa? <em>Acrílica</em>.", "Cozinha também."),
  "qua-3": B(H + "/ia-qua-textura.png", "center", ["Teste rápido:", "qual massa vai", "no banheiro?"], "am"),
  "qui-1": D(C + "quanta-tinta-2026-11-19/slide-1.png", "Quanta tinta você <em>precisa</em>?"),
  "qui-2": Cz(H + "/ia-qui-trena.png", "center 45%", "Manda as <em>medidas</em> que a gente calcula.", "Parcele em até 12x sem juros (consulte as condições)"),
  "sex-1": B(H + "/ia-sex-preparo.png", "center 55%", ["Vai pintar", "alguma coisa", "no feriado?"], "am"),
  "sex-2": A(H + "/ia-sex-lixa.png", "center 40%", "Antes de pintar: <em>lixa, limpa e corrige</em>.", "A tinta dura mais."),
  "sex-3": Cz(F + "vendedor-cliente-leque.jpg", "center 35%", "Manda a foto da parede. A gente indica a <em>tinta</em>.", "Parcele em até 12x sem juros (consulte as condições)"),
  "sab-1": A(F + "loja-interior-rampa.jpg", "center 50%", "Bom dia! Aberto até as <em>14h</em>.", "6 lojas no ABC e Zona Leste."),
  "sab-2": D(C + "lojas-perto-2026-11-20/slide-1.png", "Tem Laet <em>pertinho</em> de você."),
  "sab-3": Cz(F + "fachada-loja5.jpg", "center 40%", "Passa aqui <em>hoje</em>.", "Aberto até as 14h · @tintaslaet"),
  "dom-1": B(H + "/ia-dom-sala.png", "92% 50%", ["Vocês", "responderam:"], "am"),
  "dom-2": B(H + "/ia-dom-sala.png", "88% 62%", ["Que post você", "quer ver na", "semana que vem?"], "am"),
};

(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  fs.mkdirSync(path.join(H, "final"), { recursive: true });
  for (const [n, h] of Object.entries(S)) {
    await p.setContent(h, { waitUntil: "networkidle" }); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(200);
    await p.screenshot({ path: path.join(H, "final", n + ".png") });
  }
  await b.close(); console.log("ok", Object.keys(S).length);
})();
