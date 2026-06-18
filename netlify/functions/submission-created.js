// Netlify chama essa funcao automaticamente a cada envio de formulario do site
// (convencao de nome: "submission-created"). Aqui formatamos os dados e
// repassamos pro WhatsApp do Kevin via CallMeBot.

exports.handler = async function (event) {
  try {
    const body = JSON.parse(event.body || "{}");
    const data = (body.payload && body.payload.data) || {};

    if (data["form-name"] !== "cupom-sorteio") {
      return { statusCode: 200, body: "formulario ignorado" };
    }

    const apikey = process.env.CALLMEBOT_APIKEY;
    const phone = process.env.WHATSAPP_NOTIFY_PHONE || "5511977140964";

    if (!apikey) {
      console.error("CALLMEBOT_APIKEY nao configurada nas variaveis de ambiente do Netlify");
      return { statusCode: 200, body: "sem apikey configurada" };
    }

    const amigosNomes = toArray(data["amigo_nome[]"]);
    const amigosWpp = toArray(data["amigo_whatsapp[]"]);
    let amigosTexto = "";
    amigosNomes.forEach((nome, i) => {
      if (nome) amigosTexto += `\n  ${i + 1}. ${nome} - ${amigosWpp[i] || "sem whatsapp"}`;
    });

    const comoConheceu = data.como_conheceu === "Outro"
      ? (data.como_conheceu_outro || "Outro")
      : (data.como_conheceu || "-");

    const linhas = [
      "🎟️ *Novo cupom do sorteio!*",
      "",
      `*Nome:* ${data.nome || "-"}`,
      `*WhatsApp:* ${data.whatsapp || "-"}`,
      `*Cidade:* ${data.cidade || "-"}`,
      `*Loja:* ${data.loja || "-"}`,
      `*Forma de compra:* ${data.forma_compra || "-"}`,
      data.numero_pedido ? `*Numero do pedido:* ${data.numero_pedido}` : null,
      data.prazo_projeto ? `*Prazo do projeto:* ${data.prazo_projeto}` : null,
      `*Como conheceu:* ${comoConheceu}`,
      amigosTexto ? `*Amigos indicados:*${amigosTexto}` : null,
    ].filter(Boolean).join("\n");

    const url = `https://api.callmebot.com/whatsapp.php?phone=${phone}&text=${encodeURIComponent(linhas)}&apikey=${apikey}`;
    await fetch(url);

    return { statusCode: 200, body: "ok" };
  } catch (err) {
    console.error("Erro ao notificar WhatsApp:", err);
    return { statusCode: 200, body: "erro tratado" };
  }
};

function toArray(value) {
  if (Array.isArray(value)) return value;
  if (value === undefined || value === null || value === "") return [];
  return [value];
}
