// Gera o folder "Guia da Pintura" (A4, 3 dobras) com os preços ATUAIS do site.
//
// Uso:  node scripts/folder-precos/gerar.js [AAAA-MM] [--modelo livro|3dobras]
//   - modelo padrão: livro (A4 dobrado ao meio, 4 páginas A5 — mais barato)
//     3dobras: A4 em 3 dobras (6 painéis)
//   - lê o modelo em templates/folder-guia-pintura[-livro]/folder.html
//   - cada preço do modelo é um elemento com data-preco="id-do-produto|tamanho", que bate
//     com o objeto `produtos` de site/produto.html (id + campo `desc` de `precos`)
//   - confere se os endereços do folder batem com a seção "Onde estamos" do site
//   - grava em saidas/folder-guia-pintura[-livro]-AAAA-MM/ e gera o PDF da gráfica + prévias
//   - mostra o que mudou de preço em relação ao último folder gerado
//
// Nunca editar preço direto no folder gerado: a próxima rodada sobrescreve. Se o preço do
// site estiver errado, corrigir no site (ou com /precos-pigmento) e rodar de novo.
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const RAIZ = path.resolve(__dirname, '..', '..');
const MODELOS = {
  livro: { pasta: 'folder-guia-pintura-livro', saida: 'folder-guia-pintura-livro' },
  '3dobras': { pasta: 'folder-guia-pintura', saida: 'folder-guia-pintura' },
};

function carregarProdutos() {
  const s = fs.readFileSync(path.join(RAIZ, 'site', 'produto.html'), 'utf8');
  const ini = s.indexOf('const produtos = {');
  const fim = s.indexOf('const upsellMap');
  if (ini < 0 || fim < 0) throw new Error('Não achei o objeto `produtos` em site/produto.html');
  const ctx = {};
  new Function('ctx', s.slice(ini, fim).replace('const produtos', 'ctx.produtos'))(ctx);
  return ctx.produtos;
}

function precoDe(produtos, id, desc) {
  const p = produtos[id];
  if (!p) return { erro: `produto "${id}" não existe mais no site` };
  const linha = (p.precos || []).find((x) => x.desc === desc);
  if (!linha) return { erro: `"${id}" não tem mais o tamanho "${desc}" (tem: ${(p.precos || []).map((x) => x.desc).join(' / ')})` };
  return { valor: linha.valor.replace(/\s+/g, ' ').trim() };
}

function precosDoHtml(html) {
  const mapa = {};
  for (const m of html.matchAll(/data-preco="([^"]+)"[^>]*>([^<]*)</g)) mapa[m[1]] = m[2];
  return mapa;
}

function ultimoFolderGerado(prefixo, excetoDir) {
  const saidas = path.join(RAIZ, 'saidas');
  const dirs = fs.readdirSync(saidas)
    .filter((d) => new RegExp(`^${prefixo}-\\d{4}-\\d{2}$`).test(d) && path.join(saidas, d) !== excetoDir)
    .sort();
  for (const d of dirs.reverse()) {
    const f = path.join(saidas, d, 'folder.html');
    if (fs.existsSync(f)) return { nome: d, html: fs.readFileSync(f, 'utf8') };
  }
  return null;
}

function conferirEnderecos(htmlFolder) {
  const idx = fs.readFileSync(path.join(RAIZ, 'site', 'index.html'), 'utf8');
  const doSite = [...idx.matchAll(/class="location-address">([^<]+)</g)].map((m) => m[1].split(' — ')[0].trim());
  const avisos = [];
  for (const end of doSite) if (!htmlFolder.includes(end)) avisos.push(`endereço do site não está no folder: "${end}"`);
  // telefones por loja (quando o site tiver): cada um precisa aparecer no folder
  for (const m of idx.matchAll(/class="location-phone">[^<]*<a[^>]*>([^<]+)</g)) {
    if (!htmlFolder.includes(m[1].trim())) avisos.push(`telefone do site não está no folder: "${m[1].trim()}"`);
  }
  const qtdFolder = (htmlFolder.match(/class="loja[" ]/g) || []).length;
  if (qtdFolder !== doSite.length) avisos.push(`o site tem ${doSite.length} lojas e o folder tem ${qtdFolder}`);
  return avisos;
}

