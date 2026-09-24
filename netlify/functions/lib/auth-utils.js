// Helper compartilhado pelas functions que exigem login da area do vendedor
// (orcamento.html). Token = "<expiraEm>.<assinatura HMAC>", assinado com
// ORCAMENTO_AUTH_SECRET (variavel de ambiente da Netlify, nunca exposta ao
// navegador). Sem o segredo certo, nao da pra forjar um token valido.

const crypto = require('crypto');

const DURACAO_MS = 12 * 60 * 60 * 1000; // 12h — cobre um turno de trabalho

function gerarToken() {
  const segredo = process.env.ORCAMENTO_AUTH_SECRET;
  if (!segredo) return null;
  const expiraEm = Date.now() + DURACAO_MS;
  const assinatura = crypto.createHmac('sha256', segredo).update(String(expiraEm)).digest('hex');
  return `${expiraEm}.${assinatura}`;
}

function tokenValido(token) {
  const segredo = process.env.ORCAMENTO_AUTH_SECRET;
  if (!segredo || !token || typeof token !== 'string') return false;
  const [expiraEmStr, assinatura] = token.split('.');
  if (!expiraEmStr || !assinatura) return false;
  const expiraEm = parseInt(expiraEmStr, 10);
  if (!expiraEm || Date.now() > expiraEm) return false;

  const esperada = crypto.createHmac('sha256', segredo).update(expiraEmStr).digest('hex');
  const bufA = Buffer.from(assinatura);
  const bufB = Buffer.from(esperada);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

// Extrai o token do header Authorization: Bearer <token>
function extrairToken(event) {
  const auth = (event.headers && (event.headers.authorization || event.headers.Authorization)) || '';
  const match = auth.match(/^Bearer\s+(.+)$/i);
  return match ? match[1] : null;
}

module.exports = { gerarToken, tokenValido, extrairToken };
