// Carrossel 1 · Emborrachada (ter 17/11 19h) — 1080x1350, só fotos reais da loja + tipografia.
const { chromium } = require("playwright"); const fs=require("fs"), path=require("path");
const F="/home/user/tintas-laet-painel/render-worker/assets/fotos-reais/";
const uri=(p)=>"data:image/"+(p.endsWith(".png")?"png":"jpeg")+";base64,"+fs.readFileSync(p).toString("base64");
const _F6=fs.existsSync(__dirname+"/real-laje-pintada.jpg")?__dirname+"/real-laje-pintada.jpg":F+"loja-interior-clientes.jpg";
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

const AZ="#062B63", AM="#FFC107", AZ2="#0D47A1";
// figura: quarto visto de cima com as 4 paredes medidas
const figQuarto=`<svg viewBox="0 0 900 640" width="900" height="640" style="display:block;margin:0 auto">
 <rect x="230" y="120" width="440" height="400" rx="6" fill="#fff" stroke="${AZ}" stroke-width="22"/>
 <rect x="330" y="508" width="110" height="24" fill="#F5ECD7"/><path d="M330 520 A110 110 0 0 1 440 410" fill="none" stroke="${AZ2}" stroke-width="5" stroke-dasharray="10 8"/>
 <rect x="440" y="108" width="140" height="24" fill="#9ED6F9"/>
 ${[["3 m",450,85],["3 m",450,590],["3 m",160,330],["3 m",740,330]].map(([t,x,y])=>`<g><rect x="${x-70}" y="${y-38}" width="140" height="62" rx="31" fill="${AM}"/><text x="${x}" y="${y+6}" text-anchor="middle" font-family="Montserrat" font-weight="900" font-size="38" fill="${AZ}">${t}</text></g>`).join("")}
 <text x="450" y="330" text-anchor="middle" font-family="Poppins" font-weight="600" font-size="34" fill="${AZ}">quarto</text>
 <text x="450" y="372" text-anchor="middle" font-family="Poppins" font-weight="600" font-size="26" fill="#6b7280">visto de cima</text></svg>`;
