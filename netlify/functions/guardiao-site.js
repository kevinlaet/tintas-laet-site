// "Guardião" do site: roda sozinho de 3 em 3 horas (agendado em netlify.toml),
// confere as páginas públicas e, se achar algo estranho, manda um push de ALTA
// prioridade pro celular do Kevin (ntfy.sh, tópico na env var NTFY_TOPIC).
// Sem problema = silêncio. Uma vez por dia (meio-dia UTC) manda um "tudo certo"
// curtinho só pra você saber que o guardião está vivo.
//
// O que ele confere em cada página:
//  1. abre normalmente (status 200)
//  2. só carrega script/iframe de origem conhecida (o nosso domínio + Google Tag Manager)
//  3. todo link de WhatsApp aponta pro número oficial (golpe clássico: trocam o número no site)
//  4. sem código embaralhado típico de invasão (eval(atob(...)), document.write(unescape(...)) etc.)
//  5. cabeçalhos de segurança presentes (X-Frame-Options / CSP)
// E do domínio: certificado HTTPS válido e com mais de 14 dias de vida.
//
// Só olha o que é público (o mesmo que qualquer visitante vê). Não lê nem guarda nada de cliente.

const tls = require("tls");
const { alertarCelular } = require("./lib/alerta");

const SITE = (process.env.GUARDIAO_SITE_URL || "https://tintaslaet.com").replace(/\/$/, "");
const NUMERO_OFICIAL = "5511977140964";
// Todos os telefones oficiais (mesma lista de site/canais-oficiais.js). Qualquer outro número
// aparecendo em tel:/WhatsApp/lista de canais = alerta.
const TELEFONES_OFICIAIS = new Set([
  "5511977140964", "5511980820686", "5511977504434", "5511977498813", "5511948551977",
  "5511914334875", "5511918755095", "5511948485925", "5511953189216", "5511948910470",
]);
const PAGINAS = ["/", "/produtos.html", "/produto.html?id=massa-corrida", "/linktree.html", "/lojas.html", "/curriculo.html", "/privacidade.html"];
const HOSTS_PERMITIDOS = new Set([
  "tintaslaet.com",
  "www.tintaslaet.com",
  "www.googletagmanager.com",
  "fonts.googleapis.com",
  "fonts.gstatic.com",
]);
const PADROES_SUSPEITOS = [
  /eval\s*\(\s*atob\s*\(/i,
  /document\.write\s*\(\s*unescape\s*\(/i,
  /String\.fromCharCode\s*\(\s*(\d+\s*,\s*){25,}/i,
  /atob\s*\(\s*['"][A-Za-z0-9+/=]{200,}['"]\s*\)/i,
];

function hostDe(url) {
  try {
    return new URL(url, SITE).host.toLowerCase();
  } catch (e) {
    return null;
  }
}

// Recebe o HTML de uma página e devolve a lista de problemas encontrados (vazia = ok).
function analisarPagina(html, caminho) {
  const problemas = [];

  for (const m of html.matchAll(/<(?:script|iframe)\b[^>]*\bsrc\s*=\s*["']([^"']+)["']/gi)) {
    const src = m[1];
    if (src.startsWith("data:") || src.startsWith("blob:")) {
      problemas.push(`${caminho}: recurso embutido suspeito (${src.slice(0, 30)}…)`);
      continue;
    }
    const host = hostDe(src);
    if (!host || !HOSTS_PERMITIDOS.has(host)) problemas.push(`${caminho}: carrega conteúdo de origem desconhecida: ${host || src.slice(0, 60)}`);
  }

  for (const m of html.matchAll(/wa\.me\/(\d+)/gi)) {
    if (!TELEFONES_OFICIAIS.has(m[1])) problemas.push(`${caminho}: link de WhatsApp com número FORA da lista oficial (${m[1]})`);
  }

  for (const m of html.matchAll(/href\s*=\s*["']tel:\+?(\d+)/gi)) {
    if (!TELEFONES_OFICIAIS.has(m[1])) problemas.push(`${caminho}: telefone que NÃO está na lista oficial (${m[1]})`);
  }

  for (const m of html.matchAll(/<form\b[^>]*\baction\s*=\s*["'](https?:\/\/[^"']+)["']/gi)) {
    const host = hostDe(m[1]);
    if (!host || !HOSTS_PERMITIDOS.has(host)) problemas.push(`${caminho}: formulário enviando dados pra fora: ${host}`);
  }

  for (const re of PADROES_SUSPEITOS) {
    if (re.test(html)) problemas.push(`${caminho}: código embaralhado suspeito (${re.source.slice(0, 25)}…)`);
  }

  return problemas;
}

async function baixar(caminho) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 12000);
  try {
    const res = await fetch(SITE + caminho, { signal: ctrl.signal, redirect: "follow", headers: { "User-Agent": "TintasLaet-Guardiao/1.0" } });
    const html = await res.text();
    return { status: res.status, html, headers: res.headers };
  } finally {
    clearTimeout(timer);
  }
}

function diasDoCertificado(host) {
  return new Promise((resolve) => {
    const socket = tls.connect({ host, port: 443, servername: host, timeout: 10000 }, () => {
      const cert = socket.getPeerCertificate();
      socket.end();
      if (!cert || !cert.valid_to) return resolve(null);
      resolve(Math.floor((new Date(cert.valid_to).getTime() - Date.now()) / 86400000));
    });
    socket.on("error", () => resolve(null));
    socket.on("timeout", () => {
      socket.destroy();
      resolve(null);
    });
  });
}

async function verificarTudo() {
  const problemas = [];

  for (const caminho of PAGINAS) {
    try {
      const { status, html, headers } = await baixar(caminho);
      if (status !== 200) {
        problemas.push(`${caminho}: respondeu ${status} (deveria abrir normal)`);
        continue;
      }
      problemas.push(...analisarPagina(html, caminho));
      if (caminho === "/" && !headers.get("x-frame-options") && !headers.get("content-security-policy")) {
        problemas.push("/: cabeçalhos de segurança sumiram (X-Frame-Options/CSP)");
      }
    } catch (err) {
      problemas.push(`${caminho}: não abriu (${err.name === "AbortError" ? "demorou demais" : err.message})`);
    }
  }

  try {
    const { status, html } = await baixar("/canais-oficiais.js");
    if (status !== 200) problemas.push(`/canais-oficiais.js: respondeu ${status}`);
    else {
      const achados = new Set([...html.matchAll(/\((\d{2})\)\s?(\d{4,5})-(\d{4})/g)].map((m) => "55" + m[1] + m[2] + m[3]));
      for (const n of achados) if (!TELEFONES_OFICIAIS.has(n)) problemas.push(`/canais-oficiais.js: número fora da lista oficial (${n})`);
      for (const n of TELEFONES_OFICIAIS) if (!achados.has(n)) problemas.push(`/canais-oficiais.js: número oficial sumiu (${n})`);
    }
  } catch (err) {
    problemas.push(`/canais-oficiais.js: não abriu (${err.message})`);
  }

  const host = hostDe(SITE);
  const dias = await diasDoCertificado(host);
  if (dias === null) problemas.push(`${host}: não consegui conferir o certificado HTTPS`);
  else if (dias < 14) problemas.push(`${host}: certificado HTTPS vence em ${dias} dia(s)`);

  return problemas;
}

exports.handler = async function () {
  try {
    const problemas = await verificarTudo();
    if (problemas.length) {
      await alertarCelular("Alerta de segurança do site", problemas.slice(0, 8).join("\n") + (problemas.length > 8 ? `\n…e mais ${problemas.length - 8}` : ""));
      return { statusCode: 200, body: "problemas encontrados: " + problemas.length };
    }
    if (new Date().getUTCHours() === 12) {
      await fetch("https://ntfy.sh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: process.env.NTFY_TOPIC, title: "✅ Site vigiado: tudo certo", message: "O guardião conferiu as páginas, os links de WhatsApp e o certificado. Nada estranho.", priority: 2, tags: ["white_check_mark"] }),
      }).catch(() => {});
    }
    return { statusCode: 200, body: "ok" };
  } catch (err) {
    console.error("guardiao-site: erro inesperado:", err);
    await alertarCelular("Guardião do site falhou", "O vigia automático teve um erro e não conseguiu conferir o site. Vale dar uma olhada nos logs do Netlify.");
    return { statusCode: 200, body: "erro tratado" };
  }
};

exports.analisarPagina = analisarPagina;
