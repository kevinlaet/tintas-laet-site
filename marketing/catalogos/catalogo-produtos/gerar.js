// Catálogo Técnico de Produtos Laet · A4 retrato com 3 mm de sangria (216x303 mm) · 8 páginas.
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
    disp: ["17L · 13 cores", "3,4L · 13 cores", `18L e 3,6L · Branca ${CONF()}`],
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
    uso: "Interno (área seca)", rend: { n: "50", pre: "Rende até", pos: "m²", obs: CONF("embalagem") },
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

// ---------- componentes ----------
const spec = (ic, rot, val) => `<div class="spec"><span class="ic">${I[ic]}</span><div><div class="sr">${rot}</div><div class="sv">${val}</div></div></div>`;
const rendimento = (p) => p.rend ? `<div class="spec"><span class="ic">${I.rend}</span><div><div class="sr">Rendimento</div><div class="rv"><span class="rp">${p.rend.pre}</span> <b>${p.rend.n}</b> <span class="rp">${p.rend.pos}</span></div>${p.rend.obs ? `<div class="ro">${p.rend.obs}</div>` : ""}</div></div>`
  : spec("rend", "Rendimento", CONF());
const specs = (p, comAcab = true) => `<div class="specs">${spec("uso", "Uso", p.uso || CONF())}${comAcab ? spec("acab", "Acabamento", p.acab || CONF()) : ""}${rendimento(p)}</div>`;
const disp = (p) => `<div class="disp"><span class="dr">Disponível em</span>${p.disp.map((d) => `<span class="chip">${d}</span>`).join("")}</div>`;
const cartela = (c, cols, tam = 9.2) => !c ? "" : `<div class="cart">${c.titulo ? `<div class="ct">${c.titulo}</div>` : `<div class="ct">Cores</div>`}
  <div class="cg" style="grid-template-columns:repeat(${cols},${tam}mm)">${c.lista.map((x) => `<div class="sw"><div class="q" style="background:${x.hex};width:${tam}mm;height:${tam}mm${x.hex.toUpperCase() === "#FFFFFF" ? ";box-shadow:inset 0 0 0 .25mm #CBD3DF" : ""}"></div><div class="qn">${x.nome}</div></div>`).join("")}</div>
  ${c.mais ? `<div class="mais">${c.mais}</div>` : ""}</div>`;
const lata = (img, h, extra = "") => `<div class="lata" style="${extra}"><img src="IMG/${img}.png" style="height:${h}mm"><div class="chao"></div></div>`;
const nome = (p, fs = 15) => `<div class="pn" style="font-size:${fs}pt">${p.nome}</div>${p.sub ? `<div class="ps">${p.sub}</div>` : ""}`;

const cabecalho = (linha, nomeLinha, n) => `<div class="band"><div class="bi">
  <div class="bl"><span>${nomeLinha.startsWith("Cartela") ? "Tintas Laet" : "Linha"}</span></div><div class="bt">${nomeLinha}</div><div class="bar"></div></div>
  <img class="blogo" src="IMG/logo-branco.png"></div>${rodape(n)}`;
const rodape = (n) => `<div class="rod"><div class="rl"><span>${I.site}tintaslaet.com</span><span>${I.insta}@tintaslaet</span><span>${I.zap}(11) 97714-0964</span></div><div class="rn">${String(n).padStart(2, "0")}</div></div>`;
const AVISO = `<div class="aviso">As cores impressas ou na tela podem variar um pouco da cor real. Confira na cartela da loja.</div>`;

// ---------- cartelas: nome e hex do SITE no ar (origin/main:site/produto.html), cartelas iguais juntas ----------
const SITE = (() => { const s = execFileSync("git", ["-C", R, "show", "origin/main:site/produto.html"], { encoding: "utf8", maxBuffer: 1e8 });
  const i = s.indexOf("const produtos = {"); let d = 0, j = s.indexOf("{", i), k = j; for (; k < s.length; k++) { if (s[k] === "{") d++; else if (s[k] === "}") { d--; if (!d) break; } }
  return eval("(" + s.slice(j, k + 1) + ")"); })();
const coresSite = (id) => (SITE[id].cores || []).map((c) => ({ nome: c.nome, hex: c.hex.toUpperCase() }));
const nomesDe = (id) => new Set(coresSite(id).map((c) => c.nome));
const marca = (lista, cond, txt) => lista.map((c) => (cond(c) ? { ...c, marca: txt } : c));
const stdTem = nomesDe("standard"), spTem = nomesDe("super-profissional");
const EPOXI = coresSite("epoxi-base-agua");
// ordem por família de tom (como cartela de loja): branco, amarelos, laranjas, vermelhos, rosas, roxos, azuis, verdes, neutros/marrons, cinzas
const hsl = (hex) => { const n = parseInt(hex.slice(1), 16), r = (n >> 16) / 255, g = ((n >> 8) & 255) / 255, b = (n & 255) / 255;
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, d = mx - mn; let h = 0, s2 = 0;
  if (d) { s2 = d / (1 - Math.abs(2 * l - 1)); h = mx === r ? 60 * (((g - b) / d) % 6) : mx === g ? 60 * ((b - r) / d + 2) : 60 * ((r - g) / d + 4); }
  return { h: (h + 360) % 360, s: s2, l }; };
const familia = (hex) => { const { h, s, l } = hsl(hex);
  if (hex.toUpperCase() === "#FFFFFF") return 0;
  if (s < 0.16 || (s < 0.3 && l < 0.55)) return l > 0.62 && h > 15 && h < 75 ? 9 : 10;       // neutros quentes / cinzas
  if (h >= 15 && h < 50 && l < 0.5) return 9;                                                   // marrons
  if (h >= 48 && h < 75) return 1; if (h >= 22 && h < 48) return 2; if (h < 12 || h >= 350) return l > 0.72 ? 4 : 3;
  if (h >= 12 && h < 22) return 3; if (h >= 300 && h < 350) return 4; if (h >= 250 && h < 300) return 5;
  if (h >= 185 && h < 250) return 6; return 8; };
const ordenar = (lista) => lista.map((c, i) => ({ c, f: familia(c.hex), l: hsl(c.hex).l, i })).sort((a, b) => a.f - b.f || b.l - a.l || a.i - b.i).map((x) => x.c);
const tag = (lista, cond, txt) => lista.map((c) => (cond(c) ? { ...c, tag: txt } : c));
const CARTELAS = {
  grande: { titulo: "Cartela Paleta Grande", usada: "Vale para: <b>Emborrachada</b>, <b>Premium Lavável</b> e <b>1ª Linha Standard</b>",
    lista: ordenar(tag(coresSite("premium-lavavel"), (c) => c.nome !== "Branco" && !stdTem.has(c.nome), "Não tem na Standard")) },
  gesso: { titulo: "Cartela Profissional e Gesso", usada: "Vale para: <b>Super Profissional</b> e <b>Direto no Gesso</b>",
    lista: ordenar(tag(coresSite("direto-no-gesso"), (c) => c.nome !== "Branco" && !spTem.has(c.nome), "Só Direto no Gesso")) },
  esmalte: { titulo: "Cartela Esmalte e Epóxi", usada: "<b>Esmalte Ecológico</b>: todas, menos Areia Bege · <b>Epóxi</b>: só as 16 marcadas",
    // primeiro as 16 do Epóxi na ordem do Kevin; depois as que são só do Esmalte (por tom)
    lista: [...EPOXI.map((c) => ({ ...c, tag: c.nome === "Areia Bege" ? "Só Epóxi" : "Também no Epóxi", conf: c.nome === "Areia Bege" })),
            ...ordenar(coresSite("esmalte-ecologico").filter((c) => !EPOXI.some((e) => e.nome === c.nome)))] },
  vinil: { titulo: "Cartela Básica Interna Vinil", usada: "Vale para: <b>Básica Interna Vinil</b>", lista: ordenar(coresSite("latex-vinil")) },
  pisos: { titulo: "Cartela Pisos & Fachadas", usada: "Vale para: <b>Pisos & Fachadas</b>", lista: ordenar(coresSite("piso-fachada")) },
  verniz: { titulo: "Verniz Base Água · tonalidades", lista: coresSite("verniz-premium") },
};
const QW = 26, QH = 15, COLS = 7;           // quadradinho EXATO 26 x 15 mm (pedido do Kevin), 7 por linha
const cart = (c, ini = 0, fim = c.lista.length, cont = false, nota = true) => `<div class="cart2">
  <div class="c2h"><div class="c2t">${c.titulo}${cont ? ' <span class="c2c">(continuação)</span>' : ""}</div>${c.usada && !cont ? `<div class="c2u">${c.usada}</div>` : ""}</div>
  <div class="c2g">${c.lista.slice(ini, fim).map((x) => `<div class="s2"><div class="q2" style="background:${x.hex}${x.hex === "#FFFFFF" ? ";box-shadow:inset 0 0 0 .3mm #C9D2DE" : ""}">${x.tag ? `<span class="qtag${x.tag !== "" ? " forte" : ""}">${x.tag}</span>` : ""}${x.conf ? `<span class="qconf">[CONFERIR HEX]</span>` : ""}</div><div class="n2">${x.nome}</div></div>`).join("")}</div>
  ${nota ? `<div class="c2n"><span></span><span>Cores aproximadas. Confira na loja antes de comprar.</span></div>` : ""}</div>`;
const refCor = (t) => `<div class="cart"><div class="ct">Cores</div><div class="sv" style="font-weight:500">${t}</div></div>`;

// ---------- páginas (8) ----------
const capaFaixas = ["Romã", "Lícor de Laranja", "Amarelo Dourado", "Mistura de Mostarda", "Verde Primavera", "Ilha de Esmeralda", "Pavão", "Céu Sagrado", "Paraíso do Mar", "Azul Jazz", "Lilás Laet", "Fogo Violeta", "Flamingo Real", "Rosa Gloss", "Areia", "Cinza Fumaça"].map((n) => cor("paleta-grande", n));
const capa = `<div class="page capa">
  <div class="cfx">${capaFaixas.map((c) => `<div style="background:${c.hex};height:126mm"></div>`).join("")}</div>
  <div class="cvel"></div>
  <img class="clogo" src="IMG/logo-cor.png">
  <div class="ctit"><div class="ck">Tintas, massas e complementos</div><div class="cm">Catálogo<br>de Produtos</div><div class="cbar"></div></div>
  <div class="clatas">${[["epoxi", 46, 38], ["lavavel", 62, 70], ["emborrachada", 76, 108], ["pisos", 62, 146], ["standard", 50, 178]].map(([k, h, x]) => `<div class="cl" style="left:${x}mm;z-index:${h}"><img src="IMG/${k}.png" style="height:${h}mm"><div class="chao"></div></div>`).join("")}</div>
  <div class="cpe">tintaslaet.com · @tintaslaet</div></div>`;

// cartão de produto (página premium: 2x2)
const cartao = (p, ref, selo = true) => `<div class="pc"><div class="pimg">${lata(p.img, 40)}${selo ? '<span class="selo">Linha Premium</span>' : ""}</div>
  <div class="ptx">${nome(p, 13.5)}<div class="pd">${p.desc}</div>${specs(p)}${disp(p)}${refCor(ref)}</div></div>`;
const pg = (n, linha, corpo) => `<div class="page">${cabecalho("", linha, n)}<div class="corpo">${corpo}</div></div>`;
const linhaRow = (p, ref, lataH = 33, extra = "", premium = false) => `<div class="row${premium ? " prem" : ""}"><div class="rimg">${lata(p.img, lataH)}${premium ? '<span class="selo">Linha Premium</span>' : ""}</div><div class="rtx">${nome(p, premium ? 14.5 : 13)}<div class="pd">${p.desc}</div>${specs(p)}${disp(p)}${ref ? refCor(ref) : ""}${extra}</div></div>`;
const p2 = pg(2, "Premium e Nobres", linhaRow(P.emborrachada, "Cartela <b>Paleta Grande</b>, páginas 3 e 4", 44, "", true) + linhaRow(P.lavavel, "Cartela <b>Paleta Grande</b>, páginas 3 e 4", 44, "", true)
  + linhaRow(P.pisos, "Cartela <b>Pisos & Fachadas</b>, página 4", 44, "", true) + linhaRow(P.epoxi, "16 cores: cartela <b>Esmalte Ecológico e Epóxi</b>, página 7", 42, "", true));
const G = CARTELAS.grande, corte = COLS * 9;   // 9 fileiras na pág. 3, o resto na 4
const p3 = pg(3, "Cartela de Cores", cart(G, 0, corte, false, false));
const p4 = pg(4, "Cartela de Cores", cart(G, corte, G.lista.length, true) + cart(CARTELAS.pisos));

const p5 = pg(5, "Acrílicas", linhaRow(P.standard, "Cartela <b>Paleta Grande</b>, páginas 3 e 4 (as que não têm na Standard estão marcadas)")
  + linhaRow(P.profissional, "Cartela <b>Super Profissional e Direto no Gesso</b>, página 6") + linhaRow(P.vinil, "Cartela abaixo") + cart(CARTELAS.vinil));
const p6 = pg(6, "Gesso & Drywall", linhaRow(P.gesso, "Cartela abaixo", 34) + `<div class="dica" style="margin:3mm 0 1mm"><b>Dica de balcão</b>Gesso e drywall novos: limpa o pó, aplica a Direto no Gesso e pronto. Não precisa passar fundo antes.</div>` + cart(CARTELAS.gesso));
const tons = (c) => `<div class="cart"><div class="ct">Tonalidades</div><div class="tons">${c.lista.map((x) => `<div class="s2"><div class="q2" style="background:${x.hex}"></div><div class="n2">${x.nome}</div></div>`).join("")}</div><div class="c2n" style="margin-top:.3mm"><span>Cores aproximadas. Confira na loja antes de comprar.</span></div></div>`;
const p7 = pg(7, "Madeiras & Metais", linhaRow(P.esmalte, "") + linhaRow(P.verniz, "", 34, tons(CARTELAS.verniz)) + cart(CARTELAS.esmalte));

const massa = (p) => `<div class="mc"><div class="mimg">${lata(p.img, 34)}</div><div class="mtx">${nome(p, 12)}<div class="pd">${p.desc}</div>${specs(p, false)}${disp(p)}</div></div>`;
const LOJAS = [[1, "Vila Bela (Sapopemba)", "São Paulo"], [2, "Jardim São João", "Mauá"], [3, "Jardim Santa Cecília", "Mauá"], [4, "Vila Luzita", "Santo André"], [5, "Jardim Itapark", "Mauá"], [6, "Santa Terezinha", "São Bernardo do Campo"]];
const p8 = `<div class="page">${cabecalho("", "Massas & Complementos", 8)}<div class="corpo"><div class="g2m">${["corrida", "acrilica", "seladora", "fundo"].map((k) => massa(P[k])).join("")}</div></div>
  <div class="lojasbox"><div class="lbt">Nossas lojas</div>
    <div class="lbg">${LOJAS.map(([n, b, c]) => `<div class="lbj"><span>Loja ${n}</span><b>${b}</b><i>${c}</i></div>`).join("")}</div>
    <div class="lbc"><div class="lbci">
      <div class="ci"><span>${I.zap}</span><div><small>WhatsApp</small>(11) 97714-0964</div></div>
      <div class="ci"><span>${I.insta}</span><div><small>Instagram</small>@tintaslaet</div></div>
      <div class="ci"><span>${I.site}</span><div><small>Site</small>tintaslaet.com</div></div></div>
      <div class="qr"><div>QR CODE<br>DO WHATSAPP</div><small>espaço reservado</small></div></div></div></div>`;
const PAGINAS = [capa, p2, p3, p4, p5, p6, p7, p8];

// ---------- estilo ----------
const CSS = `@page{size:216mm 303mm;margin:0}
*{margin:0;padding:0;box-sizing:border-box}
html,body{background:#fff;-webkit-print-color-adjust:exact;print-color-adjust:exact}
body{font-family:'Poppins',sans-serif;color:#1B2433}
.page{position:relative;width:216mm;height:303mm;overflow:hidden;background:#FAFAF7;page-break-after:always}
.conf{color:#E53935;font-weight:700;font-family:'Poppins'}.confn{font-weight:500;font-size:.85em}
/* cabeçalho de linha (sai na sangria) */
.band{position:absolute;left:0;top:0;right:0;height:43mm;background:linear-gradient(120deg,#0D47A1 0%,#0B3C8C 55%,#062B63 100%)}
.band::after{content:"";position:absolute;left:0;right:0;bottom:0;height:1.6mm;background:linear-gradient(90deg,#FFC107 0 26%,#FFE082 26% 30%,transparent 30%)}
.bi{position:absolute;left:18mm;top:12mm}
.bl span{display:inline-block;font-family:'Poppins';font-weight:600;font-size:9pt;letter-spacing:.22em;text-transform:uppercase;color:#FFE082}
.bt{font-family:'Montserrat';font-weight:800;font-size:27pt;letter-spacing:-.01em;text-transform:uppercase;color:#fff;line-height:1.05;margin-top:1mm}
.bar{width:16mm;height:1.6mm;background:#FFC107;border-radius:1mm;margin-top:2.6mm}
.blogo{position:absolute;right:18mm;top:13.5mm;height:17mm}
.rod{position:absolute;left:18mm;right:18mm;bottom:12mm;display:flex;align-items:center;justify-content:space-between;border-top:.3mm solid #D5DDEA;padding-top:2.6mm;font-size:7.6pt;color:#4A5568}
.rl{display:flex;gap:6mm}.rl span{display:flex;align-items:center;gap:1.4mm}.rl svg{width:3.4mm;height:3.4mm;color:#0D47A1}
.rn{font-family:'Bebas Neue';font-size:14pt;color:#0D47A1;letter-spacing:.04em}
.aviso{position:absolute;left:18mm;right:18mm;bottom:19.5mm;font-size:6.6pt;color:#7A8597;text-align:right}
.corpo{position:absolute;left:16mm;right:16mm;top:48mm;bottom:22mm}
/* produto */
.lata{position:relative;display:flex;justify-content:center;align-items:flex-end}
.lata img{position:relative;z-index:2;filter:drop-shadow(0 1.2mm 1.2mm rgba(6,43,99,.18))}
.chao{position:absolute;bottom:-1.6mm;left:50%;transform:translateX(-50%);width:80%;height:4mm;border-radius:50%;background:radial-gradient(ellipse,rgba(6,24,58,.38) 0%,rgba(6,24,58,.14) 45%,transparent 72%);z-index:1}
.pn{font-family:'Montserrat';font-weight:800;text-transform:uppercase;color:#0D47A1;letter-spacing:-.005em;line-height:1.05}
.ps{font-family:'Poppins';font-weight:600;font-size:8pt;color:#1976D2;margin-top:.6mm;letter-spacing:.02em}
.pd{font-size:8.6pt;line-height:1.45;color:#2D3748;margin-top:2mm}
.specs{display:flex;gap:4mm;margin-top:3mm;flex-wrap:wrap}
.spec{display:flex;gap:1.6mm;align-items:flex-start;min-width:0}
.ic{flex:none;width:6.2mm;height:6.2mm;border-radius:50%;background:#E8EEF8;color:#0D47A1;display:flex;align-items:center;justify-content:center}.ic svg{width:3.8mm;height:3.8mm}
.sr{font-size:6.2pt;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:#7A8597}
.sv{font-size:8.2pt;font-weight:600;color:#1B2433;line-height:1.25}
.rv{color:#0D47A1;line-height:1}.rv b{font-family:'Bebas Neue';font-weight:400;font-size:17pt;letter-spacing:.01em;vertical-align:-.06em}.rp{font-size:7.6pt;font-weight:600;color:#1B2433}
.ro{font-size:6.8pt;color:#5A6577;margin-top:.4mm}
.disp{display:flex;flex-wrap:wrap;align-items:center;gap:1.4mm;margin-top:3mm}
.dr{font-size:6.2pt;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:#7A8597;margin-right:1mm}
.chip{font-size:7.4pt;font-weight:600;color:#062B63;background:#fff;border:.3mm solid #C9D5E8;border-radius:5mm;padding:.5mm 2.4mm}
.cart{margin-top:3.2mm}.ct{font-size:6.2pt;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:#7A8597;margin-bottom:1.4mm}
.cg{display:grid;column-gap:1.6mm;row-gap:1.8mm}
.sw{min-width:0}.q{border-radius:1.2mm}
.qn{font-size:5.3pt;line-height:1.15;color:#3A4556;margin-top:.7mm;overflow-wrap:break-word;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.mais{font-size:7pt;font-weight:600;color:#1976D2;margin-top:1.6mm}
/* página premium: 2x2 */
.g2{display:grid;grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr;gap:6mm;height:100%}
.pc{background:#fff;border-radius:4mm;border:.3mm solid #E3E8F0;box-shadow:0 1mm 3mm rgba(6,43,99,.06);padding:5mm;display:flex;flex-direction:column;overflow:hidden}
.pimg{position:relative;height:48mm;flex:none;border-radius:3mm;background:radial-gradient(ellipse 70% 80% at 50% 45%,#FFFFFF 0%,#EEF3FA 70%,#E3EAF5 100%);display:flex;align-items:flex-end;justify-content:center;padding-bottom:4mm}
.selo{position:absolute;left:3mm;top:3mm;font-size:6pt;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:#062B63;border:.3mm solid #FFC107;background:rgba(255,224,130,.35);border-radius:4mm;padding:.5mm 2.2mm}
.ptx{padding-top:3.6mm;min-height:0}
.ptx .specs{gap:3mm}
/* premium grande: 2 por página */
.pb{display:flex;gap:7mm;height:50%;padding:1mm 0 6mm}.pb + .pb{border-top:.3mm solid #E3E8F0;padding-top:6mm}
.pbimg{position:relative;flex:none;width:68mm;border-radius:4mm;background:radial-gradient(ellipse 70% 80% at 50% 45%,#FFFFFF 0%,#EEF3FA 70%,#E3EAF5 100%);display:flex;align-items:flex-end;justify-content:center;padding-bottom:7mm}
.pbimg img{max-width:60mm;object-fit:contain}
.pbtx{flex:1;min-width:0;padding-top:1mm}.pbtx .ps{font-size:9pt}.pbtx .specs{gap:4.5mm}
.pbtx .dica{margin-top:3mm;padding:2.2mm 3.4mm;font-size:7.8pt}
/* linhas (acrílicas, madeiras) */
.row{display:flex;gap:6mm;padding:2.6mm 0;border-bottom:.3mm solid #E3E8F0}.row.prem{padding:2.2mm 0}.row:last-child{border-bottom:0}
.rimg{position:relative;flex:none;width:40mm;height:40mm;border-radius:3mm;background:radial-gradient(ellipse 70% 80% at 50% 45%,#FFFFFF 0%,#EEF3FA 70%,#E3EAF5 100%);display:flex;align-items:flex-end;justify-content:center;padding-bottom:4mm}
.rtx{flex:1;min-width:0}.rtx .specs{margin-top:1.8mm}.rtx .disp{margin-top:1.8mm}.rtx .cart{margin-top:1.8mm}.rtx .pd{margin-top:1.2mm;font-size:8.2pt}.rtx .ct{margin-bottom:.6mm}
/* gesso */
.hero{display:flex;gap:8mm;align-items:stretch}
.himg{flex:none;width:76mm;height:112mm;border-radius:4mm;background:radial-gradient(ellipse 70% 80% at 50% 45%,#FFFFFF 0%,#EEF3FA 70%,#E3EAF5 100%);display:flex;align-items:flex-end;justify-content:center;padding-bottom:7mm}
.htx{flex:1;padding-top:3mm}.htx .ps{font-size:9.5pt}
.dica{margin-top:5mm;background:#FFF6D6;border-left:1.4mm solid #FFC107;border-radius:0 2.5mm 2.5mm 0;padding:3mm 4mm;font-size:8.4pt;line-height:1.45;color:#3A3220}.dica b{display:block;font-family:'Montserrat';font-weight:800;font-size:7.4pt;letter-spacing:.08em;text-transform:uppercase;color:#062B63;margin-bottom:.6mm}
.hero + .cart{margin-top:8mm}.hero + .cart .qn{font-size:6.2pt}
/* massas */
.g2m{display:grid;grid-template-columns:1fr 1fr;grid-auto-rows:73mm;gap:4mm}.mc .chip{font-size:6.8pt;padding:.4mm 1.8mm}.mc .disp{gap:1mm}.mc .dr{width:100%;margin-bottom:.2mm}
.mc{background:#fff;border-radius:4mm;border:.3mm solid #E3E8F0;padding:5mm;display:flex;gap:4mm}
.mimg{flex:none;width:26mm;border-radius:3mm;background:radial-gradient(ellipse 70% 80% at 50% 45%,#FFFFFF 0%,#EEF3FA 70%,#E3EAF5 100%);display:flex;align-items:flex-end;justify-content:center;padding-bottom:4mm}
.mimg img{max-width:27mm;object-fit:contain}
.mtx{flex:1;min-width:0}.mtx .specs{flex-direction:column;gap:2mm}
.qual{position:absolute;left:18mm;right:18mm;top:233mm;background:#062B63;border-radius:4mm;padding:4.5mm 6mm;color:#fff}
.qt{font-family:'Montserrat';font-weight:800;font-size:11pt;text-transform:uppercase;margin-bottom:2.4mm}.qt::after{content:"";display:inline-block;width:8mm;height:1.2mm;background:#FFC107;border-radius:1mm;margin-left:3mm;vertical-align:middle}
.qrow{display:flex;justify-content:space-between;align-items:center;font-size:8.4pt;padding:1.3mm 0;border-top:.25mm solid rgba(255,255,255,.14)}.qrow b{color:#FFC107;font-weight:600}
.page:has(.qual) .rod{bottom:12mm}
.row.prem .rimg{width:46mm;height:48mm}
.tons{display:grid;grid-template-columns:repeat(3,26mm);gap:3mm}
/* cartelas 26x15 */
.cart2{margin-top:4mm;break-inside:avoid}.corpo > .cart2:first-child{margin-top:0}
.c2h{display:flex;align-items:baseline;justify-content:space-between;gap:4mm;border-bottom:.35mm solid #0D47A1;padding-bottom:1.2mm;margin-bottom:2mm}
.c2t{font-family:'Montserrat';font-weight:800;font-size:12pt;text-transform:uppercase;color:#0D47A1;letter-spacing:-.005em}.c2c{font-family:'Poppins';font-weight:500;font-size:8pt;text-transform:none;color:#7A8597}
.c2u{font-size:8pt;font-weight:500;color:#2D3748;text-align:right}.c2u b{color:#0D47A1;font-weight:700}
.c2g{display:grid;grid-template-columns:repeat(7,26mm);column-gap:.33mm;row-gap:1.1mm;justify-content:space-between}
.q2{position:relative;width:26mm;height:15mm;border-radius:1.4mm}.qtag{position:absolute;left:.9mm;top:.9mm;font-size:5.2pt;font-weight:600;line-height:1;color:#062B63;background:rgba(255,255,255,.9);border-radius:.8mm;padding:.5mm .9mm .4mm}.qtag.forte{background:#062B63;color:#fff}
.qconf{position:absolute;left:1mm;bottom:1mm;font-size:5.6pt;font-weight:700;color:#E53935;background:rgba(255,255,255,.85);border-radius:.8mm;padding:0 .8mm}
.n2{font-family:'Poppins';font-size:6.2pt;font-weight:500;line-height:1.15;color:#2D3748;margin-top:.6mm;height:3.4mm;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}.n2 b{color:#1976D2;font-weight:700}
.c2n{display:flex;justify-content:space-between;gap:4mm;margin-top:1.8mm;font-size:6.8pt;color:#5A6577}.c2n span:last-child{font-weight:600;color:#062B63}
.g2r{display:grid;grid-template-columns:1fr 1fr;gap:6mm;margin-bottom:2mm}.g2r .pc{height:92mm}
.lojasbox{position:absolute;left:0;right:0;bottom:0;height:102mm;background:linear-gradient(160deg,#0D47A1 0%,#0A3A86 45%,#062B63 100%);color:#fff;padding:8mm 18mm 0}
.lbt{font-family:'Montserrat';font-weight:800;font-size:17pt;text-transform:uppercase}.lbt::after{content:"";display:inline-block;width:10mm;height:1.4mm;background:#FFC107;border-radius:1mm;margin-left:3mm;vertical-align:middle}
.lbg{display:grid;grid-template-columns:repeat(3,1fr);gap:3mm;margin-top:4mm}
.lbj{background:rgba(255,255,255,.08);border:.3mm solid rgba(255,255,255,.16);border-radius:3mm;padding:2.6mm 3.4mm;display:flex;flex-direction:column}
.lbj span{font-family:'Bebas Neue';font-size:11pt;letter-spacing:.06em;color:#FFC107}.lbj b{font-family:'Montserrat';font-weight:800;font-size:9.5pt}.lbj i{font-style:normal;font-size:7.6pt;color:rgba(255,255,255,.78)}
.lbc{display:flex;justify-content:space-between;align-items:center;margin-top:5mm}.lbci{display:flex;gap:7mm}
.lbc .ci{font-size:11pt}.lbc .ci span{width:8.5mm;height:8.5mm}.lbc .qr{width:34mm;height:34mm}
/* capa */
.capa{background:#FAFAF7}
.cfx{position:absolute;left:0;right:0;bottom:0;height:150mm;display:flex;align-items:flex-end}.cfx div{flex:1;border-radius:2.2mm 2.2mm 0 0;margin:0 .45mm}
.cvel{position:absolute;left:0;right:0;bottom:0;height:150mm;background:linear-gradient(180deg,#FAFAF7 0%,rgba(250,250,247,.0) 28%,rgba(250,250,247,0) 62%,rgba(250,250,247,.15) 100%)}
.clogo{position:absolute;left:21mm;top:25mm;height:30mm}
.ctit{position:absolute;left:21mm;top:76mm}
.ck{font-size:10pt;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:#1976D2}
.cm{font-family:'Montserrat';font-weight:800;font-size:46pt;line-height:.98;letter-spacing:-.02em;color:#0D47A1;margin-top:3mm}
.cbar{width:22mm;height:2.2mm;background:#FFC107;border-radius:1mm;margin-top:6mm}
.clatas{position:absolute;left:0;right:0;bottom:30mm;height:90mm}
.cl{position:absolute;bottom:0;transform:translateX(-50%)}.cl img{display:block;filter:drop-shadow(0 2mm 2.4mm rgba(0,0,0,.28))}.cl .chao{bottom:-2mm;width:90%;height:5mm;background:radial-gradient(ellipse,rgba(0,0,0,.45) 0%,rgba(0,0,0,.16) 45%,transparent 72%)}
.capa::after{content:"";position:absolute;left:0;right:0;bottom:0;height:30mm;background:#062B63}
.cpe{position:absolute;left:0;right:0;bottom:13mm;text-align:center;color:#fff;font-weight:600;font-size:10pt;letter-spacing:.08em;z-index:3}
/* contracapa */
.contra{background:linear-gradient(160deg,#0D47A1 0%,#0A3A86 45%,#062B63 100%);color:#fff}
.ccfx{position:absolute;left:0;right:0;top:0;height:6mm;display:flex}.ccfx div{flex:1}
.clogo2{position:absolute;left:21mm;top:26mm;height:24mm}
.ctt{position:absolute;left:21mm;top:68mm;font-family:'Montserrat';font-weight:800;font-size:30pt;text-transform:uppercase;letter-spacing:-.01em}
.cts{position:absolute;left:21mm;top:84mm;font-size:10.5pt;color:#FFE082;font-weight:500}
.lojas{position:absolute;left:21mm;right:21mm;top:98mm;display:grid;grid-template-columns:1fr 1fr;gap:4.5mm}
.lj{background:rgba(255,255,255,.08);border:.3mm solid rgba(255,255,255,.16);border-radius:3.5mm;padding:4.5mm 5mm}
.ljn{font-family:'Bebas Neue';font-size:13pt;letter-spacing:.06em;color:#FFC107}
.ljb{font-family:'Montserrat';font-weight:800;font-size:12.5pt;margin-top:.6mm}.ljc{font-size:9pt;color:rgba(255,255,255,.78);margin-top:.4mm}
.cont{position:absolute;left:21mm;right:21mm;top:196mm;display:flex;justify-content:space-between;align-items:center}
.cl1{display:flex;flex-direction:column;gap:5mm}
.ci{display:flex;align-items:center;gap:3.4mm;font-family:'Montserrat';font-weight:800;font-size:14pt}.ci span{width:10mm;height:10mm;border-radius:50%;background:#FFC107;color:#062B63;display:flex;align-items:center;justify-content:center}.ci svg{width:5.6mm;height:5.6mm}
.ci small{display:block;font-family:'Poppins';font-weight:500;font-size:7.5pt;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.7)}
.qr{width:46mm;height:46mm;border:.6mm dashed rgba(255,255,255,.7);border-radius:3mm;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;font-family:'Montserrat';font-weight:800;font-size:9pt;line-height:1.3}.qr small{font-family:'Poppins';font-weight:500;font-size:6.8pt;color:rgba(255,255,255,.7);margin-top:2mm}
.cav{position:absolute;left:21mm;right:21mm;bottom:16mm;font-size:7.4pt;color:rgba(255,255,255,.65)}`;

const HTML = (img) => `<!doctype html><html><head><meta charset="utf-8"><link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Montserrat:wght@800&family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet"><style>${CSS}</style></head><body>
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
