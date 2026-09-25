// Extrai as cores dos catálogos em PDF (marketing/catalogos): nome, hex do quadradinho e preços de cada linha da tabela.
// Precisa de: cd scripts/cores/extracao && npm install   (pdfjs-dist e sharp; o Playwright vem do projeto)
// Saída: scripts/cores/extracao/saida-pdf.json — NÃO vai direto pro site: revisar e só então atualizar identidade/cores/paleta-oficial.json.
// Lê os catálogos em PDF e devolve, pra cada linha de cor, o nome, a cor do quadradinho
// (amostrada da página renderizada) e os preços — pra comparar com o site.
import http from "http";
import fs from "fs";
import path from "path";
import { createRequire } from "module";
import { fileURLToPath } from "url";

const requireProjeto = createRequire(new URL("../../../package.json", import.meta.url));
const { chromium } = requireProjeto("playwright");

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const LIB = path.join(AQUI, "node_modules/pdfjs-dist/legacy/build");
const PDFS = path.join(AQUI, "..", "..", "..", "marketing", "catalogos");

const PAGINA = `<!doctype html><meta charset="utf-8"><body><script type="module">
import * as pdfjs from '/lib/pdf.mjs';
pdfjs.GlobalWorkerOptions.workerSrc = '/lib/pdf.worker.mjs';
const ESC = 2;
window.extrair = async (url) => {
  const doc = await pdfjs.getDocument({ url, verbosity: 0 }).promise;
  const linhasSaida = [];
  for (let p = 1; p <= doc.numPages; p++) {
    const pagina = await doc.getPage(p);
    const vp = pagina.getViewport({ scale: ESC });
    const canvas = document.createElement('canvas');
    canvas.width = Math.ceil(vp.width); canvas.height = Math.ceil(vp.height);
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    await pagina.render({ canvasContext: ctx, viewport: vp }).promise;
    const tc = await pagina.getTextContent();
    const itens = tc.items.map(i => {
      const t = pdfjs.Util.transform(vp.transform, i.transform);
      return { s: i.str.trim(), x: t[4], y: t[5], w: i.width * ESC, h: (i.height || 10) * ESC };
    }).filter(i => i.s);
    const cab = {};
    for (const i of itens) {
      if (i.s === 'COR') cab.cor = i;
      if (i.s === 'NOME DA COR') cab.nome = i;
      if (i.s === 'BALDE') cab.balde = i;
    }
    if (!cab.cor || !cab.nome || !cab.balde) continue;
    const swX = cab.cor.x + cab.cor.w / 2;
    const linhas = new Map();
    for (const i of itens) {
      if (i.y <= cab.cor.y + 6) continue;
      const chave = Math.round(i.y / 6);
      const achou = [chave - 1, chave, chave + 1].find(k => linhas.has(k));
      const k = achou === undefined ? chave : achou;
      if (!linhas.has(k)) linhas.set(k, []);
      linhas.get(k).push(i);
    }
    for (const [, its] of linhas) {
      const nomeParts = its.filter(i => i.x >= cab.cor.x + cab.cor.w + 10 && i.x < cab.balde.x - 8 && !/^R\\$/.test(i.s));
      const precos = its.filter(i => /^R\\$/.test(i.s)).sort((a, b) => a.x - b.x).map(i => i.s);
      if (!nomeParts.length || !precos.length) continue;
      nomeParts.sort((a, b) => a.x - b.x);
      const nome = nomeParts.map(i => i.s).join(' ').replace(/\\s+/g, ' ').trim();
      const y = its.reduce((s, i) => s + i.y, 0) / its.length;
      const yc = y - nomeParts[0].h * 0.35;
      const px = [];
      for (let dx = -3; dx <= 3; dx++) for (let dy = -3; dy <= 3; dy++) {
        const d = ctx.getImageData(Math.round(swX + dx), Math.round(yc + dy), 1, 1).data;
        px.push([d[0], d[1], d[2]]);
      }
      const med = [0, 1, 2].map(c => px.map(v => v[c]).sort((a, b) => a - b)[Math.floor(px.length / 2)]);
      const hex = '#' + med.map(v => v.toString(16).padStart(2, '0')).join('').toUpperCase();
      linhasSaida.push({ pagina: p, nome, hex, precos, x: Math.round(swX), y: Math.round(yc) });
    }
  }
  return linhasSaida;
};
window.pronto = true;
</script></body>`;

const servidor = http.createServer((req, res) => {
  const u = new URL(req.url, "http://x");
  if (u.pathname === "/") { res.setHeader("Content-Type", "text/html; charset=utf-8"); res.end(PAGINA); return; }
  let arq = null;
  if (u.pathname.startsWith("/lib/")) arq = path.join(LIB, u.pathname.slice(5));
  if (u.pathname.startsWith("/pdf/")) arq = path.join(PDFS, decodeURIComponent(u.pathname.slice(5)));
  if (!arq || !fs.existsSync(arq)) { res.statusCode = 404; res.end("nf"); return; }
  res.setHeader("Content-Type", arq.endsWith(".mjs") ? "text/javascript" : arq.endsWith(".pdf") ? "application/pdf" : "application/octet-stream");
  res.end(fs.readFileSync(arq));
});
await new Promise((r) => servidor.listen(8768, r));

const browser = await chromium.launch();
const page = await browser.newPage();
page.on("pageerror", (e) => console.error("erro na página:", e.message));
await page.goto("http://localhost:8768/");
await page.waitForFunction(() => window.pronto === true);

const saida = {};
for (const arquivo of fs.readdirSync(PDFS).filter((f) => f.toLowerCase().endsWith(".pdf"))) {
  saida[arquivo] = await page.evaluate((url) => window.extrair(url), "/pdf/" + encodeURIComponent(arquivo));
  console.error(arquivo, "->", saida[arquivo].length, "cores");
}
fs.writeFileSync(path.join(AQUI, "saida-pdf.json"), JSON.stringify(saida, null, 1));
await browser.close();
servidor.close();
