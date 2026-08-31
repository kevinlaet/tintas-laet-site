// Notifica o Kevin quando um vendedor clica em "Ver Total" no gerador de
// orcamento — sinal de uso real da ferramenta no balcao (diferente de gerar
// PDF/mandar WhatsApp, que so acontece se o cliente fechar negocio).
// Mesmo mecanismo de push do submission-created.js e chat-message.js.

const { tokenValido, extrairToken } = require('./lib/auth-utils');

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "method not allowed" };
  }

  if (!tokenValido(extrairToken(event))) {
    return { statusCode: 401, body: JSON.stringify({ ok: false, erro: 'sessão expirada, faça login de novo' }) };
  }

  try {
    const data = JSON.parse(event.body || "{}");
    const numero = data.numero ? String(data.numero).padStart(3, "0") : "S/N";
    const vendedor = (data.vendedor || "").trim();
    const loja = (data.loja || "").trim();
    const cliente = (data.cliente || "").trim();
    const total = typeof data.total === "number" ? data.total : parseFloat(data.total) || 0;

    const topic = process.env.NTFY_TOPIC;

    if (!topic) {
      console.error("NTFY_TOPIC nao configurado nas variaveis de ambiente do Netlify");
      return { statusCode: 200, body: JSON.stringify({ ok: true }) };
    }

    const totalFmt = "R$ " + total.toFixed(2).replace(".", ",");
    const linhas = [
      `Protocolo: #${numero}`,
      `Vendedor: ${vendedor || "-"}`,
      `Loja: ${loja || "-"}`,
      `Cliente: ${cliente || "-"}`,
      `Total: ${totalFmt}`,
    ].join("\n");

    await fetch("https://ntfy.sh", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        topic,
        title: "🧾 Orçamento consultado no balcão",
        message: linhas,
        tags: ["receipt"],
      }),
    });

    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (err) {
    console.error("Erro ao notificar Ver Total do orcamento:", err);
    return { statusCode: 200, body: JSON.stringify({ ok: false }) };
  }
};
