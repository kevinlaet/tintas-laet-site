// Recebe uma foto de pedido (escrito a mao ou print de conversa) do gerador de
// orcamento (site/orcamento.html) e usa o Gemini (Google, cota gratuita) pra
// extrair a lista de produtos/quantidades. O navegador nunca ve a chave da API
// -- ela fica so aqui, na variavel de ambiente GEMINI_API_KEY da Netlify.

const { tokenValido, extrairToken } = require('./lib/auth-utils');

const MODELO = 'gemini-3.6-flash';

const PROMPT = `Você está vendo uma foto de um pedido de tinta feito numa loja — pode ser uma anotação escrita à mão por um vendedor ou um print de uma conversa de WhatsApp com o cliente.

Leia a imagem e extraia cada produto pedido. Responda SOMENTE com um array JSON, sem texto antes ou depois, no formato:
[{"produto": "nome do produto como está escrito/lido", "quantidade": numero, "observacao": "cor, tamanho ou detalhe extra, se tiver"}]

Regras:
- Se não conseguir ler um item com certeza, inclua mesmo assim com o texto mais próximo que conseguir e quantidade 1.
- Se a quantidade não estiver escrita, assuma 1.
- Não invente produtos que não estão na imagem.
- Se a imagem não tiver nenhum pedido legível, responda com um array vazio: []`;

// Com o catálogo da loja no prompt, a própria IA escolhe produto e variante exatos
// (ex: "tinta branca emborrachada 3,7L" -> emborrachada / "Branco — 3,6L"), em vez
// do navegador tentar adivinhar pelo texto lido.
function promptComCatalogo(catalogo) {
  return `Você está vendo a foto de um pedido de uma loja de tintas — anotação escrita à mão por um vendedor ou print de conversa de WhatsApp com o cliente.

CATÁLOGO DA LOJA — uma linha por produto, no formato: id | nome | variantes separadas por " ; "
${catalogo}

Para cada produto pedido na imagem, encontre o produto e a variante corretos NESTE CATÁLOGO. Responda SOMENTE com um array JSON, sem texto antes ou depois, no formato:
[{"texto_lido": "o item como está escrito na imagem", "quantidade": numero, "produto_id": "id copiado exatamente do catálogo, ou vazio", "variante": "variante copiada exatamente do catálogo, ou vazio", "certeza": "alta" ou "baixa"}]

Como deduzir:
- Entenda o que o item é, não só as palavras soltas: "tinta branca emborrachada" é a Tinta Emborrachada na variante Branco; "rolo anti respingo 9" é o Rolo Anti-Respingo 9cm.
- Tamanho: lata ou balde = 18L (nas cores, 17L); galão = 3,6L (nas cores, 3,4L); quarto ou 1/4 = a variante de 1/4 ou 0,9L. Litragem escrita um pouco diferente do catálogo (ex: 3,7L, 3,5L, 20L) = o tamanho mais próximo que existir pra aquela cor.
- Cor: compare sem ligar pra acento ou maiúscula; "branca" = Branco. Nunca troque por outra cor parecida: se a cor escrita não existir nesse produto, deixe "variante" vazio e "certeza" baixa.
- Se o produto tem uma variante só, use ela.
- Lixa sem dizer o tipo (massa, madeira ou ferro): use a lixa de massa, com "certeza" baixa.
- "produto_id" e "variante" precisam ser cópias exatas do catálogo, caractere por caractere.
- Se o item não existir no catálogo, deixe "produto_id" vazio e escreva em "texto_lido" o que leu.
- "certeza" alta só quando produto, cor e tamanho estão claros na imagem (ou o produto tem variante única); se precisou chutar algo, baixa.
- Quantidade não escrita = 1. Não invente itens que não estão na imagem. Sem pedido legível: [].`;
}

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ ok: false, erro: 'method not allowed' }) };
  }

  // Sem login valido nao gasta cota do Gemini.
  if (!tokenValido(extrairToken(event))) {
    return { statusCode: 401, body: JSON.stringify({ ok: false, erro: 'não autorizado' }) };
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return { statusCode: 200, body: JSON.stringify({ ok: false, erro: 'GEMINI_API_KEY não configurada' }) };
  }

  try {
    const { imagemBase64, mimeType, catalogo } = JSON.parse(event.body || '{}');
    const usarCatalogo = typeof catalogo === 'string' && catalogo.length > 0 && catalogo.length <= 150000;
    if (!imagemBase64 || typeof imagemBase64 !== 'string') {
      return { statusCode: 400, body: JSON.stringify({ ok: false, erro: 'imagem não enviada' }) };
    }
    if (imagemBase64.length > 5 * 1024 * 1024) {
      return { statusCode: 413, body: JSON.stringify({ ok: false, erro: 'imagem grande demais' }) };
    }
    if (mimeType && !/^image\/(jpeg|png|webp|heic|heif)$/.test(mimeType)) {
      return { statusCode: 400, body: JSON.stringify({ ok: false, erro: 'tipo de arquivo não aceito' }) };
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODELO}:generateContent`;
    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: usarCatalogo ? promptComCatalogo(catalogo) : PROMPT },
            { inline_data: { mime_type: mimeType || 'image/jpeg', data: imagemBase64 } }
          ]
        }],
        generationConfig: { responseMimeType: 'application/json' }
      })
    });

    const data = await resp.json().catch(() => ({}));
    if (!resp.ok) {
      // Cota gratuita do Gemini: 503 (modelo sobrecarregado) e 429 (limite de uso) passam
      // sozinhos em segundos/minutos — o navegador tenta de novo quando vê "temporario".
      if (resp.status === 503 || resp.status === 429 || resp.status === 500) {
        const erro = resp.status === 429
          ? 'o limite de uso gratuito da IA foi atingido por agora'
          : 'a IA do Google está sobrecarregada no momento';
        return { statusCode: 200, body: JSON.stringify({ ok: false, temporario: true, erro }) };
      }
      const msg = (data.error && data.error.message) || 'erro desconhecido do Gemini';
      return { statusCode: 200, body: JSON.stringify({ ok: false, erro: msg }) };
    }

    const texto = data.candidates && data.candidates[0] && data.candidates[0].content &&
      data.candidates[0].content.parts && data.candidates[0].content.parts[0] &&
      data.candidates[0].content.parts[0].text;

    if (!texto) {
      return { statusCode: 200, body: JSON.stringify({ ok: false, erro: 'Gemini não retornou leitura da imagem' }) };
    }

    let itens;
    try {
      itens = JSON.parse(texto);
    } catch (e) {
      return { statusCode: 200, body: JSON.stringify({ ok: false, erro: 'Resposta do Gemini não veio em JSON válido' }) };
    }

    if (!Array.isArray(itens)) {
      return { statusCode: 200, body: JSON.stringify({ ok: false, erro: 'Formato inesperado na resposta do Gemini' }) };
    }

    return { statusCode: 200, body: JSON.stringify({ ok: true, itens }) };
  } catch (err) {
    console.error('Erro ao ler foto do pedido:', err);
    return { statusCode: 200, body: JSON.stringify({ ok: false, erro: 'erro interno ao processar a foto' }) };
  }
};
