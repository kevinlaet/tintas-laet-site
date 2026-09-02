// Roda uma vez por dia (agendado em netlify.toml) e manda um resumo do dia
// anterior pro celular do Kevin via ntfy.sh — mesmo mecanismo de
// netlify/functions/chat-message.js e submission-created.js.
// Le os dados direto do Google Analytics (GA4 Data API) usando uma service
// account (ver GA_CLIENT_EMAIL / GA_PRIVATE_KEY / GA_PROPERTY_ID abaixo).
//
// Usa "yesterday", nao "today": o relatorio padrao do GA4 (diferente do
// Tempo Real) tem atraso de processamento de varias horas, entao pedir o
// dia de hoje as 21h sempre voltava zerado mesmo com gente no site.

const EVENTOS_CUSTOM = ["click_whatsapp", "click_produto", "form_submit", "gerar_lead"];

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

async function avisar(topic, title, message, tags) {
  await fetch("https://ntfy.sh", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ topic, title, message, tags }),
  });
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

    const [geral, eventos, topPagina] = await Promise.all([
      runReport(accessToken, propertyId, {
        dateRanges: [{ startDate: "yesterday", endDate: "yesterday" }],
        metrics: [{ name: "activeUsers" }, { name: "sessions" }, { name: "screenPageViews" }],
      }),
      runReport(accessToken, propertyId, {
        dateRanges: [{ startDate: "yesterday", endDate: "yesterday" }],
        dimensions: [{ name: "eventName" }],
        metrics: [{ name: "eventCount" }],
        dimensionFilter: {
          filter: { fieldName: "eventName", inListFilter: { values: EVENTOS_CUSTOM } },
        },
      }),
      runReport(accessToken, propertyId, {
        dateRanges: [{ startDate: "yesterday", endDate: "yesterday" }],
        dimensions: [{ name: "pageTitle" }],
        metrics: [{ name: "screenPageViews" }],
        orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
        limit: 1,
      }),
    ]);

    const [usuarios, sessoes, pageviews] = geral.rows && geral.rows[0]
      ? geral.rows[0].metricValues.map((m) => m.value)
      : ["0", "0", "0"];

    const contagem = {};
    (eventos.rows || []).forEach((row) => {
      contagem[row.dimensionValues[0].value] = row.metricValues[0].value;
    });

    const pagina = topPagina.rows && topPagina.rows[0]
      ? `${topPagina.rows[0].dimensionValues[0].value} (${topPagina.rows[0].metricValues[0].value} views)`
      : "sem dados ontem";

    const mensagem = [
      `👥 ${usuarios} usuários ativos | ${sessoes} sessões | ${pageviews} páginas vistas`,
      `📄 Página mais vista: ${pagina}`,
      `💬 Cliques no WhatsApp: ${contagem.click_whatsapp || 0}`,
      `🛒 Cliques em produto: ${contagem.click_produto || 0}`,
      `📝 Formulários enviados: ${contagem.form_submit || 0}`,
      `✅ Leads gerados: ${contagem.gerar_lead || 0}`,
    ].join("\n");

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