// figura: as paredes "esticadas" numa faixa
const figFaixa=`<svg viewBox="0 0 920 520" width="920" height="520" style="display:block;margin:0 auto">
 ${[0,1,2,3].map(i=>`<rect x="${40+i*210}" y="120" width="200" height="260" fill="${["#DBABAB","#FFCE64","#588D82","#95D0F6"][i]}" stroke="#fff" stroke-width="6"/>`).join("")}
 <line x1="40" y1="430" x2="870" y2="430" stroke="${AZ}" stroke-width="6"/><line x1="40" y1="414" x2="40" y2="446" stroke="${AZ}" stroke-width="6"/><line x1="870" y1="414" x2="870" y2="446" stroke="${AZ}" stroke-width="6"/>
 <rect x="345" y="440" width="220" height="62" rx="31" fill="${AM}"/><text x="455" y="483" text-anchor="middle" font-family="Montserrat" font-weight="900" font-size="38" fill="${AZ}">12 m</text>
 <line x1="890" y1="120" x2="890" y2="380" stroke="${AZ}" stroke-width="6"/>
 <rect x="770" y="30" width="150" height="62" rx="31" fill="${AM}"/><text x="845" y="73" text-anchor="middle" font-family="Montserrat" font-weight="900" font-size="36" fill="${AZ}">2,6 m</text>
 <path d="M845 92 L890 118" stroke="${AZ}" stroke-width="5"/></svg>`;
// figura: parede com porta e janela recortadas
const figPorta=`<svg viewBox="0 0 900 520" width="900" height="520" style="display:block;margin:0 auto">
 <rect x="60" y="60" width="780" height="380" fill="#FFCE64"/>
 <rect x="140" y="170" width="160" height="270" fill="#F5ECD7" stroke="${AZ}" stroke-width="6" stroke-dasharray="16 10"/>
 <rect x="520" y="140" width="220" height="150" fill="#F5ECD7" stroke="${AZ}" stroke-width="6" stroke-dasharray="16 10"/>
 <text x="220" y="320" text-anchor="middle" font-family="Montserrat" font-weight="900" font-size="34" fill="${AZ}">porta</text>
 <text x="630" y="228" text-anchor="middle" font-family="Montserrat" font-weight="900" font-size="34" fill="${AZ}">janela</text>
 <text x="450" y="500" text-anchor="middle" font-family="Poppins" font-weight="600" font-size="30" fill="#6b7280">porta + janela ≈ 3 m²</text></svg>`;
// figura: 2 demãos (duas camadas) + balde
const figDemaos=`<svg viewBox="0 0 900 380" width="900" height="380" style="display:block;margin:0 auto">
 <rect x="60" y="90" width="320" height="220" rx="14" fill="#DBABAB" opacity=".55"/><rect x="100" y="60" width="320" height="220" rx="14" fill="#DBABAB"/>
 <text x="260" y="185" text-anchor="middle" font-family="Montserrat" font-weight="900" font-size="50" fill="${AZ}">28 m² × 2</text>
 <text x="490" y="205" text-anchor="middle" font-family="Montserrat" font-weight="900" font-size="80" fill="${AZ}">=</text>
 <rect x="560" y="90" width="300" height="190" rx="95" fill="${AZ}"/><text x="710" y="205" text-anchor="middle" font-family="Montserrat" font-weight="900" font-size="64" fill="${AM}">56 m²</text></svg>`;
const conta=(t)=>`<div style="display:inline-flex;align-items:center;gap:14px;background:${AZ};color:#fff;border-radius:999px;padding:18px 34px;font-weight:900;font-size:50px">${t}</div>`;
const passo=(n)=>`<div class="chip">Passo ${n} de 4</div>`;
const S=[
 // 1 capa
 pag(`<div class="foto" style="background-image:url('${uri(__dirname+"/ia-capa-trena.png")}');background-position:center 40%"></div><div class="veu"></div>${N(1)}
  <div class="bl" style="bottom:140px"><div class="chip">Antes de comprar</div><div class="t" style="font-size:100px;margin-top:30px">Comprou tinta e <em>faltou</em> no meio da parede?</div>
  <div class="p" style="margin-top:26px">A conta é fácil. Arrasta pro lado →</div></div>`),
 // 2 medir
 pag(`${N(2)}<div class="bl" style="top:110px">${passo(1)}<div class="t" style="font-size:78px;margin-top:28px">Meça cada parede e <em>some</em>.</div></div>
  <div style="position:absolute;left:0;right:0;top:420px">${figQuarto}</div>
  <div style="position:absolute;left:0;right:0;bottom:90px;text-align:center">${conta("3 + 3 + 3 + 3 = 12 m")}</div>`,"creme"),
 // 3 altura
 pag(`${N(3)}<div class="bl" style="top:110px">${passo(2)}<div class="t" style="font-size:78px;margin-top:28px">Agora vezes a <em>altura</em>.</div>
  <div class="p" style="margin-top:22px;font-size:36px">Imagina as paredes esticadas numa faixa só.</div></div>
  <div style="position:absolute;left:0;right:0;top:470px">${figFaixa}</div>
  <div style="position:absolute;left:0;right:0;bottom:90px;text-align:center">${conta("12 × 2,6 = 31 m²")}</div>`,"creme"),
 // 4 porta e janela
 pag(`${N(4)}<div class="bl" style="top:110px">${passo(3)}<div class="t" style="font-size:78px;margin-top:28px">Tire a porta e a <em>janela</em>.</div>
  <div class="p" style="margin-top:22px;font-size:36px">Ali não vai tinta.</div></div>
  <div style="position:absolute;left:0;right:0;top:470px">${figPorta}</div>
  <div style="position:absolute;left:0;right:0;bottom:90px;text-align:center">${conta("31 − 3 = 28 m²")}</div>`,"creme"),
 // 5 demãos + rendimento
 pag(`${N(5)}<div class="bl" style="top:110px">${passo(4)}<div class="t" style="font-size:78px;margin-top:28px">Vezes as <em>demãos</em>.</div>
  <div class="p" style="margin-top:22px;font-size:36px">Normalmente são 2. Confira na embalagem.</div></div>
  <div style="position:absolute;left:0;right:0;top:470px">${figDemaos}</div>
  <div class="bl" style="top:900px;background:#fff;border-radius:28px;padding:34px 38px;box-shadow:0 14px 30px rgba(6,43,99,.12)">
   <div class="p" style="font-size:34px;color:${AZ}">Agora é só ver <b>quanto a tinta rende</b> na embalagem.</div>
   <div class="p" style="font-size:30px;color:#4b5563;margin-top:14px">Ex.: a Super Profissional rende até 330 m² por demão no balde de 18L, com a parede preparada e selada.</div></div>`,"creme"),
 // 6 chamada
 pag(`<div class="foto" style="background-image:url('${uri(F+"prateleira-tintas-2.jpg")}');background-position:center 40%"></div>
  <div class="veu" style="background:linear-gradient(180deg,rgba(4,24,58,.92) 0%,rgba(4,24,58,.7) 40%,rgba(4,24,58,.97) 100%)"></div>
  <img src="${LOGO}" style="position:absolute;top:40px;left:84px;height:170px">
  <div class="bl" style="top:250px"><div class="t" style="font-size:88px">Deu preguiça<br>da <em>conta</em>?</div>
  <div class="p" style="margin-top:30px;font-size:40px">Manda as medidas do cômodo no WhatsApp. A gente calcula e passa o orçamento.</div>
  <div class="p" style="margin-top:26px;font-size:32px;color:#FFC107">12x sem juros acima de R$ 300 (consulte as condições)</div></div>
  <div style="position:absolute;left:84px;right:84px;bottom:120px;display:flex;align-items:center;justify-content:center;gap:18px;background:#FFC107;color:#062B63;border-radius:999px;padding:26px;font-weight:900;font-size:52px">${ZAP}(11) 97714-0964</div>
  <div class="rod" style="font-size:26px"><b>@tintaslaet</b> · tintaslaet.com · 6 lojas no ABC e Zona Leste</div>`),
];
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1350}});
 for(let i=0;i<S.length;i++){await p.setContent(S[i],{waitUntil:"networkidle"});await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(300);await p.screenshot({path:`slide-${i+1}.png`});}
 await b.close(); console.log("ok");})();
