// Confere (e opcionalmente corrige) as cores do site e dos catálogos contra a paleta oficial.
//
//   node scripts/cores/verificar.js             -> só relata (não mexe em nada)
//   node scripts/cores/verificar.js --corrigir  -> troca o hex errado pelo oficial, nos arquivos
//
// Fonte de verdade: identidade/cores/paleta-oficial.json (extraída dos PDFs/fotos que o Kevin mandou).
// Regra: hex tem que ser IGUAL ao oficial, letra por letra (sem tolerância).
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const RAIZ = path.join(__dirname, "..", "..");
const CORRIGIR = process.argv.includes("--corrigir");
const mestre = JSON.parse(fs.readFileSync(path.join(RAIZ, "identidade", "cores", "paleta-oficial.json"), "utf8"));

const norm = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toUpperCase().replace(/[-–]/g, " ").replace(/\s+/g, " ").trim();
const oficial = {}; // linha -> Map(nome normalizado -> { nome, hex })
for (const [k, l] of Object.entries(mestre.linhas)) oficial[k] = new Map(l.cores.map((c) => [norm(c.nome), c]));

// id do produto/linha do site -> linha da paleta oficial
const LINHA_DO_PRODUTO = {};
for (const [k, l] of Object.entries(mestre.linhas)) for (const id of l.usada_por) LINHA_DO_PRODUTO[id] = k;
const LINHA_DA_PAGINA = { "standard.html": "standard", "premium-lavavel.html": "paleta-grande", "emborrachada.html": "paleta-grande", "latex-vinil.html": "latex-vinil", "super-profissional.html": "super-profissional", "piso-fachada.html": "piso-fachada", "esmalte-ecologico.html": "esmalte-ecologico" };
const LINHA_DO_IMPRESSO = { "Latex Vinil 18L": "latex-vinil", "Paleta Grande Laet": "paleta-grande", "1ª Linha Standard": "standard", "Super Profissional & Direto no Gesso": "super-profissional", "Esmalte Ecológico Base Água": "esmalte-ecologico", "Pisos & Fachadas": "piso-fachada" };

const IGNORAR = new Set(["BRANCO"]); // branco é sempre #FFFFFF

// ---------- utilidades de cor ----------
function lab(hex) {
  const v = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)));
  const x = (0.4124 * v[0] + 0.3576 * v[1] + 0.1805 * v[2]) / 0.95047, y = 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2], z = (0.0193 * v[0] + 0.1192 * v[1] + 0.9505 * v[2]) / 1.08883;
  const f = (t) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);
  return [116 * f(y) - 16, 500 * (f(x) - f(y)), 200 * (f(y) - f(z))];
}
const deltaE = (a, b) => { const p = lab(a), q = lab(b); return Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]); };

// ---------- achados ----------
const achados = []; // { arquivo, linha, nome, hex, oficial, ordem }
const semReferencia = []; // nomes que o site tem mas a linha oficial não
const arquivosTocados = new Map(); // arquivo -> texto novo
const lidos = new Map();
const ler = (rel) => { if (!lidos.has(rel)) lidos.set(rel, fs.readFileSync(path.join(RAIZ, rel), "utf8")); return lidos.get(rel); };
const contagem = {};

const vistos = new Map(); // "arquivo#contexto" -> { linha, nomes:Set } (pra achar cor que falta na página)
function conferir(arquivo, linha, nome, hex, contexto = "") {
  const n = norm(nome);
  if (IGNORAR.has(n)) return null;
  contagem[arquivo] = (contagem[arquivo] || 0) + 1;
  const chave = arquivo + "#" + (contexto || linha);
  if (!vistos.has(chave)) vistos.set(chave, { arquivo, linha, contexto: contexto || linha, nomes: new Set() });
  vistos.get(chave).nomes.add(n);
  const ref = oficial[linha] && oficial[linha].get(n);
  if (!ref) { semReferencia.push({ arquivo, linha, nome, hex }); return null; }
  if (ref.hex.toUpperCase() === hex.toUpperCase()) return null;
  achados.push({ arquivo, linha, nome, hex: hex.toUpperCase(), oficial: ref.hex.toUpperCase(), de: deltaE(hex, ref.hex) });
  return ref.hex.toUpperCase();
}

// troca dentro de um arquivo, respeitando o contexto de linha
function varrer(arquivo, regex, resolver) {
  let texto = ler(arquivo);
  const novo = texto.replace(regex, (...args) => {
    const g = args[args.length - 1];
    const offset = args[args.length - 3];
    const r = resolver(offset, g);
    if (!r) return args[0];
    const linha = typeof r === "string" ? r : r.linha;
    const contexto = typeof r === "string" ? "" : r.contexto;
    const certo = conferir(arquivo, linha, g.nome, g.hex, contexto);
    return certo ? args[0].replace(new RegExp(g.hex, "i"), certo) : args[0];
  });
  if (novo !== texto) arquivosTocados.set(arquivo, novo);
  lidos.set(arquivo, novo);
}

