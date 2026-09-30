// Recebe a mensagem do widget de chat do site (fetch direto do navegador, sem
// depender de Netlify Forms) e repassa pra notificacao push do Kevin via
// ntfy.sh — mesmo mecanismo do netlify/functions/submission-created.js.

const { registrarMensagemSite } = require("./lib/supabase");
const { ipDe, ipMascarado, limitar, alertarCelular } = require("./lib/alerta");

const ORIGEM_OK = /^https:\/\/([a-z0-9-]+\.)*(tintaslaet\.com|netlify\.app)$|^http:\/\/localhost(:\d+)?$/i;

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "method not allowed" };
  }

  // Só aceita mensagem vinda do nosso próprio site (sem Origin = ferramenta de teste/servidor).
  const origem = (event.headers && (event.headers.origin || event.headers.Origin)) || "";
  if (origem && !ORIGEM_OK.test(origem)) {
    return { statusCode: 403, body: JSON.stringify({ ok: false }) };
  }

  if ((event.body || "").length > 20000) {
    return { statusCode: 413, body: JSON.stringify({ ok: false, erro: "mensagem grande demais" }) };
  }

  // Freio de flood: 6 mensagens por IP a cada 10 min. Passou disso, para de repassar
  // (protege o celular do Kevin e o banco) e avisa uma vez.
  const ip = ipDe(event);
  const lim = limitar("chat:" + ip, 6, 10 * 60 * 1000);
  if (!lim.ok) {
    if (lim.count === 7) {
      await alertarCelular("Flood no chat do site", `Muitas mensagens seguidas do mesmo visitante (${ipMascarado(ip)}). Bloqueei o excesso automaticamente.`);
    }
    return { statusCode: 429, body: JSON.stringify({ ok: false, erro: "muitas mensagens, tente daqui a pouco" }) };
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

    // Registra a mensagem pro painel conseguir avisar "ainda sem resposta" —
    // best-effort: se o Supabase falhar, a notificação push abaixo continua
    // funcionando normal (é o canal que já existia e sempre funcionou).
    try {
      await registrarMensagemSite({ tipo: "chat", nome, contato, mensagem });
    } catch (err) {
      console.error("chat-message: falha ao registrar no Supabase (notificação segue normal):", err.message);
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