function copiarPasta(de, para) {
  fs.mkdirSync(para, { recursive: true });
  for (const item of fs.readdirSync(de)) {
    const a = path.join(de, item), b = path.join(para, item);
    if (fs.statSync(a).isDirectory()) copiarPasta(a, b); else fs.copyFileSync(a, b);
  }
}

(function main() {
  const hoje = new Date();
  const args = process.argv.slice(2);
  const iMod = args.indexOf('--modelo');
  const nomeModelo = iMod >= 0 ? args.splice(iMod, 2)[1] : 'livro';
  const modelo = MODELOS[nomeModelo];
  if (!modelo) { console.error(`Modelo inválido: ${nomeModelo}. Use: ${Object.keys(MODELOS).join(' | ')}`); process.exit(1); }
  const MODELO = path.join(RAIZ, 'templates', modelo.pasta);
  const mes = args[0] || `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}`;
  if (!/^\d{4}-\d{2}$/.test(mes)) { console.error('Mês inválido. Use AAAA-MM, ex: 2026-11'); process.exit(1); }
  const data = hoje.toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' });
  const destino = path.join(RAIZ, 'saidas', `${modelo.saida}-${mes}`);

  const produtos = carregarProdutos();
  let html = fs.readFileSync(path.join(MODELO, 'folder.html'), 'utf8');

  const erros = [];
  html = html.replace(/(data-preco="([^"|]+)\|([^"]+)"[^>]*>)[^<]*(<)/g, (_, abre, id, desc, fecha) => {
    const r = precoDe(produtos, id, desc);
    if (r.erro) { erros.push(r.erro); return abre + '???' + fecha; }
    return abre + r.valor + fecha;
  });
  html = html.replace(/\{\{DATA\}\}/g, data);

  if (erros.length) {
    console.error('\n✗ Folder NÃO gerado — o modelo pede preço que o site não tem mais:\n');
    erros.forEach((e) => console.error('  - ' + e));
    console.error('\nAjustar o data-preco em templates/folder-guia-pintura/folder.html e rodar de novo.\n');
    process.exit(1);
  }

  const avisos = conferirEnderecos(html);

  const anterior = ultimoFolderGerado(modelo.saida, destino);
  const mudancas = [];
  if (anterior) {
    const antes = precosDoHtml(anterior.html), agora = precosDoHtml(html);
    for (const k of Object.keys(agora)) if (antes[k] && antes[k] !== agora[k]) mudancas.push(`${k.replace('|', ' · ')}: ${antes[k]} → ${agora[k]}`);
  }

  copiarPasta(MODELO, destino);
  fs.writeFileSync(path.join(destino, 'folder.html'), html);

  const env = { ...process.env };
  const chromeNuvem = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
  if (!env.PW_EXEC && fs.existsSync(chromeNuvem)) env.PW_EXEC = chromeNuvem;
  execFileSync(process.execPath, [path.join(destino, 'render.js')], { stdio: 'inherit', env });

  console.log(`\n✅ Folder (${nomeModelo}) gerado em saidas/${modelo.saida}-${mes}/ (preços de ${data})`);
  console.log(`   ${Object.keys(precosDoHtml(html)).length} preços puxados do site.`);
  if (anterior) {
    console.log(mudancas.length ? `\nMudou de preço desde ${anterior.nome}:` : `\nNenhum preço mudou desde ${anterior.nome}.`);
    mudancas.forEach((m) => console.log('  - ' + m));
  }
  if (avisos.length) { console.log('\n⚠ Conferir endereços:'); avisos.forEach((a) => console.log('  - ' + a)); }
})();
