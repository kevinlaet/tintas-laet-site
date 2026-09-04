// Roda uma vez por dia (agendado em netlify.toml) e manda um resumo do dia
// anterior pro celular do Kevin via ntfy.sh — mesmo mecanismo de
// netlify/functions/chat-message.js e submission-created.js.
// Le os dados direto do Google Analytics (GA4 Data API) usando uma service
// account (ver GA_CLIENT_EMAIL / GA_PRIVATE_KEY / GA_PROPERTY_ID abaixo).
//
// Usa "yesterday", nao "today": o relatorio padrao do GA4 (diferente do
// Tempo Real) tem atraso de processamento de varias horas, entao pedir o
// dia de hoje as 21h sempre voltava zerado mesmo com gente no site.
//
// Cada consulta ao GA4 roda isolada (tentarReport) -- se uma falhar (ex: a
// dimensao customEvent:produto_id nao estiver registrada como dimensao
// personalizada no GA4), so aquele pedaco do relatorio some, sem derrubar
// o resto. Importante porque essa function nao da pra testar localmente
// (chave privada bloqueada pelo classificador de seguranca, e a Netlify
// recusa invocacao externa direta de scheduled function) -- so da pra
// confirmar no disparo real das 21h.

const EVENTOS_CUSTOM = ["click_whatsapp", "click_produto", "form_submit", "gerar_lead"];

let PRODUTOS_POR_ID = null;
function nomeDoProduto(id) {
  if (!PRODUTOS_POR_ID) {
    PRODUTOS_POR_ID = {};
    try {
      require("../../site/search-data.js").forEach((p) => { PRODUTOS_POR_ID[p.id] = p.nome; });
    } catch (err) {
      console.error("Relatorio diario: nao consegui carregar site/search-data.js:", err);
    }
  }
  return PRODUTOS_POR_ID[id] || id;
}

// Traduz o valor cru do GA4 (ex: "instagram / bio", "(direct) / (none)")
// pra uma descricao que qualquer pessoa entende de primeira.
const ORIGENS_CONHECIDAS = {
  "(direct) / (none)": "Direto (sem origem)",
  "google / organic": "Busca no Google",
  "instagram / bio": "Instagram (bio)",
  "instagram / story": "Instagram (story)",
  "whatsapp / status": "WhatsApp (Status)",
  "facebook / post": "Facebook (post)",
  "ig / social": "Instagram",
  "l.instagram.com / referral": "Instagram (link)",
  "facebook.com / referral": "Facebook (link)",
  "m.facebook.com / referral": "Facebook (link)",
  "l.wl.co / referral": "WhatsApp (link)",
};
function nomeDaOrigem(sourceMedium) {
  if (ORIGENS_CONHECIDAS[sourceMedium]) return ORIGENS_CONHECIDAS[sourceMedium];
  return sourceMedium.replace(/ \/ referral$/, " (link externo)").replace(/ \/ /g, " — ");
}

function base64url(input) {
  const buf = Buffer.isBuffer(input) ? input : Buffer.from(input);
  return buf.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function getAccessToken(clientEmail, privateKey) {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "RS256", typ: "JWT" };
  const claim = {
    iss: clientEmail,
    scope: "https://www.googleapis.com/auth/analytics.readonly",
    aud: "https://oauth2.googleapis.com/token",
    exp: now + 3600,
    iat: now,
  };
  const unsigned = `${base64url(JSON.stringify(header))}.${base64url(JSON.stringify(claim))}`;
  const signature = require("crypto").createSign("RSA-SHA256").update(unsigned).sign(privateKey);
  const jwt = `${unsigned}.${base64url(signature)}`;

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });
  const data = await res.json();
  if (!data.access_token) throw new Error("Falha ao obter access_token: " + JSON.stringify(data));
  return data.access_token;
}

