---
name: folder-precos
description: >
  Gera o folder "Guia da Pintura" (A4 dobrado em 3, frente e verso, pronto pra gráfica) com os
  preços ATUAIS do site e os endereços das lojas, mostra o que mudou de preço desde o último folder
  e entrega o PDF com sangria + prévias. Use quando o usuário pedir "folder", "panfleto de preço",
  "atualiza o folder", "folder do mês", "material pra deixar na loja", "mudou preço, refaz o
  panfleto" ou /folder-precos.
---

# /folder-precos — Folder Guia da Pintura com preços do site

O folder é um **modelo** (`templates/folder-guia-pintura/`) que puxa os preços sozinho do site
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
   ```
   Grava em `saidas/folder-guia-pintura-AAAA-MM/`: `folder-impressao.pdf` (gráfica),
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

- Arquivo: `folder-impressao.pdf` — A4 deitado, frente e verso, 303×216 mm = A4 + 3 mm de sangria.
- Dobra em 3 tipo **janela/rolo** (a aba de 97 mm dobra pra dentro).
- Papel sugerido: couché 115 g ou 150 g.

## Mudar o conteúdo do folder (não o preço)

Editar `templates/folder-guia-pintura/folder.html` e rodar o gerador. Regras:
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
