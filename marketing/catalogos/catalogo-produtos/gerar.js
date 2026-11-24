// Catálogo Técnico de Produtos Laet · A4 retrato com 3 mm de sangria (216x303 mm) · 9 páginas (v7).
// Rodar: NODE_PATH=$(npm root -g) node marketing/catalogos/catalogo-produtos/gerar.js
// Saída: catalogo-produtos-laet-impressao.pdf (fotos em resolução cheia) e catalogo-produtos-laet-whatsapp.pdf (leve).
// Dados: dossiê de produtos, aulas do Kevin (CLAUDE.md), rótulos e site. O que não está confirmado sai "[CONFERIR]" em vermelho.
// Cores das cartelas: nome e hex do site no ar (origin/main:site/produto.html), iguais ao mestre identidade/cores/paleta-oficial.json
// (regra /cores). Cartelas iguais juntas (pedido do Kevin, 24/11). Quadradinho 26 x 15 mm. Sem preço nenhum.
const { chromium } = require("playwright"); const fs = require("fs"), path = require("path");
const { execFileSync } = require("child_process");
const R = path.resolve(__dirname, "../../.."), D = __dirname, B = path.join(D, "build");
const PALETA = JSON.parse(fs.readFileSync(path.join(R, "identidade/cores/paleta-oficial.json"), "utf8")).linhas;
const cor = (linha, nome) => { const c = PALETA[linha].cores.find((x) => x.nome === nome); if (!c) throw new Error(`cor ${nome} não está na paleta ${linha}`); return { nome, hex: c.hex }; };
const todas = (linha) => PALETA[linha].cores.map((c) => ({ nome: c.nome, hex: c.hex }));
const BRANCO = { nome: "Branco", hex: "#FFFFFF" };
const CONF = (t = "") => `<span class="conf">[CONFERIR]${t ? " " + t : ""}</span>`;

// ---------- embalagens reais (recorte pela transparência; versão leve pro WhatsApp) ----------
const EMB = {
  emborrachada: "emborrachada-remove-bg-io.png", epoxi: "epoxibaseagua.png", lavavel: "premiumlavavel-remove-bg-io.png",
  pisos: "pisos efachadas-remove-bg-io.png", standard: "standard-remove-bg-io.png", profissional: "profissional-remove-bg-io.png",
  vinil: "vinil-remove-bg-io.png", gesso: "direto no gesso-remove-bg-io.png", esmalte: "esmalteecologico-removebg-preview.png",
  verniz: "verniz-premium-remove-bg-io.png", barrica: "barrica-remove-bg-io.png", saco: "massaplastico.png",
  seladora: "seladora-removebg-preview.png", fundo: "fundo_preparador-removebg-preview.png",
};
fs.mkdirSync(path.join(B, "alta"), { recursive: true }); fs.mkdirSync(path.join(B, "leve"), { recursive: true });
execFileSync("python3", ["-I", "-c", `
import sys, json
from PIL import Image
emb = json.loads(sys.argv[1]); src, dst = sys.argv[2], sys.argv[3]
for k, f in emb.items():
    i = Image.open(src + "/" + f).convert("RGBA"); a = i.split()[3].point(lambda v: 255 if v > 10 else 0); i = i.crop(a.getbbox())
    i.save(dst + "/alta/" + k + ".png")
    l = i.copy(); l.thumbnail((420, 420), Image.LANCZOS); l.save(dst + "/leve/" + k + ".png", optimize=True)
for nome, f in [("logo-cor", "identidade/catalogo-pdf/logo-laet.png"), ("logo-branco", "identidade/logotipo branco-remove-bg-io.png")]:
    i = Image.open(sys.argv[4] + "/" + f).convert("RGBA"); i = i.crop(i.split()[3].getbbox())
    i.save(dst + "/alta/" + nome + ".png"); l = i.copy(); l.thumbnail((700, 700), Image.LANCZOS); l.save(dst + "/leve/" + nome + ".png", optimize=True)
`, JSON.stringify(EMB), path.join(R, "identidade/embalagens"), B, R]);

