// Ferramentas de proteção compartilhadas pelas functions públicas:
//  - limitar(): freio de abuso por IP (em memória, "melhor esforço": cada
//    instância da function tem o seu contador, mas já barra o grosso de bot/flood)
//  - alertarCelular(): push de ALTA prioridade pro celular do Kevin (ntfy.sh,
//    mesmo tópico das outras notificações, guardado só na env var NTFY_TOPIC)
//  - ipDe(): IP do visitante (só usado pra contar tentativas; nunca gravado)

const janelas = new Map();

function ipDe(event) {
  const h = (event && event.headers) || {};
  const ip = h["x-nf-client-connection-ip"] || (h["x-forwarded-for"] || "").split(",")[0].trim() || "desconhecido";
  return String(ip).slice(0, 64);
}

function limitar(chave, max, janelaMs) {
  const agora = Date.now();
  const lista = (janelas.get(chave) || []).filter((t) => agora - t < janelaMs);
  lista.push(agora);
  janelas.set(chave, lista);
  if (janelas.size > 5000) {
    for (const [k, v] of janelas) {
      if (!v.length || agora - v[v.length - 1] > janelaMs) janelas.delete(k);
    }
  }
  return { ok: lista.length <= max, count: lista.length };
}

// Só lê quantos eventos já houve na janela (não conta um novo).
function contar(chave, janelaMs) {
  const agora = Date.now();
  return (janelas.get(chave) || []).filter((t) => agora - t < janelaMs).length;
}

function zerar(chave) {
  janelas.delete(chave);
}

// IP mascarado pro alerta: dá pra reconhecer um padrão sem guardar dado pessoal completo.
function ipMascarado(ip) {
  if (ip.includes(".")) return ip.split(".").slice(0, 2).join(".") + ".x.x";
  return ip.split(":").slice(0, 2).join(":") + ":…";
}

async function alertarCelular(titulo, mensagem) {
  const topic = process.env.NTFY_TOPIC;
  if (!topic) {
    console.error("alertarCelular: NTFY_TOPIC nao configurado");
    return;
  }
  try {
    await fetch("https://ntfy.sh", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        topic,
        title: `🚨 ${titulo}`,
        message: mensagem,
        priority: 4,
        tags: ["rotating_light"],
      }),
    });
  } catch (err) {
    console.error("alertarCelular: falha ao enviar push:", err.message);
  }
}

module.exports = { ipDe, ipMascarado, limitar, contar, zerar, alertarCelular };
