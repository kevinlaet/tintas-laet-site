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

### Passo 2 — Sugerir o post de feed da semana

- Checar `marketing/conteudo/` pra ver o que já foi postado recentemente (não repetir tema)
- Cruzar com `_memoria/dores-clientes.md`: priorizar dor ainda não usada
- Se tem data comemorativa próxima, ela tem prioridade sobre a lista de dores
- Oferecer **2-3 opções de ângulo/tipo** (puxando do "Banco de ângulos por tipo de conteúdo" em `calendario-editorial.md`) — não escolher um tipo fixo pelo usuário, ele decide pauta a pauta
- Indicar se o formato sugerido é carrossel, vídeo ou post único, e por quê

### Passo 3 — Sugerir ideias de stories

- Dar 2-3 ideias de story pros próximos dias, variando tipo (não repetir o mesmo tipo dois dias seguidos)
- Distinguir o que precisa de material das lojas (foto/vídeo bruto) do que pode ser feito só com arte/texto
- Se o post de feed da semana já está definido, sugerir 1 story que reaproveite esse conteúdo (ex: bastidor da produção, prévia, repost com sticker de enquete)

### Passo 4 — Lembrete de pedido de material

- Checar se hoje é dia da rotina fixa (segunda-feira, conforme `calendario-editorial.md`)
- Se for, lembrar o usuário de mandar a mensagem-modelo pros vendedores, já preenchendo o "[algo específico]" com o tema da semana definido no Passo 2
- Se tem data comemorativa chegando em breve, lembrar do reforço pontual também

### Passo 5 — Resumo

Entregar em formato direto, sem enrolação:

```
Semana de <data>

📌 Data comemorativa próxima: <nome, se houver> — ângulo: <texto>

FEED (mín. 1 essa semana):
- Opção 1: <ângulo/tipo>
- Opção 2: <ângulo/tipo>
- Opção 3: <ângulo/tipo>

STORIES (mín. 2/dia):
- <ideia 1 — precisa de material da loja? sim/não>
- <ideia 2 — precisa de material da loja? sim/não>
- <ideia 3>

📨 Pedido às lojas essa semana: <texto já preenchido, se for dia da rotina>
```

## Regras

- Nunca impor um tipo de conteúdo fixo — sempre oferecer opções, o usuário decide pauta a pauta
- Sempre ancorar em dor real ou data comemorativa, nunca em produto solto
- Não repetir tema de post de feed recém-publicado
- Se `_memoria/calendario-editorial.md` não existir ou estiver vazio, avisar e não inventar datas ou metas