// ---------- dados dos produtos ----------
// rend: { n: número, pre: "Rende até", pos: "m² por demão", obs: "balde 18L" } | null (= CONFERIR)
const P = {
  emborrachada: { nome: "Emborrachada", sub: "Tinta de borracha", img: "emborrachada",
    desc: "Seca e vira uma película de borracha que protege laje, telhado e muro. Resolve até 100% do problema de infiltração e aguenta sol e chuva.",
    uso: "Externo: laje, telhado, muro e fachada", acab: null, rend: { n: "200", pre: "Rende até", pos: "m²", obs: "balde 18L" },
    disp: ["18L · Branca e cores", "3,6L · Branca e cores"],
    cores: { lista: ["Gelo", "Amarelo B 07", "Amarelo Dourado", "Laranja Turco", "Tangerina", "Romã", "Intensa Sedução", "Rosa Gloss", "Lilás Laet", "Uva Doce", "Azul Laet", "Céu Sagrado", "Paraíso do Mar", "Azul Jazz", "Verde Piscina", "Verde Primavera", "Ilha de Esmeralda", "Pavão", "Areia", "Doce da Bisa", "Terra Nossa", "Concreto", "Cinza Elefante", "Penhasco"].map((n) => cor("paleta-grande", n)), mais: "Mais de 100 cores na cartela da loja" } },
  epoxi: { nome: "Epóxi Base Água", sub: "Renove sem quebrar", img: "epoxi",
    desc: "Pinta azulejo de cozinha e banheiro sem quebrar nada. Seca rápido, não tem cheiro forte e forma uma película resistente, fácil de limpar.",
    uso: null, acab: null, rend: { n: "60", pre: "Rende até", pos: "m² por demão", obs: "galão 3,6L · 900ml até 15 m²" },
    disp: ["3,6L · Branca", "900ml · Branca"], coresConf: "cores do Epóxi",
    onde: "Azulejo de cozinha e banheiro, metal e galvanizado.", dica: "Espere 20 dias de cura antes de limpar. Depois, pano macio com água e detergente neutro, sem esfregar." },
  lavavel: { nome: "Premium Lavável", img: "lavavel",
    desc: "Cobre muito bem, tem baixo odor e é fácil de limpar. Antimofo e antifungos, pra parede de dentro e de fora de casa.",
    uso: "Interno e externo", acab: "Fosco", rend: { n: "200", pre: "Rende até", pos: "m²", obs: "balde 18L" },
    disp: ["18L · Branca e cores", "3,6L · Branca e cores", "900ml · Branca"],
    cores: { lista: ["Marfim", "Palha", "Amarelo C 07", "Mistura de Mostarda", "Pêssego", "Lícor de Laranja", "Flamingo Real", "Rosa Irlandesa", "Lilás Delicado", "Fogo Violeta", "Ana Maria", "Gota Serena", "Pena Azul", "Mar Aberto", "Planetário", "Capim Cheiroso", "Jogo de Golfe", "Verde Musgo", "Algodão Egípcio", "Chá Quente", "Cobre Suave", "Pitada Casual", "Cinza Wick", "Semente Urbana"].map((n) => cor("paleta-grande", n)), mais: "Mais de 100 cores na cartela da loja" } },
  pisos: { nome: "Pisos & Fachadas", img: "pisos",
    desc: "Aguenta o tráfego de carro, a chuva e o sol. Pra garagem, calçada e fachada, com acabamento bonito por muito tempo.",
    uso: "Interno e externo", acab: "Fosco", rend: { n: "300", pre: "Rende até", pos: "m² por demão", obs: "" },
    disp: ["17L · 13 cores", "3,4L · 13 cores"],
    cores: { lista: todas("piso-fachada"), mais: "" } },
  standard: { nome: "1ª Linha Standard", sub: "Acrílico concentrado", img: "standard",
    desc: "Tinta de baixo custo, mas concentrada, grossa e com bom poder de cobertura. Pode ser diluída em até 20%. Antimofo.",
    uso: "Interno e externo", acab: "Fosco", rend: null, rendConf: "site diz até 300 m² por demão",
    disp: ["18L · Branca e cores", "3,6L · Branca e cores"],
    cores: { lista: ["Gelo", "Amarelo Albertino", "Pêssego", "Laranja Turco", "Rosa Gloss", "Lilás Laet", "Azul Laet", "Paraíso do Mar", "Verde Primavera", "Espaço Verde", "Areia", "Concreto"].map((n) => cor("standard", n)), mais: "Mais de 80 cores na cartela da loja" } },
  profissional: { nome: "Super Profissional", img: "profissional",
    desc: "Acrílica de ótima qualidade, cobre bem e tem antimofo. Indicada pra parede de dentro de casa.",
    uso: "Interno", acab: null, rend: { n: "330", pre: "Rende até", pos: "m² por demão", obs: "superfície totalmente preparada e selada" },
    disp: ["18L · Branca e cores", "3,6L · Branca e cores"],
    cores: { lista: ["Palha", "Compota de Abacaxi", "Vitamina", "Camponesa", "Rosa Gloss", "Mousse de Uva", "Azul Rei", "Mergulho Tranquilo", "Paraíso Secreto", "Folha de Trevo", "Linho Americano", "Tubarão Cinza"].map((n) => cor("super-profissional", n)), mais: "34 cores na cartela da loja" } },
  vinil: { nome: "Básica Interna Vinil", img: "vinil",
    desc: "A opção mais econômica pra parede interna e seca. Espere 8 horas entre uma demão e outra e não use em área externa nem em parede úmida.",
    uso: "Interno", acab: "Fosco", rend: { n: "100", pre: "Rende em média", pos: "m² por demão", obs: "balde 18L" },
    disp: ["18L · Branca e cores"], cores: { lista: todas("latex-vinil").slice(3, 15), mais: "18 cores na cartela da loja" } },
  gesso: { nome: "Direto no Gesso", sub: "Gesso e drywall", img: "gesso",
    desc: "Vai direto no gesso e no drywall: não necessita de fundo preparador. Prática, econômica e com ótimo acabamento.",
    uso: "Interno", acab: null, rend: null,
    disp: ["18L · Branca e cores", "3,6L · Branca e cores"], cores: { lista: [BRANCO, ...todas("super-profissional")], mais: "" } },
  esmalte: { nome: "Esmalte Ecológico", sub: "Base água", img: "esmalte",
    desc: "Base água, baixo odor e boa cobertura. Pinta ferro, madeira, parede e teto.",
    uso: "Interno e externo", acab: "Brilhante", rend: null,
    disp: ["18L · Branca", "3,6L · Branca e cores", "900ml · Branca e cores"], cores: { lista: todas("esmalte-ecologico"), mais: "" } },
  verniz: { nome: "Verniz Base Água", img: "verniz",
    desc: "Fundo e acabamento no mesmo produto: dispensa seladora. Realça os veios da madeira e resiste à chuva.",
    uso: "Interno e externo", acab: "Brilhante", rend: { n: "60", pre: "Rende até", pos: "m² por demão", obs: "galão 3,6L · 900ml até 15 m²" },
    disp: ["18L", "3,6L", "900ml"],
    // tons de madeira (não são cor de tinta da paleta): hex do site
    cores: { lista: [{ nome: "Incolor (Natural)", hex: "#DC9A3D" }, { nome: "Mogno", hex: "#82380F" }, { nome: "Imbuia", hex: "#4A2B1A" }], mais: "", titulo: "Tonalidades" } },
  corrida: { nome: "Massa Corrida", img: "barrica",
    desc: "Nivela e corrige a parede antes de pintar. Fácil de lixar. Só pra área interna e seca, como quarto e sala.",
    uso: "Interno (área seca)", rend: { n: "50", pre: "Rende até", pos: "m²", obs: "" },
    disp: ["1,5kg", "5kg", "Saco 23kg", "Barrica 23kg"] },
  acrilica: { nome: "Massa Acrílica", img: "saco",
    desc: "Pra parede de dentro e de fora e pra lugares que pegam respingo de água, como banheiro e cozinha. Fácil de lixar.",
    uso: "Interno e externo", rend: null, disp: ["5kg", "Saco 23kg", "Barrica 23kg"] },
  seladora: { nome: "Seladora", img: "seladora",
    desc: "Pra parede nova ou reboco novo que chupa muita tinta. Preenche os poros do reboco e faz você gastar menos tinta.",
    uso: null, rend: null, disp: ["18L", "3,6L"] },
  fundo: { nome: "Fundo Preparador", img: "fundo",
    desc: "Pra reboco fraco e parede velha que esfarela ou descasca. Firma a superfície antes da tinta.",
    uso: null, rend: null, disp: ["18L", "3,6L", "900ml"] },
};

