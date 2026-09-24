---
name: precos-pigmento
description: >
  Atualiza os preços por cor do site a partir da tabela de pigmentos (preço da cor = base do
  produto + pote de pigmento). Lê a tabela nova (PDF/foto/texto), atualiza
  scripts/precos-cores/tabela.js, recalcula produto.html, catálogos, home e produtos.html, mostra
  a lista antes → agora e só coloca no ar depois da aprovação. Use quando o usuário mandar tabela
  nova de pigmentos, disser "mudou o preço do pigmento", "atualiza o preço das cores", "preço da
  base mudou", "entrou/saiu cor" ou /precos-pigmento.
---

# /precos-pigmento — Atualizar preço das cores

Desde 24/09/2026 cada cor é feita com um **pote de pigmento separado**. Por isso:

> **Preço da cor = preço da base do produto (no tamanho) + preço do pote de pigmento da cor (no mesmo tamanho)**

**Todo preço final termina em ,90.** Se a soma der outro centavo (ex: 64,90 + 9,90 = 74,80), o
script sobe pro próximo ,90 (74,90). Regra do Kevin, 24/09/2026 — não mudar.

Toda a conta sai de um arquivo só: `scripts/precos-cores/tabela.js`. O script
`scripts/precos-cores/atualizar.js` recalcula e grava em todo lugar. **Nunca editar preço de cor
direto no HTML**: na próxima rodada do script o valor volta pro que está na tabela.

## Como ler a tabela de pigmentos

- **PSE** = Premium, Standard e Emborrachada (mesma tabela pros três)
- **BD** = balde (18/17L) · **GL** = galão (3,6/3,4L) · **PT** = pote (900/800ml)
- **A / B / C** = base usada pra fazer a cor. Não muda o preço da base.
- **Cimento Queimado:** na tabela da fábrica, BD = saco de 20kg e GL = saco de 5kg. No site é o
  contrário (`preco_balde` = 5kg, `preco_galao` = 20kg). A tabela `CIMENTO` em `tabela.js` já
  está na ordem do site: `[nome, base, 5kg, 20kg, null]`.
- **Anotação à mão** em tabela escaneada: desconsiderar, a não ser que o Kevin diga outra coisa.
- Valor estranho (ex: pote R$ 1,00 quando os parecidos são R$ 10,00): perguntar antes de usar.

## Onde cada coisa fica

| O quê | Arquivo |
|---|---|
| Bases, pigmentos e apelidos de nome | `scripts/precos-cores/tabela.js` |
| Preço por cor (fonte do orçamento do balconista) | `site/produto.html` |
| Catálogos com preço por cor | `site/catalogo/{standard,premium-lavavel,emborrachada,efeito-cimento-queimado}.html` |
| "A partir de" do Cimento Queimado e "18L cores" do Vinil | `site/index.html`, `site/produtos.html`, `site/produto.html` (o script atualiza) |

O orçamento (`site/orcamento.html`) lê os preços direto de `produto.html`, então atualiza junto.

## Workflow

1. **Ler a tabela nova** que o Kevin mandou (PDF: usar o Read direto no arquivo, sem `pages`).
2. **Atualizar `tabela.js`**: pigmentos que mudaram, cores novas e bases (se mudaram).
   - Cor com nome diferente no site e na tabela → adicionar em `apelidos`.
   - Cor que o Kevin informou fora da tabela → comentário `// informado pelo Kevin em DD/MM/AAAA`.
3. **Simular:** `node scripts/precos-cores/atualizar.js`
   - Mostra quantos preços mudam e lista as cores "mantidas sem recalcular" (cor sem pigmento na
     tabela, ou sem pote no tamanho). **Cada item dessa lista vira pergunta pro Kevin.** Não
     inventar pigmento nem base.
4. **Aplicar:** `node scripts/precos-cores/atualizar.js --aplicar`
   - Gera `saidas/precos-cores-AAAA-MM-DD.md` com a lista antes → agora.
   - Rodar de novo sem `--aplicar` tem que dar **0 mudanças** (confere se ficou tudo consistente).
5. **Validar:**
   - O objeto `produtos` de `produto.html` precisa continuar carregando, igual o orçamento faz:
     `node -e "const t=require('fs').readFileSync('site/produto.html','utf8');new Function('return '+t.match(/const produtos = (\{[\s\S]*?\n\});/)[1])()"`
   - `git diff site/index.html site/produtos.html`: conferir que só mudou o card certo.
6. **Mostrar pro Kevin** a lista antes → agora (mandar o `.md`), destacando o que sobe mais e
   qualquer coisa que ficou de fora. Esperar aprovação.
7. **Colocar no ar** só depois do "pode colocar": commit na branch de trabalho, abrir PR pra
   `main` e fazer o merge (o Netlify publica só a `main`).

## Quando uma cor sai de linha

Apagar a linha da cor em `produto.html` e no catálogo do produto, e atualizar a contagem de cores
nos textos ("108 cores") em `site/catalogo/*.html`, `site/index.html` e `site/produtos.html`.

## Bases atuais (24/09/2026)

| Produto | BD | GL | PT |
|---|---|---|---|
| Standard | 219,90 | 59,90 | — |
| Premium Lavável | 299,90 | 79,90 | 29,90 |
| Emborrachada | 399,90 | 99,90 | — |
| Esmalte Ecológico | 399,90 | 89,90 | 29,90 |
| Cimento Queimado | 199,90 (20kg) | 64,90 (5kg) | — |
| Latex Vinil (cores 18L, preço único) | 80,00 | — | — |
| Pisos & Fachadas | ? (base não informada, não recalculado) | | |
