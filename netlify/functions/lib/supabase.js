// Só uma operação aqui: registrar mensagem do chat/"Trabalhe Conosco" pra
// rastrear "ainda sem resposta" no painel (tintas-laet-painel). Usa a chave
// ANON do Supabase (não a de serviço) porque essa função roda num site
// público — a chave anon só consegue INSERIR nessa tabela, protegido por RLS
// (ver README/SQL da migração), nunca ler ou mudar nada do banco.

function supabaseUrl() {
  const url = process.env.SUPABASE_URL;
  if (!url) throw new Error("SUPABASE_URL ausente.");
  return url.replace(/\/$/, "");
}

async function registrarMensagemSite({ tipo, nome, contato, mensagem }) {
  const key = process.env.SUPABASE_ANON_KEY;
  if (!key) throw new Error("SUPABASE_ANON_KEY ausente.");

  const res = await fetch(`${supabaseUrl()}/rest/v1/mensagens_site`, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({ tipo, nome: nome || null, contato: contato || null, mensagem }),
  });
  if (!res.ok) {
    const texto = await res.text();
    throw new Error(`Supabase mensagens_site: ${res.status} ${texto}`);
  }
}

module.exports = { registrarMensagemSite };
