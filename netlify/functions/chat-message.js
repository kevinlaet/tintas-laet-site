// Recebe a mensagem do widget de chat do site (fetch direto do navegador, sem
// depender de Netlify Forms) e repassa pra notificacao push do Kevin via
// ntfy.sh — mesmo mecanismo do netlify/functions/submission-created.js.

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "method not allowed" };
  }

  try {
    const data = JSON.parse(event.body || "{}");

    // Honeypot: campo escondido que só um bot preencheria. Se veio algo, finge
    // sucesso e não faz nada (não avisar o bot que foi barrado).
    if ((data.website || "").trim()) {
      return { statusCode: 200, body: JSON.stringify({ ok: true }) };
    }

    const nome = (data.nome || "").trim().slice(0, 200);
    const contato = (data.contato || "").trim().slice(0, 200);
    const mensagem = (data.mensagem || "").trim().slice(0, 2000);

    if (!mensagem) {
      return { statusCode: 400, body: JSON.stringify({ ok: false, erro: "mensagem vazia" }) };
    }

    const topic = process.env.NTFY_TOPIC;

    if (!topic) {
      console.error("NTFY_TOPIC nao configurado nas variaveis de ambiente do Netlify");
      return { statusCode: 200, body: JSON.stringify({ ok: true }) };
    }

    const linhas = [
      `Nome: ${nome || "-"}`,
      `Contato: ${contato || "-"}`,
      `Mensagem: ${mensagem}`,
    ].join("\n");

    await fetch("https://ntfy.sh", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        topic,
        title: "💬 Nova mensagem do chat do site!",
        message: linhas,
        tags: ["speech_balloon"],
      }),
    });

    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (err) {
    console.error("Erro ao repassar mensagem do chat:", err);
    return { statusCode: 200, body: JSON.stringify({ ok: false }) };
  }
};