// ---------- ícones ----------
const I = {
  uso: '<svg viewBox="0 0 24 24"><path d="M3 11.5 12 4l9 7.5M5.5 9.8V20h13V9.8M10 20v-5.5h4V20" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round" stroke-linecap="round"/></svg>',
  acab: '<svg viewBox="0 0 24 24"><path d="M12 3.5c3.2 4.2 5.5 7.4 5.5 10.2a5.5 5.5 0 0 1-11 0C6.5 10.9 8.8 7.7 12 3.5z" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"/><path d="M9.6 14.2a2.5 2.5 0 0 0 2.3 2.4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
  rend: '<svg viewBox="0 0 24 24"><rect x="3.5" y="4" width="14" height="5.5" rx="1.6" fill="none" stroke="currentColor" stroke-width="1.9"/><path d="M17.5 6.7h2.2v5.2h-7.7V15" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"/><rect x="10.6" y="15" width="2.8" height="5.5" rx="1" fill="currentColor"/></svg>',
  emb: '<svg viewBox="0 0 24 24"><path d="M5 8h14l-1.2 11.2a1.5 1.5 0 0 1-1.5 1.3H7.7a1.5 1.5 0 0 1-1.5-1.3L5 8zM4 8h16M8.5 8a3.5 3 0 0 1 7 0" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"/></svg>',
  zap: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm4.5 12.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1-1.4-.7-2.4-1.4-3.3-3-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.5l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.2s1 2.6 1.1 2.7c.1.2 1.9 2.9 4.6 4.1 1.7.7 2.4.8 3.2.7.5-.1 1.5-.6 1.8-1.2.2-.6.2-1.1.1-1.2l-.1-.7z"/></svg>',
  insta: '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="17.4" cy="6.6" r="1.2" fill="currentColor"/></svg>',
  site: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><path d="M3 12h18M12 3c2.8 3 2.8 15 0 18M12 3c-2.8 3-2.8 15 0 18" fill="none" stroke="currentColor" stroke-width="1.7"/></svg>',
};

// ---------- v7 (24/11): mesma organização do rascunho v6 do Kevin (9 páginas, cada produto seguido da cartela dele),
// tudo vetorial (texto nítido), dentro do brand book (identidade/design-guide.md): azul #0D47A1 / #062B63, amarelo #FFC107,
// cards #FFFFFF sobre #F0F2F5, cantos 4–8px, Montserrat ExtraBold/Bold, Poppins, Bebas Neue nos números.
// Sem respingo falso, sem campo vazio: o que não está confirmado simplesmente não aparece (lista em CONFERIR.md).

