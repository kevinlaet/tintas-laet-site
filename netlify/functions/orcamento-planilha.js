// Ponte entre o gerador de orçamento (site/orcamento.html) e a planilha central
// (Google Apps Script). Antes o navegador chamava a URL da planilha direto, e essa
// URL ficava escrita no código público da página — qualquer pessoa podia mandar
// orçamentos falsos pra planilha. Agora:
//  - a URL real fica só aqui, na env var SHEETS_WEBHOOK_URL (Netlify)
//  - só quem está logado na Área do vendedor (token assinado) consegue chamar
//  - o formato e o tamanho do pedido são conferidos antes de repassar
//  - (opcional, recomendado) SHEETS_SEGREDO: um segredo que o Apps Script confere,
//    pra ele recusar qualquer chamada que não venha daqui
//  - freio de abuso por IP

const { tokenValido, extrairToken } = require("./lib/auth-utils");
const { ipDe, limitar } = require("./lib/alerta");

const MAX_ITENS = 60;

function texto(v, max) {
  return String(v == null ? "" : v).slice(0, max);
}

function numero(v) {
  const n = typeof v === "number" ? v : parseFloat(v);
  return Number.isFinite(n) ? n : 0;
}

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ ok: false, erro: "method not allowed" }) };
  }

  if (!tokenValido(extrairToken(event))) {
    return { statusCode: 401, body: JSON.stringify({ ok: false, erro: "não autorizado" }) };
  }

  const url = process.env.SHEETS_WEBHOOK_URL;
  if (!url) {
    console.error("SHEETS_WEBHOOK_URL nao configurada nas variaveis de ambiente do Netlify");
    return { statusCode: 200, body: JSON.stringify({ ok: false, erro: "planilha não configurada no servidor" }) };
  }

  if ((event.body || "").length > 50000) {
    return { statusCode: 413, body: JSON.stringify({ ok: false, erro: "pedido grande demais" }) };
  }

  const lim = limitar("planilha:" + ipDe(event), 120, 10 * 60 * 1000);
  if (!lim.ok) {
    return { statusCode: 429, body: JSON.stringify({ ok: false, erro: "muitas chamadas, aguarde" }) };
  }

  let d;
  try {
    d = JSON.parse(event.body || "{}");
  } catch (e) {
    return { statusCode: 400, body: JSON.stringify({ ok: false, erro: "formato inválido" }) };
  }

  const itens = Array.isArray(d.itens) ? d.itens.slice(0, MAX_ITENS) : [];
  const payload = {
    numero: d.numero == null ? null : texto(d.numero, 20),
    vendedor: texto(d.vendedor, 120),
    loja: texto(d.loja, 120),
    cliente: texto(d.cliente, 200),
    whatsapp: texto(d.whatsapp, 40),
    endereco: texto(d.endereco, 300),
    pagamento: texto(d.pagamento, 120),
    frete: numero(d.frete),
    desconto: numero(d.desconto),
    total: numero(d.total),
    itens: itens.map((it) => ({
      qty: numero(it && it.qty),
      nome: texto(it && it.nome, 200),
      variante: texto(it && it.variante, 200),
      subtotal: numero(it && it.subtotal),
    })),
  };
  if (process.env.SHEETS_SEGREDO) payload.segredo = process.env.SHEETS_SEGREDO;

  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 9000);
    const res = await fetch(url, { method: "POST", body: JSON.stringify(payload), signal: ctrl.signal });
    clearTimeout(timer);
    const data = await res.json();
    if (!data.ok || !data.numero) {
      return { statusCode: 200, body: JSON.stringify({ ok: false, erro: "a planilha não confirmou o registro" }) };
    }
    return { statusCode: 200, body: JSON.stringify({ ok: true, numero: data.numero }) };
  } catch (err) {
    console.error("orcamento-planilha: falha ao falar com a planilha:", err.message);
    return { statusCode: 200, body: JSON.stringify({ ok: false, erro: "não consegui falar com a planilha agora" }) };
  }
};
