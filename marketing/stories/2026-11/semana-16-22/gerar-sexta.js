// 3 stories novos de sexta 20/11 (feriado), mesmo padrão visual. Reaproveita o CSS e helpers do gerar.js.
const _fs=require("fs"),_path=require("path");
const src=_fs.readFileSync(_path.join(__dirname,"gerar.js"),"utf8");
const base=src.slice(0,src.indexOf("const DIAS = {"));
eval(base.replace(/const /g,"var "));
const T=[
 pag(`${fundo(F+"prateleira-tintas-2.jpg","center 40%")}<div class="bl" style="top:260px"><div class="chip">Feriado</div><div class="t" style="font-size:104px;margin-top:30px">Vai pintar alguma coisa no <em>feriado</em>?</div></div>${fig(1000,"[figurinha ENQUETE]<br>Sim, já comecei · Tô planejando")}`),
 pag(`<div class="foto" style="background:#F5ECD7"></div><img src="${POSE("explicando")}" style="position:absolute;right:10px;top:1180px;height:520px;filter:drop-shadow(0 16px 24px rgba(6,43,99,.35))">
  <div class="bl" style="top:240px;color:#062B63"><div class="chip">Dica de fim de semana</div><div class="t" style="font-size:88px;margin-top:30px">Antes da tinta, <span style="color:#0D47A1">prepara a parede</span>.</div></div>
  <div class="bl" style="top:720px;right:84px;display:grid;gap:22px;max-width:640px">
   ${[["1","Lixa o que tá solto"],["2","Tira o pó com pano"],["3","Corrige buraco com massa"],["4","Parede nova? Seladora antes"]].map(([n,t])=>`<div style="display:flex;align-items:center;gap:20px;background:#062B63;color:#fff;border-radius:22px;padding:26px 30px"><span style="flex:none;width:58px;height:58px;border-radius:50%;background:#FFC107;color:#062B63;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:34px">${n}</span><span class="p" style="font-size:38px">${t}</span></div>`).join("")}
  </div>
  <div class="bl" style="bottom:240px"><div class="p" style="font-size:36px;color:#062B63;max-width:640px">A tinta dura mais e rende melhor.</div></div>`,"creme"),
 pag(`${fundo(F+"vendedor-cliente-leque.jpg","center 35%")}<div class="bl" style="top:260px"><div class="t" style="font-size:96px">Manda a foto da <em>parede</em>.</div><div class="p" style="margin-top:24px">A gente indica a tinta certa.</div></div>${cta("Parcele em até 12x sem juros (consulte as condições)")}`),
];
(async()=>{const {chromium}=require("playwright");const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});
 fs.mkdirSync(path.join(__dirname,"20-sexta-novo"),{recursive:true});
 for(let i=0;i<T.length;i++){await p.setContent(T[i],{waitUntil:"networkidle"});await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(250);await p.screenshot({path:path.join(__dirname,"20-sexta-novo",`sexta-story-${i+1}.png`)});}
 await b.close();console.log("ok");})();
