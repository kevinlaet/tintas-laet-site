// Avisos do feriado 20/11 (aberto 8h às 13h). Reaproveita helpers do gerar.js.
const _fs=require("fs"),_path=require("path");
const src=_fs.readFileSync(_path.join(__dirname,"gerar.js"),"utf8");
eval(src.slice(0,src.indexOf("const S = {")).replace(/const /g,"var "));
const hora=(dia,h)=>`<div style="display:inline-flex;align-items:center;gap:22px;margin-top:34px;background:#FFC107;color:#062B63;border-radius:24px;padding:22px 34px;box-shadow:0 14px 30px rgba(0,0,0,.35)"><span style="font-weight:800;font-size:44px">${dia}</span><span style="font-weight:900;font-size:76px">${h}</span></div>`;
const T={
 "qui-aviso": pag(`${foto(F+"fachada-loja4.jpg","center 40%")}${grad(cima)}${grad("linear-gradient(180deg,rgba(4,24,58,0) 58%,rgba(4,24,58,.92) 100%)")}
  <div style="position:absolute;left:70px;right:70px;top:290px"><div class="t" style="font-size:104px">Amanhã é feriado, mas a gente <em>abre</em>!</div>${hora("Sexta 20/11","8h às 13h")}</div>${zap()}`),
 "sex-aviso": pag(`${foto(F+"loja-interior-clientes-2.jpg","center 45%")}${grad(cima)}${grad("linear-gradient(180deg,rgba(4,24,58,0) 58%,rgba(4,24,58,.92) 100%)")}
  <div style="position:absolute;left:70px;right:70px;top:290px"><div class="t" style="font-size:104px">Feriado com loja <em>aberta</em>.</div>${hora("Hoje até","13h")}</div>${zap("Passa aqui ou chama no WhatsApp")}`),
 "sab-aviso": pag(`${foto(F+"loja-interior-rampa.jpg","center 50%")}${grad(baixo)}<img class="logo" src="${LOGO}">
  <div style="position:absolute;left:70px;right:70px;bottom:300px"><div class="t" style="font-size:118px">Sábado <em>normal</em>.</div>${hora("Hoje","8h às 14h")}</div>`),
};
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});
 for(const [n,h] of Object.entries(T)){await p.setContent(h,{waitUntil:"networkidle"});await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(200);await p.screenshot({path:_path.join(__dirname,"final",n+".png")});}
 await b.close();console.log("ok");})();
