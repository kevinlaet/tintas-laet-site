// Catálogo de Produtos Laet · versão final pra gráfica do RASCUNHO V7 do Kevin (24/11/2026).
// Regra do pedido: NÃO mudar conteúdo (textos, páginas, ordem, cartelas). Só acabamento e qualidade:
//  - tudo vetorial (texto e cores nítidos em qualquer zoom; o rascunho era foto JPEG da página);
//  - embalagens reais em alta (emb/, feito por preparar-embalagens.py: sem franja branca), todas no mesmo
//    tamanho e na mesma posição dentro do cartão, com sombra de contato realista (nada de sombra quadrada);
//  - cartelas 26 x 15 mm, hex da paleta oficial (identidade/cores/paleta-oficial.json da versão publicada);
//  - 3 mm de sangria em todo fundo que encosta na borda.
// Rodar: NODE_PATH=$(npm root -g) node marketing/catalogos/catalogo-v7-final/gerar.js
// 10 páginas (múltiplo de 2 pra gráfica): capa, 7 de produto, Massas & Complementos e lojas.
// Saída: catalogo-laet-grafica.pdf (216 x 303 mm, com sangria) e catalogo-laet-whatsapp.pdf (A4, leve).
const { chromium } = require("playwright"); const fs = require("fs"), path = require("path");
const { execFileSync } = require("child_process");
const D = __dirname, R = path.resolve(D, "../../..");
const PAL = JSON.parse(execFileSync("git", ["-C", R, "show", "origin/main:identidade/cores/paleta-oficial.json"], { encoding: "utf8" })).linhas;
const linha = (k) => PAL[k].cores.map((c) => ({ nome: c.nome, hex: c.hex.toUpperCase() }));
const cor = (k, n) => { const c = PAL[k].cores.find((x) => x.nome === n); if (!c) throw new Error("cor fora da paleta: " + n); return c.hex; };
const QR = require(path.join("/tmp/claude-0/-home-user/0c1c38fb-c8d2-50cb-ae85-bf67160e44c1/scratchpad/qrtool/node_modules/qrcode"));

// ---------- cartelas (mesma ordem e mesmos nomes do rascunho v7) ----------
const INCOLOR = { nome: "Incolor (Natural)", listrado: true };
const C = {
  grande: linha("paleta-grande"), standard: linha("standard"), super: linha("super-profissional"), vinil: linha("latex-vinil"),
  esmalte: [{ nome: "Branco", hex: "#FFFFFF" }, ...linha("esmalte-ecologico")], pisos: linha("piso-fachada"),
  epoxi: linha("epoxi-base-agua").map((c) => ({ ...c, hex: { "Laranja Suave": "#FFC79F", "Amarelo": "#F8D48F" }[c.nome] || c.hex })),  // mais claros: Kevin 25/11 (provisório)
  verniz: [INCOLOR, { nome: "Mogno", hex: "#9E4A22" }, { nome: "Imbuia", hex: "#4A2B1A" }],  // tons de madeira: hex do site
};
C.cimento = [{ nome: "Rosé", hex: "#FCEBD9" }, { nome: "Amarelo Laet 2", hex: "#FAF29D" }, { nome: "Bala de Iogurte", hex: "#F6ACCF" }, { nome: "Cinza Claro", hex: "#B4B4AA" }, { nome: "Verde Uva", hex: "#8BAD8A" }, { nome: "Azul Céu", hex: "#719DBA" }, { nome: "Concreto", hex: "#92927A" }, { nome: "Caixa Mágica", hex: "#8586C6" }, { nome: "Cinza Padrão", hex: "#898883" }, { nome: "Azeitona Passada", hex: "#8E7B43" }, { nome: "Pavão", hex: "#318889" }, { nome: "Jeans", hex: "#606D73" }, { nome: "Chumbo", hex: "#605F5A" }, { nome: "Dois Amores", hex: "#A63A3B" }, { nome: "Marrom Turco", hex: "#423529" }];  // do site (sem catálogo de referência)
const CONTAGEM = { grande: 110, standard: 84, super: 34, vinil: 18, esmalte: 33, pisos: 13, epoxi: 16, verniz: 3 };
for (const [k, n] of Object.entries(CONTAGEM)) if (C[k].length !== n) throw new Error(`cartela ${k}: ${C[k].length} cores, rascunho tem ${n}`);
const CERCA = ["Mistura de Mostarda", "Tangerina", "Curry Dourado", "Amarelo Laet", "Verde Piscina", "Mar de Arruda", "Mar Aberto", "Céu Sagrado", "Caixa Seca", "Lilás Delicado", "Flamingo Real", "Rosa Gloss", "Chá Quente", "Lícor Doce", "Ovelha"].map((n) => cor("paleta-grande", n));

