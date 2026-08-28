// Publica um carrossel (ou imagem única) no Instagram via Meta Graph API.
// Uso: node --env-file=.env scripts/postar-instagram.js <pasta-do-conteudo> [slug-publico]
//
// Pré-requisito: as imagens já precisam estar publicadas em <SITE_URL>/images/posts/<slug>/slide-XX.png
// (a Instagram Graph API só aceita image_url pública, não upload direto de arquivo).
// Ver marketing/automacao-meta-setup.md para configurar o .env.

const fs = require('fs');
const path = require('path');

const GRAPH_VERSION = 'v21.0';

function fail(msg) {
  console.error(`[postar-instagram] ${msg}`);
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
  if (!pasta) fail('faltou o caminho da pasta de conteúdo. Uso: postar-instagram.js <pasta> [slug]');

  const token = process.env.META_PAGE_ACCESS_TOKEN;
  const igUserId = process.env.META_IG_USER_ID;
  const siteUrl = process.env.SITE_URL;
  if (!token || !igUserId || !siteUrl) {
    fail('faltam variáveis no .env (META_PAGE_ACCESS_TOKEN, META_IG_USER_ID, SITE_URL). Ver marketing/automacao-meta-setup.md');
  }

  const legendaPath = path.join(pasta, 'legenda.md');
  if (!fs.existsSync(legendaPath)) fail(`não achei ${legendaPath}`);
  const caption = fs.readFileSync(legendaPath, 'utf8').trim();

  const instaDir = path.join(pasta, 'instagram');
  if (!fs.existsSync(instaDir)) fail(`não achei ${instaDir}`);
  const slides = fs.readdirSync(instaDir).filter((f) => /\.png$/i.test(f)).sort();
  if (slides.length === 0) fail(`nenhum PNG em ${instaDir}`);

  const slug = slugArg || inferSlug(pasta);
  const imageUrls = slides.map((f) => `${siteUrl.replace(/\/$/, '')}/images/posts/${slug}/${f}`);

  console.log(`[postar-instagram] slug: ${slug} | ${slides.length} slide(s)`);

  let creationId;

  if (imageUrls.length === 1) {
    const container = await graphPost(`${igUserId}/media`, {
      image_url: imageUrls[0],
      caption,
      access_token: token,
    });
    creationId = container.id;
  } else {
    const itemIds = [];
    for (const url of imageUrls) {
      const item = await graphPost(`${igUserId}/media`, {
        image_url: url,
        is_carousel_item: true,
        access_token: token,
      });
      itemIds.push(item.id);
      console.log(`[postar-instagram] item criado: ${item.id}`);
    }
    const carousel = await graphPost(`${igUserId}/media`, {
      media_type: 'CAROUSEL',
      children: itemIds,
      caption,
      access_token: token,
    });
    creationId = carousel.id;
  }

  console.log(`[postar-instagram] container pronto: ${creationId} — publicando...`);

  const published = await graphPost(`${igUserId}/media_publish`, {
    creation_id: creationId,
    access_token: token,
  });

  const permalinkRes = await fetch(
    `https://graph.facebook.com/${GRAPH_VERSION}/${published.id}?fields=permalink&access_token=${token}`
  );
  const permalinkJson = await permalinkRes.json();

  console.log(`[postar-instagram] publicado! post id: ${published.id}`);
  if (permalinkJson.permalink) console.log(`[postar-instagram] link: ${permalinkJson.permalink}`);

  console.log(JSON.stringify({ postId: published.id, permalink: permalinkJson.permalink || null }));
}

main().catch((err) => fail(err.message));
