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

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ ok: false, erro: 'method not allowed' }) };
  }

  if (!tokenValido(extrairToken(event))) {
    return { statusCode: 401, body: JSON.stringify({ ok: false, erro: 'sessão expirada, faça login de novo' }) };
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return { statusCode: 200, body: JSON.stringify({ ok: false, erro: 'GEMINI_API_KEY não configurada' }) };
  }

  try {
    const { imagemBase64, mimeType } = JSON.parse(event.body || '{}');
    if (!imagemBase64) {
      return { statusCode: 400, body: JSON.stringify({ ok: false, erro: 'imagem não enviada' }) };
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODELO}:generateContent?key=${apiKey}`;
    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: PROMPT },
            { inline_data: { mime_type: mimeType || 'image/jpeg', data: imagemBase64 } }
          ]
        }],
        generationConfig: { responseMimeType: 'application/json' }
      })
    });

    const data = await resp.json();
    if (!resp.ok) {
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
