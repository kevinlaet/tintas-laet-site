// Stories v3 · textos novos (gancho de balcão), mesmas fotos e layouts do gerar.js. Sem emoji na arte.
const _fs=require("fs"),_path=require("path");
const src=_fs.readFileSync(_path.join(__dirname,"gerar.js"),"utf8");
eval(src.slice(0,src.indexOf("const S = {")).replace(/const /g,"var "));
const DOZE="Parcele em até 12x sem juros (consulte as condições)";
const selo=(a,b)=>`<div style="display:inline-flex;align-items:center;gap:22px;margin-top:34px;background:#FFC107;color:#062B63;border-radius:24px;padding:22px 34px;box-shadow:0 14px 30px rgba(0,0,0,.35)"><span style="font-weight:800;font-size:44px">${a}</span><span style="font-weight:900;font-size:76px">${b}</span></div>`;
const topo=(img,pos,titulo,sub,extra)=>pag(`${foto(img,pos)}${grad(cima)}${grad("linear-gradient(180deg,rgba(4,24,58,0) 58%,rgba(4,24,58,.92) 100%)")}
  <img class="logo" src="${LOGO}"><div style="position:absolute;left:70px;right:70px;top:470px"><div class="t" style="font-size:104px">${titulo}</div>${sub}</div>${zap(extra)}`);
const subl=(t)=>`<div class="sub" style="margin-top:26px">${t}</div>`;
// B com linha de apoio pequena embaixo das tarjas
const Bs=(img,pos,linhas,apoio)=>B(img,pos,linhas,"am").replace("</body>",`<div style="position:absolute;left:60px;right:60px;top:${300+linhas.length*131+30}px;font-weight:800;font-size:50px">${[].concat(apoio).map(a=>`<span class="tarja">${a}</span>`).join("<br>")}</div></body>`);
const V={
 "qua-1": A(H+"/ia-qua-corrida.png","center 40%","Essa massa tem <em>medo de água</em>.","Massa corrida: só quarto e sala."),
 "qua-2": A(H+"/ia-qua-banheiro.png","center 40%","Molhou? Massa <em>acrílica</em>.","Banheiro, cozinha e parede de fora."),
 "qua-3": Bs(H+"/ia-qua-textura.png","center",["Duvido você","acertar essa."],["Qual massa vai no banheiro?","Vota aí ↓"]),
 "qui-aviso": topo(F+"fachada-loja4.jpg","center 40%","Feriado? A gente <em>abre</em>.",selo("Sexta 20/11","8h às 13h"),""),
 "qui-1": D(C+"quanta-tinta-2026-11-19/slide-1.png","Faltou tinta no <em>meio da parede</em>?").replace("POST NOVO","A CONTA TÁ NO POST NOVO"),
 "qui-2": topo(H+"/ia-qui-trena.png","center 45%","Preguiça de fazer <em>conta</em>?",subl("Manda as medidas no Whats que a gente faz."),DOZE),
 "sex-aviso": topo(F+"loja-interior-clientes-2.jpg","center 45%","Feriado, mas <em>tamo aqui</em>.",selo("Hoje até","13h"),"Passa aqui ou chama no Whats"),
 "sex-1": Bs(H+"/ia-sex-preparo.png","center 55%",["Feriado é pra","descansar","ou pintar?"],"Vota aí ↓"),
 "sex-2": A(H+"/ia-sex-lixa.png","center 40%","Erro que <em>todo mundo</em> comete:","Pintar sem lixar e limpar antes."),
 "sex-3": topo(F+"vendedor-cliente-leque.jpg","center 35%","Não sabe qual <em>tinta</em> comprar?",subl("Manda a foto da parede no Whats."),DOZE),
 "sab-aviso": A(F+"loja-interior-rampa.jpg","center 50%","Sábado é dia de <em>obra</em>.",selo("Hoje","8h às 14h").replace("margin-top:34px","margin-top:10px")),
 "sab-2": D(C+"lojas-perto-2026-11-20/slide-1.png","Tem Laet do lado da <em>sua casa</em>."),
 "sab-3": topo(F+"fachada-loja5.jpg","center 40%","Ainda dá tempo. Até as <em>14h</em>.",subl("Passa aqui ou chama no Whats."),DOZE),
 "dom-2": Bs(H+"/ia-dom-parede-nova.png","center 45%",["Manda sua","dúvida de","pintura."],["Responde aqui que vira post ↓"]),
};
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});
 const out=_path.join(__dirname,"final-v3"); _fs.mkdirSync(out,{recursive:true});
 for(const [n,h] of Object.entries(V)){await p.setContent(h,{waitUntil:"networkidle"});await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(200);await p.screenshot({path:_path.join(out,n+".png")});}
 await b.close();console.log("ok",Object.keys(V).length);})();
