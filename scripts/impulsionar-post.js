// Cria (e opcionalmente ativa) uma campanha de impulsionamento pra um post já publicado,
// via Meta Marketing API.
//
// DESENHO DE SEGURANÇA: "criar" nunca gasta dinheiro — só monta a campanha em modo PAUSADO.
// Gasto real só começa no comando "ativar", que deve ser rodado só depois do usuário confirmar
// orçamento e duração explicitamente na conversa. Nunca pular direto pra "ativar".
//
// Uso:
//   node --env-file=.env scripts/impulsionar-post.js criar <post-id> <facebook|instagram> <orcamento-total-reais> <dias> [loja-id] [raio-km] [campanha-existente-id]
//   node --env-file=.env scripts/impulsionar-post.js ativar <adset-id> <campaign-id>
//
// `loja-id` (opcional, ver LOJAS abaixo) restringe o anúncio a um raio ao redor daquela
// loja em vez do alvo antigo "Brasil, 18+" — mesma lógica implementada no painel
// (tintas-laet-painel/netlify/functions/lib/meta-ads.js e lib/lojas.js, mantida em sincronia
// manual aqui porque são repositórios/deploys separados). Sem loja-id, cai no alvo genérico.
//
// `campanha-existente-id` (opcional) anexa o novo conjunto de anúncios a uma campanha JÁ
// EXISTENTE em vez de criar uma campanha nova — é o que evita voltar a acumular uma campanha
// solta por impulso avulso (causa raiz das ~150 campanhas dispersas que a conta já tinha).
// Ver `_memoria/estrategia.md` — Fase 2 do plano de tráfego pago (campanhas A/B/C).
//
// Ver marketing/automacao-meta-setup.md para configurar o .env (precisa de META_AD_ACCOUNT_ID
// e um token com permissão ads_management, além das variáveis já usadas pra postar).

const GRAPH_VERSION = 'v21.0';

// Mesmos endereços da seção "Onde estamos" do site (site/index.html#enderecos) e do
// painel (tintas-laet-painel/netlify/functions/lib/lojas.js). A Loja 6 (São Bernardo do
// Campo) ainda não entra aqui — sem estoque, sem endereço de loja aberta ainda.
const LOJAS = [
  { id: 'vila-bela', nome: 'São Paulo — Vila Bela (Sapopemba)', endereco: 'Av. Sapopemba, 25723, Vila Bela, São Paulo, SP' },
  { id: 'jardim-sao-joao', nome: 'Mauá — Jardim São João', endereco: 'Rua do Britador, 2, Jardim São João, Mauá, SP' },
  { id: 'santa-cecilia', nome: 'Mauá — Jardim Santa Cecília', endereco: 'Av. Ayrton Senna da Silva, 235, Jardim Santa Cecília, Mauá, SP' },
  { id: 'vila-luzita', nome: 'Santo André — Vila Luzita', endereco: 'Av. São Bernardo do Campo, 757, Vila Luzita, Santo André, SP' },
  { id: 'itapark', nome: 'Mauá — Jardim Itapark', endereco: 'Av. Itapark, 4377, Jardim Itapark, Mauá, SP' },
];

const RAIO_PADRAO_KM = 8;

// Acha latitude/longitude de um endereço via busca da própria Meta — evita depender de
// um serviço de geocodificação externo. Retorna null se não achar (endereço mal escrito,
// instabilidade momentânea) — quem chama decide o que fazer, nunca trava a criação da campanha.
async function resolverLocalizacaoPorEndereco(endereco, token) {
  const query = new URLSearchParams({
    type: 'adgeolocation',
    location_types: JSON.stringify(['address']),
    q: endereco,
    access_token: token,
  });
  const resultado = await graphCall('GET', `search?${query.toString()}`);
  const primeiro = (resultado.data || [])[0];
  if (!primeiro || primeiro.latitude === undefined || primeiro.longitude === undefined) return null;
  return { latitude: primeiro.latitude, longitude: primeiro.longitude };
}