async function runReport(accessToken, propertyId, body) {
  const res = await fetch(`https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error("Erro na GA4 Data API: " + JSON.stringify(data));
  return data;
}

// Isola cada consulta -- uma dimensao/metrica invalida (ex: custom dimension
// nao configurada no GA4) so tira aquele pedaco do relatorio, em vez de
// derrubar a notificacao inteira.
async function tentarReport(label, fn) {
  try {
    return await fn();
  } catch (err) {
    console.error(`Relatorio diario: falha ao buscar "${label}":`, err);
    return null;
  }
}

async function avisar(topic, title, message, tags) {
  await fetch("https://ntfy.sh", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ topic, title, message, tags }),
  });
}

function formatVariacao(atual, anterior) {
  const a = parseFloat(atual) || 0;
  const b = parseFloat(anterior) || 0;
  if (b === 0) return a > 0 ? " (novo)" : "";
  const pct = Math.round(((a - b) / b) * 100);
  return ` (${pct > 0 ? "+" : ""}${pct}% vs anteontem)`;
}

function formatLista(rows, formatarLinha) {
  if (!rows || !rows.length) return null;
  return rows.map((row, i) => `${i + 1}. ${formatarLinha(row)}`).join("\n");
}

exports.handler = async function () {
  const topic = process.env.NTFY_TOPIC;
  const clientEmail = process.env.GA_CLIENT_EMAIL;
  const privateKey = (process.env.GA_PRIVATE_KEY || "").replace(/\\n/g, "\n");
  const propertyId = process.env.GA_PROPERTY_ID;

  if (!topic || !clientEmail || !privateKey || !propertyId) {
    console.error("Faltam variaveis de ambiente: GA_CLIENT_EMAIL, GA_PRIVATE_KEY, GA_PROPERTY_ID ou NTFY_TOPIC");
    return { statusCode: 200, body: "faltam variaveis de ambiente" };
  }

  try {
    const accessToken = await getAccessToken(clientEmail, privateKey);
    const metricasGerais = [{ name: "activeUsers" }, { name: "sessions" }, { name: "screenPageViews" }];

    const [geral, geralAnteontem, eventos, topPaginas, origens, produtosClicados] = await Promise.all([
      tentarReport("geral (ontem)", () => runReport(accessToken, propertyId, {
        dateRanges: [{ startDate: "yesterday", endDate: "yesterday" }],
        metrics: metricasGerais,
      })),
      tentarReport("geral (anteontem, pra comparacao)", () => runReport(accessToken, propertyId, {
        dateRanges: [{ startDate: "2daysAgo", endDate: "2daysAgo" }],
        metrics: metricasGerais,
      })),
      tentarReport("eventos custom", () => runReport(accessToken, propertyId, {
        dateRanges: [{ startDate: "yesterday", endDate: "yesterday" }],
        dimensions: [{ name: "eventName" }],
        metrics: [{ name: "eventCount" }],
        dimensionFilter: {
          filter: { fieldName: "eventName", inListFilter: { values: EVENTOS_CUSTOM } },
        },
      })),
      tentarReport("top paginas", () => runReport(accessToken, propertyId, {
        dateRanges: [{ startDate: "yesterday", endDate: "yesterday" }],
        dimensions: [{ name: "pageTitle" }],
        metrics: [{ name: "screenPageViews" }],
        orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
        limit: 5,
      })),
      tentarReport("origem do trafego", () => runReport(accessToken, propertyId, {
        dateRanges: [{ startDate: "yesterday", endDate: "yesterday" }],
        dimensions: [{ name: "sessionSourceMedium" }],
        metrics: [{ name: "sessions" }],
        orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
        limit: 5,
      })),
      tentarReport("produto clicado", () => runReport(accessToken, propertyId, {
        dateRanges: [{ startDate: "yesterday", endDate: "yesterday" }],
        dimensions: [{ name: "customEvent:produto_id" }],
        metrics: [{ name: "eventCount" }],
        dimensionFilter: {
          filter: { fieldName: "eventName", stringFilter: { value: "click_produto" } },
        },
        orderBys: [{ metric: { metricName: "eventCount" }, desc: true }],
        limit: 5,
      })),
    ]);

    const [usuarios, sessoes, pageviews] = geral && geral.rows && geral.rows[0]
      ? geral.rows[0].metricValues.map((m) => m.value)
      : ["0", "0", "0"];
    const [usuariosAntes, sessoesAntes, pageviewsAntes] = geralAnteontem && geralAnteontem.rows && geralAnteontem.rows[0]
      ? geralAnteontem.rows[0].metricValues.map((m) => m.value)
      : [null, null, null];

    const contagem = {};
    ((eventos && eventos.rows) || []).forEach((row) => {
      contagem[row.dimensionValues[0].value] = row.metricValues[0].value;
    });

    const linhaGeral = usuariosAntes !== null
      ? `${usuarios} visitantes${formatVariacao(usuarios, usuariosAntes)}\n${sessoes} visitas${formatVariacao(sessoes, sessoesAntes)} · ${pageviews} páginas vistas${formatVariacao(pageviews, pageviewsAntes)}`
      : `${usuarios} visitantes\n${sessoes} visitas · ${pageviews} páginas vistas`;

    const listaPaginas = formatLista(topPaginas && topPaginas.rows, (row) =>
      `${row.dimensionValues[0].value} — ${row.metricValues[0].value} visualizações`
    );

    const listaOrigens = formatLista(origens && origens.rows, (row) =>
      `${nomeDaOrigem(row.dimensionValues[0].value)} — ${row.metricValues[0].value} visitas`
    );

    const listaProdutos = formatLista(produtosClicados && produtosClicados.rows, (row) =>
      `${nomeDoProduto(row.dimensionValues[0].value)} — ${row.metricValues[0].value} cliques`
    );

    const partes = [linhaGeral];

    partes.push(
      [
        "RESULTADOS DO DIA",
        `💬 ${contagem.click_whatsapp || 0} cliques no WhatsApp`,
        `🛒 ${contagem.click_produto || 0} cliques em produto`,
        `📝 ${contagem.form_submit || 0} formulários enviados`,
        `✅ ${contagem.gerar_lead || 0} leads gerados`,
      ].join("\n")
    );

    if (listaProdutos) partes.push(`PRODUTOS MAIS CLICADOS\n${listaProdutos}`);
    if (listaPaginas) partes.push(`PÁGINAS MAIS VISTAS\n${listaPaginas}`);
    if (listaOrigens) partes.push(`DE ONDE VIERAM OS VISITANTES\n${listaOrigens}`);

    const mensagem = partes.join("\n\n");

    await avisar(topic, "📊 Resumo de ontem — Tintas Laet", mensagem, ["bar_chart"]);
    return { statusCode: 200, body: "ok" };
  } catch (err) {
    console.error("Erro ao gerar relatorio diario:", err);
    await avisar(
      topic,
      "⚠️ Relatório diário falhou",
      "Não consegui gerar o resumo do site de ontem. Confere os logs da função relatorio-diario no Netlify.",
      ["warning"]
    );
    return { statusCode: 200, body: "erro" };
  }
};
