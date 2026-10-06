---
name: orcamento
description: >
  Gera o orçamento visual da Tintas Laet (imagem PNG + PDF) a partir de foto/print/texto de pedido do cliente,
  sempre no mesmo design, com número sequencial (Nº 0001, 0002…), nome do vendedor, nome e WhatsApp do cliente,
  WhatsApp da loja e rodapé com CTA. Também devolve o texto pronto pra colar no WhatsApp. Use quando o Kevin mandar
  foto de orçamento/pedido, disser "orçamento", "faz o orçamento da…", "quanto fica…" ou /orcamento.
---

# /orcamento — Orçamento padronizado Tintas Laet

Criado em 06/10/2026. Kevin manda foto/print do pedido do cliente neste chat; a skill monta o orçamento no mesmo design sempre.

## Passo a passo

1. **Entender os itens da foto.** Produto, cor, tamanho, quantidade. Regra do Kevin (06/10/2026): salvo aviso, pedido é **galão** (3,4L nas cores médias/fortes, 3,6L nas claras — mesmo preço). Sem quantidade = 1 (avisar que assumiu).
2. **Preço = preço do site**, nunca de cabeça:
   - Cor de tinta (Standard, Premium Lavável, Emborrachada): `site/produto.html` (campo `preco_galao`/`preco_balde` da cor) = base + pigmento (`scripts/precos-cores/tabela.js`).
   - Super Profissional: `precos` do produto em `site/produto.html` (3,6L cores R$ 49,90 / 18L R$ 149,90).
   - Outros produtos: `site/produto.html`. Ler `_memoria/produtos.md` antes de afirmar característica técnica.
   - Se o preço de balcão for diferente, o Kevin avisa e vale o dele.
3. **Cor que não existe na paleta** (`identidade/cores/paleta-oficial.json`) → perguntar ao Kevin qual é, não chutar. Nome do cliente informal ("azul do mar") ≠ nome de catálogo.
4. **Dados do cabeçalho:** vendedor padrão **Kevin**; WhatsApp da loja padrão **(11) 97714-0964**; nome e WhatsApp do cliente — se faltar o WhatsApp, gerar mesmo assim (campo sai "—") e avisar.
5. **Gerar:** escrever um JSON na scratchpad e rodar
   ```
   node scripts/orcamento/gerar.js orcamento.json          # gasta um número
   node scripts/orcamento/gerar.js orcamento.json --teste  # só conferir visual, não gasta número
   ```
   Formato do JSON (ver cabeçalho de `scripts/orcamento/gerar.js`): `cliente`, `whatsappCliente`, `vendedor`, `whatsappLoja`, `itens[{produto,cor,tamanho,qtd,unit}]`, `desconto`, `obs`.
   Saída: `saidas/orcamentos/<nº>-<cliente>-<data>/orcamento.png` e `.pdf`.
6. **Olhar o PNG** antes de entregar (texto estourando, valor errado).
7. **Entregar ao Kevin:** a imagem, o texto curto pra colar no WhatsApp (itens + total + número), e o que ficou em dúvida. Respostas curtas.

## Contador

- `scripts/orcamento/contador.json` guarda só o último número (sem dado de cliente, é versionado).
- Histórico (número, data, hora, vendedor, cliente, WhatsApp, total) vai pra `dados/orcamentos/registro.csv` — **privado, nunca commitar** (`dados/` é gitignored; tem dado pessoal de cliente).
- **Importante:** a sessão na nuvem some. Depois de gerar um orçamento "valendo", commitar e dar push do `contador.json` na branch de trabalho, senão o próximo começa do número errado. O `registro.csv` fica só na máquina/sessão onde foi gerado.
- Contagem do mês/dia: contar as linhas do `registro.csv` por data.

## Design (fixo — não mexer sem pedido do Kevin)

Segue `identidade/design-guide.md`: cabeçalho azul `#0D47A1` com logo branco e "ORÇAMENTO" (Bebas Neue) + chip amarelo com o Nº; faixa cinza com cliente/WhatsApp/vendedor/data; tabela produto·qtd·unitário·subtotal; caixa TOTAL azul com valor amarelo; rodapé azul escuro com botão amarelo "Quer fechar? Chama no WhatsApp" e telefone da loja. Rodapé legal: "Parcelamento em até 12x sem juros — consulte as condições" (regra do CLAUDE.md). Nunca prometer entrega da loja (teste de descontinuação desde 24/09/2026).

## Pendências / ideias futuras

- Validade do orçamento (ex.: 7 dias) — ainda não definida pelo Kevin; não inventar.
- Ler preço direto de `produto.html` por nome de produto/cor (hoje o preço é buscado manualmente no passo 2).
