// HTML das páginas dos catálogos em PDF (quadro 1080x1920 px = página 9:16 do Canva, 810x1440pt).
// Medidas tiradas dos PDFs originais (marketing/catalogos/antigos-canva-2026-07). Fontes livres no lugar das pagas do Canva:
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
  lojas: "https://tintaslaet.com/lojas.html",
  produtos: "https://tintaslaet.com/produtos.html",
  whatsapp: "https://wa.me/5511977140964",
};
// Links do site com marcação de origem: o Google Analytics mostra quantas pessoas vieram de cada catálogo.
const comOrigem = (url, cfg) => `${url}${url.includes("?") ? "&" : "?"}utm_source=catalogo&utm_medium=pdf&utm_campaign=${encodeURIComponent(cfg ? cfg.id : "catalogo")}`;
const EMBALAGENS = path.join(__dirname, "..", "..", "..", "identidade", "embalagens");
const embalagem = (arq) => pathToFileURL(path.join(EMBALAGENS, arq)).href;

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

const CSS_V2 = `
.v2{background:#041D47;color:#fff;font-family:'Poppins',sans-serif}
.v2 .bg{position:absolute;inset:0;background:
  radial-gradient(ellipse 900px 700px at 50% 34%,rgba(48,128,255,.42),transparent 70%),
  radial-gradient(ellipse 700px 500px at 100% 100%,rgba(255,193,7,.10),transparent 70%),
  linear-gradient(180deg,#0B3F95 0%,#072F72 42%,#041D47 100%)}
.v2 .grade-tec{position:absolute;inset:0;background-image:
  linear-gradient(rgba(255,255,255,.055) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.055) 1px,transparent 1px);
  background-size:60px 60px;-webkit-mask-image:radial-gradient(ellipse 760px 900px at 50% 40%,#000 30%,transparent 80%);mask-image:radial-gradient(ellipse 760px 900px at 50% 40%,#000 30%,transparent 80%)}
.v2 .logo2{position:absolute;left:50%;transform:translateX(-50%);filter:drop-shadow(0 10px 26px rgba(0,0,0,.35))}
.v2 .pill{display:inline-flex;align-items:center;gap:14px;border:2px solid rgba(255,214,79,.75);color:#FFD54F;border-radius:999px;padding:12px 30px 10px;font-family:'Montserrat',sans-serif;font-weight:800;font-size:27px;letter-spacing:.2em;text-transform:uppercase}
.v2 .pill i{width:12px;height:12px;border-radius:50%;background:#FFC107;box-shadow:0 0 14px #FFC107}
.v2 .h-fit{white-space:nowrap;line-height:.92}
.v2 .amarelo{background:linear-gradient(180deg,#FFE88A 10%,#FFC107 55%,#F29B00 100%);-webkit-background-clip:text;background-clip:text;color:transparent;padding-top:.1em;margin-top:-.1em}
/* capa */
.capa2 .topo{position:absolute;left:0;right:0;top:470px;display:flex;flex-direction:column;align-items:center;text-align:center;z-index:5}
.capa2 .t1{font-family:'Montserrat',sans-serif;font-weight:900;font-size:200px;letter-spacing:-.03em;margin-top:34px;text-shadow:0 14px 40px rgba(0,0,0,.35)}
.capa2 .t2{font-family:'Montserrat',sans-serif;font-weight:900;font-size:120px;letter-spacing:-.02em;filter:drop-shadow(0 12px 26px rgba(0,0,0,.30))}
.capa2 .frase{margin-top:30px;max-width:840px;font-size:38px;line-height:1.3;font-weight:500;color:rgba(255,255,255,.88)}
.capa2 .frase b{color:#FFD54F;font-weight:700}
.capa2 .leque2{position:absolute;left:540px;top:2010px;width:0;height:0;z-index:2}
.capa2 .chip{position:absolute;left:-62px;bottom:0;width:124px;height:800px;border-radius:26px;transform-origin:62px 100%;box-shadow:0 14px 34px rgba(0,0,0,.35),inset 0 0 0 2px rgba(255,255,255,.16)}
.capa2 .chip::after{content:"";position:absolute;inset:0;border-radius:26px;background:linear-gradient(90deg,rgba(255,255,255,.22),rgba(255,255,255,0) 40%,rgba(0,0,0,.10))}
.capa2 .halo{position:absolute;left:50%;top:1500px;width:900px;height:620px;transform:translateX(-50%);border-radius:50%;background:radial-gradient(ellipse,rgba(70,150,255,.40),transparent 66%);z-index:1}
.capa2 .lata{position:absolute;left:50%;transform:translateX(-50%);z-index:4;filter:drop-shadow(0 34px 40px rgba(0,0,0,.55))}
.capa2 .base{position:absolute;left:0;right:0;bottom:0;height:150px;z-index:6;background:linear-gradient(180deg,rgba(4,29,71,0),rgba(4,29,71,.92) 55%);display:flex;align-items:flex-end;justify-content:center;padding-bottom:42px;gap:20px;font-weight:600;font-size:27px;color:rgba(255,255,255,.85)}
.capa2 .base a{color:inherit;text-decoration:none}
.capa2 .base span{opacity:.5}
/* contracapa */
.cc2 .mascote{position:absolute;left:50%;top:150px;transform:translateX(-50%);width:250px;height:250px;border-radius:50%;padding:9px;background:linear-gradient(135deg,#FFE58A,#FFB300);box-shadow:0 18px 44px rgba(0,0,0,.4)}
.cc2 .mascote img{width:100%;height:100%;border-radius:50%;object-fit:cover;background:#fff;display:block}
.cc2 .balao{position:absolute;left:650px;top:148px;background:#fff;color:#062B63;border-radius:28px 28px 28px 6px;padding:20px 28px 16px;font-family:'Montserrat',sans-serif;font-weight:800;font-size:30px;line-height:1.15;box-shadow:0 14px 30px rgba(0,0,0,.3);transform:rotate(-3deg)}
.cc2 .titulo{position:absolute;left:0;right:0;top:450px;text-align:center}
.cc2 .titulo .l1{font-family:'Montserrat',sans-serif;font-weight:900;font-size:104px;letter-spacing:-.03em;line-height:1}
.cc2 .titulo .l2{margin-top:22px;font-size:38px;font-weight:500;color:rgba(255,255,255,.85)}
.cc2 .titulo .l2 b{color:#FFD54F;font-weight:700}
.cc2 a.card{position:absolute;left:84px;width:912px;height:180px;border-radius:44px;display:flex;align-items:center;gap:34px;padding:0 40px 0 34px;text-decoration:none;color:#fff;
  background:linear-gradient(135deg,rgba(255,255,255,.14),rgba(255,255,255,.05));border:2px solid rgba(255,255,255,.22);box-shadow:0 20px 44px rgba(0,0,0,.30),inset 0 1px 0 rgba(255,255,255,.25)}
.cc2 a.card.prim{background:linear-gradient(135deg,#FFE27A 0%,#FFC107 55%,#F2AE00 100%);color:#062B63;border-color:rgba(255,255,255,.6)}
.cc2 .ic{flex:none;width:120px;height:120px;border-radius:34px;display:flex;align-items:center;justify-content:center;background:rgba(255,193,7,.16);border:2px solid rgba(255,214,79,.55);color:#FFD54F}
.cc2 .prim .ic{background:#062B63;border-color:#062B63;color:#FFC107}
.cc2 .ic svg{width:62px;height:62px}
.cc2 .txt{flex:1;min-width:0}
.cc2 .tt{font-family:'Montserrat',sans-serif;font-weight:800;font-size:50px;line-height:1.05;white-space:nowrap}
.cc2 .st{margin-top:8px;font-size:30px;line-height:1.2;opacity:.82;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.cc2 .seta{flex:none;width:76px;height:76px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,.12)}
.cc2 .prim .seta{background:#062B63;color:#FFC107}
.cc2 .seta svg{width:36px;height:36px}
.cc2 .rodape2{position:absolute;left:0;right:0;bottom:76px;display:flex;flex-direction:column;align-items:center;gap:22px}
.cc2 .zap{display:inline-flex;align-items:center;gap:16px;color:#fff;text-decoration:none;font-family:'Montserrat',sans-serif;font-weight:800;font-size:40px}
.cc2 .zap svg{width:46px;height:46px;color:#25D366}
.cc2 .dica{font-size:24px;color:rgba(255,255,255,.55);letter-spacing:.04em}
`;

