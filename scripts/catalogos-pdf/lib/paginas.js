// HTML das páginas dos catálogos em PDF (quadro 1080x1920 px = página 9:16 do Canva, 810x1440pt).
// Medidas tiradas dos PDFs originais (marketing/catalogos). Fontes livres no lugar das pagas do Canva:
// Public Sans (Canva Sans), League Spartan (Futura Heavy), Outfit (Glacial Indifference).
const path = require("path");
const { pathToFileURL } = require("url");
const formas = require("./formas-capa.json");
const { GEO, larguras } = require("./linhas");

const ASSETS = path.join(__dirname, "..", "..", "..", "identidade", "catalogo-pdf");
const asset = (nome) => pathToFileURL(path.join(ASSETS, nome)).href;

const LINKS = {
  orcamento: "https://wa.me/message/NX7QVXEHRI4SG1",
  instagram: "https://www.instagram.com/tintaslaet/",
  site: "https://tintaslaet.com/",
};

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const CSS = `
@page{size:1080px 1920px;margin:0}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:1080px;background:#fff}
body{font-family:'Public Sans',Arial,sans-serif;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.pg{position:relative;width:1080px;height:1920px;overflow:hidden;background:#fff;break-after:page;page-break-after:always}
.pg:last-child{break-after:auto;page-break-after:auto}
svg.tx{position:absolute;left:0;top:0;width:1080px;height:1920px;overflow:visible}
.tab{position:absolute}
.cab,.lin{display:grid}
.cab>div{display:flex;align-items:center;justify-content:center;font-weight:700;text-align:center;white-space:nowrap}
.lin>div{display:flex;align-items:center;justify-content:center;background:#fff;white-space:nowrap}
.lin>div.nm{justify-content:flex-start;padding-left:8px;overflow:hidden;text-transform:uppercase}
.lin>div.sw{padding:0}
.grade{position:absolute;left:0;top:0;overflow:visible;pointer-events:none}
/* encerramento */
.enc .fundo{position:absolute;left:-180px;top:0;width:1440px;height:1920px}
.enc .sombra-cartao{position:absolute;left:108px;top:1789.5px;width:864px;height:92px}
.enc .cartao{position:absolute;left:108px;top:108px;width:864px;height:1704px;background:#fff}
.enc .anel{position:absolute;left:317.8px;top:212.6px;width:445px;height:445px;border-radius:50%;background:#051951}
.enc .rosto{position:absolute;left:321.9px;top:216.7px;width:437px;height:437px;border-radius:50%;overflow:hidden;background:#fff}
.enc .rosto img{width:100%;height:100%;object-fit:cover;display:block}
.enc .logo{position:absolute;left:392.3px;top:642.2px;width:293.3px;height:293.3px}
.enc .sel{position:absolute;left:0;width:1080px;text-align:center;font-family:'Outfit',sans-serif;font-weight:400;font-size:53px;color:#051951;line-height:1}
.enc .sbtn{position:absolute;left:206.6px;width:666.9px;height:250.3px;opacity:.7}
.enc a.btn{position:absolute;left:257px;width:566.6px;height:146px;border-radius:73px;background:#051951;color:#fff;display:flex;align-items:center;justify-content:center;font-family:'Outfit',sans-serif;font-weight:700;font-size:41px;text-decoration:underline;text-underline-offset:5px;white-space:nowrap}
.enc a.btn span{display:inline-block}
.enc .contato{position:absolute;left:0;width:1080px;text-align:center;font-family:'Outfit',sans-serif;font-weight:700;font-size:49px;color:#051951;line-height:1}
`;

function pagina(conteudo, classe = "") {
  return `<section class="pg ${classe}">${conteudo}</section>`;
}

