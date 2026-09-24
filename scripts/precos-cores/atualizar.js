// Recalcula o preço de cada cor (base + pote de pigmento) a partir de
// scripts/precos-cores/tabela.js e grava em produto.html e nos catálogos.
//
//   node scripts/precos-cores/atualizar.js            → só mostra o que muda
//   node scripts/precos-cores/atualizar.js --aplicar  → grava nos arquivos
//
// O orçamento (orcamento.html) lê os preços direto de produto.html,
// então atualiza junto automaticamente.

const fs = require('fs');
const path = require('path');
const { bases, tabelaDoProduto, catalogos, apelidos, pigmentos } = require('./tabela');

const RAIZ = path.join(__dirname, '..', '..');
const APLICAR = process.argv.includes('--aplicar');
const TAMANHOS = ['balde', 'galao', 'quarto'];

function chave(nome) {
  const semAcento = nome.normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase().trim();
  const n = apelidos[semAcento] || semAcento;
  return n.replace(/[^A-Z0-9]/g, '');
}

function lerPreco(str) {
  return parseFloat(str.replace(/[^\d,]/g, '').replace(',', '.'));
}

function formatar(n) {
  const [int, dec] = n.toFixed(2).split('.');
  return 'R$ ' + int.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ',' + dec;
}

const indices = {};
for (const [tabela, linhas] of Object.entries(pigmentos)) {
  indices[tabela] = {};
  for (const [nome, base, balde, galao, quarto] of linhas) {
    indices[tabela][chave(nome)] = { base, balde, galao, quarto };
  }
}

// Recalcula as linhas de cor de um trecho de texto.
// campo(t) devolve o nome da chave de preço no arquivo (preco_balde ou balde).
function recalcular(texto, produto, campo, relatorio, arquivo) {
  const base = bases[produto];
  const pigs = indices[tabelaDoProduto[produto]];
  return texto.replace(/\{ nome: '([^']+)'[^\n]*\}/g, (linha, nome) => {
    const ehBranco = /^branc/i.test(nome);
    const pig = ehBranco ? { balde: 0, galao: 0, quarto: 0 } : pigs[chave(nome)];
    let nova = linha;
    for (const t of TAMANHOS) {
      const re = new RegExp(`(${campo(t)}: ')(R\\$ [\\d.,]+)(')`);
      const m = linha.match(re);
      if (!m) continue;
      const antigo = lerPreco(m[2]);
      let novo = null;
      let obs = '';
      if (!pig) obs = 'cor sem pigmento na tabela — mantido';
      else if (pig[t] == null) obs = 'sem pote nesse tamanho — mantido';
      else if (base[t] == null) obs = 'sem base nesse tamanho — mantido';
      else novo = Math.round((base[t] + pig[t]) * 100) / 100;
      if (novo != null && Math.abs(novo - antigo) > 0.001) {
        nova = nova.replace(re, `$1${formatar(novo)}$3`);
      }
      relatorio.push({ arquivo, produto, nome, tamanho: t, antigo, novo, obs });
    }
    return nova;
  });
}

const relatorio = [];
const alterados = {};

// produto.html
const arqProduto = path.join(RAIZ, 'site/produto.html');
let src = fs.readFileSync(arqProduto, 'utf8');
for (const produto of Object.keys(bases)) {
  if (!bases[produto]) continue;
  const ini = src.indexOf(`\n  '${produto}': {`);
  if (ini < 0) { console.warn('Produto não encontrado em produto.html:', produto); continue; }
  const fim = src.indexOf('\n  }', ini + 1);
  const bloco = src.slice(ini, fim);
  const novo = recalcular(bloco, produto, t => `preco_${t}`, relatorio, 'produto.html');
  src = src.slice(0, ini) + novo + src.slice(fim);
}
alterados[arqProduto] = src;

// catálogos
for (const [produto, rel] of Object.entries(catalogos)) {
  if (!bases[produto]) continue;
  const arq = path.join(RAIZ, rel);
  const texto = fs.readFileSync(arq, 'utf8');
  alterados[arq] = recalcular(texto, produto, t => t, relatorio, rel);
}

// Resumo
const mudancas = relatorio.filter(r => r.novo != null && Math.abs(r.novo - r.antigo) > 0.001);
const mantidos = relatorio.filter(r => r.obs);
const dosProdutos = mudancas.filter(r => r.arquivo === 'produto.html');
console.log(`Preços que mudam em produto.html: ${dosProdutos.length}`);
console.log(`Preços que mudam nos catálogos: ${mudancas.length - dosProdutos.length}`);
const unicosMantidos = [...new Set(mantidos.filter(r => r.arquivo === 'produto.html').map(r => `${r.produto} | ${r.nome} | ${r.tamanho}: ${r.obs}`))];
if (unicosMantidos.length) {
  console.log('\nMantidos sem recalcular:');
  unicosMantidos.forEach(l => console.log('  - ' + l));
}

// Relatório (antigo → novo) pra conferência, só das cores que mudam
const nomesTam = { balde: 'Balde', galao: 'Galão', quarto: 'Pote' };
let md = `# Preços por cor — antigo → novo (${new Date().toISOString().slice(0, 10)})\n\nPreço da cor = base + pote de pigmento.\n`;
for (const produto of Object.keys(bases)) {
  const linhas = dosProdutos.filter(r => r.produto === produto);
  if (!linhas.length) continue;
  md += `\n## ${produto}\n\n| Cor | Tamanho | Antes | Agora | Diferença |\n|---|---|---|---|---|\n`;
  for (const r of linhas) {
    const dif = r.novo - r.antigo;
    md += `| ${r.nome} | ${nomesTam[r.tamanho]} | ${formatar(r.antigo)} | ${formatar(r.novo)} | ${dif > 0 ? '+' : '−'}${formatar(Math.abs(dif)).slice(3)} |\n`;
  }
}
if (unicosMantidos.length) md += `\n## Mantidos sem recalcular\n\n${unicosMantidos.map(l => '- ' + l).join('\n')}\n`;
if (dosProdutos.length) {
  const saida = path.join(RAIZ, 'saidas', `precos-cores-${new Date().toISOString().slice(0, 10)}.md`);
  fs.mkdirSync(path.dirname(saida), { recursive: true });
  fs.writeFileSync(saida, md);
  console.log('\nRelatório antigo → novo:', path.relative(RAIZ, saida));
}

if (APLICAR) {
  for (const [arq, texto] of Object.entries(alterados)) fs.writeFileSync(arq, texto);
  console.log('Arquivos atualizados.');
} else {
  console.log('\n(Simulação — rode com --aplicar pra gravar.)');
}
