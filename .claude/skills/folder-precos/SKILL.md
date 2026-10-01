---
name: folder-precos
description: >
  Gera o folder "Guia da Pintura" (20x21 cm dobrado ao meio por padrão; também A5, A4 livro ou A4 em 3 dobras, pronto pra gráfica) com os
  preços ATUAIS do site e os endereços das lojas, mostra o que mudou de preço desde o último folder
  e entrega o PDF com sangria + prévias. Use quando o usuário pedir "folder", "panfleto de preço",
  "atualiza o folder", "folder do mês", "material pra deixar na loja", "mudou preço, refaz o
  panfleto" ou /folder-precos.
---

# /folder-precos — Folder Guia da Pintura com preços do site

Quatro modelos (padrão desde 01/10/2026: **10x21**, escolhido pelo Kevin a partir de uma referência de folder com painéis altos, fundo claro e formas geométricas azuis):
- **10x21** — 20 × 21 cm aberto, dobra ao meio, fecha em 10 × 21 cm (`templates/folder-guia-pintura-10x21/`). Fundo branco, formas azuis inclinadas, foto arredondada na capa, espaço do vendedor.
- **a5** — A5 dobrado ao meio, 4 páginas A6 de 10,5 × 14,8 cm (`templates/folder-guia-pintura-a5/`). Mesmo conteúdo, em formato de tabela de preços. Espaço pro vendedor na capa.
- **livro** — A4 dobrado ao meio, 4 páginas A5 (`templates/folder-guia-pintura-livro/`). Tem espaço pro vendedor escrever nome e WhatsApp na capa.
- **3dobras** — A4 em 3 dobras, 6 painéis (`templates/folder-guia-pintura/`).

O folder é um **modelo** que puxa os preços sozinho do site
(`site/produto.html`). Cada preço no modelo é um elemento com
`data-preco="id-do-produto|tamanho"`, que bate com o `id` e o campo `desc` de `precos` no objeto
`produtos` do site. **Nunca digitar preço à mão no folder**: a próxima rodada sobrescreve.

Criado em 01/10/2026, a partir do folder aprovado pelo Kevin ("ficou perfeito").

## Passo a passo

1. **Preço do site está certo?** O folder só repete o site. Se o Kevin falar de preço novo,
   primeiro corrigir o site (preço de cor → `/precos-pigmento`; preço de produto → `site/produto.html`).
   Se ele mandar foto de lista de preço de loja (`dados/preços de tintas/`), comparar com o site antes.

2. **Gerar:**
   ```
   node scripts/folder-precos/gerar.js            # mês atual
   node scripts/folder-precos/gerar.js 2026-11    # mês específico
   node scripts/folder-precos/gerar.js --modelo a5        # A5 dobrado ao meio
   node scripts/folder-precos/gerar.js --modelo livro     # A4 dobrado ao meio
   node scripts/folder-precos/gerar.js --modelo 3dobras   # A4 em 3 dobras
   ```
   Grava em `saidas/folder-guia-pintura-10x21-AAAA-MM/` (`-a5-`, `-livro-` nos outros; sem sufixo no 3 dobras): `folder-impressao.pdf` (gráfica),
   `previa-lado-de-fora.png`, `previa-lado-de-dentro.png` e o `folder.html` preenchido.
   Numa sessão de nuvem o script acha o Chromium sozinho.

3. **Ler a saída do script e repassar pro Kevin:**
   - **"Mudou de preço desde…"** → listar antes → agora em linguagem simples.
   - **"✗ Folder NÃO gerado"** → um produto ou tamanho saiu do site. Ajustar o `data-preco`
     no modelo (ou trocar o produto do folder, perguntando ao Kevin qual entra no lugar).
   - **"⚠ Conferir endereços"** → loja nova, fechada ou endereço mudado no site. Atualizar a lista
     de lojas no verso do modelo (bloco `<!-- VERSO -->`) e rodar de novo.

4. **Olhar as duas prévias antes de mandar** (texto estourando, preço `???`, painel vazio).

5. **Entregar:** mandar as prévias + o PDF e lembrar das instruções da gráfica abaixo.
   Commitar na branch de trabalho. Folder não é site: não precisa de deploy.

## Instruções pra gráfica (repassar sempre)

- Arquivo: `folder-impressao.pdf`, frente e verso, com 3 mm de sangria: **10x21** 206×216 mm (20×21 cm aberto), **a5** 216×154 mm (A5 deitado), **livro/3dobras** 303×216 mm (A4 deitado).
- **10x21:** uma dobra no meio (fecha em 10×21 cm). **a5:** uma dobra no meio (vira A6). **livro:** uma dobra no meio (vira A5). **3dobras:** dobra janela/rolo (a aba de 97 mm entra).
- Papel: **couché fosco** 115 g ou 150 g — o fosco aceita caneta no espaço do vendedor (brilho borra).

## Mudar o conteúdo do folder (não o preço)

Editar o `folder.html` do modelo (`templates/folder-guia-pintura-10x21/`, `-a5/`, `-livro/` ou `templates/folder-guia-pintura/`) e rodar o gerador. Regras:
- Texto técnico (uso interno/externo, rendimento, diluição, secagem) só com o que está escrito
  no site/`_memoria/produtos.md`. Nunca inventar.
- Enquanto durar o teste de entrega só por app (desde 24/09/2026), **nada de "a gente entrega"**.
- Produto novo: copiar um bloco `.prod`, trocar imagem (`img/`), textos e os `data-preco`.
  O tamanho no `data-preco` precisa ser idêntico ao `desc` do site (com travessão "—").
- Cores do layout: paleta do `identidade/design-guide.md`. Se o folder passar a mostrar cor de
  tinta, usar `/cores`.

## Pendências conhecidas

- Logo em 500 px: pedir ao Kevin o logo em vetor (PDF/AI/SVG) pra impressão mais nítida.
- Imagens de embalagem são renders com rendimento impresso diferente do site em alguns casos
  (ex.: "330 m²" no balde do Super Profissional). O texto do folder usa sempre o valor do site.
