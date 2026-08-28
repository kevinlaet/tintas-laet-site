// Publica um carrossel (ou imagem única) na Página do Facebook via Meta Graph API.
// Uso: node --env-file=.env scripts/postar-facebook.js <pasta-do-conteudo> [slug-publico]
//
// Pré-requisito: as imagens já precisam estar publicadas em <SITE_URL>/images/posts/<slug>/slide-XX.png
// Ver marketing/automacao-meta-setup.md para configurar o .env.

const fs = require('fs');
const path = require('path');

const GRAPH_VERSION = 'v21.0';

function fail(msg) {
  console.error(`[postar-facebook] ${msg}`);
  process.exit(1);
}

function inferSlug(pasta) {
  const base = path.basename(pasta);
  return base.replace(/-\d{4}-\d{2}-\d{2}$/, '');
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

async function main() {
  const pasta = process.argv[2];
  const slugArg = process.argv[3];
  if (!pasta) fail('faltou o caminho da pasta de conteúdo. Uso: postar-facebook.js <pasta> [slug]');

  const token = process.env.META_PAGE_ACCESS_TOKEN;
  const pageId = process.env.META_PAGE_ID;
  const siteUrl = process.env.SITE_URL;
  if (!token || !pageId || !siteUrl) {
    fail('faltam variáveis no .env (META_PAGE_ACCESS_TOKEN, META_PAGE_ID, SITE_URL). Ver marketing/automacao-meta-setup.md');
  }

  const legendaPath = path.join(pasta, 'legenda.md');
  if (!fs.existsSync(legendaPath)) fail(`não achei ${legendaPath}`);
  const message = fs.readFileSync(legendaPath, 'utf8').trim();

  const instaDir = path.join(pasta, 'instagram');
  if (!fs.existsSync(instaDir)) fail(`não achei ${instaDir}`);
  const slides = fs.readdirSync(instaDir).filter((f) => /\.png$/i.test(f)).sort();
  if (slides.length === 0) fail(`nenhum PNG em ${instaDir}`);

  const slug = slugArg || inferSlug(pasta);
  const imageUrls = slides.map((f) => `${siteUrl.replace(/\/$/, '')}/images/posts/${slug}/${f}`);

  console.log(`[postar-facebook] slug: ${slug} | ${slides.length} slide(s)`);

  let postId;

  if (imageUrls.length === 1) {
    const photo = await graphPost(`${pageId}/photos`, {
      url: imageUrls[0],
      caption: message,
      access_token: token,
    });
    postId = photo.post_id || photo.id;
  } else {
    const attachedMedia = [];
    for (const url of imageUrls) {
      const photo = await graphPost(`${pageId}/photos`, {
        url,
        published: false,
        access_token: token,
      });
      attachedMedia.push({ media_fbid: photo.id });
      console.log(`[postar-facebook] foto enviada: ${photo.id}`);
    }
    const post = await graphPost(`${pageId}/feed`, {
      message,
      attached_media: JSON.stringify(attachedMedia),
      access_token: token,
    });
    postId = post.id;
  }

  const postUrl = `https://facebook.com/${postId}`;
  console.log(`[postar-facebook] publicado! post id: ${postId}`);
  console.log(`[postar-facebook] link: ${postUrl}`);

  console.log(JSON.stringify({ postId, permalink: postUrl }));
}

main().catch((err) => fail(err.message));