// ---------- componentes ----------
const spec = (ic, rot, val) => !val ? "" : `<div class="spec"><span class="ic">${I[ic]}</span><div><div class="sr">${rot}</div><div class="sv">${val}</div></div></div>`;
const rendimento = (p) => !p.rend ? "" : `<div class="spec"><span class="ic">${I.rend}</span><div><div class="sr">Rendimento</div><div class="rv"><span class="rp">${p.rend.pre}</span> <b>${p.rend.n}</b> <span class="rp">${p.rend.pos}</span></div>${p.rend.obs ? `<div class="ro">${p.rend.obs}</div>` : ""}</div></div>`;
const specs = (p) => `<div class="specs">${spec("uso", p.onde ? "Onde usar" : "Uso", p.onde || p.uso)}${spec("acab", "Acabamento", p.acab)}${rendimento(p)}</div>`;
const disp = (p) => `<div class="disp"><span class="dr">Disponível em</span>${p.disp.map((d) => `<span class="chip">${d}</span>`).join("")}</div>`;
const lata = (img, h) => `<div class="lata"><img src="IMG/${img}.png" style="height:${h}mm"><div class="chao"></div></div>`;
const nome = (p, fs = 15) => `<div class="pn" style="font-size:${fs}pt">${p.nome}</div>${p.sub ? `<div class="ps">${p.sub}</div>` : ""}`;

const cabecalho = (nomeLinha, n) => `<div class="band"><div class="bi"><div class="bl">${nomeLinha.startsWith("Cartela") ? "Tintas Laet" : "Linha"}</div><div class="bt">${nomeLinha}</div><div class="bar"></div></div>
  <img class="blogo" src="IMG/logo-branco.png"></div>${rodape(n)}`;
const rodape = (n) => `<div class="rod"><div class="rl"><span>${I.site}tintaslaet.com</span><span>${I.insta}@tintaslaet</span><span>${I.zap}(11) 97714-0964</span></div><div class="rn">${String(n).padStart(2, "0")}</div></div>`;

// cartão de produto (horizontal): foto da lata | texto | extra opcional à direita
const card = (p, o = {}) => `<div class="pcard${o.premium ? " prem" : ""}"><div class="pimg">${lata(p.img, o.lata || 31)}${o.premium ? '<span class="selo">Linha Premium</span>' : ""}</div>
  <div class="ptx">${nome(p, o.premium ? 15 : 14)}<div class="pd">${p.desc}</div>${specs(p)}${disp(p)}${p.nota ? `<div class="pnota">${p.nota}</div>` : ""}${o.after || ""}</div>${o.extra || ""}</div>`;

// ---------- cartelas: nome e hex do SITE no ar (origin/main:site/produto.html) ----------
const SITE = (() => { const s = execFileSync("git", ["-C", R, "show", "origin/main:site/produto.html"], { encoding: "utf8", maxBuffer: 1e8 });
  const i = s.indexOf("const produtos = {"); let d = 0, j = s.indexOf("{", i), k = j; for (; k < s.length; k++) { if (s[k] === "{") d++; else if (s[k] === "}") { d--; if (!d) break; } }
  return eval("(" + s.slice(j, k + 1) + ")"); })();
const coresSite = (id) => (SITE[id].cores || []).map((c) => ({ nome: c.nome, hex: c.hex.toUpperCase() }));
const hsl = (hex) => { const n = parseInt(hex.slice(1), 16), r = (n >> 16) / 255, g = ((n >> 8) & 255) / 255, b = (n & 255) / 255;
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, d = mx - mn; let h = 0, s2 = 0;
  if (d) { s2 = d / (1 - Math.abs(2 * l - 1)); h = mx === r ? 60 * (((g - b) / d) % 6) : mx === g ? 60 * ((b - r) / d + 2) : 60 * ((r - g) / d + 4); }
  return { h: (h + 360) % 360, s: s2, l }; };
// ordem de cartela de loja: branco, amarelos, laranjas, vermelhos, rosas, roxos, azuis, verdes, beges/marrons, cinzas
const familia = (hex) => { const { h, s, l } = hsl(hex);
  if (hex === "#FFFFFF") return 0;
  if (s < 0.16 || (s < 0.3 && l < 0.55)) return l > 0.62 && h > 15 && h < 75 ? 9 : 10;
  if (h >= 15 && h < 50 && l < 0.5) return 9;
  if (h >= 48 && h < 75) return 1; if (h >= 22 && h < 48) return 2; if (h < 12 || h >= 350) return l > 0.72 ? 4 : 3;
  if (h >= 12 && h < 22) return 3; if (h >= 300 && h < 350) return 4; if (h >= 250 && h < 300) return 5;
  if (h >= 185 && h < 250) return 6; return 8; };
