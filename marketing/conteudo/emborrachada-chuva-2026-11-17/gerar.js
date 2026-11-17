// Carrossel 1 · Emborrachada (ter 17/11 19h) — 1080x1350, só fotos reais da loja + tipografia.
const { chromium } = require("playwright"); const fs=require("fs"), path=require("path");
const F="/home/user/tintas-laet-painel/render-worker/assets/fotos-reais/";
const uri=(p)=>"data:image/"+(p.endsWith(".png")?"png":"jpeg")+";base64,"+fs.readFileSync(p).toString("base64");
const LOGO=uri("/home/user/tintas-laet-site/identidade/logotipo branco-remove-bg-io.png");
const MASC=uri("/home/user/tintas-laet-site/identidade/mascote alta qualidade-remove-bg-io.png");
const ZAP='<svg viewBox="0 0 24 24" width="1em" height="1em"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm4.5 12.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1-1.4-.7-2.4-1.4-3.3-3-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.5l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.2s1 2.6 1.1 2.7c.1.2 1.9 2.9 4.6 4.1 1.7.7 2.4.8 3.2.7.5-.1 1.5-.6 1.8-1.2.2-.6.2-1.1.1-1.2l-.1-.7z"/></svg>';
const CSS=`*{margin:0;padding:0;box-sizing:border-box}html,body{width:1080px;height:1350px;overflow:hidden}
body{font-family:'Montserrat',sans-serif;position:relative;color:#fff;background:#062B63}
.foto{position:absolute;inset:0;background-size:cover;background-position:center}
.veu{position:absolute;inset:0;background:linear-gradient(180deg,rgba(6,43,99,.15) 0%,rgba(6,43,99,.25) 40%,rgba(4,24,58,.92) 78%,rgba(4,24,58,.97) 100%)}
.bl{position:absolute;left:84px;right:84px}
.t{font-weight:900;letter-spacing:-.02em;line-height:1.02}
.t em{font-style:normal;color:#FFC107}
.chip{display:inline-block;font-weight:800;font-size:28px;letter-spacing:.14em;text-transform:uppercase;color:#062B63;background:#FFC107;padding:12px 22px 10px;border-radius:10px}
.creme{background:#F5ECD7;color:#062B63}.creme .t em{color:#0D47A1;background:linear-gradient(transparent 62%,#FFC107 62%,#FFC107 92%,transparent 92%)}
.n{position:absolute;right:60px;top:52px;font-weight:800;font-size:24px;letter-spacing:.1em;opacity:.55}
.p{font-family:'Poppins',sans-serif;font-weight:600;font-size:40px;line-height:1.35}
.rod{position:absolute;left:0;right:0;bottom:52px;text-align:center;font-family:'Poppins',sans-serif;font-weight:700;font-size:30px}
.rod b{color:#FFC107}`;
const pag=(corpo,cls="")=>`<!doctype html><html><head><meta charset="utf-8"><link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@700;800;900&family=Poppins:wght@600;700&display=swap" rel="stylesheet"><style>${CSS}</style></head><body class="${cls}">${corpo}</body></html>`;
const N=(i)=>`<div class="n">${i}/6</div>`;
const S=[
 // 1 capa: dor, foto real, sem logo
 pag(`<div class="foto" style="background-image:url('${uri(__dirname+"/ia-capa-goteira.png")}');background-position:center 20%"></div><div class="veu"></div>${N(1)}
  <div class="bl" style="bottom:150px"><div class="chip">Chuva chegou</div><div class="t" style="font-size:118px;margin-top:30px">Choveu e<br><em>pingou</em> dentro<br>de casa?</div>
  <div class="p" style="margin-top:28px;opacity:.9">Arrasta pro lado →</div></div>`),
 // 2 temporada (laje na chuva)
 pag(`<div class="foto" style="background-image:url('${uri(__dirname+"/ia-laje-chuva.png")}');background-position:center 70%"></div>
  <div class="veu" style="background:linear-gradient(180deg,rgba(4,24,58,.95) 0%,rgba(4,24,58,.8) 34%,rgba(4,24,58,0) 62%)"></div>${N(2)}
  <div class="bl" style="top:130px"><div class="t" style="font-size:96px">Começou a<br>temporada de<br><em>chuva</em>.</div>
  <div class="p" style="margin-top:36px">Laje, telhado e muro já dão sinal: mancha, goteira, parede descascando.</div></div>`),
 // 3 produto: nome grande
 pag(`<div class="foto" style="background-image:url('${uri(__dirname+"/ia-aplicando.png")}');background-position:center 80%"></div><div class="veu" style="background:linear-gradient(180deg,rgba(4,24,58,.92) 0%,rgba(4,24,58,.78) 45%,rgba(4,24,58,.1) 75%)"></div>${N(3)}
  <div class="bl" style="top:110px"><div class="chip">O produto</div><div class="t" style="font-size:66px;margin-top:40px">Tinta</div>
  <div class="t" style="font-size:150px;color:#FFC107;line-height:.95">EMBOR&shy;RACHADA</div>
  <div class="p" style="margin-top:44px;font-size:46px">Forma uma película<br>tipo borracha.</div></div>`),
 // 4 a prova: foto real do Kevin, água escorrendo na Emborrachada
 pag(`<div class="foto" style="background-image:url('${uri(__dirname+"/real-agua-escorrendo.jpg")}');background-position:center 60%"></div>
  <div class="veu" style="background:linear-gradient(180deg,rgba(4,24,58,.94) 0%,rgba(4,24,58,.82) 30%,rgba(4,24,58,0) 55%,rgba(4,24,58,0) 78%,rgba(4,24,58,.85) 100%)"></div>${N(4)}
  <div class="bl" style="top:120px"><div class="chip">Teste de verdade</div><div class="t" style="font-size:104px;margin-top:34px">A água bate<br>e <em>escorre</em>.</div>
  <div class="p" style="margin-top:28px">É a nossa Emborrachada: hidrorrepelente. A água não entra.</div></div>
  <div style="position:absolute;left:84px;right:84px;bottom:70px;display:flex;gap:16px">${["Sol","Chuva","Microfissuras"].map(x=>`<div style="flex:1;display:flex;align-items:center;justify-content:center;gap:12px;background:rgba(255,255,255,.95);color:#062B63;border-radius:999px;padding:20px 10px;font-weight:800;font-size:32px"><span style="width:38px;height:38px;border-radius:50%;background:#FFC107;display:flex;align-items:center;justify-content:center;font-size:24px">✓</span>${x}</div>`).join("")}</div>
  <div style="position:absolute;right:84px;bottom:160px;font-family:Poppins;font-weight:600;font-size:22px;color:#fff;opacity:.85;text-shadow:0 2px 8px rgba(0,0,0,.6)">Foto real da Emborrachada Laet</div>`),
 // 5 a virada: chove de novo e nada pinga (teto limpo em cima, café embaixo)
 pag(`<div class="foto" style="background-image:url('${uri(__dirname+"/ia-depois-cozinha.png")}');background-position:center 85%"></div>
  <div class="veu" style="background:linear-gradient(180deg,rgba(4,24,58,.92) 0%,rgba(4,24,58,.75) 30%,rgba(4,24,58,0) 52%)"></div>${N(5)}
  <div class="bl" style="top:110px"><div class="chip">Depois da Emborrachada</div><div class="t" style="font-size:92px;margin-top:30px">Choveu de novo.<br>E dessa vez, <em>nada</em>.</div>
  <div class="p" style="margin-top:24px;opacity:.95">Só o barulho da chuva e o café quente.</div></div>`),
 // 6 fechamento: laje protegida + contato
 pag(`<div class="foto" style="background-image:url('${uri(__dirname+"/ia-depois-laje.png")}');background-position:center 55%"></div>
  <div class="veu" style="background:linear-gradient(180deg,rgba(4,24,58,.9) 0%,rgba(4,24,58,.55) 32%,rgba(4,24,58,0) 50%,rgba(4,24,58,.6) 70%,rgba(4,24,58,.96) 100%)"></div>
  <img src="${LOGO}" style="position:absolute;top:40px;left:84px;height:170px">
  <div class="bl" style="top:240px"><div class="t" style="font-size:96px">Sua laje pode<br>ficar <em>assim</em>.</div></div>
  <div class="bl" style="bottom:250px"><div class="p" style="font-size:40px">Manda uma foto da sua laje. A gente diz se a Emborrachada é a indicada e quanto você vai precisar.</div></div>
  <div style="position:absolute;left:84px;right:84px;bottom:120px;display:flex;align-items:center;justify-content:center;gap:18px;background:#FFC107;color:#062B63;border-radius:999px;padding:26px;font-weight:900;font-size:52px">${ZAP}(11) 97714-0964</div>
  <div class="rod"><b>@Tintaslaet</b> · tintaslaet.com</div>`),
];
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1350}});
 for(let i=0;i<S.length;i++){await p.setContent(S[i],{waitUntil:"networkidle"});await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(300);await p.screenshot({path:`slide-${i+1}.png`});}
 await b.close(); console.log("ok");})();
