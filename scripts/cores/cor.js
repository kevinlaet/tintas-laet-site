// Consulta a paleta oficial da Tintas Laet.
//
//   node scripts/cores/cor.js "fogo violeta"      -> hex oficial (e em quais linhas a cor existe)
//   node scripts/cores/cor.js --perto "#FF3C00"   -> as 5 cores oficiais mais próximas de um hex (ΔE)
//   node scripts/cores/cor.js --linha standard    -> lista a linha inteira (nome, hex)
const fs = require("fs");
const path = require("path");

const mestre = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "..", "identidade", "cores", "paleta-oficial.json"), "utf8"));
const norm = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toUpperCase().replace(/[-–]/g, " ").replace(/\s+/g, " ").trim();

function lab(hex) {
  const v = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)));
  const x = (0.4124 * v[0] + 0.3576 * v[1] + 0.1805 * v[2]) / 0.95047, y = 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2], z = (0.0193 * v[0] + 0.1192 * v[1] + 0.9505 * v[2]) / 1.08883;
  const f = (t) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);
  return [116 * f(y) - 16, 500 * (f(x) - f(y)), 200 * (f(y) - f(z))];
}
const deltaE = (a, b) => { const p = lab(a), q = lab(b); return Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]); };

const todas = [];
for (const [k, l] of Object.entries(mestre.linhas)) for (const c of l.cores) todas.push({ linha: k, titulo: l.titulo, ...c });

const [a, b] = process.argv.slice(2);
if (!a) { console.log('uso: cor.js "nome da cor" | --perto "#HEX" | --linha <chave>\nlinhas:', Object.keys(mestre.linhas).join(", ")); process.exit(0); }

if (a === "--linha") {
  const l = mestre.linhas[b];
  if (!l) { console.log("linha não existe. Opções:", Object.keys(mestre.linhas).join(", ")); process.exit(1); }
  console.log(`${l.titulo} — ${l.cores.length} cores (fonte: ${l.referencia})`);
  for (const c of l.cores) console.log("  " + c.hex + "  " + c.nome);
} else if (a === "--perto") {
  const hex = (b || "").toUpperCase().startsWith("#") ? b.toUpperCase() : "#" + (b || "").toUpperCase();
  if (!/^#[0-9A-F]{6}$/.test(hex)) { console.log("hex inválido:", b); process.exit(1); }
  const ordem = todas.map((c) => ({ ...c, de: deltaE(hex, c.hex) })).sort((x, y) => x.de - y.de);
  const vistos = new Set();
  let n = 0;
  console.log("Mais próximas de " + hex + ":");
  for (const c of ordem) {
    const chave = c.nome + c.hex;
    if (vistos.has(chave)) continue;
    vistos.add(chave);
    console.log(`  ΔE ${c.de.toFixed(1).padStart(5)}  ${c.hex}  ${c.nome}  [${c.linha}]`);
    if (++n === 5) break;
  }
  console.log("(ΔE < 2: praticamente igual · 2 a 5: dá pra notar lado a lado · > 5: cor diferente)");
} else {
  const q = norm(a);
  const achadas = todas.filter((c) => norm(c.nome) === q);
  const parecidas = achadas.length ? [] : todas.filter((c) => norm(c.nome).includes(q));
  const lista = achadas.length ? achadas : parecidas;
  if (!lista.length) { console.log('Nenhuma cor chamada "' + a + '" na paleta oficial. Não invente: pergunte ao Kevin ou consulte o PDF.'); process.exit(1); }
  const porHex = new Map();
  for (const c of lista) { const k = c.nome + " " + c.hex; if (!porHex.has(k)) porHex.set(k, { ...c, linhas: [] }); porHex.get(k).linhas.push(c.linha); }
  for (const c of porHex.values()) console.log(`${c.hex}  ${c.nome}  (${c.linhas.join(", ")})`);
  if (!achadas.length) console.log("(nome exato não existe; esses são os que contêm o texto)");
}
