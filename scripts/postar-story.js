// Publica um story (imagem ou vídeo) no Instagram via Meta Graph API.
// Uso: node --env-file=.env scripts/postar-story.js <pasta-do-conteudo> <imagem|video>
//
// Pré-requisito: o arquivo já precisa estar publicado em <SITE_URL>/images/stories/<slug>/ (foto)
// ou <SITE_URL>/videos/stories/<slug>/ (vídeo) — a Instagram Graph API só aceita URL pública.
// Ver marketing/automacao-meta-setup.md para configurar o .env.

const fs = require('fs');
const path = require('path');

const GRAPH_VERSION = 'v21.0';
const VIDEO_POLL_INTERVAL_MS = 5000;
const VIDEO_POLL_TIMEOUT_MS = 5 * 60 * 1000;

function fail(msg) {
  console.error(`[postar-story] ${msg}`);
  process.exit(1);
}

function inferSlug(pasta) {
  return path.basename(pasta);
}

async function graphPost(pathSegment, body) {
  const url = `https://graph.facebook.com/${GRAPH_VERSION}/${pathSegment}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!res.ok || json.error) {
    const msg = json.error ? `${json.error.message} (code ${json.error.code})` : res.statusText;
    throw new Error(msg);
  }
  return json;
}

async function graphGet(pathSegment) {
  const url = `https://graph.facebook.com/${GRAPH_VERSION}/${pathSegment}`;
  const res = await fetch(url);
  const json = await res.json();
  if (!res.ok || json.error) {
    const msg = json.error ? `${json.error.message} (code ${json.error.code})` : res.statusText;
    throw new Error(msg);
  }
  return json;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function findMediaFile(pasta, tipo) {
  const entries = fs.readdirSync(pasta);
  const pattern = tipo === 'video' ? /\.(mp4|mov)$/i : /\.(png|jpe?g)$/i;
  const found = entries.find((f) => pattern.test(f));
  if (!found) fail(`nenhum arquivo de ${tipo} encontrado em ${pasta}`);
  return found;
}

async function main() {
  const pasta = process.argv[2];
  const tipo = process.argv[3];
  if (!pasta || !['imagem', 'video'].includes(tipo)) {
    fail('uso: postar-story.js <pasta-do-conteudo> <imagem|video>');
  }

  const token = process.env.META_PAGE_ACCESS_TOKEN;
  const igUserId = process.env.META_IG_USER_ID;
  const siteUrl = process.env.SITE_URL;
  if (!token || !igUserId || !siteUrl) {
    fail('faltam variáveis no .env (META_PAGE_ACCESS_TOKEN, META_IG_USER_ID, SITE_URL). Ver marketing/automacao-meta-setup.md');
  }

  const slug = inferSlug(pasta);
  const arquivo = await findMediaFile(pasta, tipo);
  const base = siteUrl.replace(/\/$/, '');
  const mediaUrl = tipo === 'video'
    ? `${base}/videos/stories/${slug}/${arquivo}`
    : `${base}/images/stories/${slug}/${arquivo}`;

  console.log(`[postar-story] slug: ${slug} | tipo: ${tipo} | url: ${mediaUrl}`);

  const containerBody = { media_type: 'STORIES', access_token: token };
  if (tipo === 'video') {
    containerBody.video_url = mediaUrl;
  } else {
    containerBody.image_url = mediaUrl;
  }

  const container = await graphPost(`${igUserId}/media`, containerBody);
  console.log(`[postar-story] container criado: ${container.id}`);

  if (tipo === 'video') {
    console.log('[postar-story] aguardando processamento do vídeo...');
    const deadline = Date.now() + VIDEO_POLL_TIMEOUT_MS;
    let status = 'IN_PROGRESS';
    while (status === 'IN_PROGRESS') {
      if (Date.now() > deadline) {
        fail('timeout esperando o vídeo processar (5 min) — tentar publicar de novo depois com o mesmo comando');
      }
      await sleep(VIDEO_POLL_INTERVAL_MS);
      const check = await graphGet(`${container.id}?fields=status_code&access_token=${token}`);
      status = check.status_code;
      console.log(`[postar-story] status: ${status}`);
    }
    if (status !== 'FINISHED') {
      fail(`processamento do vídeo terminou com status inesperado: ${status}`);
    }
  }

  const published = await graphPost(`${igUserId}/media_publish`, {
    creation_id: container.id,
    access_token: token,
  });

  console.log(`[postar-story] publicado! story id: ${published.id}`);
  console.log(JSON.stringify({ storyId: published.id }));
}

main().catch((err) => fail(err.message));
