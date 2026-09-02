// Recebe uma mensagem do chat interativo do gerador de orcamento
// (site/orcamento.html) e usa o Gemini (Google, cota gratuita) pra
// interpretar o pedido e devolver acoes de edicao da lista de produtos
// (adicionar, remover, alterar quantidade, alterar frete/desconto).
//
// O Gemini nunca calcula preco nem inventa dado tecnico de produto -- so
// interpreta o texto e devolve o que fazer. Quem resolve produto/variante/
// preco de verdade e o navegador, cruzando com o catalogo real (mesma logica
// ja usada em ler-pedido-foto.js).

const { tokenValido, extrairToken } = require('./lib/auth-utils');

const MODELO = 'gemini-3.6-flash';

const TIPOS_VALIDOS = ['adicionar', 'remover', 'alterar_qtd', 'alterar_frete', 'alterar_desconto'];

function montarPrompt({ mensagem, historico, itens, frete, desconto }) {
  const listaTexto = itens.length
    ? itens.map(it => `${it.index}: ${it.texto} — qtd ${it.qty}`).join('\n')
    : '(lista vazia)';

  const historicoTexto = historico.length
    ? historico.map(h => `${h.role === 'user' ? 'Vendedor' : 'Você'}: ${h.texto}`).join('\n')
    : '(sem mensagens anteriores)';

  return `Você ajuda um vendedor de loja de tintas a montar e editar, por chat, a lista de produtos de um orçamento.

Estado atual da lista de produtos (índice: descrição — qtd):
${listaTexto}

Frete atual: R$ ${frete.toFixed(2)}
Desconto atual: R$ ${desconto.toFixed(2)}

Histórico da conversa:
${historicoTexto}

Nova mensagem do vendedor: "${mensagem}"

Responda SOMENTE com um JSON no formato:
{"acoes": [...], "resposta": "..."}

Tipos de ação válidos em "acoes":
- {"tipo":"adicionar","produto":"nome do produto como o vendedor descreveu","quantidade":numero,"observacao":"cor/tamanho/detalhe, se tiver"} — um pra cada produto novo pedido
- {"tipo":"remover","index":numero} — remove o item daquele índice da lista atual
- {"tipo":"alterar_qtd","index":numero,"quantidade":numero} — muda a quantidade do item daquele índice
- {"tipo":"alterar_frete","valor":numero}
- {"tipo":"alterar_desconto","valor":numero}

Regras:
- Use os índices exatamente como aparecem na lista atual acima.
- Se o vendedor se referir a um item sem dizer o índice ("a lixa", "essa tinta"), identifique pelo texto e pelo histórico da conversa.
- Se o pedido for ambíguo ou faltar informação pra agir com segurança, não invente — deixe "acoes" vazio e pergunte na "resposta".
- "resposta" é uma mensagem curta, direta e simples confirmando o que foi feito ou pedindo o que falta — sem formalidade, como um colega de trabalho respondendo rápido no chat.
- Nunca informe preço, rendimento, diluição ou qualquer dado técnico de produto na "resposta" — isso não é sua função, o sistema calcula sozinho a partir do catálogo real. Se o vendedor perguntar algo assim, responda que isso não é com você e ele pode conferir na aba de produtos.
- Nunca invente produto que não foi pedido.`;
}

function sanitizarTexto(v, max) {
  return String(v == null ? '' : v).slice(0, max);
}

function validarAcoes(acoes) {
  if (!Array.isArray(acoes)) return [];
  return acoes
    .filter(a => a && TIPOS_VALIDOS.includes(a.tipo))
    .map(a => {
      switch (a.tipo) {
        case 'adicionar':
          return {
            tipo: 'adicionar',
            produto: sanitizarTexto(a.produto, 200),
            quantidade: Math.max(1, parseInt(a.quantidade, 10) || 1),
            observacao: sanitizarTexto(a.observacao, 200)
          };
        case 'remover':
        case 'alterar_qtd': {
          const index = parseInt(a.index, 10);
          if (Number.isNaN(index) || index < 0) return null;
          if (a.tipo === 'remover') return { tipo: 'remover', index };
          const quantidade = Math.max(1, parseInt(a.quantidade, 10) || 1);
          return { tipo: 'alterar_qtd', index, quantidade };
        }
        case 'alterar_frete':
        case 'alterar_desconto': {
          const valor = Math.max(0, parseFloat(a.valor) || 0);
          return { tipo: a.tipo, valor };
        }
        default:
          return null;
      }
    })
    .filter(Boolean)
    .slice(0, 30);
}

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
    const body = JSON.parse(event.body || '{}');
    const mensagem = sanitizarTexto(body.mensagem, 500).trim();
    if (!mensagem) {
      return { statusCode: 400, body: JSON.stringify({ ok: false, erro: 'mensagem vazia' }) };
    }

    const historico = Array.isArray(body.historico)
      ? body.historico.slice(-10).map(h => ({
          role: h && h.role === 'assistant' ? 'assistant' : 'user',
          texto: sanitizarTexto(h && h.texto, 300)
        }))
      : [];

    const itens = Array.isArray(body.itens)
      ? body.itens.slice(0, 60).map((it, i) => ({
          index: Number.isInteger(it.index) ? it.index : i,
          texto: sanitizarTexto(it.texto, 150) || '(sem produto selecionado)',
          qty: Math.max(0, parseFloat(it.qty) || 0)
        }))
      : [];

    const frete = Math.max(0, parseFloat(body.frete) || 0);
    const desconto = Math.max(0, parseFloat(body.desconto) || 0);

    const prompt = montarPrompt({ mensagem, historico, itens, frete, desconto });

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODELO}:generateContent?key=${apiKey}`;
    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
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
      return { statusCode: 200, body: JSON.stringify({ ok: false, erro: 'Gemini não retornou resposta' }) };
    }

    let resultado;
    try {
      resultado = JSON.parse(texto);
    } catch (e) {
      return { statusCode: 200, body: JSON.stringify({ ok: false, erro: 'Resposta do Gemini não veio em JSON válido' }) };
    }

    const acoes = validarAcoes(resultado.acoes);
    const resposta = sanitizarTexto(resultado.resposta, 500).trim() || 'Feito.';

    return { statusCode: 200, body: JSON.stringify({ ok: true, acoes, resposta }) };
  } catch (err) {
    console.error('Erro no chat do orçamento:', err);
    return { statusCode: 200, body: JSON.stringify({ ok: false, erro: 'erro interno ao processar a mensagem' }) };
  }
};
