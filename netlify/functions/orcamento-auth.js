// Login da "Area do vendedor" (site/orcamento.html). Antes, a senha ficava
// escrita direto no JavaScript da pagina -- qualquer um via "Ver codigo fonte"
// conseguia ler. Agora a senha real fica so aqui, numa variavel de ambiente
// da Netlify (ORCAMENTO_SENHA), e essa function devolve um token assinado
// (ver lib/auth-utils.js) que as outras functions sensiveis exigem.

const { gerarToken } = require('./lib/auth-utils');

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ ok: false, erro: 'method not allowed' }) };
  }

  const senhaCorreta = process.env.ORCAMENTO_SENHA;
  if (!senhaCorreta || !process.env.ORCAMENTO_AUTH_SECRET) {
    console.error('ORCAMENTO_SENHA ou ORCAMENTO_AUTH_SECRET nao configurada nas variaveis de ambiente da Netlify');
    return { statusCode: 200, body: JSON.stringify({ ok: false, erro: 'login nao configurado no servidor' }) };
  }

  try {
    const { senha } = JSON.parse(event.body || '{}');
    if (senha !== senhaCorreta) {
      return { statusCode: 200, body: JSON.stringify({ ok: false, erro: 'senha incorreta' }) };
    }

    const token = gerarToken();
    return { statusCode: 200, body: JSON.stringify({ ok: true, token }) };
  } catch (err) {
    console.error('Erro no login do orcamento:', err);
    return { statusCode: 200, body: JSON.stringify({ ok: false, erro: 'erro interno' }) };
  }
};
