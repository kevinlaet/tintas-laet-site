// As 11 linhas com catálogo em PDF: de onde vem cada cor e cada preço, e como cada uma se veste (cores do cabeçalho, tabela, capa).
// Regra de ouro: hex SEMPRE da paleta oficial (identidade/cores/paleta-oficial.json); preço SEMPRE do site (site/produto.html).
const { norm, produtos, paleta, ordem, moeda, corDaPaleta, produto, precoFixo } = require("./dados");

// ---- geometria das tabelas (px de um quadro 1080x1920 = página do Canva 810x1440pt), medida nos PDFs originais ----
const GEO = {
  // Premium Lavável
  premium: { esq: 36.5, topo: 108, altCab: 53.4, altLinha: 47.05, larg: [178.1, 269.5], tituloBase: 74.7, tituloTam: 43.2, cabTam: 26.7, linhaTam: 22.66, texto: "#000000" },
  // Flexível Emborrachada
  flex: { esq: 71.6, topo: 108, altCab: 49.7, altLinha: 44.68, larg: [172.3, 260], tituloBase: 74.7, tituloTam: 44.8, cabTam: 26.7, linhaTam: 22.66, texto: "#202020" },
  // Cobertura Absoluta e Semi Brilho
  cobertura: { esq: 35.6, topo: 130.7, altCab: 49.1, altLinha: 46.4, larg: [188, 275], tituloBase: 98.7, tituloTam: 40, cabTam: 26.7, linhaTam: 22.66, texto: "#202020" },
  // Standard
  standard: { esq: 46.7, topo: 144, altCab: 55, altLinha: 47, larg: [178.1, 269.5], tituloBase: 77.3, tituloTam: 44.8, cabTam: 26.7, linhaTam: 22.66, texto: "#000000" },
};
// largura das colunas de preço, conforme a geometria e quantas colunas de preço a linha tem
const LARG_PRECO = {
  premium: { 3: [193.7, 182.8, 183], 2: [279.7, 279.7], 1: [279.7] },
  flex: { 2: [260, 260], 1: [260], 3: [173.3, 173.3, 173.4] },
  cobertura: { 2: [275, 275], 1: [275], 3: [183.3, 183.3, 183.4] },
  standard: { 2: [269.5, 269.5], 1: [269.5], 3: [179.7, 179.7, 179.6] },
};

// Rodapé só com o aviso de cor. Variação de litragem/embalagem NÃO entra (pedido do Kevin, 25/09).
const RODAPE_LITROS = ["AS CORES PODEM SOFRER ALTERAÇÕES DE ACORDO COM A QUALIDADE DE IMAGEM DE CADA APARELHO."];
const RODAPE_KG = RODAPE_LITROS;
const RODAPE_STANDARD = ["Por se tratar de um catálogo virtual, pode haver uma distorção na cor de até 10% devido à resolução de cada aparelho"];

const P = { pdfAntigo: (arq) => arq };

