---
name: postar-story
description: >
  Recebe um story já pronto (foto ou vídeo editado por Kevin ou pela colaboradora externa),
  armazena na pasta certa, sugere uma legenda curta e publica no Instagram Stories via Meta
  Graph API. Não edita vídeo — a edição continua sendo feita fora desta skill. Use quando o
  usuário mandar um vídeo/foto pra story e disser "posta esse story", "manda isso pro story",
  "guarda esse vídeo", ou /postar-story.
---

# /postar-story — Guardar e publicar story já pronto

Diferente do tipo STORY dentro de `/carrossel` (que monta a peça do zero em HTML), essa skill
recebe uma **mídia já finalizada** — Kevin ou a colaboradora já cortaram e legendaram o vídeo/foto
fora do MazyOS — e cuida só de guardar, sugerir texto de apoio e publicar.

## Quando NÃO usar

- Pedido de story montado do zero (texto + template) → usar `/carrossel`, tipo STORY
- Mídia ainda não editada / bruta → não é escopo desta skill, devolver pro Kevin ou pra colaboradora
- Post de feed → `/gerar-post` ou `/carrossel`

## Dependências

- `_memoria/preferencias.md` (tom de voz da legenda sugerida)
- `marketing/automacao-meta-setup.md` (pré-requisitos de `.env` — mesmos tokens já usados por
  `postar-instagram.js`/`postar-facebook.js`, nenhuma permissão nova)
- `scripts/postar-story.js`

## Workflow

### Passo 1 — Receber a mídia e o tema

Kevin manda o arquivo (foto ou vídeo) + o tema/contexto em uma frase. Se ele não disser o tema,
perguntar rapidamente (isso é diferente de `/gerar-post` — aqui a mídia já existe, então uma
pergunta rápida não atrapalha o fluxo).

### Passo 2 — Salvar

Salvar em `marketing/stories/<YYYY-MM>/<DD>-<slug>/`, mesma convenção usada pelo tipo STORY de
`/carrossel`. Nome do arquivo mantém a extensão original (`.mp4`, `.mov`, `.jpg`, `.png`).

### Passo 3 — Sugerir legenda/sticker curto

Sugerir 1 linha curta baseada no tema (pergunta pro sticker de enquete, frase de apoio, ou nada se
o vídeo já se explica sozinho) — seguir `_memoria/preferencias.md`. Mostrar a sugestão e perguntar
se aprova ou ajusta.

### Passo 4 — Publicar

Checar `.env` (`META_PAGE_ACCESS_TOKEN`, `META_IG_USER_ID`, `SITE_URL`). Se faltar, apontar pra
`marketing/automacao-meta-setup.md` e parar — mídia já está salva, só falta publicar depois.

Se configurado:
1. Copiar o arquivo pra `site/images/stories/<slug>/` (foto) ou `site/videos/stories/<slug>/` (vídeo)
2. `git add` + commit + push, aguardar deploy (mesmo padrão de `/aprovar-post`)
3. Confirmar: **"Confirma publicar esse story agora? (sim/não)"**
4. `node --env-file=.env scripts/postar-story.js marketing/stories/<pasta> <imagem|video>`
5. Mostrar confirmação de publicado

## Regras

- Nunca editar o conteúdo da mídia (corte, filtro, legenda embutida) — isso é fora do escopo, quem
  edita é Kevin ou a colaboradora
- Facebook Stories fica de fora por ora — só Instagram (API mais estável hoje)
- Se o vídeo demorar mais que alguns minutos processando no Graph API (`status_code` não vira
  `FINISHED`), avisar e não travar — pode publicar depois com o mesmo comando
