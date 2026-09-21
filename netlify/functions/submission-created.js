// Netlify chama essa funcao automaticamente a cada envio de formulario do site
// (convencao de nome: "submission-created"). Aqui formatamos os dados e
// repassamos pra notificacao push do Kevin via ntfy.sh.

const { registrarMensagemSite } = require("./lib/supabase");

exports.handler = async function (event) {
  try {
    const body = JSON.parse(event.body || "{}");
    const data = (body.payload && body.payload.data) || {};
    const formName = (body.payload && body.payload.form_name) || data["form-name"] || data.form_name;

    if (formName !== "cupom-sorteio" && formName !== "trabalhe-conosco") {
      return { statusCode: 200, body: "formulario ignorado" };
    }

    const topic = process.env.NTFY_TOPIC;

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

      // Registra pro painel conseguir avisar "ainda sem resposta" — best-effort,
      // não pode derrubar a notificação push que já funciona hoje.
      try {
        await registrarMensagemSite({
          tipo: "trabalhe-conosco",
          nome: data.nome,
          contato: data.whatsapp,
          mensagem: linhas,
        });
      } catch (err) {
        console.error("submission-created: falha ao registrar no Supabase (notificação segue normal):", err.message);
      }

      await fetch("https://ntfy.sh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          title: "💼 Nova candidatura — Trabalhe Conosco!",
          message: linhas,
          tags: ["briefcase"],
        }),
      });

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

    // Cupom não precisa de "resposta" (não é card de aviso no painel), mas
    // fica salvo pra você conseguir ver a lista de participantes lá também,
    // sem precisar abrir o Netlify Forms.
    try {
      await registrarMensagemSite({
        tipo: "cupom-sorteio",
        nome: data.nome,
        contato: data.whatsapp,
        mensagem: linhas,
      });
    } catch (err) {
      console.error("submission-created: falha ao registrar cupom no Supabase (notificação segue normal):", err.message);
    }

    await fetch("https://ntfy.sh", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        topic,
        title: "🎟️ Novo cupom do sorteio!",
        message: linhas,
        tags: ["ticket"],
      }),
    });

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