const ordenar = (lista) => lista.map((c, i) => ({ c, f: familia(c.hex), l: hsl(c.hex).l, i })).sort((a, b) => a.f - b.f || b.l - a.l || a.i - b.i).map((x) => x.c);
const spTem = new Set(coresSite("super-profissional").map((c) => c.nome));
const CARTELAS = {
  grande: { titulo: "Cartela Paleta Grande", usada: "Emborrachada e Premium Lavável", lista: ordenar(coresSite("premium-lavavel")) },
  pisos: { titulo: "Cartela Pisos & Fachadas", usada: "Pisos & Fachadas", lista: ordenar(coresSite("piso-fachada")) },
  // Epóxi: as 16 na ordem que o Kevin passou (24/11)
  epoxi: { titulo: "Cartela Epóxi Base Água", usada: "Epóxi Base Água", lista: coresSite("epoxi-base-agua").map((c) => (c.nome === "Areia Bege" ? { ...c, conf: true } : c)) },
  standard: { titulo: "Cartela 1ª Linha Standard", usada: "1ª Linha Standard", lista: ordenar(coresSite("standard")) },
  vinil: { titulo: "Cartela Básica Interna Vinil", usada: "Básica Interna Vinil", lista: ordenar(coresSite("latex-vinil")) },
  gesso: { titulo: "Cartela Profissional e Gesso", usada: "Super Profissional e Direto no Gesso",
    lista: ordenar(coresSite("direto-no-gesso")).map((c) => (c.nome !== "Branco" && !spTem.has(c.nome) ? { ...c, tag: "Só Direto no Gesso" } : c)) },
  esmalte: { titulo: "Cartela Esmalte Ecológico", usada: "Esmalte Ecológico", lista: ordenar(coresSite("esmalte-ecologico")) },
};
const sw = (x) => `<div class="s2"><div class="q2" style="background:${x.hex}${x.hex === "#FFFFFF" ? ";box-shadow:inset 0 0 0 .3mm #C9D2DE" : ""}">${x.tag ? `<span class="qtag">${x.tag}</span>` : ""}${x.conf ? `<span class="qconf">[CONFERIR HEX]</span>` : ""}</div><div class="n2">${x.nome}</div></div>`;
const cart = (c, ini = 0, fim = c.lista.length, cont = false) => `<div class="cart2">
  <div class="c2h"><div class="c2t">${c.titulo}${cont ? ' <span class="c2c">continuação</span>' : ` <span class="c2c">· ${c.lista.length} cores</span>`}</div>${cont ? "" : `<div class="c2u">Vale para: <b>${c.usada}</b></div>`}</div>
  <div class="c2g">${c.lista.slice(ini, fim).map(sw).join("")}</div>
  ${fim >= c.lista.length ? `<div class="c2n">Cores aproximadas. Confira na loja antes de comprar.</div>` : ""}</div>`;
const tons = (c) => `<div class="tons"><div class="ct">Tonalidades</div><div class="tg">${c.map(sw).join("")}</div><div class="c2n" style="text-align:left;margin-top:.8mm">Cores aproximadas. Confira na loja.</div></div>`;

// ---------- páginas (9) ----------
const pg = (n, linha, corpo, cls = "") => `<div class="page">${cabecalho(linha, n)}<div class="corpo ${cls}">${corpo}</div></div>`;
const FAIXAS = ["Romã", "Lícor de Laranja", "Amarelo Dourado", "Amarelo C 07", "Verde Primavera", "Ilha de Esmeralda", "Pavão", "Céu Sagrado", "Paraíso do Mar", "Lilás Laet", "Fogo Violeta", "Flamingo Real", "Rosa Gloss", "Doce da Bisa", "Areia", "Pitada Casual"].map((n) => cor("paleta-grande", n));
const capa = `<div class="page capa">
  <img class="clogo" src="IMG/logo-branco.png">
  <div class="ctit"><div class="cm">Catálogo de Produtos</div><div class="cbar"></div><div class="ck">Tintas · Esmaltes · Vernizes · Epóxi · Massas</div></div>
  <div class="cfx">${FAIXAS.map((c, i) => `<div style="background:${c.hex};height:${112 + [0, 6, 2, 8, 3, 7, 1, 5][i % 8]}mm"></div>`).join("")}</div>
  <div class="clatas">${[["epoxi", 50, 34], ["lavavel", 66, 70], ["emborrachada", 82, 108], ["pisos", 66, 146], ["standard", 54, 182]].map(([k, h, x]) => `<div class="cl" style="left:${x}mm;z-index:${h}"><img src="IMG/${k}.png" style="height:${h}mm"><div class="chao"></div></div>`).join("")}</div>
  <div class="cpe"><span>tintaslaet.com</span><span>@tintaslaet</span><span>(11) 97714-0964</span></div></div>`;

const G = CARTELAS.grande, S = CARTELAS.standard;
const p2 = pg(2, "Premium e Nobres", card(P.emborrachada, { premium: true, lata: 35 }) + card(P.lavavel, { premium: true, lata: 35 }) + cart(G, 0, 42));
const p3 = pg(3, "Premium e Nobres", cart(G, 42, G.lista.length, true));
const p4 = pg(4, "Premium e Nobres", card(P.pisos, { premium: true, lata: 34 }) + cart(CARTELAS.pisos) + card(P.epoxi, { premium: true, lata: 32 }) + cart(CARTELAS.epoxi));
const p5 = pg(5, "Acrílicas", card(P.standard) + cart(S, 0, 56));
const p6 = pg(6, "Acrílicas", cart(S, 56, S.lista.length, true) + card(P.vinil) + cart(CARTELAS.vinil));
const p7 = pg(7, "Profissional & Gesso", card(P.profissional) + card(P.gesso) + cart(CARTELAS.gesso));
const p8 = pg(8, "Madeiras & Metais", card(P.esmalte) + cart(CARTELAS.esmalte) + card(P.verniz, { after: tons(coresSite("verniz-premium")) }));

