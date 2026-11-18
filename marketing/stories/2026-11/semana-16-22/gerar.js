// Stories semana 16–22/11/2026 (1080x1920). Fotos reais da loja/produto; IA só onde não existe foto.
// Área segura: nada importante acima de 220px nem abaixo de 1720px. Figurinhas (enquete, quiz, caixinha, link) entram no app.
const { chromium } = require("playwright"); const fs = require("fs"), path = require("path");
const F = "/home/user/tintas-laet-painel/render-worker/assets/fotos-reais/";
const SITE = "/home/user/tintas-laet-site/site/images/";
const C1 = "/home/user/tintas-laet-site/marketing/conteudo/emborrachada-chuva-2026-11-17/";
const C2 = "/home/user/tintas-laet-site/marketing/conteudo/quanta-tinta-2026-11-19/";
const C3 = "/home/user/tintas-laet-site/marketing/conteudo/lojas-perto-2026-11-20/";
const uri = (p) => "data:image/" + (p.endsWith(".png") ? "png" : "jpeg") + ";base64," + fs.readFileSync(p).toString("base64");
const LOGO = uri("/home/user/tintas-laet-site/identidade/logotipo branco-remove-bg-io.png");
const P = "/home/user/tintas-laet-painel/render-worker/assets/laetinho/";
const POSE = (n) => uri(P + n + ".png");
const ZAP = '<svg viewBox="0 0 24 24" width="1em" height="1em"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm4.5 12.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1-1.4-.7-2.4-1.4-3.3-3-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.5l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.2s1 2.6 1.1 2.7c.1.2 1.9 2.9 4.6 4.1 1.7.7 2.4.8 3.2.7.5-.1 1.5-.6 1.8-1.2.2-.6.2-1.1.1-1.2l-.1-.7z"/></svg>';
const CSS = `*{margin:0;padding:0;box-sizing:border-box}html,body{width:1080px;height:1920px;overflow:hidden}
body{font-family:'Montserrat',sans-serif;position:relative;color:#fff;background:#062B63}
.foto{position:absolute;inset:0;background-size:cover;background-position:center}
.veu{position:absolute;inset:0;background:linear-gradient(180deg,rgba(4,24,58,.82) 0%,rgba(4,24,58,.35) 30%,rgba(4,24,58,.2) 55%,rgba(4,24,58,.9) 82%,rgba(4,24,58,.97) 100%)}
.bl{position:absolute;left:84px;right:84px}
.t{font-weight:900;letter-spacing:-.02em;line-height:1.02}.t em{font-style:normal;color:#FFC107}
.chip{display:inline-block;font-weight:800;font-size:32px;letter-spacing:.14em;text-transform:uppercase;color:#062B63;background:#FFC107;padding:14px 26px 12px;border-radius:12px}
.p{font-family:'Poppins',sans-serif;font-weight:600;font-size:44px;line-height:1.35}
.creme{background:#F5ECD7;color:#062B63}.creme .t em{color:#0D47A1;background:linear-gradient(transparent 62%,#FFC107 62%,#FFC107 92%,transparent 92%)}
.fig{position:absolute;left:140px;right:140px;height:300px;border:5px dashed rgba(255,255,255,.75);border-radius:36px;display:flex;align-items:center;justify-content:center;font-family:Poppins;font-weight:700;font-size:34px;color:rgba(255,255,255,.85);text-align:center;padding:20px;background:rgba(255,255,255,.08)}
.creme .fig{border-color:rgba(6,43,99,.45);color:rgba(6,43,99,.7);background:rgba(6,43,99,.04)}
.zap{position:absolute;left:84px;right:84px;bottom:230px;display:flex;align-items:center;justify-content:center;gap:18px;background:#FFC107;color:#062B63;border-radius:999px;padding:30px;font-weight:900;font-size:58px}
.rod{position:absolute;left:0;right:0;bottom:170px;text-align:center;font-family:Poppins;font-weight:700;font-size:30px}.rod b{color:#FFC107}
.logo{position:absolute;top:230px;left:84px;height:150px}`;
const pag = (corpo, cls = "") => `<!doctype html><html><head><meta charset="utf-8"><link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@700;800;900&family=Poppins:wght@600;700&display=swap" rel="stylesheet"><style>${CSS}</style></head><body class="${cls}">${corpo}</body></html>`;
const fundo = (src, pos = "center") => `<div class="foto" style="background-image:url('${uri(src)}');background-position:${pos}"></div><div class="veu"></div>`;
const fig = (top, txt) => `<div class="fig" style="top:${top}px">${txt}</div>`;
const cta = (txt = "Chama no WhatsApp") => `<div class="bl" style="bottom:400px"><div class="p" style="font-size:44px">${txt}</div></div><div class="zap">${ZAP}(11) 97714-0964</div><div class="rod"><b>@tintaslaet</b> · tintaslaet.com</div>`;
const capaPost = (img, chip, titulo) => pag(`<div class="foto" style="background:#04183A"></div>
  <div class="bl" style="top:260px"><div class="chip">${chip}</div><div class="t" style="font-size:96px;margin-top:30px">${titulo}</div></div>
  <img src="${uri(img)}" style="position:absolute;left:150px;top:720px;width:780px;border-radius:28px;box-shadow:0 30px 60px rgba(0,0,0,.5);transform:rotate(-2deg)">
  <div class="bl" style="bottom:260px;text-align:center"><div class="p">Toca pra ver o post ↓</div></div>`);