// ---------- produtos (correções do Kevin 25/11: nobres / econômicas / revenda, 17 L e 3,4 L, Gesso Standard, Cobertura) ----------
const T17 = "18 L / 17 L · Branca e cores", T34 = "3,6 L / 3,4 L · Branca e cores";
const NOTA17 = "17 L e 3,4 L: cores médias e fortes.";
const NOTA800 = "17 L, 3,4 L e 800 ml: cores médias e fortes.";
const P = {
  emborrachada: { nome: "Emborrachada", sub: "Tinta que vira borracha com ótima cobertura", img: "emborrachada", desc: "Seca e vira uma película de borracha que ajuda na diminuição da temperatura e impermeabiliza a superfície, protegendo lajes, telhados, muros e fachadas.",
    specs: [["Uso", "Interno e externo"], ["Acabamento", "Semibrilho"], ["Rendimento", "Rende até 200 m² por demão · balde 18 L"]], disp: [T17, T34], nota: NOTA17 },
  lavavel: { nome: "Premium Lavável", img: "lavavel", desc: "Cobertura excelente, baixo odor, antimofo e antifungos, para parede de dentro e de fora. Lave sem medo com sabão neutro, água corrente e bucha macia.",
    specs: [["Uso", "Interno e externo"], ["Acabamento", "Fosco"], ["Rendimento", "Rende até 200 m² por demão · balde 18 L"]], disp: [T17, T34, "900 ml / 800 ml · Branca e cores"], nota: NOTA800 },
  cobertura: { nome: "Cobertura Absoluta", sub: "Ultra Premium", img: "cobertura", h: 36, desc: "O mais alto poder de cobertura e totalmente lavável! Para quem busca a maior cobertura possível, fechando a pintura com facilidade e agilidade.",
    specs: [["Uso", "Interno e externo"], ["Acabamento", "Fosco"], ["Rendimento", "Rende até 350 m² acabado no 18 L · 3,6 L até 70 m² acabado"]], disp: [T17, T34], nota: NOTA17 },
  pisos: { nome: "Pisos & Fachadas", img: "pisos", desc: "Aguenta o tráfego de carro, a chuva e o sol. Para garagem, calçada e fachada.",
    specs: [["Uso", "Interno e externo"], ["Acabamento", "Fosco"], ["Rendimento", "Rende até 300 m² por demão"]], disp: ["17 L · 13 cores", "3,4 L · 13 cores"] },
  epoxi: { nome: "Epóxi Base Água", sub: "Renove sem quebrar", img: "epoxi", h: 37, desc: "Pinta azulejo, pastilha, PVC, alvenaria, madeira e metais, sem quebrar nada. Seca rápido, sem cheiro forte, e forma uma película resistente, fácil de limpar.",
    specs: [["Acabamento", "Acetinado"], ["Rendimento", "Rende até 60 m² por demão no 3,6 L · 900 ml até 15 m²"]], disp: ["3,6 L", "900 ml"],
    nota: "Antes de pintar: é necessária limpeza profunda com removedor de gordura." },
  standard: { nome: "1ª Linha Standard", sub: "Acrílico concentrado", img: "standard", desc: "Tinta de baixo custo, concentrada, grossa e com bom poder de cobertura. Pode ser diluída em até 20%. Antimofo.",
    specs: [["Uso", "Interno e externo"], ["Acabamento", "Fosco"], ["Rendimento", "Rende até 300 m² por demão"]], disp: [T17, T34], nota: NOTA17 },
  gessostd: { nome: "Direto no Gesso Standard", sub: "Mais cobertura", img: "gessostd", desc: "Vai direto no gesso e no drywall, sem fundo preparador, e cobre mais. Sem cheiro e com propriedades antimofo.",
    specs: [["Uso", "Interno"], ["Rendimento", "Rende até 240 m² por demão"]], disp: [T17, T34], nota: NOTA17 },
  profissional: { nome: "Super Profissional", img: "profissional", desc: "Acrílica de ótima qualidade, cobre bem e tem propriedades antimofo. Indicada para parede de dentro de casa.",
    specs: [["Uso", "Interno"], ["Rendimento", "Rende até 330 m² por demão · média de 250 m²"]], disp: [T17, T34], nota: NOTA17 },
  gesso: { nome: "Direto no Gesso Profissional", sub: "Gesso e drywall", img: "gesso", desc: "Vai direto no gesso e no drywall: não precisa de fundo preparador. Prática, econômica e com bom acabamento.",
    specs: [["Uso", "Interno"], ["Rendimento", "Rende até 240 m² por demão"]], disp: [T17, T34], nota: NOTA17 },
  esmalte: { nome: "Esmalte Ecológico", sub: "Base água", img: "esmalte", h: 35, desc: "Sem solventes, baixo odor e alta resistência. Pinta ferro, madeira, parede e teto.",
    specs: [["Uso", "Interno e externo"], ["Acabamento", "Brilhante"], ["Rendimento", "Até 300 m² por demão · 18 L"]], disp: [T17, T34, "900 ml · Branca e cores"], nota: NOTA17 },
  verniz: { nome: "Verniz Base Água", img: "verniz", h: 41, desc: "Fundo e acabamento no mesmo produto: dispensa seladora. Realça os veios da madeira e resiste à chuva.",
    specs: [["Uso", "Interno e externo"], ["Acabamento", "Brilhante"], ["Rendimento", "Rende até 60 m² por demão no 3,6 L"]], disp: ["18 L", "3,6 L", "900 ml / 800 ml"], nota: "800 ml: cores médias e fortes." },
  corrida: { nome: "Massa Corrida", img: "massas", h: 34, desc: "Nivela e corrige a parede antes de pintar. Fácil de lixar. Só para área interna e seca, como quarto e sala.",
    specs: [["Uso", "Interno (área seca)"]], disp: ["1,5 kg", "5 kg", "Saco 23 kg", "Barrica 23 kg"] },
  acrilica: { nome: "Massa Acrílica", img: "massas", h: 34, desc: "Para parede de dentro e de fora e para lugares que pegam respingo de água, como banheiro e cozinha. Fácil de lixar.",
    specs: [["Uso", "Interno e externo"]], disp: ["1,5 kg", "5 kg", "Saco 23 kg", "Barrica 23 kg"] },
  cimento: { nome: "Efeito Cimento Queimado", sub: "Acabamento decorativo", img: "cimento", h: 37, desc: "Acabamento moderno de cimento queimado, com aplicação fácil. Para paredes e tetos, dentro e fora de casa.",
    specs: [["Uso", "Interno e externo"]], disp: ["5 kg", "20 kg"] },
  seladora: { nome: "Seladora", img: "seladora", h: 34, desc: "Para parede nova ou reboco novo que chupa muita tinta. Preenche os poros do reboco e faz você gastar menos tinta.",
    specs: [], disp: ["18 L", "3,6 L"] },
  fundo: { nome: "Fundo Preparador", img: "fundo", h: 34, desc: "Para reboco fraco e parede velha que esfarela ou descasca. Firma a superfície antes da tinta.",
    specs: [], disp: ["18 L", "3,6 L", "900 ml"] },
  vinil: { nome: "Látex Vinil", sub: "Opções secundárias", img: "vinil", h: 38, desc: "A opção mais econômica para parede interna e seca. Espere 8 horas entre uma demão e outra. Não use em área externa nem em parede úmida.",
    specs: [["Uso", "Interno"], ["Acabamento", "Fosco"], ["Rendimento", "Rende em média 100 m² · balde 18 L"]], disp: ["18 L · Branca e cores"] },
};
const QUAL = [["Parede velha que esfarela ou descasca", "Fundo Preparador"], ["Parede nova ou reboco novo que chupa tinta", "Seladora"],
  ["Corrigir parede de quarto e sala (área seca)", "Massa Corrida"], ["Banheiro, cozinha ou área externa", "Massa Acrílica"]];