// ------------------------------------------------------------------ tabela
function paginaTabela(res, linhasDaPagina, ultima, unica) {
  const { cfg } = res;
  const g0 = GEO[cfg.geo];
  // tabela curta (cabe numa página só): linhas mais altas e letra maior pra ocupar a página, sem passar de 1,7x
  const livre = 1850 - g0.topo - g0.altCab;
  const z = unica ? Math.min(1.7, Math.max(1, livre / (linhasDaPagina.length * g0.altLinha))) : 1;
  const g = { ...g0, altLinha: g0.altLinha * z, linhaTam: g0.linhaTam * Math.min(z, 1.35) };
  let larg = larguras(cfg);
  const soma = larg.reduce((s, w) => s + w, 0);
  if (soma < 1000) larg = larg.map((w) => (w * 1007) / soma); // poucas colunas: alarga até a largura da Premium
  const total = larg.reduce((s, w) => s + w, 0);
  const esq = soma < 1000 ? (1080 - total) / 2 : g.esq;
  const cols = larg.map((w) => w + "px").join(" ");
  const cab = cfg.cabecalho; // null = cabeçalho branco com texto preto (Standard)
  const rotulos = ["COR", "NOME DA COR", ...cfg.colunas.map((c) => c.rotulo)];

  const cabHtml = `<div class="cab" style="height:${g.altCab}px;grid-template-columns:${cols};background:${cab || "#fff"};color:${cab ? "#fff" : "#000"};font-size:${g.cabTam}px">${rotulos.map((r) => `<div>${esc(r)}</div>`).join("")}</div>`;
  const linhasHtml = linhasDaPagina.map((l) => `<div class="lin" style="height:${g.altLinha}px;grid-template-columns:${cols};color:${g.texto};font-size:${g.linhaTam}px"><div class="sw" style="background:${l.hex}"></div><div class="nm">${esc(l.nome)}</div>${l.valores.map((v) => `<div>${esc(v)}</div>`).join("")}</div>`).join("");

  // grade fina (#D9D9D9, 1px) por cima de tudo, como no original
  const altTab = g.altCab + linhasDaPagina.length * g.altLinha;
  let acc = 0;
  const xs = [0, ...larg.map((w) => (acc += w))];
  const ys = [0, g.altCab, ...linhasDaPagina.map((_, i) => g.altCab + (i + 1) * g.altLinha)];
  const grade = `<svg class="grade" width="${total}" height="${altTab}" viewBox="0 0 ${total} ${altTab}" stroke="#D9D9D9" stroke-width="1" fill="none">${xs.map((x) => `<line x1="${x + 0.5}" y1="0" x2="${x + 0.5}" y2="${altTab}"/>`).join("")}${ys.map((y) => `<line x1="0" y1="${y + 0.5}" x2="${total}" y2="${y + 0.5}"/>`).join("")}</svg>`;

  // textos com linha de base exata (título, subtítulo, rodapé) num SVG por cima
  const fonteTit = cfg.fonteTitulo === "rubik" ? 'font-family="Rubik" font-weight="800"' : 'font-family="Public Sans" font-weight="700"';
  let svg = `<text class="fit" data-max="1000" x="540" y="${g.tituloBase}" text-anchor="middle" ${fonteTit} font-size="${g.tituloTam}" fill="${cfg.corTitulo}">CATÁLOGO DE CORES LAET ${esc(cfg.titulo)}</text>`;
  if (res.subtitulo) svg += `<text class="fit" data-max="980" x="540" y="${g.topo - 12}" text-anchor="middle" font-family="Public Sans" font-weight="600" font-size="21" fill="#333">${esc(res.subtitulo)}</text>`;
  if (ultima) {
    if (cfg.rodapeTipo === "standard") {
      svg += `<text class="fit" data-max="1000" x="540" y="${g.topo + altTab + 34}" text-anchor="middle" font-family="Public Sans" font-weight="400" font-size="15.6" fill="#000">${esc(cfg.rodape[0])}</text>`;
    } else {
      cfg.rodape.forEach((t, i) => { svg += `<text class="fit" data-max="1040" x="540" y="${1872 + i * 18.7}" text-anchor="middle" font-family="Public Sans" font-weight="400" font-size="13.3" fill="${cfg.corRodape}" xml:space="preserve">${esc(t)}</text>`; });
    }
  }
  return pagina(`<div class="tab" style="left:${esq}px;top:${g.topo}px;width:${total}px">${cabHtml}${linhasHtml}${grade}</div><svg class="tx" viewBox="0 0 1080 1920">${svg}</svg>`);
}

// quantas linhas cabem por página (e na última, que leva rodapé)
function distribuir(n, cfg) {
  const g = GEO[cfg.geo];
  const capNormal = Math.floor((1905 - g.topo - g.altCab) / g.altLinha);
  const capUltima = Math.floor(((cfg.rodapeTipo === "standard" ? 1860 : 1858) - g.topo - g.altCab) / g.altLinha);
  for (let p = Math.max(1, Math.ceil(n / capNormal)); p < 20; p++) {
    const base = Math.floor(n / p), resto = n % p;
    const tam = Array.from({ length: p }, (_, i) => base + (i < resto ? 1 : 0));
    if (tam[0] <= capNormal && tam[p - 1] <= capUltima) return tam;
  }
  throw new Error("não consegui paginar " + cfg.id);
}

function paginasTabela(res) {
  const tam = distribuir(res.linhas.length, res.cfg);
  let i = 0;
  return tam.map((t, k) => { const fatia = res.linhas.slice(i, i + t); i += t; return paginaTabela(res, fatia, k === tam.length - 1, tam.length === 1); });
}