// 1) produto.html: { nome: 'X', hex: '#...' } dentro de cada produto
{
  const arq = "site/produto.html";
  const texto = ler(arq);
  const chaves = []; // [offset, id] das chaves de 1º nível do objeto produtos
  const ini = texto.indexOf("const produtos = {");
  let prof = 0, q = null;
  for (let i = ini + "const produtos = ".length; i < texto.length; i++) {
    const c = texto[i];
    if (q) { if (c === "\\") i++; else if (c === q) q = null; continue; }
    if (c === "'" || c === '"' || c === "`") {
      if (prof === 1) { const m = /^(['"])([a-z0-9-]+)\1\s*:\s*\{/.exec(texto.slice(i, i + 80)); if (m) chaves.push([i, m[2]]); }
      q = c; continue;
    }
    if (c === "{") prof++;
    if (c === "}") { prof--; if (prof === 0) break; }
  }
  const idEm = (off) => { let id = null; for (const [o, k] of chaves) if (o <= off) id = k; return id; };
  varrer(arq, /\{\s*nome:\s*'(?<nome>[^']+)',\s*hex:\s*'(?<hex>#[0-9A-Fa-f]{6})'/g, (off) => { const id = idEm(off); return LINHA_DO_PRODUTO[id] ? { linha: LINHA_DO_PRODUTO[id], contexto: id } : null; });
}

// 2) catálogos: uns têm array JS, outros têm cartão HTML
for (const [pag, linha] of Object.entries(LINHA_DA_PAGINA)) {
  const arq = "site/catalogo/" + pag;
  varrer(arq, /\{\s*nome:\s*'(?<nome>[^']+)',\s*hex:\s*'(?<hex>#[0-9A-Fa-f]{6})'/g, () => linha);
  varrer(arq, /<div class="color-swatch[^"]*" style="background:(?<hex>#[0-9A-Fa-f]{6})"><\/div>\s*<div class="color-info">\s*<div class="color-name">(?<nome>[^<]+)<\/div>/g, () => linha);
}

// 3) leque da home
varrer("site/index.html", /style="background:(?<hex>#[0-9A-Fa-f]{6})"\s+data-nome="(?<nome>[^"]+)"\s+data-href="produto\.html\?id=(?<id>[a-z0-9-]+)/g, (off, g) => (LINHA_DO_PRODUTO[g.id] ? { linha: LINHA_DO_PRODUTO[g.id], contexto: "leque" } : null));

// 4) catálogo impresso da loja
{
  const arq = "saidas/catalogo-cores-loja/catalogo-cores-laet.html";
  if (fs.existsSync(path.join(RAIZ, arq))) {
    const texto = ler(arq);
    const pos = [];
    for (const t of Object.keys(LINHA_DO_IMPRESSO)) { const i = texto.indexOf("titulo: '" + t + "'"); if (i >= 0) pos.push([i, LINHA_DO_IMPRESSO[t]]); }
    pos.sort((a, b) => a[0] - b[0]);
    const todos = [...texto.matchAll(/titulo:\s*'([^']+)'/g)].map((m) => [m.index, LINHA_DO_IMPRESSO[m[1]] || null]);
    const linhaEm = (off) => { let l = null; for (const [o, k] of todos) if (o <= off) l = k; return l ? { linha: l, contexto: l } : null; };
    varrer(arq, /\{nome:'(?<nome>[^']+)',hex:'(?<hex>#[0-9A-Fa-f]{6})'/g, (off) => linhaEm(off));
  }
}

// ---------- relatório ----------
const R = "\x1b[31m", V = "\x1b[32m", A = "\x1b[33m", Z = "\x1b[0m";
console.log("Cores conferidas por arquivo:");
for (const [a, n] of Object.entries(contagem)) console.log("  " + String(n).padStart(4), a);

if (achados.length) {
  console.log(`\n${R}${achados.length} cor(es) diferente(s) do oficial:${Z}`);
  achados.sort((a, b) => b.de - a.de);
  for (const a of achados) console.log(`  ${a.arquivo}  [${a.linha}]  ${a.nome}: ${a.hex} -> ${a.oficial}  (ΔE ${a.de.toFixed(1)})`);
} else console.log(`\n${V}Todas as cores batem com a paleta oficial.${Z}`);

if (semReferencia.length) {
  console.log(`\n${A}${semReferencia.length} nome(s) no site que não existem na linha oficial (conferir se foi retirada de propósito ou se o nome está diferente):${Z}`);
  for (const s of semReferencia) console.log(`  ${s.arquivo}  [${s.linha}]  ${s.nome} ${s.hex}`);
}

// cor que existe na paleta oficial mas não aparece na página (só relata; o leque é amostra e fica de fora)
const faltando = [];
for (const v of vistos.values()) {
  if (v.contexto === "leque") continue;
  const l = mestre.linhas[v.linha];
  const fora = new Set((l.removidas_do_site || []).map(norm));
  for (const [n, c] of oficial[v.linha]) if (!v.nomes.has(n) && !fora.has(n)) faltando.push(v.arquivo + " [" + v.contexto + "]  " + c.nome + " " + c.hex);
}
if (faltando.length) {
  console.log(`
${A}${faltando.length} cor(es) da paleta oficial que não aparecem na página (conferir se saiu de propósito):${Z}`);
  for (const f of faltando) console.log("  " + f);
}

if (CORRIGIR && arquivosTocados.size) {
  for (const [rel, txt] of arquivosTocados) fs.writeFileSync(path.join(RAIZ, rel), txt);
  console.log(`\n${V}Corrigido em ${arquivosTocados.size} arquivo(s):${Z} ${[...arquivosTocados.keys()].join(", ")}`);
} else if (achados.length) console.log("\n(nada foi alterado; rode com --corrigir pra aplicar)");
process.exitCode = achados.length ? 1 : 0;
