// Mede a cor de um pedaço de uma imagem (peça pronta, foto, render, print) e compara com a cor oficial.
//
//   node scripts/cores/medir.js <imagem> <x,y,largura,altura> "Fogo Violeta"
//   node scripts/cores/medir.js <imagem> <x,y,largura,altura> "#6B24A2"
//
// Usa a MEDIANA dos pixels da região (ignora reflexo, sombra de borda e ruído). Escolha uma região do miolo da cor,
// longe de sombra, brilho e do contorno.
// Veredito: ΔE <= 1 igual · <= 3 aceitável só pra foto/render (luz muda a cor) · > 3 fora.
// Cor chapada digital (HTML, canvas, arte vetorial) tem que dar ΔE 0 — se não deu, tem filtro, opacidade ou perfil de cor no meio.
const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

const mestre = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "..", "identidade", "cores", "paleta-oficial.json"), "utf8"));
const norm = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toUpperCase().replace(/[-–]/g, " ").replace(/\s+/g, " ").trim();
function lab(hex) {
  const v = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)));
  const x = (0.4124 * v[0] + 0.3576 * v[1] + 0.1805 * v[2]) / 0.95047, y = 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2], z = (0.0193 * v[0] + 0.1192 * v[1] + 0.9505 * v[2]) / 1.08883;
  const f = (t) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);
  return [116 * f(y) - 16, 500 * (f(x) - f(y)), 200 * (f(y) - f(z))];
}
const deltaE = (a, b) => { const p = lab(a), q = lab(b); return Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]); };

const [img, regiao, alvo] = process.argv.slice(2);
if (!img || !regiao || !alvo) { console.log('uso: medir.js <imagem> <x,y,largura,altura> "<nome da cor ou #HEX>"'); process.exit(1); }
const [x, y, w, h] = regiao.split(",").map(Number);
if ([x, y, w, h].some((n) => !Number.isFinite(n)) || w < 1 || h < 1) { console.log("região inválida, use x,y,largura,altura"); process.exit(1); }

let oficial = null, rotulo = alvo;
if (/^#?[0-9a-f]{6}$/i.test(alvo)) oficial = ("#" + alvo.replace("#", "")).toUpperCase();
else {
  const hexes = new Set();
  for (const l of Object.values(mestre.linhas)) for (const c of l.cores) if (norm(c.nome) === norm(alvo)) hexes.add(c.hex.toUpperCase());
  if (!hexes.size) { console.log('"' + alvo + '" não está na paleta oficial.'); process.exit(1); }
  if (hexes.size > 1) { console.log('"' + alvo + '" tem mais de um hex conforme a linha: ' + [...hexes].join(", ") + ". Passe o hex da linha certa."); process.exit(1); }
  oficial = [...hexes][0];
}

(async () => {
  const ext = path.extname(img).slice(1).toLowerCase().replace("jpg", "jpeg");
  const dataUrl = `data:image/${ext};base64,` + fs.readFileSync(img).toString("base64");
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const r = await page.evaluate(async ([src, x, y, w, h]) => {
    const im = new Image();
    await new Promise((ok, erro) => { im.onload = ok; im.onerror = () => erro(new Error("imagem não abriu")); im.src = src; });
    if (x + w > im.naturalWidth || y + h > im.naturalHeight) return { erro: `região fora da imagem (${im.naturalWidth}x${im.naturalHeight})` };
    const c = document.createElement("canvas");
    c.width = im.naturalWidth; c.height = im.naturalHeight;
    const ctx = c.getContext("2d", { willReadFrequently: true });
    ctx.drawImage(im, 0, 0);
    const d = ctx.getImageData(x, y, w, h).data;
    const canais = [[], [], []];
    for (let i = 0; i < d.length; i += 4) { if (d[i + 3] < 250) continue; canais[0].push(d[i]); canais[1].push(d[i + 1]); canais[2].push(d[i + 2]); }
    if (!canais[0].length) return { erro: "região transparente" };
    const med = canais.map((a) => a.sort((p, q) => p - q)[Math.floor(a.length / 2)]);
    return { med, pixels: canais[0].length };
  }, [dataUrl, x, y, w, h]);
  await browser.close();
  if (r.erro) { console.log("erro:", r.erro); process.exit(1); }
  const medido = "#" + r.med.map((v) => v.toString(16).padStart(2, "0")).join("").toUpperCase();
  const de = deltaE(medido, oficial);
  const veredito = de <= 1 ? "IGUAL" : de <= 3 ? "aceitável (só vale pra foto/render)" : "FORA";
  console.log(`${rotulo}: oficial ${oficial} · medido ${medido} (${r.pixels} pixels) · ΔE ${de.toFixed(1)} → ${veredito}`);
  process.exitCode = de <= 3 ? 0 : 1;
})();
