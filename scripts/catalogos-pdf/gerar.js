// Gera os catálogos de cores em PDF (formato 9:16, mesmo modelo dos catálogos do Canva) com preço e cor atuais.
//
//   node scripts/catalogos-pdf/gerar.js                      -> as 11 linhas
//   node scripts/catalogos-pdf/gerar.js premium-lavavel      -> só uma (ids em lib/linhas.js)
//
// Cores: identidade/cores/paleta-oficial.json (idênticas aos PDFs/fotos de catálogo).  Preços: site/produto.html.
// Capas das linhas que já tinham PDF são copiadas dos PDFs antigos (marketing/catalogos); as demais são desenhadas aqui.
// Precisa de internet (fontes do Google Fonts) e de:  cd scripts/catalogos-pdf && npm install
const fs = require("fs");
const os = require("os");
const path = require("path");
const { pathToFileURL } = require("url");
const { chromium } = require("playwright");
const { PDFDocument } = require("pdf-lib");
const { LINHAS, resolver } = require("./lib/linhas");
const { paginasTabela, paginaCapa, paginaEncerramento, documento } = require("./lib/paginas");

const RAIZ = path.join(__dirname, "..", "..");
const ANTIGOS = path.join(RAIZ, "marketing", "catalogos");
const SAIDA = path.join(RAIZ, "saidas", "catalogos-pdf");
const TMP = path.join(os.tmpdir(), "tintas-laet-catalogos");

async function main() {
  const pedidas = process.argv.slice(2);
  const linhas = pedidas.length ? LINHAS.filter((l) => pedidas.includes(l.id)) : LINHAS;
  if (!linhas.length) throw new Error("nenhuma linha com esse id. Opções: " + LINHAS.map((l) => l.id).join(", "));
  fs.mkdirSync(SAIDA, { recursive: true });
  fs.mkdirSync(TMP, { recursive: true });

  const avisos = [];
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  const resumo = [];

  for (const cfg of linhas) {
    const res = resolver(cfg, avisos);
    const paginas = [];
    if (!cfg.capaAntiga) paginas.push(paginaCapa(cfg));
    paginas.push(...paginasTabela(res));
    paginas.push(paginaEncerramento());

    const html = path.join(TMP, cfg.id + ".html");
    fs.writeFileSync(html, documento(paginas));
    await page.goto(pathToFileURL(html).href, { waitUntil: "networkidle" });
    await page.evaluate(() => window.ajustar());
    const gerado = await page.pdf({ width: "1080px", height: "1920px", printBackground: true, preferCSSPageSize: true });

    // monta o arquivo final: [capa antiga (+ página de produto antiga)] + páginas geradas
    const final = await PDFDocument.create();
    const novo = await PDFDocument.load(gerado);
    const antigas = [cfg.capaAntiga, cfg.paginaProdutoAntiga].filter(Boolean);
    for (const a of antigas) {
      const doc = await PDFDocument.load(fs.readFileSync(path.join(ANTIGOS, a.pdf)));
      const [pg] = await final.copyPages(doc, [a.pagina - 1]);
      final.addPage(pg);
    }
    const copiadas = await final.copyPages(novo, novo.getPageIndices());
    copiadas.forEach((p) => final.addPage(p));
    final.setTitle(`Catálogo de cores Tintas Laet: ${cfg.titulo}`);
    final.setAuthor("Tintas Laet");
    final.setCreator("Tintas Laet OS");
    const bytes = await final.save();
    const arq = path.join(SAIDA, cfg.arquivo + ".pdf");
    fs.writeFileSync(arq, bytes);
    resumo.push(`${cfg.id.padEnd(26)} ${String(res.linhas.length).padStart(3)} cores  ${String(final.getPageCount()).padStart(2)} pág.  ${(bytes.length / 1048576).toFixed(1)} MB  ${path.relative(RAIZ, arq)}`);
  }
  await browser.close();
  console.log(resumo.join("\n"));
  if (avisos.length) console.log("\nAvisos:\n - " + avisos.join("\n - "));
}

main().catch((e) => { console.error(e); process.exit(1); });