const DIAS = {
  "18-quarta": [
    pag(`${fundo(F + "prateleira-tintas-1.jpg", "center 40%")}<div class="bl" style="bottom:330px"><div class="chip">Bastidor</div><div class="t" style="font-size:100px;margin-top:30px">Bom dia da <em>Laet</em>.</div><div class="p" style="margin-top:24px">Prateleira cheia esperando a sua obra.</div></div>`),
    pag(`${fundo(F + "loja-interior-clientes.jpg", "center 40%")}<img src="${POSE("explicando")}" style="position:absolute;right:30px;top:950px;height:640px;filter:drop-shadow(0 20px 30px rgba(0,0,0,.5))"><div class="bl" style="top:260px"><div class="chip">Caixinha</div><div class="t" style="font-size:92px;margin-top:30px">Qual sua dúvida de <em>pintura</em>?</div><div class="p" style="margin-top:24px">O Laetinho responde no sábado.</div></div>${fig(1000, "[figurinha CAIXINHA<br>de perguntas]").replace("right:140px", "right:440px")}`),
    pag(`<div class="foto" style="background:#F5ECD7"></div><div class="bl" style="top:240px;color:#062B63"><div class="chip">Dica rápida</div><div class="t" style="font-size:86px;margin-top:30px">Massa corrida ou <span style="color:#0D47A1">acrílica</span>?</div></div>
     <img src="${uri(SITE + "embalagens/barrica+plastico.png")}" style="position:absolute;left:50%;transform:translateX(-50%);top:600px;height:600px;filter:drop-shadow(0 20px 26px rgba(6,43,99,.3))">
     <div class="bl" style="top:1200px;display:grid;gap:22px">
      <div style="background:#062B63;color:#fff;border-radius:24px;padding:30px 36px"><div class="t" style="font-size:52px;color:#FFC107">Corrida</div><div class="p" style="font-size:36px;margin-top:8px">Só área interna e seca. Quarto e sala.</div></div>
      <div style="background:#0D47A1;color:#fff;border-radius:24px;padding:30px 36px"><div class="t" style="font-size:52px;color:#FFC107">Acrílica</div><div class="p" style="font-size:36px;margin-top:8px">Banheiro, cozinha e área externa.</div></div></div>`, "creme"),
    pag(`${fundo(F + "parede-ferramentas.jpg", "center 40%")}<div class="bl" style="top:260px"><div class="t" style="font-size:96px">Ficou na <em>dúvida</em>?</div><div class="p" style="margin-top:24px">Manda foto da parede que a gente indica a massa certa.</div></div>${cta()}`),
  ],
  "19-quinta": [
    capaPost(C2 + "slide-1.png", "Post novo", "Quanta tinta <em>eu preciso</em>?"),
    pag(`${fundo(C2 + "ia-capa-trena.png", "center 40%")}<div class="bl" style="top:260px"><div class="chip">Enquete</div><div class="t" style="font-size:100px;margin-top:30px">Já comprou tinta <em>errada</em>?</div></div>${fig(1050, "[figurinha ENQUETE]<br>Já sobrou · Já faltou")}`),
    pag(`${fundo(F + "fachada-loja2.jpg", "center 35%")}<div class="bl" style="top:260px"><div class="chip">Aviso</div><div class="t" style="font-size:100px;margin-top:30px">Amanhã é <em>feriado</em>.</div><div class="p" style="margin-top:24px">Horário das lojas: [CONFIRMAR]</div></div>${cta("Confirma pelo WhatsApp antes de sair")}`),
  ],
  "20-sexta": [
    pag(`${fundo(F + "fachada-loja4.jpg", "center 40%")}<div class="bl" style="bottom:330px"><div class="chip">Feriado</div><div class="t" style="font-size:104px;margin-top:30px">Horário de <em>hoje</em>:</div><div class="p" style="margin-top:24px;font-size:56px">[CONFIRMAR]</div></div>`),
    pag(`<div class="foto" style="background:#F5ECD7"></div><div class="bl" style="top:240px;color:#062B63"><div class="chip">Fim de semana</div><div class="t" style="font-size:92px;margin-top:30px">Tudo pra <span style="color:#0D47A1">começar</span> a pintura.</div></div>
     <img src="${uri(SITE + "ferramentas/kit-5-itens.jfif")}" style="position:absolute;left:50%;transform:translateX(-50%);top:640px;height:820px;border-radius:30px;box-shadow:0 24px 40px rgba(6,43,99,.25)">
     <div class="bl" style="bottom:280px;text-align:center"><div class="t" style="font-size:64px;color:#062B63">Kit Pintura 5 itens</div><div class="p" style="font-size:40px;color:#0D47A1;margin-top:8px">[CONFIRMAR preço]</div></div>`, "creme"),
    capaPost(C3 + "slide-1.png", "Post novo", "Tem uma Laet <em>perto de você</em>."),
    pag(`${fundo(F + "fachada-loja6.jpg", "center 35%")}<div class="bl" style="top:260px"><div class="t" style="font-size:100px">Amanhã aberto das <em>8h às 14h</em>.</div><div class="p" style="margin-top:24px">6 lojas no ABC e Zona Leste.</div></div>${cta()}`),
  ],
  "21-sabado": [
    pag(`${fundo(F + "loja-interior-rampa.jpg", "center 50%")}<div class="bl" style="bottom:330px"><div class="chip">Sábado</div><div class="t" style="font-size:110px;margin-top:30px">Bom dia! Aberto até as <em>14h</em>.</div></div>`),
    pag(`<div class="foto" style="background:#F5ECD7"></div><img src="${POSE("pensando")}" style="position:absolute;right:20px;top:1080px;height:600px;filter:drop-shadow(0 16px 24px rgba(6,43,99,.35))">
     <div class="bl" style="top:240px;color:#062B63"><div class="chip">O Laetinho responde</div><div class="t" style="font-size:80px;margin-top:30px">[PERGUNTA DA CAIXINHA]</div>
     <div class="p" style="margin-top:34px;right:300px;font-size:42px">[RESPOSTA: 1 pergunta por tela, texto curto. Fazer depois que as perguntas chegarem]</div></div>`, "creme"),
    pag(`<div class="foto" style="background:#F5ECD7"></div><img src="${POSE("apontando")}" style="position:absolute;right:20px;top:1080px;height:600px;filter:drop-shadow(0 16px 24px rgba(6,43,99,.35))">
     <div class="bl" style="top:240px;color:#062B63;right:84px"><div class="chip">O Laetinho responde</div><div class="t" style="font-size:86px;margin-top:30px">Parede nova <span style="color:#0D47A1">bebe tinta</span>?</div>
     <div class="p" style="margin-top:34px;font-size:44px;max-width:620px">Passa a seladora antes. Ela fecha os poros do reboco e economiza tinta.</div>
     <div class="p" style="margin-top:22px;font-size:32px;color:#6b7280;max-width:620px">(tema reserva, se a caixinha vier fraca)</div></div>`, "creme"),
    pag(`${fundo(F + "fachada-loja5.jpg", "center 40%")}<div class="bl" style="top:260px"><div class="t" style="font-size:96px">Passa <em>hoje</em> na loja.</div><div class="p" style="margin-top:24px">Aberto até as 14h.</div></div>${fig(700, "[figurinha LOCALIZAÇÃO]")}${cta()}`),
  ],
  "22-domingo": [
    pag(`${fundo(__dirname + "/ia-domingo.png", "center 50%")}<div class="bl" style="top:260px"><div class="chip">Resultado da semana</div><div class="t" style="font-size:96px;margin-top:30px">Vocês <em>responderam</em>:</div></div>${fig(820, "[colar o RESULTADO das enquetes<br>de quinta: Já sobrou × Já faltou]")}`),
    pag(`${fundo(__dirname + "/ia-domingo.png", "center 60%")}<div class="bl" style="top:260px"><div class="chip">Caixinha</div><div class="t" style="font-size:96px;margin-top:30px">Que post você quer ver na <em>semana que vem</em>?</div></div>${fig(1050, "[figurinha CAIXINHA<br>de perguntas]")}`),
    pag(`${fundo(F + "loja-interior-rampa.jpg", "center 45%")}<img src="${LOGO}" class="logo"><div class="bl" style="bottom:330px"><div class="t" style="font-size:100px">Amanhã às <em>8h</em> a gente tá de volta.</div><div class="p" style="margin-top:24px">Bom domingo!</div></div>`),
  ],
};

(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  for (const [dia, telas] of Object.entries(DIAS)) {
    fs.mkdirSync(path.join(__dirname, dia), { recursive: true });
    for (let i = 0; i < telas.length; i++) {
      await p.setContent(telas[i], { waitUntil: "networkidle" }); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(250);
      await p.screenshot({ path: path.join(__dirname, dia, `story-${i + 1}.png`) });
    }
  }
  await b.close(); console.log("ok");
})();
