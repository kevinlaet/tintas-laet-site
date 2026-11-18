// Carrossel 1 · Emborrachada (ter 17/11 19h) — 1080x1350, só fotos reais da loja + tipografia.
const { chromium } = require("playwright"); const fs=require("fs"), path=require("path");
const F="/home/user/tintas-laet-painel/render-worker/assets/fotos-reais/";
const uri=(p)=>"data:image/"+(p.endsWith(".png")?"png":"jpeg")+";base64,"+fs.readFileSync(p).toString("base64");
const F6=fs.existsSync(__dirname+"/real-laje-pintada.jpg")?__dirname+"/real-laje-pintada.jpg":F+"loja-interior-clientes.jpg";
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

const L=[
 {n:1,cid:"São Paulo",b:"Sapopemba · Vila Bela",e:"Av. Sapopemba, 25.723",z:"(11) 98082-0686",f:"fachada-loja1-sapopemba.jpg",p:"center 30%"},
 {n:2,cid:"Mauá",b:"Jardim São João",e:"Rua do Britador, 2",z:"(11) 97750-4434",f:"fachada-loja2.jpg",p:"center 35%"},
 {n:3,cid:"Mauá",b:"Jardim Santa Cecília",e:"Av. Ayrton Senna da Silva, 235",z:"(11) 97749-8813",f:"fachada-loja3.jpg",p:"center 30%"},
 {n:4,cid:"Santo André",b:"Vila Luzita",e:"Av. São Bernardo do Campo, 757",z:"(11) 94855-1977",f:"fachada-loja4.jpg",p:"center 40%"},
 {n:5,cid:"Mauá",b:"Jardim Itapark",e:"Av. Itapark, 4377",z:"(11) 91433-4875",f:"fachada-loja5.jpg",p:"center 40%"},
 {n:6,cid:"São Bernardo do Campo",b:"Santa Terezinha",e:"Av. Luís Pequini, 899",z:"(11) 91875-5095",f:"fachada-loja6.jpg",p:"center 35%"},
];
const card=(l)=>`<div style="display:flex;gap:30px;align-items:stretch;background:#fff;border-radius:30px;overflow:hidden;box-shadow:0 16px 34px rgba(6,43,99,.16);height:520px">
  <div style="flex:none;width:400px;position:relative;background:url('${uri(F+l.f)}') ${l.p}/cover">
   <div style="position:absolute;left:18px;top:18px;background:#FFC107;color:#062B63;font-weight:900;font-size:30px;padding:10px 18px;border-radius:12px">LOJA ${l.n}</div></div>
  <div style="flex:1;padding:44px 36px 40px 0;display:flex;flex-direction:column;justify-content:center;color:#062B63">
   <div class="t" style="font-size:${l.cid.length>12?50:66}px">${l.cid}</div>
   <div class="p" style="font-size:34px;color:#0D47A1;margin-top:10px">${l.b}</div>
   <div class="p" style="font-size:28px;color:#4b5563;margin-top:22px;font-weight:600">${l.e}</div>
   <div class="p" style="font-size:30px;margin-top:18px;display:flex;align-items:center;gap:10px;color:#062B63"><span style="color:#1FA855">${ZAP}</span>${l.z}</div></div></div>`;
const par=(a,b,i)=>pag(`${N(i)}<div class="bl" style="top:70px"><div class="chip">Tem Laet perto de você</div></div>
  <div class="bl" style="top:170px;display:grid;gap:34px">${card(L[a])}${card(L[b])}</div>`,"creme");
const S=[
 // 1 capa
 pag(`<div class="foto" style="background-image:url('${uri(F+"fachada-loja6.jpg")}');background-position:center 30%"></div><div class="veu"></div>${N(1)}
  <div class="bl" style="bottom:140px"><div class="chip">6 lojas</div><div class="t" style="font-size:84px;margin-top:30px">Mauá, Santo André, <em>São Bernardo do Campo</em> ou Zona Leste?</div>
  <div class="p" style="margin-top:26px">Tem uma Tintas Laet perto de você →</div></div>`),
 par(0,1,2), par(2,3,3), par(4,5,4),
 // 5 horário + retirada
 pag(`${N(5)}<div class="bl" style="top:120px"><div class="chip">Como funciona</div><div class="t" style="font-size:88px;margin-top:30px">Aberto pra <em>sua obra</em>.</div></div>
  <div class="bl" style="top:470px;display:grid;gap:26px">
   ${[["Segunda a sexta","8h às 18h"],["Sábado","8h às 14h"]].map(([d,h])=>`<div style="display:flex;justify-content:space-between;align-items:center;background:#062B63;color:#fff;border-radius:24px;padding:36px 40px"><span class="p" style="font-size:42px">${d}</span><span class="t" style="font-size:56px;color:#FFC107">${h}</span></div>`).join("")}
   <div class="p" style="font-size:28px;color:#4b5563">Feriado de hoje (20/11): [CONFIRMAR]</div>
   <div style="background:#fff;border-radius:24px;padding:34px 40px;box-shadow:0 12px 26px rgba(6,43,99,.1)"><div class="p" style="font-size:38px;color:#062B63">Retire na loja ou peça um <b>Uber ou Lalamove</b> pra buscar.</div><div class="p" style="font-size:28px;color:#6b7280;margin-top:10px">A corrida é por sua conta.</div></div>
  </div>`,"creme"),
 // 6 chamada
 pag(`<div class="foto" style="background-image:url('${uri(F+"loja-interior-clientes.jpg")}');background-position:center 50%"></div>
  <div class="veu" style="background:linear-gradient(180deg,rgba(4,24,58,.92) 0%,rgba(4,24,58,.6) 38%,rgba(4,24,58,.7) 60%,rgba(4,24,58,.97) 100%)"></div>
  <img src="${LOGO}" style="position:absolute;top:40px;left:84px;height:170px">
  <div class="bl" style="top:250px"><div class="t" style="font-size:90px">Comenta o seu <em>bairro</em>.</div>
  <div class="p" style="margin-top:28px;font-size:40px">A gente responde qual loja fica mais perto. Ou chama no WhatsApp e confirma se o produto tá na loja antes de sair.</div>
  <div class="p" style="margin-top:24px;font-size:32px;color:#FFC107">Parcele em até 12x sem juros (consulte as condições)</div></div>
  <div style="position:absolute;left:84px;right:84px;bottom:120px;display:flex;align-items:center;justify-content:center;gap:18px;background:#FFC107;color:#062B63;border-radius:999px;padding:26px;font-weight:900;font-size:52px">${ZAP}(11) 97714-0964</div>
  <div class="rod" style="font-size:26px"><b>@tintaslaet</b> · tintaslaet.com · A tinta nobre da comunidade</div>`),
];
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1350}});
 for(let i=0;i<S.length;i++){await p.setContent(S[i],{waitUntil:"networkidle"});await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(300);await p.screenshot({path:`slide-${i+1}.png`});}
 await b.close(); console.log("ok");})();
