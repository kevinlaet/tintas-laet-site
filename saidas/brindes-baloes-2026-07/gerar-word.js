const { Document, Packer, Paragraph, Table, TableRow, TableCell, TextRun, HeadingLevel, AlignmentType, WidthType, BorderStyle, ShadingType } = require('docx');
const fs = require('fs');
const path = require('path');

const AZUL = '0D47A1';
const AMARELO = 'FFC107';
const AZUL_ESCURO = '062B63';

function cabecalhoTabela(cols) {
  return new TableRow({
    tableHeader: true,
    children: cols.map(txt => new TableCell({
      shading: { type: ShadingType.SOLID, color: AZUL },
      children: [new Paragraph({
        children: [new TextRun({ text: txt, bold: true, color: 'FFFFFF', size: 20 })],
      })],
    })),
  });
}

function linhaTabela(cells, bg) {
  return new TableRow({
    children: cells.map(txt => new TableCell({
      shading: bg ? { type: ShadingType.SOLID, color: bg } : undefined,
      children: [new Paragraph({
        children: [new TextRun({ text: txt, size: 20 })],
      })],
    })),
  });
}

const doc = new Document({
  sections: [{
    children: [

      // Título
      new Paragraph({
        text: 'Brindes nos Balões — Inauguração Loja 5',
        heading: HeadingLevel.HEADING_1,
        spacing: { after: 100 },
      }),
      new Paragraph({
        children: [new TextRun({ text: 'Av. Itapark, 4377 — Mauá  ·  Tintas Laet', size: 20, color: '555555' })],
        spacing: { after: 300 },
      }),

      // Como funciona
      new Paragraph({
        text: 'Como funciona',
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 100 },
      }),
      new Paragraph({
        children: [new TextRun({ text: 'Cliente compra e ganha um balão. Estoura o balão, pega o papelzinho e vai retirar o brinde na loja.', size: 20 })],
        spacing: { after: 80 },
      }),
      new Paragraph({
        children: [new TextRun({ text: 'Dentro do balão: ', bold: true, size: 20 }), new TextRun({ text: '1 etiqueta dobrada + confetes. Total: 30 balões.', size: 20 })],
        spacing: { after: 300 },
      }),

      // Como montar
      new Paragraph({
        text: 'Como montar os balões',
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 100 },
      }),
      ...[
        '1. Recorte as etiquetas do arquivo etiquetas.html (imprimir → recortar nas linhas tracejadas)',
        '2. Dobre a etiqueta e coloque dentro do balão com um punhado de confetes',
        '3. Encha o balão com bomba de ar',
        '4. Amarre e separe por grupo de compra',
      ].map(txt => new Paragraph({
        children: [new TextRun({ text: txt, size: 20 })],
        spacing: { after: 60 },
      })),

      // Tabela de brindes
      new Paragraph({
        text: 'Distribuição dos brindes',
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 300, after: 120 },
      }),
      new Paragraph({
        children: [new TextRun({ text: 'São 2 de cada prêmio por categoria. Distribua aleatoriamente dentro do grupo.', size: 20, italics: true, color: '555555' })],
        spacing: { after: 160 },
      }),

      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          cabecalhoTabela(['Categoria', 'Qtd.', 'Prêmio', 'Observação']),

          // R$100
          linhaTabela(['R$ 100,00 a R$ 499,99', '2', 'Vale R$ 5 de desconto', 'Qualquer compra · válido 1 mês'], 'E8F0FB'),
          linhaTabela(['', '2', 'Rolo de Espuma 15cm', 'Retirar na loja'], 'FFFFFF'),
          linhaTabela(['', '2', '1 Corante (cliente escolhe a cor)', 'Retirar na loja'], 'E8F0FB'),
          linhaTabela(['', '2', 'Kit Pincel P + Fita Crepe P', 'Retirar na loja'], 'FFFFFF'),
          linhaTabela(['', '2', 'Espátula de Aço 6cm', 'Retirar na loja'], 'E8F0FB'),

          // R$500
          linhaTabela(['R$ 500,00 a R$ 999,99', '2', 'Vale R$ 25 de desconto', 'Próxima compra · válido 1 mês'], 'FFF9E0'),
          linhaTabela(['', '2', 'Tinta Spray (qualquer cor)', 'Retirar na loja'], 'FFFFFF'),
          linhaTabela(['', '2', 'Tinta Epoxi 900ml Branca', 'Retirar na loja'], 'FFF9E0'),
          linhaTabela(['', '2', 'Kit Ferramentas Básico (Rolo + Cabo + Pincel P)', 'Retirar na loja'], 'FFFFFF'),
          linhaTabela(['', '2', 'Pad de Pintura Compel', 'Retirar na loja'], 'FFF9E0'),

          // R$1.000
          linhaTabela(['Acima de R$ 1.000,00', '2', 'Vale R$ 50 de desconto', 'Próxima compra · válido 1 mês'], 'E8EAF0'),
          linhaTabela(['', '2', 'Tinta Piso Lavável 3,4L (qualquer cor)', 'Retirar na loja'], 'FFFFFF'),
          linhaTabela(['', '2', 'Tinta Standard 3,6L (cores claras)', 'Retirar na loja'], 'E8EAF0'),
          linhaTabela(['', '2', 'Seladora Acrílica 18L Branca', 'Retirar na loja'], 'FFFFFF'),
          linhaTabela(['', '2', 'Frete Grátis em 3 Pedidos', 'Válido por 3 meses'], 'E8EAF0'),
        ],
      }),

      // Regras
      new Paragraph({
        text: 'Regras para o funcionário',
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 400, after: 120 },
      }),
      ...[
        '• Cliente deve apresentar a etiqueta para resgatar o brinde',
        '• Brinde sujeito à disponibilidade — se faltar, substituir por item equivalente',
        '• Vale de desconto não é cumulativo com outras promoções',
        '• Vale de desconto não é trocável por dinheiro',
        '• Um brinde por etiqueta',
        '• Dúvidas: falar com o Kevin — (11) 97714-0964',
      ].map(txt => new Paragraph({
        children: [new TextRun({ text: txt, size: 20 })],
        spacing: { after: 80 },
      })),

      // Rodapé
      new Paragraph({
        children: [new TextRun({ text: 'Tintas Laet — Loja 5 — Uso interno', size: 16, color: '999999' })],
        alignment: AlignmentType.CENTER,
        spacing: { before: 600 },
      }),
    ],
  }],
});

Packer.toBuffer(doc).then(buffer => {
  const out = path.join(__dirname, 'instrucoes-brindes.docx');
  fs.writeFileSync(out, buffer);
  console.log('✅ instrucoes-brindes.docx gerado em:', out);
});
