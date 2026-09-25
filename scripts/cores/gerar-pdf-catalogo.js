// Gera o PDF do catálogo impresso das lojas a partir do HTML (saidas/catalogo-cores-loja/catalogo-cores-laet.html).
// Rode DEPOIS de conferir as cores: node scripts/cores/verificar.js
//   node scripts/cores/gerar-pdf-catalogo.js
const path = require("path");
const { pathToFileURL } = require("url");
const { chromium } = require("playwright");

(async () => {
  const pasta = path.join(__dirname, "..", "..", "saidas", "catalogo-cores-loja");
  const html = path.join(pasta, "catalogo-cores-laet.html");
  const pdf = path.join(pasta, "catalogo-cores-laet.pdf");
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(pathToFileURL(html).href, { waitUntil: "load" });
  await page.evaluate(() => document.fonts && document.fonts.ready);
  await page.waitForTimeout(1500);
  await page.pdf({ path: pdf, preferCSSPageSize: true, printBackground: true });
  await browser.close();
  console.log("PDF gerado:", pdf);
})();
