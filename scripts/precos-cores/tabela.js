// Tabela de preços por cor — fonte única de verdade.
//
// Regra (desde 24/09/2026): cada cor é feita com um pote de pigmentos
// separado. Preço da cor = preço da BASE do produto (no tamanho) + preço
// do POTE de pigmento daquela cor (no mesmo tamanho).
//
// Pra atualizar preço: muda o valor aqui e roda
//   node scripts/precos-cores/atualizar.js          (só mostra o que muda)
//   node scripts/precos-cores/atualizar.js --aplicar (grava no site)
//
// BD = balde (18/17L), GL = galão (3,6/3,4L), PT = pote (900/800ml).
// A/B/C = base usada pra fazer a cor (não muda o preço da base).

// Preço da base (sem pigmento) por produto e tamanho.
// null = base ainda não confirmada — o script não mexe nesse produto.
const bases = {
  'standard':                { balde: 219.90, galao: 59.90 },
  'premium-lavavel':         { balde: 299.90, galao: 79.90, quarto: 29.90 },
  'emborrachada':            { balde: 399.90, galao: 99.90 },
  'esmalte-ecologico':       { balde: 399.90, galao: 89.90, quarto: 29.90 },
  'efeito-cimento-queimado': null, // "base A" — valor da base a confirmar
  'latex-vinil':             null, // "base A" — valor da base a confirmar
  'piso-fachada':            null, // base desconhecida (?)
};

// Qual tabela de pigmentos cada produto usa.
const tabelaDoProduto = {
  'standard': 'PSE',
  'premium-lavavel': 'PSE',
  'emborrachada': 'PSE',
  'esmalte-ecologico': 'ESMALTE',
  'efeito-cimento-queimado': 'CIMENTO',
  'latex-vinil': 'VINIL',
  'piso-fachada': 'PISO',
};

// Arquivos de catálogo que repetem os preços por cor (chaves balde/galao/quarto).
const catalogos = {
  'standard': 'site/catalogo/standard.html',
  'premium-lavavel': 'site/catalogo/premium-lavavel.html',
  'emborrachada': 'site/catalogo/emborrachada.html',
};

// Nome da cor no site → nome na tabela de pigmentos (quando é diferente).
const apelidos = {
  'PITADA DE ALECRIM': 'PITADA ALECRIM',
  'BITIGUI': 'BITINGUI',
  'CINZA ELEFANTE': 'ELEFANTE',
  'ILHA DE ESMERALDA': 'ILHA ESMERALDA',
  'VERDE FLUORESCENTE': 'VERDE FLORESCENTE',
  'VERMELHO D 10': 'VERMELHO B10',
  'AMARELO B 07': 'AMARELO B07',
  'AMARELO C 07': 'AMARELO C07',
  'CINZA C 04': 'CINZA C04',
  'CINZA D 04': 'CINZA D04',
  'VERDE B 10': 'VERDE B10',
  'VERMELHO C 09': 'VERMELHO C09',
  'ROSA BIG-BIG': 'ROSA BIG BIG',
  'PROFUNDIDADE': 'PROFUNDIDADE',
};