const LOJAS = [
  [1, "Vila Bela", "São Paulo", "Av. Sapopemba, 25.723", "(11) 98082-0686"], [2, "Jardim São João", "Mauá", "Rua do Britador, 2", "(11) 97750-4434"],
  [3, "Jardim Santa Cecília", "Mauá", "Av. Ayrton Senna da Silva, 235", "(11) 97749-8813"], [4, "Vila Luzita", "Santo André", "Av. São Bernardo do Campo, 757", "(11) 94855-1977"],
  [5, "Jardim Itapark", "Mauá", "Av. Itapark, 4.377", "(11) 91433-4875"], [6, "Santa Terezinha", "São Bernardo do Campo", "Av. Luís Pequini, 899", "(11) 91875-5095"]];

// ---------- componentes ----------
const IMG = (k) => `IMG/${k}.png`;
const listrado = `repeating-linear-gradient(135deg,#FFFFFF 0 .9mm,#DADFE6 .9mm 1.35mm)`;
const sw = (x) => `<div class="sw"><div class="q${x.hex === "#FFFFFF" || x.listrado ? " clara" : ""}" style="background:${x.listrado ? listrado : x.hex}"></div><div class="qn">${x.nome}</div></div>`;
const cartela = (titulo, n, nota, lista, fim = true, cont = false) => `<div class="cart">
  <div class="ch"><div class="ct">${titulo} <span class="cdot">·</span> ${n}${cont ? ' <span class="ccont">(continuação)</span>' : ""}</div>${nota ? `<div class="cn">${nota}</div>` : ""}</div>
  <div class="cg">${lista.map(sw).join("")}</div>${fim ? '<div class="caviso">Cores aproximadas. Confira na loja antes de comprar.</div>' : ""}</div>`;
const card = (p, cls = "") => `<div class="card ${cls}"><span class="tick"></span>
  <div class="palco"><div class="luz"></div><div class="som2" style="width:${(p.h || 40) * 0.78}mm"></div><div class="som1" style="width:${(p.h || 40) * 0.62}mm"></div>
    ${p.leque ? `<div class="leq">${C.cimento.filter((_, i) => i % 2 === 0).map((c, i, a) => `<span style="background:${c.hex};transform:rotate(${-48 + i * (96 / (a.length - 1))}deg)"></span>`).join("")}<i></i></div>` : `<img src="${IMG(p.img)}" style="height:${p.h || 40}mm">`}</div>
  <div class="ctx"><div class="pn">${p.nome}</div>${p.sub ? `<div class="ps">${p.sub}</div>` : ""}<div class="pd">${p.desc}</div>
    ${p.specs.length ? `<div class="specs">${p.specs.map(([r, v]) => `<div class="sp"><div class="sr">${r}</div><div class="sv">${v}</div></div>`).join("")}</div>` : ""}
    <div class="disp"><span class="dr">Disponível em</span>${p.disp.map((d) => `<span class="chip">${d}</span>`).join("")}</div>
    ${p.nota ? `<div class="pnota">${p.nota}</div>` : ""}${p.tons ? `<div class="tons"><div class="sr">Tonalidades</div><div class="tg">${p.tons.map(sw).join("")}</div><div class="pnota" style="margin-top:.6mm">Incolor é o quadradinho listrado. Cores aproximadas.</div></div>` : ""}</div></div>`;
const secao = (titulo, rot = "Linha") => `<div class="sec"><div class="sl">${rot}</div><div class="st">${titulo}</div><div class="su"></div></div>`;
const parcele = `<div class="parc">Parcele em até 12x sem juros (consulte as condições).</div>`;
const pagina = (n, titulo, corpo) => `<div class="page"><div class="bleedbg"></div><div class="topo"></div><div class="trim">
  ${secao(titulo).replace('class="sec"', 'class="sec hd"')}<img class="hlogo" src="${IMG("logo-azul")}">
  <div class="corpo">${corpo}</div>
  <div class="rod"><span>tintaslaet.com</span><i>·</i><span>@tintaslaet</span><i>·</i><span>(11) 97714-0964</span><b>${String(n).padStart(2, "0")}</b></div></div></div>`;
const div = `<div class="div"></div>`;