// Monta o alvo geográfico: raio ao redor da loja escolhida, ou "Brasil, 18+" se não
// escolher loja (post institucional/sorteio) ou se a busca do endereço falhar — nunca
// bloqueia a criação da campanha por causa disso, só cai pro alvo genérico.
async function montarSegmentacao(lojaId, raioKm, token) {
  const generico = { geo_locations: { countries: ['BR'] }, age_min: 18 };
  if (!lojaId) return generico;

  const loja = LOJAS.find((l) => l.id === lojaId);
  if (!loja) {
    console.log(`[impulsionar-post] AVISO: loja "${lojaId}" não encontrada em LOJAS — usando Brasil inteiro.`);
    return generico;
  }

  try {
    const local = await resolverLocalizacaoPorEndereco(loja.endereco, token);
    if (!local) throw new Error('endereço não encontrado');
    console.log(`[impulsionar-post] segmentação: raio de ${raioKm || RAIO_PADRAO_KM}km ao redor de "${loja.nome}"`);
    return {
      geo_locations: {
        custom_locations: [{ latitude: local.latitude, longitude: local.longitude, radius: raioKm || RAIO_PADRAO_KM, distance_unit: 'kilometer' }],
      },
      age_min: 18,
    };
  } catch (err) {
    console.log(`[impulsionar-post] AVISO: não foi possível localizar "${loja.nome}" (${err.message}) — usando Brasil inteiro.`);
    return generico;
  }
}

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
  const [, , , postId, rede, orcamentoStr, diasStr, lojaId, raioKmStr, campanhaExistenteId] = process.argv;
  if (!postId || !rede || !orcamentoStr || !diasStr) {
    fail('uso: impulsionar-post.js criar <post-id> <facebook|instagram> <orcamento-total-reais> <dias> [loja-id] [raio-km] [campanha-existente-id]');
  }
  if (!['facebook', 'instagram'].includes(rede)) fail('rede precisa ser "facebook" ou "instagram"');

  const orcamentoReais = Number(orcamentoStr);
  const dias = Number(diasStr);
  if (!Number.isFinite(orcamentoReais) || orcamentoReais <= 0) fail('orçamento inválido');
  if (!Number.isFinite(dias) || dias <= 0) fail('dias inválido');
  const raioKm = raioKmStr ? Number(raioKmStr) : undefined;
  if (raioKm !== undefined && (!Number.isFinite(raioKm) || raioKm <= 0)) fail('raio-km inválido');

  requireEnv(['META_PAGE_ACCESS_TOKEN', 'META_AD_ACCOUNT_ID', 'META_PAGE_ID']);
  const token = process.env.META_PAGE_ACCESS_TOKEN;
  const adAccount = process.env.META_AD_ACCOUNT_ID; // formato act_XXXXXXXXX
  const pageId = process.env.META_PAGE_ID;

  const dailyBudgetCentavos = Math.round((orcamentoReais / dias) * 100);
  const now = new Date();
  const end = new Date(now.getTime() + dias * 24 * 60 * 60 * 1000);
  const targeting = await montarSegmentacao(lojaId, raioKm, token);

  console.log(`[impulsionar-post] montando conjunto de anúncios PAUSADO — nada será cobrado ainda`);
  console.log(`[impulsionar-post] orçamento total: R$ ${orcamentoReais.toFixed(2)} em ${dias} dia(s) (R$ ${(dailyBudgetCentavos / 100).toFixed(2)}/dia)`);

  let campaignId = campanhaExistenteId;
  if (campaignId) {
    console.log(`[impulsionar-post] anexando a campanha existente: ${campaignId} (não cria campanha nova)`);
  } else {
    const campaign = await graphCall('POST', `${adAccount}/campaigns`, {
      name: `Impulsionamento ${postId} — ${now.toISOString().slice(0, 10)}`,
      objective: 'OUTCOME_ENGAGEMENT',
      status: 'PAUSED',
      special_ad_categories: [],
      access_token: token,
    });
    campaignId = campaign.id;
    console.log(`[impulsionar-post] campanha criada: ${campaignId}`);
  }

  const adset = await graphCall('POST', `${adAccount}/adsets`, {
    name: `Conjunto ${postId}`,
    campaign_id: campaignId,
    daily_budget: dailyBudgetCentavos,
    billing_event: 'IMPRESSIONS',
    optimization_goal: 'POST_ENGAGEMENT',
    bid_strategy: 'LOWEST_COST_WITHOUT_CAP',
    start_time: now.toISOString(),
    end_time: end.toISOString(),
    targeting: JSON.stringify(targeting),
    status: 'PAUSED',
    access_token: token,
  });
  console.log(`[impulsionar-post] conjunto de anúncios criado: ${adset.id}`);

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
  console.log(`Campanha: ${campaignId} | Conjunto: ${adset.id} | Anúncio: ${ad.id}`);
  console.log(`Pra ativar de verdade (começa o gasto): node --env-file=.env scripts/impulsionar-post.js ativar ${adset.id} ${campaignId}`);
  console.log(JSON.stringify({ campaignId, adsetId: adset.id, adId: ad.id, dailyBudgetCentavos }));
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
