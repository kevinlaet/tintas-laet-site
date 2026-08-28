// Cria (e opcionalmente ativa) uma campanha de impulsionamento pra um post já publicado,
// via Meta Marketing API.
//
// DESENHO DE SEGURANÇA: "criar" nunca gasta dinheiro — só monta a campanha em modo PAUSADO.
// Gasto real só começa no comando "ativar", que deve ser rodado só depois do usuário confirmar
// orçamento e duração explicitamente na conversa. Nunca pular direto pra "ativar".
//
// Uso:
//   node --env-file=.env scripts/impulsionar-post.js criar <post-id> <facebook|instagram> <orcamento-total-reais> <dias>
//   node --env-file=.env scripts/impulsionar-post.js ativar <adset-id> <campaign-id>
//
// Ver marketing/automacao-meta-setup.md para configurar o .env (precisa de META_AD_ACCOUNT_ID
// e um token com permissão ads_management, além das variáveis já usadas pra postar).

const GRAPH_VERSION = 'v21.0';

function fail(msg) {
  console.error(`[impulsionar-post] ${msg}`);
  process.exit(1);
}

async function graphCall(method, pathSegment, body) {
  const url = `https://graph.facebook.com/${GRAPH_VERSION}/${pathSegment}`;
  const opts = { method };
  if (method === 'POST') {
    opts.headers = { 'Content-Type': 'application/json' };
    opts.body = JSON.stringify(body);
  }
  const res = await fetch(url, opts);
  const json = await res.json();
  if (!res.ok || json.error) {
    const msg = json.error ? `${json.error.message} (code ${json.error.code})` : res.statusText;
    throw new Error(msg);
  }
  return json;
}

function requireEnv(names) {
  const missing = names.filter((n) => !process.env[n]);
  if (missing.length) {
    fail(`faltam variáveis no .env: ${missing.join(', ')}. Ver marketing/automacao-meta-setup.md`);
  }
}

async function criar() {
  const [, , , postId, rede, orcamentoStr, diasStr] = process.argv;
  if (!postId || !rede || !orcamentoStr || !diasStr) {
    fail('uso: impulsionar-post.js criar <post-id> <facebook|instagram> <orcamento-total-reais> <dias>');
  }
  if (!['facebook', 'instagram'].includes(rede)) fail('rede precisa ser "facebook" ou "instagram"');

  const orcamentoReais = Number(orcamentoStr);
  const dias = Number(diasStr);
  if (!Number.isFinite(orcamentoReais) || orcamentoReais <= 0) fail('orçamento inválido');
  if (!Number.isFinite(dias) || dias <= 0) fail('dias inválido');

  requireEnv(['META_PAGE_ACCESS_TOKEN', 'META_AD_ACCOUNT_ID', 'META_PAGE_ID']);
  const token = process.env.META_PAGE_ACCESS_TOKEN;
  const adAccount = process.env.META_AD_ACCOUNT_ID; // formato act_XXXXXXXXX
  const pageId = process.env.META_PAGE_ID;

  const dailyBudgetCentavos = Math.round((orcamentoReais / dias) * 100);
  const now = new Date();
  const end = new Date(now.getTime() + dias * 24 * 60 * 60 * 1000);

  console.log(`[impulsionar-post] montando campanha PAUSADA — nada será cobrado ainda`);
  console.log(`[impulsionar-post] orçamento total: R$ ${orcamentoReais.toFixed(2)} em ${dias} dia(s) (R$ ${(dailyBudgetCentavos / 100).toFixed(2)}/dia)`);

  const campaign = await graphCall('POST', `${adAccount}/campaigns`, {
    name: `Impulsionamento ${postId} — ${now.toISOString().slice(0, 10)}`,
    objective: 'OUTCOME_ENGAGEMENT',
    status: 'PAUSED',
    special_ad_categories: [],
    access_token: token,
  });
  console.log(`[impulsionar-post] campanha criada: ${campaign.id}`);

  const adset = await graphCall('POST', `${adAccount}/adsets`, {
    name: `Conjunto ${postId}`,
    campaign_id: campaign.id,
    daily_budget: dailyBudgetCentavos,
    billing_event: 'IMPRESSIONS',
    optimization_goal: 'POST_ENGAGEMENT',
    bid_strategy: 'LOWEST_COST_WITHOUT_CAP',
    start_time: now.toISOString(),
    end_time: end.toISOString(),
    targeting: JSON.stringify({
      geo_locations: { countries: ['BR'] },
      age_min: 18,
    }),
    status: 'PAUSED',
    access_token: token,
  });
  console.log(`[impulsionar-post] conjunto de anúncios criado: ${adset.id}`);
  console.log('[impulsionar-post] AVISO: segmentação default é só "Brasil, 18+" — ajustar pra raio das lojas / interesses antes de ativar campanhas maiores.');

  const creativeBody = { access_token: token };
  if (rede === 'facebook') {
    creativeBody.object_story_id = `${pageId}_${postId}`;
  } else {
    creativeBody.source_instagram_media_id = postId;
  }
  const creative = await graphCall('POST', `${adAccount}/adcreatives`, creativeBody);
  console.log(`[impulsionar-post] criativo criado: ${creative.id}`);

  const ad = await graphCall('POST', `${adAccount}/ads`, {
    name: `Anúncio ${postId}`,
    adset_id: adset.id,
    creative: JSON.stringify({ creative_id: creative.id }),
    status: 'PAUSED',
    access_token: token,
  });
  console.log(`[impulsionar-post] anúncio criado: ${ad.id}`);

  console.log('');
  console.log('=== RASCUNHO PRONTO — NADA FOI COBRADO ===');
  console.log(`Campanha: ${campaign.id} | Conjunto: ${adset.id} | Anúncio: ${ad.id}`);
  console.log(`Pra ativar de verdade (começa o gasto): node --env-file=.env scripts/impulsionar-post.js ativar ${adset.id} ${campaign.id}`);
  console.log(JSON.stringify({ campaignId: campaign.id, adsetId: adset.id, adId: ad.id, dailyBudgetCentavos }));
}

async function ativar() {
  const [, , , adsetId, campaignId] = process.argv;
  if (!adsetId || !campaignId) fail('uso: impulsionar-post.js ativar <adset-id> <campaign-id>');

  requireEnv(['META_PAGE_ACCESS_TOKEN']);
  const token = process.env.META_PAGE_ACCESS_TOKEN;

  await graphCall('POST', `${campaignId}`, { status: 'ACTIVE', access_token: token });
  await graphCall('POST', `${adsetId}`, { status: 'ACTIVE', access_token: token });

  console.log(`[impulsionar-post] ATIVADO — campanha ${campaignId} e conjunto ${adsetId} agora estão rodando e gastando.`);
}

async function main() {
  const comando = process.argv[2];
  if (comando === 'criar') return criar();
  if (comando === 'ativar') return ativar();
  fail('primeiro argumento precisa ser "criar" ou "ativar"');
}

main().catch((err) => fail(err.message));
