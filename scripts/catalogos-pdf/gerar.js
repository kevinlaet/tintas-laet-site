// Gera os catálogos de cores em PDF (formato 9:16, mesmo modelo dos catálogos do Canva) com preço e cor atuais.
//
//   node scripts/catalogos-pdf/gerar.js                      -> as 11 linhas
//   node scripts/catalogos-pdf/gerar.js premium-lavavel      -> só uma (ids em lib/linhas.js)
//
// Cores: identidade/cores/paleta-oficial.json (idênticas aos PDFs/fotos de catálogo).  Preços: site/produto.html.
// Capas das linhas que já tinham PDF são copiadas dos originais do Canva (marketing/catalogos/antigos-canva-2026-07); as demais são desenhadas aqui.
// Saída: marketing/catalogos/ (os catálogos atuais, prontos pra mandar). Arquivos com o mesmo nome são substituídos.
// Precisa de internet (fontes do Google Fonts) e de:  cd scripts/catalogos-pdf && npm install
const fs = require("fs");
const os = require("os");
const path = require("path");
const { pathToFileURL } = require("url");
const { chromium } = require("playwright");
const { PDFDocument, PDFName, PDFString } = require("pdf-lib");
const { LINHAS, resolver } = require("./lib/linhas");
const { paginasTabela, paginaCapa, paginaEncerramento, documento } = require("./lib/paginas");

const RAIZ = path.join(__dirname, "..", "..");
const ANTIGOS = path.join(RAIZ, "marketing", "catalogos", "antigos-canva-2026-07");
const SAIDA = path.join(RAIZ, "marketing", "catalogos");
const TMP = path.join(os.tmpdir(), "tintas-laet-catalogos");

async function main() {
  const pedidas = process.argv.slice(2);
  const linhas = pedidas.length ? LINHAS.filter((l) => pedidas.includes(l.id)) : LINHAS;
  if (!linhas.length) throw new Error("nenhuma linha com esse id. Opções: " + LINHAS.map((l) => l.id).join(", "));
  fs.mkdirSync(SAIDA, { recursive: true });
  fs.mkdirSync(TMP, { recursive: true });

  const avisos = [];
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 2 });
  const resumo = [];

  for (const cfg of linhas) {
    const res = resolver(cfg, avisos);
    const paginas = [];
    if (!cfg.capaAntiga) paginas.push(paginaCapa(cfg, res));
    paginas.push(...paginasTabela(res));
    paginas.push(paginaEncerramento(cfg));

    const html = path.join(TMP, cfg.id + ".html");
    fs.writeFileSync(html, documento(paginas));
    await page.goto(pathToFileURL(html).href, { waitUntil: "networkidle" });
    await page.evaluate(() => window.ajustar());
    const gerado = await page.pdf({ width: "1080px", height: "1920px", printBackground: true, preferCSSPageSize: true });

    // Páginas "v2" (capa e contracapa novas) usam transparência, sombra e brilho: o leitor de PDF do iPhone desenha
    // isso errado (camadas fantasma). Por isso elas entram como IMAGEM em alta resolução, e os links viram
    // áreas clicáveis por cima, nas mesmas posições dos botões.
    const v2 = await page.evaluate(() => [...document.querySelectorAll("section.pg")].map((sec, i) => {
      if (!sec.classList.contains("v2")) return null;
      const b = sec.getBoundingClientRect();
      return { i, links: [...sec.querySelectorAll("a[href]")].map((a) => { const r = a.getBoundingClientRect(); return { href: a.href, x: r.left - b.left, y: r.top - b.top, w: r.width, h: r.height }; }) };
    }).filter(Boolean));
    const imagens = {};
    for (const p of v2) imagens[p.i] = await page.locator("section.pg").nth(p.i).screenshot({ type: "jpeg", quality: 92, scale: "device" });

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
    for (let k = 0; k < copiadas.length; k++) {
      const info = v2.find((p) => p.i === k);
      if (!info) { final.addPage(copiadas[k]); continue; }
      const { width: W, height: H } = copiadas[k].getSize();
      const pg = final.addPage([W, H]);
      const img = await final.embedJpg(imagens[k]);
      pg.drawImage(img, { x: 0, y: 0, width: W, height: H });
      const f = W / 1080; // px do desenho -> pontos do PDF
      for (const l of info.links) {
        const annot = final.context.obj({ Type: "Annot", Subtype: "Link", Rect: [l.x * f, H - (l.y + l.h) * f, (l.x + l.w) * f, H - l.y * f], Border: [0, 0, 0],
          A: { Type: "Action", S: "URI", URI: PDFString.of(l.href) } });
        pg.node.addAnnot(final.context.register(annot));
      }
    }
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