const LINHAS = [
  {
    id: "premium-lavavel", arquivo: "catalogo-premium-lavavel", titulo: "PREMIUM LAVÁVEL",
    geo: "premium", cabecalho: "#313FBF", corTitulo: "#2F0063", corRodape: "#2F0063",
    ordem: "premium-lavavel", paleta: "paleta-grande", produtoPrecos: "premium-lavavel",
    colunas: [{ rotulo: "BALDE", campo: "preco_balde" }, { rotulo: "GALÃO", campo: "preco_galao" }, { rotulo: "(1/4)", campo: "preco_quarto" }],
    capaAntiga: { pdf: "Premiumlavavel05.26.pdf", pagina: 1 }, paginaProdutoAntiga: { pdf: "Premiumlavavel05.26.pdf", pagina: 2 },
    rodape: RODAPE_LITROS,
  },
  {
    id: "emborrachada", arquivo: "catalogo-flexivel-emborrachada", titulo: "EMBORRACHADA",
    geo: "flex", fonteTitulo: "rubik", cabecalho: "#FF6300", corTitulo: "#FF6300", corRodape: "#FF6300",
    ordem: "emborrachada", paleta: "paleta-grande", produtoPrecos: "emborrachada",
    colunas: [{ rotulo: "BALDE", campo: "preco_balde" }, { rotulo: "GALÃO", campo: "preco_galao" }],
    capaAntiga: { pdf: "Flexemborrachado05.26 (1).pdf", pagina: 1 },
    rodape: RODAPE_LITROS,
  },
  {
    // Os PDFs antigos de Cobertura, Flexível e Semi Brilho tinham a MESMA tabela de preço (mesmos valores cor a cor).
    // Sem preço próprio no site, seguem o preço da Emborrachada, que foi atualizado em 24/09. CONFIRMAR com o Kevin.
    id: "cobertura-absoluta", arquivo: "catalogo-cobertura-absoluta", titulo: "COBERTURA ABSOLUTA",
    geo: "cobertura", fonteTitulo: "rubik", cabecalho: "#365A96", corTitulo: "#365A96", corRodape: "#365A96",
    ordem: "cobertura-absoluta", paleta: "paleta-grande", produtoPrecos: "emborrachada",
    colunas: [{ rotulo: "BALDE", campo: "preco_balde" }, { rotulo: "GALÃO", campo: "preco_galao" }],
    capaAntiga: { pdf: "Coberturaabsoluta05.26.pdf", pagina: 1 },
    rodape: RODAPE_LITROS,
  },
  {
    // O PDF antigo do Semi Brilho trazia o título "cobertura absoluta" nas páginas da tabela (erro de cópia). Corrigido.
    id: "semibrilho", arquivo: "catalogo-semi-brilho-premium", titulo: "SEMI BRILHO PREMIUM",
    geo: "cobertura", fonteTitulo: "rubik", cabecalho: "#365A96", corTitulo: "#365A96", corRodape: "#365A96",
    ordem: "semibrilho", paleta: "paleta-grande", produtoPrecos: "emborrachada",
    colunas: [{ rotulo: "BALDE", campo: "preco_balde" }, { rotulo: "GALÃO", campo: "preco_galao" }],
    capaAntiga: { pdf: "Semibrilhocatalogo05.26.pdf", pagina: 1 },
    rodape: RODAPE_LITROS,
  },
  {
    id: "standard", arquivo: "catalogo-standard-concentrada", titulo: "STANDARD",
    geo: "standard", cabecalho: null, corTitulo: "#000000", corRodape: "#000000",
    ordem: "standard", paleta: "standard", produtoPrecos: "standard",
    colunas: [{ rotulo: "BALDE", campo: "preco_balde" }, { rotulo: "GALÃO", campo: "preco_galao" }],
    capaAntiga: { pdf: "NOVO CAT STAND.pdf (1).pdf", pagina: 1 },
    rodape: RODAPE_STANDARD, rodapeTipo: "standard",
  },

  // ---- linhas que ainda não tinham catálogo em PDF: mesmo modelo (capa, tabela, encerramento) ----
  {
    id: "latex-vinil", arquivo: "catalogo-latex-vinil", titulo: "LATEX VINIL",
    geo: "premium", cabecalho: "#2B2B30", corTitulo: "#2B2B30", corRodape: "#2B2B30",
    paletaLista: "latex-vinil", paleta: "latex-vinil", produtoPrecos: "latex-vinil",
    colunas: [{ rotulo: "BALDE", fixo: "18L — Cores", branco: "18L — Branca" }],
    capa: { tema: "#2B2B30", linhas: ["LATEX", "VINIL"] },
    rodape: RODAPE_LITROS,
  },
  {
    id: "super-profissional", arquivo: "catalogo-super-profissional", titulo: "SUPER PROFISSIONAL",
    geo: "premium", cabecalho: "#1F4FBF", corTitulo: "#1F4FBF", corRodape: "#1F4FBF",
    paletaLista: "super-profissional", paleta: "super-profissional", produtoPrecos: "super-profissional",
    colunas: [{ rotulo: "BALDE", fixo: "18L — Cores", branco: "18L — Branca" }, { rotulo: "GALÃO", fixo: "3,6L — Cores", branco: "3,6L — Branca" }],
    capa: { tema: "#1F4FBF", linhas: ["SUPER", "PROFISSIONAL"] },
    rodape: RODAPE_LITROS,
  },
  {
    id: "direto-no-gesso", arquivo: "catalogo-direto-no-gesso", titulo: "DIRETO NO GESSO",
    geo: "premium", cabecalho: "#B8860B", corTitulo: "#B8860B", corRodape: "#B8860B",
    // mesma cartela da Super Profissional; a lista de nomes vem do site (Direto no Gesso), o hex do mestre
    paletaLista: "site", paleta: "super-profissional", produtoLista: "direto-no-gesso", produtoPrecos: "direto-no-gesso",
    colunas: [{ rotulo: "BALDE", fixo: "18L — Cores", branco: "18L — Branca" }, { rotulo: "GALÃO", fixo: "3,6L — Cores", branco: "3,6L — Branca" }],
    capa: { tema: "#B8860B", linhas: ["DIRETO NO", "GESSO"] },
    rodape: RODAPE_LITROS,
  },
  {
    id: "esmalte-ecologico", arquivo: "catalogo-esmalte-ecologico", titulo: "ESMALTE ECOLÓGICO BASE ÁGUA",
    geo: "premium", cabecalho: "#2D2F8F", corTitulo: "#2D2F8F", corRodape: "#2D2F8F",
    paletaLista: "esmalte-ecologico", paleta: "esmalte-ecologico", produtoPrecos: "esmalte-ecologico",
    colunas: [{ rotulo: "BALDE", campo: "preco_balde", branco: "18L — Branca" }, { rotulo: "GALÃO", campo: "preco_galao", branco: "3,6L — Branca" }, { rotulo: "(1/4)", campo: "preco_quarto", branco: "900ml — Branca" }],
    capa: { tema: "#2D2F8F", linhas: ["ESMALTE", "ECOLÓGICO"] },
    rodape: RODAPE_LITROS,
  },
  {
    id: "piso-fachada", arquivo: "catalogo-pisos-e-fachadas", titulo: "PISOS & FACHADAS",
    geo: "premium", cabecalho: "#1B7A3A", corTitulo: "#1B7A3A", corRodape: "#1B7A3A",
    paletaLista: "piso-fachada", paleta: "piso-fachada", produtoPrecos: "piso-fachada",
    colunas: [{ rotulo: "BALDE", fixo: "17L — Cores", branco: "18L — Branca" }, { rotulo: "GALÃO", fixo: "3,4L — Cores", branco: "3,6L — Branca" }],
    capa: { tema: "#1B7A3A", linhas: ["PISOS &", "FACHADAS"] },
    rodape: RODAPE_LITROS,
  },
  {
    // Sem catálogo de referência (PDF/foto): as cores vêm do site e NÃO foram conferidas contra material do fabricante.
    id: "efeito-cimento-queimado", arquivo: "catalogo-efeito-cimento-queimado", titulo: "EFEITO CIMENTO QUEIMADO",
    geo: "premium", cabecalho: "#7B3FB3", corTitulo: "#7B3FB3", corRodape: "#7B3FB3",
    paletaLista: "site", paleta: null, produtoLista: "efeito-cimento-queimado", produtoPrecos: "efeito-cimento-queimado",
    colunas: [{ rotulo: "20 KG", campo: "preco_galao" }, { rotulo: "5 KG", campo: "preco_balde" }],
    capa: { tema: "#7B3FB3", linhas: ["EFEITO CIMENTO", "QUEIMADO"] },
    rodape: RODAPE_KG,
  },
];

