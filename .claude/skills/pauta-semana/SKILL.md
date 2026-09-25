---
name: pauta-semana
description: >
  Lê o calendário editorial e devolve a pauta da semana: sugestão pro post de feed,
  ideias de stories pros próximos dias, aviso de data comemorativa chegando e lembrete
  de pedido de material às lojas. Use quando o usuário pedir "pauta da semana",
  "o que eu posto essa semana", "/pauta-semana" ou quiser saber o que produzir nos
  próximos dias sem abrir o calendário manualmente.
---

# /pauta-semana — Sugestão semanal de conteúdo

Skill de apoio — traduz o calendário editorial em uma sugestão pronta pra semana, sem exigir que o usuário abra o documento.

## Dependências

- **Calendário operacional:** `_memoria/calendario-editorial.md` — metas, datas comemorativas, banco de ângulos, modelo de pedido às lojas
- **Pauta real:** `_memoria/dores-clientes.md` — dores ainda não usadas têm prioridade
- **Visão geral:** `_memoria/estrategia.md` — prioridade atual do negócio
- **Tom de voz:** `_memoria/preferencias.md`

## Workflow

### Passo 1 — Situar a data

Identificar a data de hoje e checar a tabela de "Datas comemorativas" em `calendario-editorial.md`:
- Se alguma data cai dentro dos próximos ~10 dias, abrir a sugestão da semana avisando sobre ela e com o ângulo já sugerido na tabela
- Se nenhuma data está próxima, seguir direto pro banco de ângulos

### Passo 2 — Sugerir os posts de feed da semana

- Cadência: **1 dia sim, 1 dia não** (~3-4 posts/semana), produzidos e
  agendados em lote (não um por dia) — ver `_memoria/estrategia.md`
- Checar `marketing/conteudo/` pra ver o que já foi postado recentemente (não repetir tema)
- Cruzar com os **6 pilares de conteúdo** em `calendario-editorial.md` ("Pilares de conteúdo do
  feed"), priorizando o pilar que está há mais tempo sem aparecer — não é grade fixa, é rotação por
  ausência
- Se tem data comemorativa próxima, ela tem prioridade sobre os pilares
- Pra cada dia da cadência, oferecer **2-3 opções de ângulo/tipo**, puxando de pilares diferentes quando possível (puxando
  também do "Banco de ângulos por tipo de conteúdo" em `calendario-editorial.md`) — não escolher um
  tipo fixo pelo usuário, ele decide pauta a pauta
- Indicar se o formato sugerido é carrossel, vídeo ou post único, e por quê
- Lembrar que o post pode ser **agendado** com data futura (não precisa publicar todos no mesmo dia)

### Passo 3 — Sugerir ideias de stories

- Cadência: **todo dia, 3 peças** — 1 criada + 1 repost de conteúdo de
  marcação/menção (amigos/seguidores que marcaram a Laet) + 1 repost de
  conteúdo próprio já existente. Só a primeira exige material novo.
- Dar a ideia da peça "criada" do dia, variando tipo (não repetir o mesmo tipo dois dias seguidos)
- Distinguir o que precisa de material das lojas (foto/vídeo bruto) do que pode ser feito só com arte/texto
- **Padrão, não opção:** Kevin sempre amarra a peça criada ao tema do post de feed da semana (baixa frequência de criação, não cria pauta de story solta) — a sugestão default é reaproveitar esse conteúdo (ex: enquete/caixinha de pergunta sobre a mesma dor, bastidor da produção, prévia, repost com sticker)
- Pro repost de marcação: lembrar o usuário de checar manualmente as marcações do Instagram (automação ainda não existe)

### Passo 4 — Lembrete de pedido de material

- Checar se hoje é dia da rotina fixa (segunda **ou quinta-feira**, conforme `calendario-editorial.md`)
- Se for, lembrar o usuário de mandar a mensagem-modelo pros vendedores, já preenchendo o "[algo específico]" com o tema da semana definido no Passo 2
- Se tem data comemorativa chegando em breve, lembrar do reforço pontual também

### Passo 4.5 — Sorteio mensal (sempre perguntar)

- Ler a seção "Sorteio mensal — recorrente" em `calendario-editorial.md`, que registra qual foi o último sorteio já colocado no site (`site/sorteios.html`)
- Perguntar ao usuário se já teve sorteio novo desde essa última atualização
- Se sim: pedir nome do ganhador principal, nome do amigo indicado, loja da compra e data do sorteio; atualizar `site/sorteios.html` (lista de ganhadores + rótulo "Prêmios de [mês]") e atualizar o registro em `calendario-editorial.md`
- Se não: só confirmar que está em dia, sem mexer em nada

### Passo 5 — Resumo

Entregar em formato direto, sem enrolação:

```
Semana de <data>

📌 Data comemorativa próxima: <nome, se houver> — ângulo: <texto>

FEED (1 dia sim, 1 dia não — ~3-4 essa semana, agendar em lote):
- Seg: opção 1 <ângulo/tipo> | opção 2 <ângulo/tipo>
- Qua: opção 1 <ângulo/tipo> | opção 2 <ângulo/tipo>
- Sex: opção 1 <ângulo/tipo> | opção 2 <ângulo/tipo>

STORIES (3/dia: 1 criado + 1 repost de marcação + 1 repost nosso):
- Criado: <ideia — precisa de material da loja? sim/não>
- Repost de marcação: checar manualmente as menções do Instagram
- Repost nosso: <sugestão de peça já existente pra reaproveitar>

📨 Pedido às lojas essa semana: <texto já preenchido, se for dia da rotina>

🎉 Sorteio: <em dia / pergunta sobre sorteio novo>
```

## Regras

- Nunca impor um tipo de conteúdo fixo — sempre oferecer opções, o usuário decide pauta a pauta
- Sempre ancorar em dor real ou data comemorativa, nunca em produto solto
- Não repetir tema de post de feed recém-publicado
- Se `_memoria/calendario-editorial.md` não existir ou estiver vazio, avisar e não inventar datas ou metas