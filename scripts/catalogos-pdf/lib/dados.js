// Dados dos catálogos: cores (paleta oficial, identidade/cores) e preços (site/produto.html, a mesma fonte do site).
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const RAIZ = path.join(__dirname, "..", "..", "..");
const norm = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toUpperCase().replace(/[-–]/g, " ").replace(/\s+/g, " ").trim();

function lerProdutos() {
  const html = fs.readFileSync(path.join(RAIZ, "site", "produto.html"), "utf8");
  const ini = html.indexOf("const produtos = {");
  if (ini < 0) throw new Error("não achei 'const produtos' em site/produto.html");
  const comeco = ini + "const produtos = ".length;
  let prof = 0, aspas = null, fim = -1;
  for (let i = comeco; i < html.length; i++) {
    const c = html[i];
    if (aspas) { if (c === "\\") i++; else if (c === aspas) aspas = null; continue; }
    if (c === "'" || c === '"' || c === "`") { aspas = c; continue; }
    if (c === "{") prof++;
    if (c === "}") { prof--; if (prof === 0) { fim = i; break; } }
  }
  return vm.runInNewContext("(" + html.slice(comeco, fim + 1) + ")");
}

const produtos = lerProdutos();
const paleta = JSON.parse(fs.readFileSync(path.join(RAIZ, "identidade", "cores", "paleta-oficial.json"), "utf8"));
const ordem = JSON.parse(fs.readFileSync(path.join(__dirname, "ordem-cores.json"), "utf8"));

// "R$ 419,90" -> "R$419,90" (o jeito que o catálogo sempre escreveu)
const moeda = (s) => (s ? String(s).replace(/\s+/g, "") : "");

function corDaPaleta(linhaPaleta, nome) {
  const l = paleta.linhas[linhaPaleta];
  return l.cores.find((c) => norm(c.nome) === norm(nome)) || null;
}

function produto(id) {
  const p = produtos[id];
  if (!p) throw new Error("produto não existe no site: " + id);
  return p;
}

function precoFixo(id, desc) {
  const achado = (produto(id).precos || []).find((p) => norm(p.desc) === norm(desc));
  if (!achado) throw new Error(`preço "${desc}" não existe em ${id}`);
  return moeda(achado.valor);
}

module.exports = { RAIZ, norm, produtos, paleta, ordem, moeda, corDaPaleta, produto, precoFixo };
