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
const PAGINAS = ["/", "/produtos.html", "/produto.html?id=massa-corrida", "/linktree.html", "/curriculo.html", "/privacidade.html"];
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
    if (m[1] !== NUMERO_OFICIAL) problemas.push(`${caminho}: link de WhatsApp com número DIFERENTE do oficial (${m[1]})`);
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
