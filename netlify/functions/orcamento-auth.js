// Login da "Area do vendedor" (site/orcamento.html). Antes, a senha ficava
// escrita direto no JavaScript da pagina -- qualquer um via "Ver codigo fonte"
// conseguia ler. Agora a senha real fica so aqui, numa variavel de ambiente
// da Netlify (ORCAMENTO_SENHA), e essa function devolve um token assinado
// (ver lib/auth-utils.js) que as outras functions sensiveis exigem.

const crypto = require('crypto');
const { gerarToken } = require('./lib/auth-utils');
const { ipDe, ipMascarado, limitar, contar, zerar, alertarCelular } = require('./lib/alerta');

// Compara pelo hash, em tempo constante -- um "!==" comum vaza, pelo tempo de
// resposta, quantas letras da senha o chute acertou.
function senhaConfere(informada, correta) {
  const a = crypto.createHash('sha256').update(String(informada)).digest();
  const b = crypto.createHash('sha256').update(String(correta)).digest();
  return crypto.timingSafeEqual(a, b);
}

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ ok: false, erro: 'method not allowed' }) };
  }

  const senhaCorreta = process.env.ORCAMENTO_SENHA;
  if (!senhaCorreta || !process.env.ORCAMENTO_AUTH_SECRET) {
    console.error('ORCAMENTO_SENHA ou ORCAMENTO_AUTH_SECRET nao configurada nas variaveis de ambiente da Netlify');
    return { statusCode: 200, body: JSON.stringify({ ok: false, erro: 'login nao configurado no servidor' }) };
  }

  // Trava por IP: 5 erros de senha em 15 min bloqueia todo acesso desse IP por 15 min
  // (mesmo chute certo) e avisa o Kevin no celular. O atraso de 600 ms sozinho
  // não segura chute em paralelo.
  const JANELA = 15 * 60 * 1000;
  const ip = ipDe(event);
  const chave = 'auth:' + ip;
  if (contar(chave, JANELA) >= 5) {
    return { statusCode: 429, body: JSON.stringify({ ok: false, erro: 'muitas tentativas, aguarde alguns minutos' }) };
  }

  try {
    const { senha } = JSON.parse(event.body || '{}');
    if (typeof senha !== 'string' || senha.length > 200) {
      return { statusCode: 400, body: JSON.stringify({ ok: false, erro: 'senha inválida' }) };
    }
    if (!senhaConfere(senha, senhaCorreta)) {
      const lim = limitar(chave, 5, JANELA);
      if (lim.count === 5) {
        await alertarCelular('Tentativas de senha na Área do vendedor', `5 erros de senha seguidos (${ipMascarado(ip)}). Bloqueei esse acesso por 15 minutos. Se não foi alguém da equipe, considere trocar a senha (ORCAMENTO_SENHA) no Netlify.`);
      }

      // Espera um pouco antes de responder: chutar senha em sequencia fica lento.
      await new Promise((resolve) => setTimeout(resolve, 600));
      return { statusCode: 200, body: JSON.stringify({ ok: false, erro: 'senha incorreta' }) };
    }

    zerar(chave);
    const token = gerarToken();
    return { statusCode: 200, body: JSON.stringify({ ok: true, token }) };
  } catch (err) {
    console.error('Erro no login do orcamento:', err);
    return { statusCode: 200, body: JSON.stringify({ ok: false, erro: 'erro interno' }) };
  }
};