// [nome, base, BD, GL, PT]  — PT = null quando não existe pote.
const pigmentos = {
  // Premium, Standard e Emborrachada (PSE)
  PSE: [
    ['ALGODAO EGIPCIO', 'A', 20, 15, 5],
    ['AMARELO ALBERTINO', 'A', 60, 35, 10],
    ['AMARELO B07', 'A', 30, 20, 8],
    ['AMARELO C07', 'A', 40, 25, 8],
    ['AMARELO DOURADO', 'A/C', 100, 45, 10],
    ['AMARELO LAET', 'A', 20, 15, 5],
    ['ANA MARIA', 'A', 20, 15, 5],
    ['AREIA ENCHARCADA', 'A', 40, 25, 8],
    ['AREIA', 'A', 20, 15, 5],
    ['AURORA SERENA', 'C', 200, 75, 15],
    ['AZEITONA', 'A', 50, 35, 10],
    ['AZUL JAZZ', 'C', 50, 35, 8],
    ['AZUL LAET', 'A', 20, 15, 5],
    ['BEGE MINERAL', 'A', 40, 20, 8],
    ['BITINGUI', 'A', 40, 25, 8],
    ['BORDO', 'C', 130, 45, 10],
    ['CAIXA SECA', 'A', 50, 25, 8],
    ['CAMURCA', 'B', 30, 15, 8],
    ['CAPIM CHEIROSO', 'A', 40, 25, 8],
    ['CEU SAGRADO', 'C', 20, 15, 5],
    ['CHA DA TARDE', 'B', 50, 35, 10],
    ['CHA QUENTE', 'B', 40, 25, 8],
    ['CHUVA', 'A', 20, 15, 5],
    ['CHUVA SUAVE', 'A', 20, 15, 5],
    ['CINZA B', 'A', 30, 15, 5],
    ['CINZA C04', 'C', 40, 20, 8],          // informado pelo Kevin em 24/09/2026
    ['CINZA D04', 'C', 40, 20, 8],
    ['CINZA FUMACA', 'A', 40, 20, 8],
    ['CINZA A', 'A', 20, 15, 5],
    ['CINZA WICK', 'B', 40, 20, 8],
    ['COBRE SUAVE', 'C', 50, 25, 8],
    ['CONCRETO', 'B', 30, 15, 8],
    ['CROMIO', 'A', 20, 15, 5],
    ['CURRY DOURADO', 'C', 90, 35, 8],
    ['DISFARCE', 'A', 40, 25, 5],
    ['DOCE DA BISA', 'A', 30, 25, 8],
    ['DOCE DA VOVO', 'A', 20, 15, 5],
    ['ELEFANTE', 'A', 30, 15, 5],
    ['ERVA DOCE', 'A', 20, 15, 5],
    ['ESPACO VERDE', 'C', 30, 25, 5],
    ['ESTADUAL', 'C', 130, 55, 10],
    ['EXPEDICAO MARITIMA', 'A', 40, 25, 8],
    ['FLAMINGO REAL', 'B', 30, 15, 7],
    ['FOGO VIOLETA', 'C', 200, 75, 15],
    ['GELO', 'A', 20, 15, 5],
    ['GOTA SERENA', 'A', 20, 15, 5],
    ['ILHA ESMERALDA', 'C', 200, 75, 10],
    ['INTENSA SEDUCAO', 'C', 300, 95, 25],
    ['JOGO DE GOLFE', 'C', 100, 75, 10],
    ['LAGOA DOS LIRIOS', 'A', 20, 15, 5],
    ['LARANJA TURCO', 'C', 30, 25, 8],
    ['LICOR DE LARANJA', 'C', 100, 35, 10],
    ['LICOR DOCE', 'B', 40, 25, 8],
    ['LILAS DELICADO', 'A', 20, 15, 5],
    ['LILAS ENEVOADO', 'A', 20, 15, 5],
    ['LILAS LAET', 'A', 30, 20, 8],
    ['LILAS PRIMATA', 'A', 80, 35, 8],
    ['MAGIA', 'C', 50, 35, 8],
    ['MAR ABERTO', 'C', 40, 25, 8],
    ['MAR DE ARRUDA', 'A', 50, 25, 8],
    ['MARFIM', 'A', 20, 15, 5],
    ['MARROM BURGUES', 'C', 100, 65, 10],   // PT corrigido pelo Kevin (tabela dizia 1,00)
    ['MARROM SUAVE', 'C', 40, 25, 8],
    ['MEDIA VISAO', 'C', 40, 25, 8],
    ['MISTURA DE MOSTARDA', 'C', 100, 45, 10],
    ['OCEANO TRANQUILO', 'C', 50, 35, 8],
    ['OVELHA', 'A', 20, 15, 5],
    ['PALHA', 'A', 20, 15, 5],
    ['PANTANAL', 'A', 50, 25, 8],
    ['PAPEL PICADO', 'A', 20, 15, 5],
    ['PARAISO DO MAR', 'C', 20, 15, 5],
    ['PAVAO', 'C', 50, 45, 8],
    ['PECA DE TEATRO', 'B', 40, 25, 8],
    ['PENA AZUL', 'B', 30, 25, 8],
    ['PENHASCO', 'A', 50, 25, 10],
    ['PERGAMINHO', 'A', 20, 15, 5],
    ['PESSEGO', 'A', 20, 15, 5],
    ['PETUNIA ROXA', 'C', 50, 25, 8],
    ['PITADA ALECRIM', 'A', 20, 15, 5],
    ['PITADA CASUAL', 'A', 40, 20, 8],
    ['PORCELANA EGIPCIA', 'A', 20, 15, 5],
    ['PLANETARIO', 'C', 20, 15, 8],
    ['PROFUNDIDADE', 'C', 20, 10, null],   // informado pelo Kevin (pigmento do piso); sem PT
    ['ROMA', 'C', 200, 75, 10],
    ['ROSA ACAI', 'B', 40, 25, 8],
    ['ROSA GLOSS', 'A', 20, 15, 5],
    ['ROSA IRLANDESA', 'B', 30, 25, 8],
    ['ROSA VERMELHA', 'C', 200, 75, 10],
    ['ROSE SUAVE', 'A', 20, 15, 5],
    ['SELVA ESCURA', 'C', 50, 35, 8],
    ['SEMENTE URBANA', 'C', 200, 75, 10],
    ['SOMBRA LUNAR', 'A', 20, 15, 5],
    ['SUAVE KIWI', 'A', 30, 20, 8],
    ['SUNTUOSO', 'C', 130, 55, 10],
    ['TANGERINA', 'C', 30, 20, 8],
    ['TERRA NOSSA', 'C', 50, 35, 10],
    ['TRIPLA COROA', 'C', 40, 25, 8],
    ['UVA DOCE', 'C', 90, 35, 8],
    ['VALSA AZUL', 'C', 100, 25, 8],
    ['VERDE B10', 'C', 30, 25, 8],
    ['VERDE FLORESCENTE', 'C', 100, 75, 10],
    ['VERDE LIMAO', 'C', 100, 75, 10],
    ['VERDE MUSGO', 'B', 50, 35, 10],
    ['VERDE PISCINA', 'A', 20, 15, 5],
    ['VERDE PRIMAVERA', 'A', 20, 15, 5],
    ['VERMELHO B10', 'C', 30, 25, 10],      // PT 10 informado pelo Kevin (tabela dizia 8)
    ['VERMELHO C09', 'C', 100, 65, 10],
  ],

  ESMALTE: [
    ['AMARELO', 'B', 50, 20, 10],
    ['ARGILA', 'B', 50, 20, 10],
    ['AZUL CADEIRANTE', 'C', 50, 20, 10],
    ['AZUL CELESTE', 'A', 20, 10, 5],
    ['AZUL DEL REY', 'C', 100, 30, 15],
    ['AZUL FRANCA', 'C', 100, 30, 15],
    ['CAMURCA', 'B', 50, 20, 10],
    ['CINZA CLARO', 'A', 20, 10, 5],
    ['CINZA ESCURO', 'C', 100, 30, 15],
    ['CINZA MEDIO', 'A', 50, 20, 10],
    ['CONHAQUE', 'B', 50, 20, 10],
    ['CROMIO', 'A', 20, 10, 5],
    ['ESCURIDAO', 'C', 100, 30, 15],
    ['FLORESTA AMAZONICA', 'C', 100, 30, 15],
    ['GELO', 'A', 20, 10, 5],
    ['JEANS', 'C', 50, 20, 10],
    ['LARANJA CITRICO', 'C', 100, 30, 15],
    ['LARANJA SUAVE', 'B', 50, 20, 10],
    ['MARFIM', 'A', 20, 10, 5],
    ['PEROLA', 'A', 20, 10, 5],
    ['PLATINA', 'A', 20, 10, 5],
    ['ROSA BEBE', 'A', 20, 10, 5],
    ['ROSA BIG BIG', 'C', 50, 20, 10],
    ['ROXO', 'C', 100, 30, 15],
    ['TABACO', 'C', 100, 30, 15],
    ['VERDE CARIBE', 'B', 50, 20, 10],
    ['VERDE CASUAL', 'B', 50, 20, 10],
    ['VERDE COLONIAL', 'C', 100, 30, 15],
    ['VERDE FOLHA', 'C', 100, 30, 15],
    ['VERDE UVA', 'B', 50, 20, 10],
    ['VERMELHO', 'C', 100, 30, 15],
    ['VERMELHO GOYA', 'C', 100, 30, 15],
  ],

  // Cimento Queimado: BD = saco grande, GL = saco pequeno.
  CIMENTO: [
    ['CINZA CLARO', 'A', 19.90, 9.90, null],
    ['CINZA PADRAO', 'A', 39.90, 19.90, null],
    ['CHUMBO', 'A', 39.90, 19.90, null],
    ['CONCRETO', 'A', 39.90, 19.90, null],
    ['AZEITONA PASSADA', 'A', 39.90, 19.90, null],
    ['MARROM TURCO', 'A', 79.90, 39.90, null],
    ['ROSE', 'A', 19.90, 9.90, null],
    ['BALA DE IOGURTE', 'A', 39.90, 19.90, null],
    ['DOIS AMORES', 'A', 99.90, 49.90, null],
    ['AMARELO LAET 2', 'A', 19.90, 9.90, null],
    ['VERDE UVA', 'A', 39.90, 19.90, null],
    ['PAVAO', 'A', 39.90, 19.90, null],
    ['CAIXA MAGICA', 'A', 39.90, 19.90, null],
    ['AZUL CEU', 'A', 39.90, 19.90, null],
    ['JEANS', 'A', 39.90, 19.90, null],
  ],

  VINIL: [
    'CINZA A', 'CINZA B', 'CINZA C', 'MARFIM', 'AMARELO LAET', 'COMPOTA DE ABACAXI',
    'AREIA', 'PESSEGO', 'SAPATILHA', 'ROSA VINHO', 'GOMA DE MASCAR', 'CACTO DALIA',
    'ROSADO', 'TEMPLO DA SABEDORIA', 'CHIFFON AZUL', 'PASSAGEM LEVE', 'FRESCOR MARITIMO',
    'FONTE DA SORTE',
  ].map(n => [n, 'A', 19.90, null, null]),

  PISO: [
    ['CINZA', 'B', 19.90, 9.90, null],
    ['CINZA C04', 'C', 19.90, 9.90, null],
    ['CHUMBO', 'C', 19.90, 9.90, null],
    ['CONCRETO', 'B', 19.90, 9.90, null],
    ['PROFUNDIDADE', 'C', 19.90, 9.90, null],
    ['PRETO', 'C', 19.90, 9.90, null],
    ['CAMURCA', 'B', 19.90, 9.90, null],
    ['VERMELHO', 'C', 19.90, 9.90, null],
    ['VERMELHO C09', 'C', 19.90, 9.90, null],
    ['AZUL', 'C', 19.90, 9.90, null],
    ['ESPACO VERDE', 'C', 19.90, 9.90, null],
    ['VERDE B10', 'C', 19.90, 9.90, null],
    ['AMARELO', 'C', 19.90, 9.90, null],
  ],
};

module.exports = { bases, tabelaDoProduto, catalogos, apelidos, pigmentos };
