// Notifica o Kevin quando um vendedor clica em "Ver Total" no gerador de
// orcamento — sinal de uso real da ferramenta no balcao (diferente de gerar
// PDF/mandar WhatsApp, que so acontece se o cliente fechar negocio).
// Mesmo mecanismo de push do submission-created.js e chat-message.js.

const { tokenValido, extrairToken } = require("./lib/auth-utils");

const brl = (v) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v || 0);
const MAX_ITENS = 15;

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "method not allowed" };
  }

  // Sem login valido nao manda notificacao pro celular do Kevin.
  if (!tokenValido(extrairToken(event))) {
    return { statusCode: 401, body: JSON.stringify({ ok: false }) };
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

    const itens = Array.isArray(data.itens) ? data.itens : [];
    const frete = Number(data.frete) || 0;
    const desconto = Number(data.desconto) || 0;

    const whatsapp = String(data.whatsapp || "").trim().slice(0, 30);
    const endereco = String(data.endereco || "").trim().slice(0, 140);
    const pagamento = String(data.pagamento || "").trim().slice(0, 60);

    const linhasItens = itens.slice(0, MAX_ITENS).map((it) => {
      const qty = Number(it.qty) || 0;
      const nome = String(it.nome || "").trim().slice(0, 60);
      const variante = String(it.variante || "").trim().slice(0, 40);
      const unitario = Number(it.valor) || 0;
      const detalheUnit = qty > 1 && unitario > 0 ? ` (${brl(unitario)} cada)` : "";
      return `• ${qty}x ${nome}${variante ? " (" + variante + ")" : ""}\n   ${brl(Number(it.subtotal))}${detalheUnit}`;
    });
    if (itens.length > MAX_ITENS) linhasItens.push(`+ ${itens.length - MAX_ITENS} item(ns)`);

    const qtdTotal = itens.reduce((s, it) => s + (Number(it.qty) || 0), 0);
    const subtotalItens = itens.reduce((s, it) => s + (Number(it.subtotal) || 0), 0);

    const linhas = [
      `Vendedor: ${vendedor || "Sem vendedor"}`,
      `Loja: ${loja || "Sem loja"}`,
      "",
      `Cliente: ${cliente || "-"}`,
      ...(whatsapp ? [`WhatsApp: ${whatsapp}`] : []),
      ...(endereco ? [`Endereço: ${endereco}`] : []),
      "",
      `Produtos (${itens.length} ${itens.length === 1 ? "item" : "itens"}, ${qtdTotal} un.):`,
      ...linhasItens,
      "",
      ...(frete > 0 || desconto > 0 ? [`Produtos: ${brl(subtotalItens)}`] : []),
      ...(frete > 0 ? [`Frete: ${brl(frete)}`] : []),
      ...(desconto > 0 ? [`Desconto: -${brl(desconto)}`] : []),
      ...(pagamento ? [`Pagamento: ${pagamento}`] : []),
      `Total: ${brl(total)}`,
    ].join("\n");

    await fetch("https://ntfy.sh", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        topic,
        title: `🧾 #${numero} · ${brl(total)} · consultado no balcão`,
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