const massa = (p) => `<div class="mc"><div class="mimg">${lata(p.img, 30)}</div><div class="mtx">${nome(p, 12)}<div class="pd">${p.desc}</div>${specs(p)}${disp(p)}</div></div>`;
const LOJAS = [
  [1, "Vila Bela (Sapopemba)", "São Paulo", "Av. Sapopemba, 25.723", "(11) 98082-0686"],
  [2, "Jardim São João", "Mauá", "Rua do Britador, 2", "(11) 97750-4434"],
  [3, "Jardim Santa Cecília", "Mauá", "Av. Ayrton Senna da Silva, 235", "(11) 97749-8813"],
  [4, "Vila Luzita", "Santo André", "Av. São Bernardo do Campo, 757", "(11) 94855-1977"],
  [5, "Jardim Itapark", "Mauá", "Av. Itapark, 4377", "(11) 91433-4875"],
  [6, "Santa Terezinha", "São Bernardo do Campo", "Av. Luís Pequini, 899", "(11) 91875-5095"]];
const p9 = `<div class="page">${cabecalho("Massas & Complementos", 9)}<div class="corpo"><div class="g2m">${["corrida", "acrilica", "seladora", "fundo"].map((k) => massa(P[k])).join("")}</div></div>
  <div class="lojasbox"><div class="lbt">Nossas lojas</div><div class="lbs">6 lojas no ABC e na Zona Leste de São Paulo · Parcele em até 12x sem juros (consulte as condições)</div>
    <div class="lbg">${LOJAS.map(([n, b, c, e, z]) => `<div class="lbj"><span>Loja ${n} · ${c}</span><b>${b}</b><i>${e}</i><em>${I.zap}${z}</em></div>`).join("")}</div>
    <div class="lbc"><div class="lbci">
      <div class="ci"><span>${I.zap}</span><div><small>WhatsApp</small>(11) 97714-0964</div></div>
      <div class="ci"><span>${I.insta}</span><div><small>Instagram</small>@tintaslaet</div></div>
      <div class="ci"><span>${I.site}</span><div><small>Site</small>tintaslaet.com</div></div></div>
      <div class="qr"><div>QR CODE<br>DO WHATSAPP</div><small>espaço reservado</small></div></div></div></div>`;
const PAGINAS = [capa, p2, p3, p4, p5, p6, p7, p8, p9];