const ICONES = {
  loja: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.6"/></svg>',
  produtos: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 7h14l-1.2 12.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8z"/><path d="M9 7V5.5a3 3 0 0 1 6 0V7"/></svg>',
  insta: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.3" cy="6.7" r=".6" fill="currentColor"/></svg>',
  site: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.6 2.8 3.8 5.8 3.8 9s-1.2 6.2-3.8 9c-2.6-2.8-3.8-5.8-3.8-9S9.4 5.8 12 3z"/></svg>',
  seta: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17L17 7M9 7h8v8"/></svg>',
  zap: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm4.5 12.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1-1.4-.7-2.4-1.4-3.3-3-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.5l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.2s1 2.6 1.1 2.7c.1.2 1.9 2.9 4.6 4.1 1.7.7 2.4.8 3.2.7.5-.1 1.5-.6 1.8-1.2.2-.6.2-1.1.1-1.2l-.1-.7z"/></svg>',
};

function pagina(conteudo, classe = "") {
  return `<section class="pg ${classe}">${conteudo}</section>`;
}

// ------------------------------------------------------------------ tabela
function paginaTabela(res, linhasDaPagina, ultima, unica, altLinha) {
  const { cfg } = res;
  const g0 = { ...GEO[cfg.geo], altLinha: altLinha || GEO[cfg.geo].altLinha };
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

// Quantas linhas por página. Enche cada página até o limite (como nos PDFs originais) e a sobra vai pra última, que leva o rodapé.
// Se a última ficaria com pouca coisa (menos de 40%), tenta caber tudo numa página a menos apertando a altura da linha,
// até no máximo 16% mais baixa que a original — assim não sobra página quase vazia no fim.
function distribuir(n, cfg) {
  const g = GEO[cfg.geo];
  const fimUltima = cfg.rodapeTipo === "standard" ? 1860 : 1858;
  const cap = (limite, alt) => Math.floor((limite - g.topo - g.altCab) / alt);
  const encher = (alt) => {
    const tam = [];
    let resto = n;
    while (resto > cap(fimUltima, alt)) { const t = Math.min(cap(1905, alt), resto - 1); tam.push(t); resto -= t; }
    tam.push(resto);
    return tam;
  };
  const tam = encher(g.altLinha);
  if (tam.length > 1 && tam[tam.length - 1] < cap(fimUltima, g.altLinha) * 0.4) {
    const p = tam.length - 1;
    const porPagina = Math.ceil(n / p);
    const alt = Math.min((1905 - g.topo - g.altCab) / porPagina, (fimUltima - g.topo - g.altCab) / (n - porPagina * (p - 1)));
    if (alt >= g.altLinha * 0.84) {
      const base = Math.floor(n / p), sobra = n % p;
      return { tam: Array.from({ length: p }, (_, i) => base + (i < sobra ? 1 : 0)), alt };
    }
  }
  return { tam, alt: g.altLinha };
}

function paginasTabela(res) {
  const { tam, alt } = distribuir(res.linhas.length, res.cfg);
  let i = 0;
  return tam.map((t, k) => { const fatia = res.linhas.slice(i, i + t); i += t; return paginaTabela(res, fatia, k === tam.length - 1, tam.length === 1, alt); });
}

// ------------------------------------------------------------------ capa (só das linhas sem PDF antigo)
// Capa v2 (nov/2026): fundo azul com grade "tecnológica", leque feito com as cores DE VERDADE da linha
// (hex da tabela, em ordem de matiz) e a embalagem real na frente. Tudo que o cliente lê é fato da linha.
function paginaCapa(cfg, res) {
  const { linhas: titulo, frase, embalagem: arqLata } = cfg.capa;
  const cores = (res ? res.linhas : []).filter((l) => !/^branc/i.test(l.nome)).map((l) => l.hex);
  const matiz = (h) => { const r = parseInt(h.slice(1, 3), 16) / 255, g = parseInt(h.slice(3, 5), 16) / 255, b = parseInt(h.slice(5, 7), 16) / 255;
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn; if (d < 0.08) return 999 + (1 - mx);
    let hh = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; return (hh * 60 + 360) % 360; };
  const ordenadas = [...cores].sort((a, b) => matiz(a) - matiz(b));
  const N = Math.min(15, ordenadas.length);
  const escolha = Array.from({ length: N }, (_, k) => ordenadas[Math.round((k * (ordenadas.length - 1)) / Math.max(1, N - 1))]);
  const abre = 56;
  const chips = escolha.map((hex, k) => { const ang = N > 1 ? -abre + (2 * abre * k) / (N - 1) : 0; return `<div class="chip" style="background:${hex};transform:rotate(${ang.toFixed(2)}deg)"></div>`; }).join("");
  const total = res ? res.linhas.length : 0;
  const lata = arqLata ? `<img class="lata" src="${embalagem(arqLata)}" style="top:1250px;height:560px">` : "";
  return pagina(`
    <div class="bg"></div><div class="grade-tec"></div>
    <img class="logo2" src="${asset("logo-laet-branco.png")}" style="top:110px;width:440px">
    <div class="topo">
      <div class="pill"><i></i>Catálogo de cores${total ? ` · ${total} cores` : ""}</div>
      <div class="t1 h-fit" data-max="980">${esc(titulo[0])}</div>
      ${titulo[1] ? `<div class="t2 h-fit amarelo" data-max="980">${esc(titulo[1])}</div>` : ""}
      ${frase ? `<div class="frase">${frase}</div>` : ""}
    </div>
    <div class="halo"></div>
    <div class="leque2">${chips}</div>
    ${lata}
    <div class="base"><a href="${comOrigem(LINKS.site, cfg)}">tintaslaet.com</a><span>•</span><a href="${LINKS.instagram}">@tintaslaet</a><span>•</span><a href="${LINKS.whatsapp}">(11) 97714-0964</a></div>`, "v2 capa2");
}

// ------------------------------------------------------------------ contracapa (v2, nov/2026): 4 botões clicáveis
// Ordem pedida pelo Kevin: Lojas (página de lojas, com WhatsApp e mapa de cada uma), Produtos, Instagram, Site.
function paginaEncerramento(cfg) {
  const cards = [
    { ic: "loja", tt: "Lojas", st: "Endereço e WhatsApp das 6 lojas", url: comOrigem(LINKS.lojas, cfg), prim: true },
    { ic: "produtos", tt: "Produtos", st: "A linha completa, com preços", url: comOrigem(LINKS.produtos, cfg) },
    { ic: "insta", tt: "Instagram", st: "Dicas, novidades e sorteios", url: LINKS.instagram },
    { ic: "site", tt: "Site", st: "Tudo da Laet num lugar só", url: comOrigem(LINKS.site, cfg) },
  ];
  const y0 = 700, passo = 206;
  return pagina(`
    <div class="bg"></div><div class="grade-tec"></div>
    <div class="mascote"><img src="${asset("mascote-rosto.png")}"></div>
    <div class="balao">Escolheu<br>a cor?</div>
    <div class="titulo">
      <div class="l1">Bora <span style="color:#FFC107">pintar.</span></div>
      <div class="l2">Toque num botão e <b>siga daqui</b>:</div>
    </div>
    ${cards.map((c, k) => `<a class="card${c.prim ? " prim" : ""}" href="${c.url}" style="top:${y0 + k * passo}px">
      <div class="ic">${ICONES[c.ic]}</div>
      <div class="txt"><div class="tt">${c.tt}</div><div class="st">${c.st}</div></div>
      <div class="seta">${ICONES.seta}</div></a>`).join("")}
    <div class="rodape2">
      <img src="${asset("logo-laet-branco.png")}" style="width:250px">
      <a class="zap" href="${LINKS.whatsapp}">${ICONES.zap}(11) 97714-0964</a>
      <div class="dica">Os botões desta página são clicáveis</div>
    </div>`, "v2 cc2");
}

// ------------------------------------------------------------------ documento
const FONTES = "https://fonts.googleapis.com/css2?family=Public+Sans:wght@400;600;700&family=Rubik:wght@800&family=League+Spartan:wght@800&family=Outfit:wght@400;700&family=Montserrat:wght@800;900&family=Poppins:wght@500;600;700&display=swap";

const SCRIPT = `
window.ajustar = async () => {
  await document.fonts.ready;
  for (const f of ['400 20px "Public Sans"', '600 20px "Public Sans"', '700 20px "Public Sans"', '800 20px "League Spartan"', '400 20px "Outfit"', '700 20px "Outfit"', '800 20px "Rubik"', '800 20px "Montserrat"', '900 20px "Montserrat"', '500 20px "Poppins"', '600 20px "Poppins"', '700 20px "Poppins"']) await document.fonts.load(f);
  // títulos da capa v2: diminui até caber
  document.querySelectorAll('.h-fit').forEach((el) => {
    const max = Number(el.dataset.max); let s = parseFloat(getComputedStyle(el).fontSize);
    for (let i = 0; i < 60 && el.scrollWidth > max; i++) { s *= 0.97; el.style.fontSize = s + 'px'; }
  });
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
<style>${CSS}${CSS_V2}</style></head><body>${paginas.join("")}<script>${SCRIPT}</script></body></html>`;
}

module.exports = { paginasTabela, paginaCapa, paginaEncerramento, documento, LINKS };