// ---------------------------------------------------------------------------------------------------------------

function porNome(lista) {
  return new Map(lista.map((c) => [norm(c.nome), c]));
}

// Monta as linhas da tabela: { nome, hex, valores: [ "R$...", ... ] }
function resolver(cfg, avisos) {
  const preco = produto(cfg.produtoPrecos);
  const dosPrecos = porNome(preco.cores || []);
  let lista; // [{ nome, hex }]

  if (cfg.ordem) {
    // linhas que já tinham PDF: mantém a ordem do PDF antigo; cor sai se saiu do site (ex.: Preto, Chumbo, Cinza em 24/09)
    lista = [];
    const semPreco = [];
    for (const nome of ordem[cfg.ordem]) {
      if (!dosPrecos.has(norm(nome))) { semPreco.push(nome); continue; }
      const c = corDaPaleta(cfg.paleta, nome);
      if (!c) throw new Error(`${cfg.id}: "${nome}" não está na paleta oficial (${cfg.paleta})`);
      lista.push({ nome: c.nome, hex: c.hex });
    }
    if (semPreco.length) avisos.push(`${cfg.id}: fora do PDF novo por não constarem mais no site: ${semPreco.join(", ")}`);
    const jaNaLista = new Set(lista.map((c) => norm(c.nome)));
    const faltando = (preco.cores || []).filter((c) => !jaNaLista.has(norm(c.nome)) && norm(c.nome) !== "BRANCO");
    for (const c of faltando) {
      const of = corDaPaleta(cfg.paleta, c.nome);
      if (!of) throw new Error(`${cfg.id}: cor do site "${c.nome}" não está no PDF antigo nem na paleta oficial`);
      lista.push({ nome: of.nome, hex: of.hex });
      avisos.push(`${cfg.id}: "${c.nome}" está no site mas não estava no PDF antigo; acrescentada no fim`);
    }
  } else if (cfg.paletaLista === "site") {
    const fonte = produto(cfg.produtoLista).cores.filter((c) => norm(c.nome) !== "BRANCO");
    lista = fonte.map((c) => {
      const of = cfg.paleta ? corDaPaleta(cfg.paleta, c.nome) : null;
      if (cfg.paleta && !of) throw new Error(`${cfg.id}: "${c.nome}" não está na paleta oficial (${cfg.paleta})`);
      return { nome: c.nome, hex: (of || c).hex };
    });
    if (!cfg.paleta) avisos.push(`${cfg.id}: cores tiradas do site, SEM catálogo de referência (não conferidas contra PDF/foto)`);
  } else {
    lista = paleta.linhas[cfg.paletaLista].cores.map((c) => ({ nome: c.nome, hex: c.hex }));
  }

  // Branco primeiro (os PDFs antigos não listavam; o preço dele é o mais procurado). Pula se a linha não tem branco.
  const brancoSite = dosPrecos.get("BRANCO");
  const temBrancoFixo = cfg.colunas.every((col) => col.branco);
  if (temBrancoFixo || (brancoSite && cfg.colunas.every((col) => col.campo && brancoSite[col.campo]))) {
    lista.unshift({ nome: "Branco", hex: "#FFFFFF", branco: true });
  }

  const linhas = lista.map((c) => {
    const valores = cfg.colunas.map((col) => {
      if (c.branco && col.branco) return precoFixo(cfg.produtoPrecos, col.branco);
      if (col.fixo) return precoFixo(cfg.produtoPrecos, col.fixo);
      const site = dosPrecos.get(norm(c.nome));
      const v = site && site[col.campo];
      if (!v) throw new Error(`${cfg.id}: sem ${col.campo} pra "${c.nome}" no site`);
      return moeda(v);
    });
    return { nome: c.nome, hex: c.hex.toUpperCase(), valores };
  });

  return { cfg, linhas, subtitulo: null };
}

function larguras(cfg) {
  const g = GEO[cfg.geo];
  const n = cfg.colunas.length;
  const precos = LARG_PRECO[cfg.geo][n];
  if (!precos) throw new Error(`${cfg.id}: sem largura de coluna pra ${n} preços em ${cfg.geo}`);
  return [...g.larg, ...precos];
}

module.exports = { LINHAS, GEO, resolver, larguras };