// ---------- estilo ----------
const CSS = `@page{size:216mm 303mm;margin:0}
*{margin:0;padding:0;box-sizing:border-box}
html,body{background:#fff;-webkit-print-color-adjust:exact;print-color-adjust:exact}
body{font-family:'Poppins',sans-serif;color:#212529}
.page{position:relative;width:216mm;height:303mm;overflow:hidden;background:#F0F2F5;page-break-after:always}
.conf{color:#E53935;font-weight:700}
/* cabeçalho (sai na sangria) */
.band{position:absolute;left:0;top:0;right:0;height:37mm;background:linear-gradient(115deg,#0D47A1 0%,#0B3D8F 60%,#062B63 100%)}
.band::after{content:"";position:absolute;left:0;right:0;bottom:0;height:1.4mm;background:#FFC107}
.bi{position:absolute;left:17mm;top:11mm}
.bl{font-family:'Montserrat';font-weight:700;font-size:8.5pt;letter-spacing:.2em;text-transform:uppercase;color:#FFE082}
.bt{font-family:'Montserrat';font-weight:800;font-size:25pt;text-transform:uppercase;color:#fff;line-height:1.05;margin-top:.8mm;letter-spacing:-.005em}
.bar{display:none}
.blogo{position:absolute;right:17mm;top:10.5mm;height:15.5mm}
.rod{position:absolute;left:17mm;right:17mm;bottom:11mm;display:flex;align-items:center;justify-content:space-between;border-top:.3mm solid #CDD5E1;padding-top:2.4mm;font-size:7.6pt;color:#4A5568}
.rl{display:flex;gap:6mm}.rl span{display:flex;align-items:center;gap:1.4mm}.rl svg{width:3.4mm;height:3.4mm;color:#0D47A1}
.rn{font-family:'Bebas Neue';font-size:13pt;color:#fff;background:#0D47A1;border-radius:1.2mm;padding:.2mm 2.2mm 0}
.corpo{position:absolute;left:15mm;right:15mm;top:44mm;bottom:21mm}
/* cartão de produto */
.pcard{display:flex;gap:5mm;align-items:stretch;background:#fff;border-radius:2mm;box-shadow:0 .5mm 2mm rgba(6,43,99,.08);padding:3.4mm;margin-bottom:3.4mm}
.pimg{position:relative;flex:none;width:40mm;border-radius:1.6mm;background:radial-gradient(ellipse 70% 75% at 50% 42%,#FFFFFF 0%,#F0F2F5 70%,#E4E9F1 100%);display:flex;align-items:flex-end;justify-content:center;padding:3mm 0 3.2mm;min-height:38mm}
.pcard.prem .pimg{width:44mm}
.lata{position:relative;display:flex;justify-content:center;align-items:flex-end}
.lata img{position:relative;z-index:2;filter:drop-shadow(0 1mm 1mm rgba(6,43,99,.2))}
.chao{position:absolute;bottom:-1.4mm;left:50%;transform:translateX(-50%);width:82%;height:3.6mm;border-radius:50%;background:radial-gradient(ellipse,rgba(6,24,58,.4) 0%,rgba(6,24,58,.14) 45%,transparent 72%);z-index:1}
.selo{position:absolute;z-index:5;left:2mm;top:2mm;font-family:'Montserrat';font-weight:700;font-size:5.8pt;letter-spacing:.14em;text-transform:uppercase;color:#062B63;background:#FFC107;border-radius:1mm;padding:.6mm 1.8mm .5mm}
.ptx{flex:1;min-width:0;padding-top:.6mm}
.pn{font-family:'Montserrat';font-weight:800;text-transform:uppercase;color:#0D47A1;letter-spacing:-.005em;line-height:1.05}
.ps{font-family:'Montserrat';font-weight:700;font-size:8pt;color:#1976D2;margin-top:.5mm}
.pd{font-size:8.6pt;line-height:1.42;color:#2D3748;margin-top:1.4mm}
.pnota{font-size:7pt;color:#5A6577;margin-top:1.4mm}
.specs{display:flex;gap:5mm;margin-top:2.4mm;flex-wrap:wrap}
.spec{display:flex;gap:1.6mm;align-items:flex-start;min-width:0}
.ic{flex:none;width:6mm;height:6mm;border-radius:50%;background:#E3EBF7;color:#0D47A1;display:flex;align-items:center;justify-content:center}.ic svg{width:3.6mm;height:3.6mm}
.sr{font-family:'Montserrat';font-weight:700;font-size:5.8pt;letter-spacing:.12em;text-transform:uppercase;color:#7A8597}
.sv{font-size:8.2pt;font-weight:600;color:#212529;line-height:1.25}
.rv{color:#0D47A1;line-height:1}.rv b{font-family:'Bebas Neue';font-weight:400;font-size:17pt;vertical-align:-.06em}.rp{font-size:7.6pt;font-weight:600;color:#212529}
.ro{font-size:6.8pt;color:#5A6577;margin-top:.4mm}
.disp{display:flex;flex-wrap:wrap;align-items:center;gap:1.4mm;margin-top:2.4mm}
.dr{font-family:'Montserrat';font-weight:700;font-size:5.8pt;letter-spacing:.12em;text-transform:uppercase;color:#7A8597;margin-right:1mm}
.chip{font-size:7.4pt;font-weight:600;color:#062B63;background:#F0F2F5;border-radius:1mm;padding:.6mm 2.2mm}
/* cartelas 26 x 15 mm */
.cart2{margin:.5mm 0 3.4mm}
.c2h{display:flex;align-items:baseline;justify-content:space-between;gap:4mm;margin-bottom:1.8mm}
.c2t{font-family:'Montserrat';font-weight:800;font-size:11pt;text-transform:uppercase;color:#0D47A1;letter-spacing:-.005em}.c2t::before{content:"";display:inline-block;width:1.4mm;height:3.4mm;background:#FFC107;border-radius:.5mm;margin-right:2mm;vertical-align:-.3mm}
.c2c{font-family:'Poppins';font-weight:500;font-size:8pt;text-transform:none;color:#5A6577}
.c2u{font-size:7.8pt;color:#4A5568;text-align:right}.c2u b{color:#0D47A1;font-weight:600}
.c2g{display:grid;grid-template-columns:repeat(7,26mm);justify-content:space-between;row-gap:1.4mm}
.q2{position:relative;width:26mm;height:15mm;border-radius:1.2mm}
.n2{font-size:6.2pt;font-weight:500;line-height:1.15;color:#2D3748;margin-top:.7mm;height:3.4mm;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}
.qtag{position:absolute;left:.9mm;top:.9mm;font-size:5.2pt;font-weight:600;line-height:1;color:#fff;background:#062B63;border-radius:.8mm;padding:.5mm .9mm .4mm}
.qconf{position:absolute;left:1mm;bottom:1mm;font-size:5.6pt;font-weight:700;color:#E53935;background:rgba(255,255,255,.88);border-radius:.8mm;padding:0 .8mm}
.c2n{font-size:6.8pt;font-weight:600;color:#062B63;text-align:right;margin-top:1.4mm}
.tons{margin-top:1.8mm}.ct{font-family:'Montserrat';font-weight:700;font-size:5.8pt;letter-spacing:.12em;text-transform:uppercase;color:#7A8597;margin-bottom:1.4mm}
.tg{display:grid;grid-template-columns:repeat(3,26mm);gap:3mm}
/* massas + lojas */
.g2m{display:grid;grid-template-columns:1fr 1fr;grid-auto-rows:66mm;gap:4mm}
.mc{background:#fff;border-radius:2mm;box-shadow:0 .5mm 2mm rgba(6,43,99,.08);padding:3.6mm;display:flex;gap:3.6mm}
.mimg{flex:none;width:25mm;border-radius:1.6mm;background:radial-gradient(ellipse 70% 75% at 50% 42%,#FFFFFF 0%,#F0F2F5 70%,#E4E9F1 100%);display:flex;align-items:flex-end;justify-content:center;padding-bottom:3.5mm}
.mimg img{max-width:22mm;object-fit:contain}
.mtx{flex:1;min-width:0}.mtx .specs{flex-direction:column;gap:1.6mm}.mtx .pd{font-size:8pt}
.mc .chip{font-size:6.8pt;padding:.5mm 1.6mm}.mc .disp{gap:1mm}.mc .dr{width:100%;margin-bottom:.2mm}
.lojasbox{position:absolute;left:0;right:0;bottom:0;height:116mm;background:linear-gradient(160deg,#0D47A1 0%,#0A3A86 45%,#062B63 100%);color:#fff;padding:9mm 17mm 0}
.lojasbox::before{content:"";position:absolute;left:0;right:0;top:0;height:1.4mm;background:#FFC107}
.lbt{font-family:'Montserrat';font-weight:800;font-size:18pt;text-transform:uppercase}
.lbs{font-size:8.4pt;color:#FFE082;margin-top:1mm}
.lbg{display:grid;grid-template-columns:repeat(3,1fr);gap:3mm;margin-top:4.5mm}
.lbj{background:rgba(255,255,255,.08);border:.3mm solid rgba(255,255,255,.16);border-radius:1.6mm;padding:2.8mm 3.2mm;display:flex;flex-direction:column;gap:.4mm}
.lbj span{font-family:'Montserrat';font-weight:700;font-size:6.4pt;letter-spacing:.1em;text-transform:uppercase;color:#FFC107}
.lbj b{font-family:'Montserrat';font-weight:800;font-size:9.4pt}.lbj i{font-style:normal;font-size:7.4pt;color:rgba(255,255,255,.82)}
.lbj em{font-style:normal;font-size:7.8pt;font-weight:600;display:flex;align-items:center;gap:1.2mm;margin-top:.6mm}.lbj em svg{width:3.2mm;height:3.2mm;color:#FFC107}
.lbc{display:flex;justify-content:space-between;align-items:center;margin-top:6mm}.lbci{display:flex;gap:7mm}
.ci{display:flex;align-items:center;gap:2.6mm;font-family:'Montserrat';font-weight:800;font-size:11pt}.ci span{width:8.5mm;height:8.5mm;border-radius:50%;background:#FFC107;color:#062B63;display:flex;align-items:center;justify-content:center}.ci svg{width:4.8mm;height:4.8mm}
.ci small{display:block;font-family:'Poppins';font-weight:500;font-size:6.8pt;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.7)}
.qr{width:32mm;height:32mm;border:.5mm dashed rgba(255,255,255,.7);border-radius:2mm;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;font-family:'Montserrat';font-weight:800;font-size:8pt;line-height:1.3}.qr small{font-family:'Poppins';font-weight:500;font-size:6.4pt;color:rgba(255,255,255,.7);margin-top:1.4mm}
/* capa */
.capa{background:linear-gradient(170deg,#0D47A1 0%,#0B3E92 55%,#062B63 100%)}
.clogo{position:absolute;left:50%;transform:translateX(-50%);top:24mm;height:46mm}
.ctit{position:absolute;left:0;right:0;top:80mm;text-align:center;color:#fff}
.cm{font-family:'Montserrat';font-weight:800;font-size:30pt;text-transform:uppercase;letter-spacing:-.005em}
.cbar{width:22mm;height:1.6mm;background:#FFC107;border-radius:1mm;margin:4mm auto 4mm}
.ck{font-family:'Montserrat';font-weight:700;font-size:9pt;letter-spacing:.24em;text-transform:uppercase;color:#FFE082}
.cfx{position:absolute;left:0;right:0;bottom:22mm;display:flex;align-items:flex-end;gap:.9mm;padding:0 .9mm}.cfx div{flex:1;border-radius:6mm 6mm 0 0}
.clatas{position:absolute;left:0;right:0;bottom:30mm;height:100mm}
.cl{position:absolute;bottom:0;transform:translateX(-50%)}.cl img{display:block;filter:drop-shadow(0 2mm 2.4mm rgba(0,0,0,.3))}.cl .chao{bottom:-2mm;width:92%;height:5mm;background:radial-gradient(ellipse,rgba(0,0,0,.5) 0%,rgba(0,0,0,.18) 45%,transparent 72%)}
.cpe{position:absolute;left:0;right:0;bottom:0;height:22mm;background:#062B63;display:flex;align-items:center;justify-content:center;gap:9mm;color:#fff;font-weight:600;font-size:9.5pt;letter-spacing:.04em;z-index:3}
.cpe::before{content:"";position:absolute;left:0;right:0;top:0;height:1.4mm;background:#FFC107}`;

const HTML = (img) => `<!doctype html><html><head><meta charset="utf-8"><link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Montserrat:wght@700;800&family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet"><style>${CSS}</style></head><body>
${PAGINAS.join("\n")}</body></html>`.replace(/IMG\//g, img + "/");

(async () => {
  const b = await chromium.launch(); const p = await b.newPage();
  for (const [tipo, arq] of [["alta", "catalogo-produtos-laet-impressao.pdf"], ["leve", "catalogo-produtos-laet-whatsapp.pdf"]]) {
    const h = path.join(B, `catalogo-${tipo}.html`); fs.writeFileSync(h, HTML(tipo));
    await p.goto("file://" + h, { waitUntil: "networkidle" }); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(400);
    await p.pdf({ path: path.join(D, arq), width: "216mm", height: "303mm", printBackground: true, preferCSSPageSize: true });
    console.log("ok", arq, (fs.statSync(path.join(D, arq)).size / 1e6).toFixed(1) + " MB");
  }
  await b.close();
})();