// ---------- páginas (10) ----------
const capa = `<div class="page capa"><div class="bleedbg"></div><div class="topo am"></div><div class="trim">
  <img class="clogo" src="${IMG("logo-branco")}"><div class="cu"></div>
  <div class="ctit">Catálogo de Produtos</div><div class="csub">Tintas · Esmaltes · Vernizes · Epóxi</div></div>
  <img class="liq liqc" src="LIQ/liq-capa.png"><div class="liqfade fc"></div><div class="chao"></div>
  <div class="trim"><div class="latas">${[["epoxi", 44, 22], ["lavavel", 56, 52], ["emborrachada", 70, 87], ["cobertura", 66, 126], ["pisos", 56, 162], ["standard", 46, 191]].map(([k, h, x]) =>
    `<div class="cl" style="left:${x}mm;z-index:${h}"><div class="ls2" style="width:${h * 0.95}mm"></div><div class="ls1" style="width:${h * 0.7}mm"></div><img src="${IMG(k)}" style="height:${h}mm"><img class="refl" src="${IMG(k)}" style="height:${h}mm"></div>`).join("")}</div>
  <div class="cpe">tintaslaet.com <i>·</i> @tintaslaet</div></div></div>`;

const G = C.grande, S = C.standard, SP = C.super, ES = C.esmalte;
const VG = "Vale para: Emborrachada, Premium Lavável e Cobertura Absoluta";
const VS = "Vale para: 1ª Linha Standard e Direto no Gesso Standard";
const VP = "Vale para: Super Profissional e Direto no Gesso Profissional · as mesmas 34 cores";
const CG = 56, CS = 21;   // onde as cartelas grandes quebram de página (12 páginas, com respiro)
const solta = (h) => h.replace('<div class="cart">', '<div class="cart solta">');
const faixa = `<div class="parc alta">Parcele em até 12x sem juros (consulte as condições).<img class="liqs" src="LIQ/liq-faixa.png"></div>`;
const p2 = pagina(2, "Nobre", card(P.emborrachada) + card(P.lavavel) + card(P.cobertura) + faixa);
const p3 = pagina(3, "Nobre", solta(cartela("CARTELA PALETA GRANDE", "110 cores", VG, G.slice(0, CG), false)));
const p4 = pagina(4, "Nobre", solta(cartela("CARTELA PALETA GRANDE", "110 cores", VG, G.slice(CG), true, true)));
const p5 = pagina(5, "Nobre", card(P.pisos) + cartela("CARTELA PISOS & FACHADAS", "13 cores", "Vale para: Pisos & Fachadas", C.pisos)
  + card(P.epoxi) + cartela("CARTELA EPÓXI BASE ÁGUA", "16 cores", "Vale para: Epóxi Base Água · ordem combinada", C.epoxi));
const p6 = pagina(6, "Nobre", card(P.standard) + card(P.gessostd) + cartela("CARTELA 1ª LINHA STANDARD", "84 cores", VS, S.slice(0, CS), false));
const p7 = pagina(7, "Nobre", solta(cartela("CARTELA 1ª LINHA STANDARD", "84 cores", VS, S.slice(CS), true, true)));
const p8 = pagina(8, "Econômica", card(P.profissional) + card(P.gesso) + cartela("CARTELA PROFISSIONAL E GESSO", "34 cores", VP, SP));
const p9 = pagina(9, "Madeiras & Metais", card(P.esmalte) + solta(cartela("CARTELA ESMALTE ECOLÓGICO", "32 cores + Branco", "Vale para: Esmalte Ecológico · todos os tamanhos", ES)));
const p10 = pagina(10, "Madeiras & Metais", card(P.verniz) + cartela("CARTELA VERNIZ BASE ÁGUA", "3 tonalidades", "Vale para: Verniz Base Água · Incolor é o quadradinho listrado", C.verniz)
  + div + secao("Efeitos Decorativos") + card(P.cimento) + cartela("CARTELA EFEITO CIMENTO QUEIMADO", "15 cores", "Vale para: Efeito Cimento Queimado", C.cimento));
const p11 = pagina(11, "Massas & Complementos", `<div class="g2c">${["corrida", "acrilica", "seladora", "fundo"].map((k) => card(P[k], "meia")).join("")}</div>`
  + div + secao("Látex Vinil", "Também vendemos") + card(P.vinil, "revenda") + cartela("CARTELA LÁTEX VINIL", "18 cores", "Vale para: Látex Vinil · só no 18 L", C.vinil));
const p12 = (qr) => `<div class="page lojas"><div class="bleedbg"></div><div class="topo am"></div><img class="liq liql" src="LIQ/liq-lojas.png"><div class="liqfade fl"></div><div class="trim">
  <img class="llogo" src="${IMG("logo-branco")}"><div class="ltit">Nossas Lojas</div><div class="lu"></div><div class="lhr">Segunda a sexta 8h às 18h <i>·</i> Sábado 8h às 14h</div>
  <div class="lg">${LOJAS.map(([n, b, c, e, z]) => `<div class="lj"><span class="lchip">Loja ${n}</span><div class="lb">${b}</div><div class="lc">${c}</div><div class="le">${e}</div><div class="lz">WhatsApp ${z}</div></div>`).join("")}</div>
  <div class="lct"><div class="lbx"><small>WhatsApp central</small>(11) 97714-0964</div><div class="lbx"><small>Instagram</small>@tintaslaet</div><div class="lbx"><small>Site das lojas</small>tintaslaet.com/lojas</div>
    <div class="qr">${qr}</div></div>
  <div class="lpar">Parcele em até 12x sem juros (consulte as condições).</div>
</div></div>`;