// ------------------------------------------------------------------ capa (só das linhas sem PDF antigo)
function paginaCapa(cfg) {
  const { tema, linhas } = cfg.capa;
  const fit = (txt, y, max) => `<text class="fit" data-max="${max}" x="41" y="${y}" font-family="League Spartan" font-weight="800" font-size="190" letter-spacing="-0.07em" fill="${tema}">${esc(txt)}</text>`;
  // linhas 2 e 3: cada uma com o maior tamanho que couber (até 190px), como nos originais
  const svg = `
    <path d="${formas.arco}" fill="${tema}"/>
    <text x="41" y="745" font-family="League Spartan" font-weight="800" font-size="80.2" letter-spacing="-0.07em" fill="${tema}">CATÁLOGO DE CORES</text>
    ${fit(linhas[0], 917, 760).replace('class="fit"', 'class="fit t2"')}
    ${fit(linhas[1], 1077, 760).replace('class="fit"', 'class="fit t3"')}
    <path d="${formas.estrela}" fill="${tema}"/>`;
  return pagina(`
    <img src="${asset("logo-laet.png")}" style="position:absolute;left:98.9px;top:-77.5px;width:882px;height:882px">
    <svg class="tx" viewBox="0 0 1080 1920" style="z-index:1">${svg}</svg>
    <img src="${asset("leque-pincel.png")}" style="position:absolute;left:145.2px;top:1226px;width:1007px;height:929px;z-index:2">`, "capa");
}

// ------------------------------------------------------------------ encerramento (botões com link)
function paginaEncerramento() {
  const tops = [1035.5, 1209.1, 1382.7];
  const sombras = [973, 1147, 1320];
  const botoes = [["ORÇAMENTO GRATUITO", LINKS.orcamento], ["INSTAGRAM", LINKS.instagram], ["SITE", LINKS.site]];
  return pagina(`
    <img class="fundo" src="${asset("fundo-azul.jpg")}">
    <img class="sombra-cartao" src="${asset("sombra-cartao.png")}">
    <div class="cartao"></div>
    <div class="anel"></div>
    <div class="rosto"><img src="${asset("mascote-rosto.png")}"></div>
    <img class="logo" src="${asset("logo-laet.png")}">
    <div class="sel" style="top:${917 - 42}px">Selecione abaixo:</div>
    ${sombras.map((y) => `<img class="sbtn" src="${asset("sombra-botao.png")}" style="top:${y}px">`).join("")}
    ${botoes.map(([t, url], i) => `<a class="btn" href="${url}" style="top:${tops[i]}px"><span>${t}</span></a>`).join("")}
    <div class="contato" style="top:${1680 - 38}px">@TINTASLAET</div>
    <div class="contato" style="top:${1741 - 38}px">(11) 97714-0964</div>`, "enc");
}

// ------------------------------------------------------------------ documento
const FONTES = "https://fonts.googleapis.com/css2?family=Public+Sans:wght@400;600;700&family=Rubik:wght@800&family=League+Spartan:wght@800&family=Outfit:wght@400;700&display=swap";

const SCRIPT = `
window.ajustar = async () => {
  await document.fonts.ready;
  for (const f of ['400 20px "Public Sans"', '600 20px "Public Sans"', '700 20px "Public Sans"', '800 20px "League Spartan"', '400 20px "Outfit"', '700 20px "Outfit"', '800 20px "Rubik"']) await document.fonts.load(f);
  // textos SVG: reduz o tamanho até caber na largura máxima
  document.querySelectorAll('text.fit').forEach((t) => {
    const max = Number(t.dataset.max); let s = parseFloat(t.getAttribute('font-size'));
    for (let i = 0; i < 40 && t.getComputedTextLength() > max; i++) { s *= 0.97; t.setAttribute('font-size', s.toFixed(2)); }
  });
  // capa: as linhas 2 e 3 podem ter tamanhos diferentes; reacomoda as linhas de base (mesma proporção do original)
  const t2 = document.querySelector('text.t2'), t3 = document.querySelector('text.t3');
  if (t2 && t3) {
    const s2 = parseFloat(t2.getAttribute('font-size')), s3 = parseFloat(t3.getAttribute('font-size'));
    const y2 = 745 + 0.9 * s2;
    t2.setAttribute('y', y2.toFixed(1));
    t3.setAttribute('y', (y2 + 0.42 * s2 + 0.42 * s3).toFixed(1));
  }
  // nomes de cor: reduz a fonte até caber na coluna
  document.querySelectorAll('.lin .nm').forEach((el) => {
    let s = parseFloat(getComputedStyle(el).fontSize);
    for (let i = 0; i < 30 && el.scrollWidth > el.clientWidth; i++) { s -= 0.5; el.style.fontSize = s + 'px'; }
  });
  // botões e nomes do encerramento: garante que o texto do botão cabe
  document.querySelectorAll('a.btn').forEach((el) => {
    const sp = el.querySelector('span');
    let s = parseFloat(getComputedStyle(el).fontSize);
    for (let i = 0; i < 30 && sp.getBoundingClientRect().width > el.clientWidth - 60; i++) { s -= 1; el.style.fontSize = s + 'px'; }
  });
  return true;
};`;

function documento(paginas) {
  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>Catálogo Tintas Laet</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="stylesheet" href="${FONTES}">
<style>${CSS}</style></head><body>${paginas.join("")}<script>${SCRIPT}</script></body></html>`;
}

module.exports = { paginasTabela, paginaCapa, paginaEncerramento, documento, LINKS };
