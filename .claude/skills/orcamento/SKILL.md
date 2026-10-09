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

- Numeração única (orçamento + retirada), continua da sequência já emitida (0055 e 0056 foram os últimos; próximo = 0057). `scripts/orcamento/contador.json` guarda só o último número (sem dado de cliente, é versionado).
- Histórico (número, data, hora, vendedor, cliente, WhatsApp, total) vai pra `dados/orcamentos/registro.csv` — **privado, nunca commitar** (`dados/` é gitignored; tem dado pessoal de cliente).
- **Importante:** a sessão na nuvem some. Depois de gerar um orçamento "valendo", commitar e dar push do `contador.json` na branch de trabalho, senão o próximo começa do número errado. O `registro.csv` fica só na máquina/sessão onde foi gerado.
- Contagem do mês/dia: contar as linhas do `registro.csv` por data.

## Design (fixo — não mexer sem pedido do Kevin)

Segue `identidade/design-guide.md`: cabeçalho azul `#0D47A1` com logo branco e "ORÇAMENTO" (Bebas Neue) + chip amarelo com o Nº; faixa cinza com cliente/WhatsApp/vendedor/data; tabela produto·qtd·unitário·subtotal; caixa TOTAL azul com valor amarelo; rodapé azul escuro com botão amarelo "Quer fechar? Chama no WhatsApp" e telefone da loja. Rodapé legal: "Parcelamento em até 12x sem juros — consulte as condições" (regra do CLAUDE.md). Nunca prometer entrega da loja (teste de descontinuação desde 24/09/2026).

## Pendências / ideias futuras

- Validade do orçamento (ex.: 7 dias) — ainda não definida pelo Kevin; não inventar.
- Ler preço direto de `produto.html` por nome de produto/cor (hoje o preço é buscado manualmente no passo 2).

## Autorização de retirada (09/10/2026)

Mesmo design do orçamento, pra cliente que pagou parte (sinal) e acerta o resto na loja. Mostra data, cliente, WhatsApp, produto, cor, tamanho, quantidade, valor total, valor pago e **saldo a pagar na retirada**. Se saldo = 0 vira "PAGO — RETIRADA LIBERADA".

```
node scripts/orcamento/retirada.js retirada.json          # gasta um número (MESMO contador do orçamento)
node scripts/orcamento/retirada.js retirada.json --teste  # prévia
```
JSON: ver cabeçalho de `scripts/orcamento/retirada.js` (`cliente`, `whatsappCliente`, `loja`, `itens[]`, `pago`, `formaPagamento`). Pedir ao Kevin a loja de retirada se não vier. Histórico em `dados/orcamentos/registro-retiradas.csv` (privado). Orçamentos e retiradas dividem **uma numeração só** (`contador.json`); a contagem começou em 0055 (Kevin, 06/10/2026); ele chegou a propor 0133 em 09/10/2026 e voltou atrás.

## CTA (rodapé) — fixo em toda peça

Instagram @Tintaslaet + WhatsApp (11) 97714-0964 + site tintaslaet.com (`scripts/orcamento/rodape.js`). WhatsApp só muda em peça de loja específica. Regra também no `CLAUDE.md`.

## Persistência do contador (importante)

Toda sessão nova começa clonando a `main`. Por isso o `contador.json` só "lembra" se o último valor estiver **commitado e na `main`**. Ao gerar qualquer documento valendo: commitar o `contador.json` e dar push. Ao começar uma sessão: ler o `contador.json` antes de gerar e conferir com o último número que o Kevin disser, se ele falar um diferente, o dele vale.

## Dados obrigatórios — SEMPRE perguntar o que faltar (regra do Kevin, 09/10/2026)

Antes de gerar, conferir a lista. Se faltar algo, pedir ao Kevin numa mensagem só (curta). Não gerar com campo vazio.

**Autorização de retirada** (o script recusa sem loja e sem data):
1. Nome do cliente · 2. WhatsApp do cliente · 3. Produto, cor, tamanho, quantidade · 4. Valor total · 5. Valor já pago (e forma de pagamento, se ele quiser) · 6. **Loja de retirada** (1 a 6) · 7. **Data prevista de retirada + período** (manhã/tarde) · 8. Vendedor (padrão Kevin).

**Orçamento:** nome e WhatsApp do cliente, itens com quantidade (galão por padrão), **loja de retirada e data prevista** (quando o cliente for retirar; campos opcionais `loja` e `retirada`), vendedor (padrão Kevin).

Nomes de loja (usar assim): Loja 1 — Vila Bela (Sapopemba) · Loja 2 — Mauá (Jardim São João) · Loja 3 — Mauá (Av. Ayrton Senna) · Loja 4 — Santo André (Vila Luzita) · Loja 5 — Mauá (Itapark) · Loja 6 — São Bernardo do Campo (Santa Terezinha).