// ---------- estilo (mm; trim = A4 210 x 297, sangria = var(--b)) ----------
const CSS = (b) => `@page{size:${210 + 2 * b}mm ${297 + 2 * b}mm;margin:0}
*{margin:0;padding:0;box-sizing:border-box}
html,body{-webkit-print-color-adjust:exact;print-color-adjust:exact;background:#fff}
body{font-family:'Poppins',sans-serif;color:#212529;-webkit-font-smoothing:antialiased}
.page{position:relative;width:${210 + 2 * b}mm;height:${297 + 2 * b}mm;overflow:hidden;page-break-after:always;background:#F0F2F5}
.bleedbg{position:absolute;inset:0;background:radial-gradient(ellipse 140% 60% at 50% 0%,#F7F8FA 0%,#F0F2F5 60%,#EBEEF2 100%)}
.trim{position:absolute;left:${b}mm;top:${b}mm;width:210mm;height:297mm}
.topo{position:absolute;left:0;right:0;top:0;height:${b + 2.6}mm;background:#062B63;border-bottom:.9mm solid #FFC107}
.topo.am{height:${b + 1.4}mm;background:#FFC107;border:0}
/* cabeçalho */
.sec{margin:0 0 3mm}.sl{font-family:'Montserrat';font-weight:700;font-size:7pt;letter-spacing:.32em;text-transform:uppercase;color:#1976D2}
.st{font-family:'Montserrat';font-weight:800;font-size:17pt;line-height:1.05;text-transform:uppercase;color:#062B63;letter-spacing:-.005em;margin-top:.6mm}
.su{width:9mm;height:1.1mm;border-radius:.6mm;background:#FFC107;margin-top:1.6mm}
.sec.hd{position:absolute;left:10mm;top:8.5mm;margin:0}
.hlogo{position:absolute;right:10mm;top:7.2mm;height:14.5mm}
.corpo{position:absolute;left:10mm;right:10mm;top:25.5mm;bottom:14.3mm;display:flex;flex-direction:column;justify-content:space-evenly}
.rod{position:absolute;left:10mm;right:10mm;bottom:6.5mm;height:6.5mm;border-top:.25mm solid #D3DAE4;display:flex;align-items:flex-end;gap:2mm;font-size:7.6pt;color:#4A5568}
.rod i{font-style:normal;color:#AAB4C3}.rod b{margin-left:auto;font-family:'Bebas Neue';font-weight:400;font-size:12pt;letter-spacing:.04em;color:#fff;background:#062B63;border-radius:3mm;padding:.5mm 3.2mm .2mm;line-height:1.1;transform:translateY(.6mm)}
/* cartão de produto */
.card{position:relative;flex:none;display:flex;min-height:45mm;border-radius:3.2mm;background:linear-gradient(160deg,#0C3A80 0%,#082F6B 45%,#062B63 100%);box-shadow:0 1.4mm 3.2mm rgba(6,43,99,.20),0 .3mm .6mm rgba(6,43,99,.12);color:#fff;margin-bottom:3mm;overflow:hidden}
.card::after{content:"";position:absolute;inset:0;border-radius:3.2mm;box-shadow:inset 0 .25mm 0 rgba(255,255,255,.10);pointer-events:none}
.tick{position:absolute;left:3mm;top:5mm;width:1.1mm;height:7mm;border-radius:.6mm;background:#FFC107;z-index:3}
.palco{position:relative;flex:none;width:52mm;display:flex;align-items:flex-end;justify-content:center;padding-bottom:4.2mm}
.palco .luz{position:absolute;left:2mm;right:2mm;top:2mm;bottom:1.5mm;background:radial-gradient(ellipse 62% 58% at 50% 62%,rgba(120,170,255,.30) 0%,rgba(80,130,230,.12) 45%,transparent 75%)}
.palco img{position:relative;z-index:3;filter:drop-shadow(0 .5mm .5mm rgba(0,0,0,.35))}
.som2,.som1{position:absolute;left:50%;transform:translateX(-50%);border-radius:50%;z-index:2}
.som2{bottom:2.2mm;height:4.6mm;background:radial-gradient(ellipse at center,rgba(0,8,25,.55) 0%,rgba(0,8,25,.25) 45%,transparent 72%)}
.som1{bottom:3.4mm;height:1.8mm;background:radial-gradient(ellipse at center,rgba(0,5,18,.85) 0%,rgba(0,5,18,.45) 50%,transparent 78%)}
.ctx{flex:1;min-width:0;padding:4.2mm 7mm 3.9mm 1mm;display:flex;flex-direction:column;justify-content:center}
.pn{font-family:'Montserrat';font-weight:800;font-size:16pt;line-height:1.05;text-transform:uppercase;letter-spacing:-.005em}
.ps{font-style:italic;font-weight:600;font-size:9pt;color:#FFC107;margin-top:.6mm}
.pd{font-size:8.4pt;line-height:1.42;color:#EAEFF7;margin-top:1.6mm}
.specs{display:flex;gap:6mm;margin-top:2.2mm}
.sr{font-family:'Montserrat';font-weight:700;font-size:6.6pt;letter-spacing:.06em;text-transform:uppercase;color:#FFC107}
.sv{font-size:8.2pt;font-weight:500;line-height:1.3;color:#fff}
.disp{display:flex;align-items:center;flex-wrap:wrap;gap:1.5mm;margin-top:2.4mm}
.dr{font-family:'Montserrat';font-weight:700;font-size:6.6pt;letter-spacing:.06em;text-transform:uppercase;color:#FFC107;margin-right:1.4mm}
.chip{font-weight:600;font-size:7.6pt;color:#062B63;background:#fff;border-radius:1.8mm;padding:.7mm 2.4mm .5mm;box-shadow:0 .3mm .6mm rgba(0,0,0,.18)}
.pnota{font-size:7.2pt;color:#C3CDDD;margin-top:1.4mm}
/* cartela */
.cart{flex:none;margin-bottom:2.4mm}
.ch{display:flex;flex-wrap:wrap;align-items:baseline;column-gap:4mm;row-gap:.6mm;margin-bottom:2.4mm;position:relative;padding-bottom:1.6mm}
.ch::after{content:"";position:absolute;left:0;bottom:0;width:9mm;height:1mm;border-radius:.5mm;background:#FFC107}
.ch.dupla{flex-direction:column;gap:.6mm}
.ct{font-family:'Montserrat';font-weight:800;font-size:10.4pt;color:#062B63;text-transform:none;white-space:nowrap}
.ct{font-variant:normal}.cdot{color:#1976D2;margin:0 .6mm}.ccont{font-weight:700}
.cn{font-size:7.6pt;color:#5A6577;white-space:nowrap}
.cg{display:grid;grid-template-columns:repeat(7,26mm);justify-content:space-between;row-gap:1.05mm}
.q{width:26mm;height:15mm;border-radius:1.6mm;box-shadow:inset 0 0 0 .15mm rgba(0,0,0,.08)}  /* sem sombra por fora: a cor ocupa exatamente 26 x 15 mm */
.q.clara{box-shadow:inset 0 0 0 .2mm #C9D2DE}
.qn{font-size:6.4pt;font-weight:500;color:#2D3748;text-align:center;margin-top:.7mm;line-height:1.05;height:2.6mm;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.caviso{font-size:7.2pt;color:#5A6577;text-align:right;margin-top:1.1mm}
.parc{flex:none;border-radius:3.2mm;background:linear-gradient(160deg,#0C3A80,#062B63);color:#FFC107;font-weight:600;font-size:8.6pt;padding:3.1mm 6mm;box-shadow:0 1mm 2.4mm rgba(6,43,99,.18)}
.parc.alta{position:relative;height:25mm;overflow:hidden;padding-top:3.4mm}
.parc.alta .cerca{position:absolute;left:0;right:0;bottom:0;height:12mm}
.div{flex:none;height:.25mm;background:#D3DAE4;margin:.4mm 0 2.4mm}
/* meia largura (massas) e revenda */
.g2c{display:grid;grid-template-columns:1fr 1fr;column-gap:4mm;flex:none}
.card.meia{min-height:52mm}.card.meia .palco{width:34mm}.card.meia .ctx{padding:4.6mm 4.6mm 4mm 0}.card.meia .pn{font-size:12.5pt}.card.meia .pd{font-size:7.8pt}
.card.meia .chip{font-size:7pt;padding:.6mm 1.8mm .4mm}.card.meia .disp{gap:1.1mm}.card.meia .dr{width:100%;margin-bottom:.3mm}
.card.revenda{background:linear-gradient(160deg,#4A5260 0%,#3A414D 50%,#2E343E 100%)}.card.revenda .tick{background:#AAB4C3}.card.revenda .ps{color:#D3DAE4}.card.revenda .sr,.card.revenda .dr{color:#D3DAE4}
/* leque de cores (produto sem foto real) */
.leq{position:relative;z-index:3;width:40mm;height:36mm}
.leq span{position:absolute;left:50%;bottom:2mm;width:9mm;height:30mm;margin-left:-4.5mm;border-radius:1.6mm;transform-origin:50% 92%;box-shadow:0 .4mm 1mm rgba(0,0,0,.35),inset 0 0 0 .2mm rgba(255,255,255,.25)}
.leq i{position:absolute;left:50%;bottom:2.6mm;width:3.4mm;height:3.4mm;margin-left:-1.7mm;border-radius:50%;background:#E8ECF2;box-shadow:0 .3mm .6mm rgba(0,0,0,.4)}
.tons{margin-top:2.2mm}.tons .tg{display:inline-flex;gap:2.4mm;margin-top:1mm;background:#fff;border-radius:2mm;padding:2.2mm 2.6mm 1.6mm}.tons .qn{color:#2D3748}
/* guia "qual usar" */
.qual{flex:none;border-radius:3.2mm;background:#fff;box-shadow:0 1mm 2.4mm rgba(6,43,99,.12);padding:4.2mm 6mm 3.4mm;margin-top:.6mm}
.qt{font-family:'Montserrat';font-weight:800;font-size:11pt;color:#062B63;text-transform:uppercase;margin-bottom:2mm}
.qt::after{content:"";display:inline-block;width:9mm;height:1mm;border-radius:.5mm;background:#FFC107;margin-left:3mm;vertical-align:middle}
.qr2{display:flex;justify-content:space-between;align-items:center;font-size:8.4pt;color:#2D3748;padding:1.7mm 0;border-top:.25mm solid #E2E7EF}
.qr2 b{font-family:'Montserrat';font-weight:700;color:#0D47A1}
.cart.solta .cg{row-gap:4.6mm}.cart.solta .ch{margin-bottom:4mm}
/* tinta líquida (tinta-liquida.py) */
.liq{position:absolute;left:0;width:100%;object-fit:cover}
.liqc{top:${b + 131}mm;height:${172 - b}mm}.liql{top:${b + 219}mm;height:${78 + b}mm}
.liqfade{position:absolute;left:0;right:0}
.liqfade.fc{top:${b + 130}mm;height:28mm;background:linear-gradient(180deg,#0A3C8C 0%,rgba(10,60,140,.85) 25%,rgba(10,60,140,0) 100%)}
.liqfade.fl{top:${b + 218}mm;height:22mm;background:linear-gradient(180deg,#0B3F92 0%,rgba(11,63,146,.8) 30%,rgba(11,63,146,0) 100%)}
.liqs{position:absolute;left:0;right:0;bottom:0;width:100%;height:12mm;object-fit:cover}
/* cerca de cores (pontas arredondadas, leve volume como paleta de tinta) */
.cerca{display:flex;align-items:flex-end;gap:.5mm}
.cerca div{flex:1;border-radius:50mm 50mm 0 0/12mm 12mm 0 0;background:linear-gradient(90deg,rgba(255,255,255,.16) 0%,rgba(255,255,255,0) 35%,rgba(0,0,0,0) 70%,rgba(0,0,0,.10) 100%),var(--c);box-shadow:inset 0 .4mm 0 rgba(255,255,255,.25)}
/* capa */
.capa .bleedbg{background:radial-gradient(ellipse 90% 45% at 50% 18%,#1658B8 0%,#0D47A1 45%,#0A3C8C 75%,#073170 100%)}
.clogo{position:absolute;left:50%;transform:translateX(-50%);top:15mm;width:150mm}
.cu{position:absolute;left:50%;transform:translateX(-50%);top:101mm;width:18mm;height:1.3mm;border-radius:.7mm;background:#FFC107}
.ctit{position:absolute;left:0;right:0;top:104.5mm;text-align:center;font-family:'Bebas Neue';font-size:45pt;line-height:1;color:#fff;letter-spacing:.01em}
.csub{position:absolute;left:0;right:0;top:123mm;text-align:center;font-family:'Montserrat';font-weight:700;font-size:7.4pt;letter-spacing:.32em;text-transform:uppercase;color:#FFE082}
.cerca.cc{position:absolute;left:0;right:0;top:${b + 133}mm;bottom:0;gap:.6mm}
.chao{position:absolute;left:0;right:0;bottom:0;height:${b + 70}mm;background:linear-gradient(180deg,rgba(7,40,98,0) 0%,rgba(7,40,98,.55) 30%,#062B63 62%,#04214E 100%)}
.latas{position:absolute;left:0;right:0;top:0;bottom:0}
.cl{position:absolute;bottom:26mm;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center}
.cl img{display:block;position:relative;z-index:2;filter:drop-shadow(0 1mm 1.2mm rgba(0,0,0,.35))}
.cl .refl{position:absolute;top:100%;z-index:1;transform:scaleY(-1);opacity:.18;filter:blur(.25mm);-webkit-mask-image:linear-gradient(0deg,#000 0%,transparent 28%);mask-image:linear-gradient(0deg,#000 0%,transparent 28%)}
.ls2,.ls1{position:absolute;bottom:-2.4mm;border-radius:50%;z-index:1}
.ls2{height:6mm;background:radial-gradient(ellipse,rgba(0,6,20,.65) 0%,rgba(0,6,20,.28) 45%,transparent 72%)}
.ls1{bottom:-1mm;height:2.2mm;background:radial-gradient(ellipse,rgba(0,4,14,.9) 0%,rgba(0,4,14,.5) 50%,transparent 80%)}
.cpe{position:absolute;left:0;right:0;bottom:9mm;text-align:center;color:#fff;font-weight:600;font-size:9.4pt;letter-spacing:.04em}.cpe i{font-style:normal;color:#FFC107;margin:0 2mm}
/* lojas */
.lojas .bleedbg{background:radial-gradient(ellipse 90% 50% at 50% 22%,#1658B8 0%,#0D47A1 45%,#0A3C8C 75%,#073170 100%)}
.cerca.cl9{position:absolute;left:0;right:0;top:${b + 207}mm;bottom:0;gap:.6mm}
.llogo{position:absolute;left:50%;transform:translateX(-50%);top:10mm;width:64mm}
.ltit{position:absolute;left:0;right:0;top:48mm;text-align:center;font-family:'Bebas Neue';font-size:30pt;line-height:1;color:#fff}
.lu{position:absolute;left:50%;transform:translateX(-50%);top:60.5mm;width:16mm;height:1.2mm;border-radius:.6mm;background:#FFC107}
.lhr{position:absolute;left:0;right:0;top:64mm;text-align:center;font-size:10pt;color:#FFE082;font-weight:500}.lhr i{font-style:normal;margin:0 1.4mm}
.lg{position:absolute;left:10mm;right:10mm;top:73mm;display:grid;grid-template-columns:repeat(2,1fr);gap:3.6mm}
.lj{height:30mm;border-radius:3.2mm;background:linear-gradient(160deg,rgba(6,30,75,.78),rgba(6,30,75,.58));border:.25mm solid rgba(255,255,255,.12);box-shadow:0 1mm 2.4mm rgba(0,10,35,.25);padding:4mm 4.2mm}
.lchip{display:inline-block;text-transform:uppercase;letter-spacing:.04em;font-family:'Montserrat';font-weight:800;font-size:8pt;color:#062B63;background:#FFC107;border-radius:1.6mm;padding:.9mm 2.6mm .7mm;float:right}
.lb{font-weight:700;font-size:14pt;color:#fff;margin-top:0;line-height:1.1}.lc{font-weight:600;font-size:9.6pt;color:#FFC107;margin-top:.5mm}
.le{font-size:9.6pt;color:#D2DAE8;margin-top:1.6mm}.lz{display:flex;align-items:center;gap:1.2mm;font-weight:700;font-size:11pt;color:#fff;margin-top:1.4mm}.lz svg{width:3.3mm;height:3.3mm;color:#25D366;flex:none}
.lct{position:absolute;left:10mm;right:10mm;top:177mm;display:grid;grid-template-columns:1fr 1fr 1fr 31mm;gap:3.6mm;align-items:start}
.lbx{height:18mm;border-radius:3.2mm;background:linear-gradient(160deg,rgba(6,30,75,.78),rgba(6,30,75,.58));border:.25mm solid rgba(255,255,255,.12);padding:3mm 4mm;font-weight:700;font-size:11pt;color:#fff}
.lbx small{display:block;font-family:'Montserrat';font-weight:700;font-size:7.4pt;letter-spacing:.05em;text-transform:uppercase;color:#FFC107;margin-bottom:.8mm}
.qr{width:31mm;height:31mm;border-radius:3.2mm;background:#fff;padding:2.6mm;box-shadow:0 1mm 2.4mm rgba(0,10,35,.3)}.qr svg{display:block;width:100%;height:100%}
.lpar{position:absolute;left:0;right:0;top:205mm;text-align:center;font-size:10pt;font-weight:500;color:#FFE082}
.pnum{position:absolute;right:10mm;bottom:6mm;font-family:'Bebas Neue';font-size:12pt;letter-spacing:.04em;color:#fff;background:#062B63;border-radius:3mm;padding:.5mm 3.2mm .2mm;line-height:1.1}`;

