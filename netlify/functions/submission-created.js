// Netlify chama essa funcao automaticamente a cada envio de formulario do site
// (convencao de nome: "submission-created"). Aqui formatamos os dados e
// repassamos pra notificacao push do Kevin via ntfy.sh.

exports.handler = async function (event) {
  try {
    const body = JSON.parse(event.body || "{}");
    const data = (body.payload && body.payload.data) || {};
    const formName = (body.payload && body.payload.form_name) || data["form-name"] || data.form_name;

    console.log("Formulario recebido:", formName);

    if (formName !== "cupom-sorteio" && formName !== "trabalhe-conosco") {
      return { statusCode: 200, body: "formulario ignorado" };
    }

    const topic = process.env.NTFY_TOPIC;

    console.log("NTFY_TOPIC presente:", Boolean(topic));

    if (!topic) {
      console.error("NTFY_TOPIC nao configurado nas variaveis de ambiente do Netlify");
      return { statusCode: 200, body: "sem topico configurado" };
    }

    if (formName === "trabalhe-conosco") {
      const linhas = [
        `Nome: ${data.nome || "-"}`,
        `WhatsApp: ${data.whatsapp || "-"}`,
        `Cidade: ${data.cidade || "-"}`,
        `Loja de preferência: ${data.loja_preferencia || "-"}`,
        `Área de interesse: ${data.vaga_interesse || "-"}`,
        `Disponibilidade: ${data.disponibilidade || "-"}`,
        data.experiencia ? `Experiência: ${data.experiencia}` : null,
        data.link_curriculo ? `Currículo/LinkedIn: ${data.link_curriculo}` : null,
      ].filter(Boolean).join("\n");

      const resp = await fetch("https://ntfy.sh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          title: "💼 Nova candidatura — Trabalhe Conosco!",
          message: linhas,
          tags: ["briefcase"],
        }),
      });
      console.log("Resposta do ntfy.sh:", resp.status, await resp.text());

      return { statusCode: 200, body: "ok" };
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
      data.protocolo ? `Protocolo: ${data.protocolo}` : null,
      `Nome: ${data.nome || "-"}`,
      `WhatsApp: ${data.whatsapp || "-"}`,
      `Cidade: ${data.cidade || "-"}`,
      `Loja: ${data.loja || "-"}`,
      `Forma de compra: ${data.forma_compra || "-"}`,
      data.numero_pedido ? `Numero do pedido: ${data.numero_pedido}` : null,
      data.prazo_projeto ? `Prazo do projeto: ${data.prazo_projeto}` : null,
      `Como conheceu: ${comoConheceu}`,
      amigosTexto ? `Amigos indicados:${amigosTexto}` : null,
    ].filter(Boolean).join("\n");

    const resp = await fetch("https://ntfy.sh", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        topic,
        title: "🎟️ Novo cupom do sorteio!",
        message: linhas,
        tags: ["ticket"],
      }),
    });
    console.log("Resposta do ntfy.sh:", resp.status, await resp.text());

    return { statusCode: 200, body: "ok" };
  } catch (err) {
    console.error("Erro ao notificar:", err);
    return { statusCode: 200, body: "erro tratado" };
  }
};

function toArray(value) {
  if (Array.isArray(value)) return value;
  if (value === undefined || value === null || value === "") return [];
  return [value];
}