const MODOS = `
@font-face{font-family:"Montserrat";font-weight:700;src:url("file://${D}/fontes/Montserrat-Bold.ttf")}
@font-face{font-family:"Montserrat";font-weight:800;src:url("file://${D}/fontes/Montserrat-ExtraBold.ttf")}
body.bg *,body.bg *::before,body.bg *::after{color:transparent!important;-webkit-text-fill-color:transparent!important;text-shadow:none!important}
body.txt *{background:transparent!important;box-shadow:none!important;filter:none!important;border-color:transparent!important}
body.txt *::before,body.txt *::after{visibility:hidden!important}
body.txt img,body.txt svg,body.txt .q{visibility:hidden!important}
body.txt img.flat{visibility:visible!important;position:absolute;left:0;top:0;width:100%;height:100%;z-index:0}
body.txt .trim{z-index:1}
.sheet{position:relative;overflow:hidden;page-break-after:always}.sheet .page{page-break-after:auto}`;
const HTML = (b, img, qr, modo = "", flat = null, corte = 0) => `<!doctype html><html><head><meta charset="utf-8"><link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Poppins:ital,wght@0,400;0,500;0,600;1,600&display=swap" rel="stylesheet"><style>${CSS(b)}${MODOS}${corte ? `@page{size:210mm 297mm;margin:0}.sheet{width:210mm;height:297mm}.sheet .page{margin:-${corte}mm 0 0 -${corte}mm}` : ""}</style></head><body class="${modo}">
${[capa, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12(qr)].map((pg, i) => { if (flat) pg = pg.replace(/^<div class="page([^"]*)">/, `<div class="page$1"><img class="flat" src="${flat[i]}">`); return corte ? `<div class="sheet">${pg}</div>` : pg; }).join("\n")}</body></html>`.replace(/IMG\//g, img + "/").replace(/LIQ\//g, path.join(D, "build") + "/");

(async () => {
  // embalagens + logos: alta (gráfica) e leve (WhatsApp)
  fs.mkdirSync(path.join(D, "build/alta"), { recursive: true }); fs.mkdirSync(path.join(D, "build/leve"), { recursive: true });
  execFileSync("python3", ["-I", "-c", `
import glob, os, sys
from PIL import Image
d = sys.argv[1]; logos = sys.argv[2]
for f in glob.glob(d + "/emb/*.png") + [logos + "/logo-branco.png", logos + "/logo-azul.png"]:
    i = Image.open(f).convert("RGBA"); n = os.path.basename(f)
    i.save(d + "/build/alta/" + n)
    l = i.copy(); l.thumbnail((640, 640), Image.LANCZOS); l.save(d + "/build/leve/" + n, optimize=True)
`, D, path.join(R, "saidas/banners-loja6-2026-11/assets")]);
  const qr = await QR.toString("https://wa.me/5511977140964", { type: "svg", margin: 0, errorCorrectionLevel: "M", color: { dark: "#062B63", light: "#FFFFFF" } });
  // tinta líquida
  for (const [n, w, h, seed] of [["liq-capa", 2551, 1988, 11], ["liq-lojas", 2551, 1099, 23], ["liq-faixa", 2244, 142, 5]])
    if (!fs.existsSync(path.join(D, "build", n + ".png"))) execFileSync("python3", ["-I", path.join(D, "tinta-liquida.py"), w, h, path.join(D, "build", n + ".png"), seed, "cheio"].map(String));
  const b = await chromium.launch();
  // 1) fundo de cada página como imagem 300 dpi, sem transparência (é o que some com os "quadrados" no iPhone)
  const ctx = await b.newContext({ deviceScaleFactor: 300 / 96, viewport: { width: 817, height: 1146 } }); const pb = await ctx.newPage();
  const hb = path.join(D, "build", "fundo.html"); fs.writeFileSync(hb, HTML(3, path.join(D, "build", "alta"), qr, "bg"));
  await pb.goto("file://" + hb, { waitUntil: "networkidle" }); await pb.evaluate(() => document.fonts.ready); await pb.waitForTimeout(800);
  fs.mkdirSync(path.join(D, "build/fundo"), { recursive: true });
  const els = await pb.$$(".page"); const alta = [];
  for (let i = 0; i < els.length; i++) { const f = path.join(D, "build/fundo", `p${i + 1}.png`); await els[i].screenshot({ path: f }); alta.push(f); }
  await ctx.close();
  execFileSync("python3", ["-I", "-c", `
import sys
from PIL import Image
for f in sys.argv[1:]:
    i = Image.open(f).convert("RGB")
    i.save(f[:-4] + ".jpg", quality=95, subsampling=0, dpi=(300, 300))
    l = i.resize((i.width // 2, i.height // 2), Image.LANCZOS); l.save(f[:-4] + "-leve.jpg", quality=84, dpi=(150, 150))
`, ...alta]);
  // 2) texto vetorial por cima
  const p = await b.newPage();
  for (const [arq, sufixo, corte] of [["catalogo-laet-grafica.pdf", ".jpg", 0], ["catalogo-laet-whatsapp.pdf", "-leve.jpg", 3]]) {
    const flat = alta.map((f) => f.replace(/\.png$/, sufixo));
    const h = path.join(D, "build", `catalogo-${corte ? "leve" : "alta"}.html`); fs.writeFileSync(h, HTML(3, path.join(D, "build", "alta"), qr, "txt", flat, corte));
    await p.goto("file://" + h, { waitUntil: "networkidle" }); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(500);
    await p.pdf({ path: path.join(D, arq), preferCSSPageSize: true, printBackground: true });
    console.log("ok", arq, (fs.statSync(path.join(D, arq)).size / 1e6).toFixed(1) + " MB");
  }
  await b.close();
})();
