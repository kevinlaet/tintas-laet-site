---
name: gerar-post
description: >
  Gera um post de feed completo do início ao fim sem pausas no meio — escolhe a pauta sozinho,
  escreve o texto, resolve a foto (real ou IA) e renderiza o carrossel inteiro — e só chama o
  usuário UMA vez no final, numa tela de revisão única onde ele aprova ou pede um ajuste em uma
  frase curta. Feito pra quando o usuário está sem tempo de participar do processo passo a passo
  e quer só aprovar no fim. Use quando o usuário disser "cria um post pra mim", "gera o post da
  semana sozinho", "quero só aprovar", "me poupa esse trabalho", ou /gerar-post.
---

# /gerar-post — Post pronto de ponta a ponta, uma revisão só

Versão "modo poupa-tempo" do `/carrossel`: em vez de parar em 2-3 checkpoints (texto → foto →
visual), roda tudo direto e para **uma única vez**, no final, com a peça inteira pronta.

Usar quando o usuário quer participar o mínimo possível do processo de criação. Se ele quiser
acompanhar/decidir em cada etapa (escolher ângulo, aprovar foto antes de montar), usar `/carrossel`
normal em vez desta.

## Dependências

Mesmas do `/carrossel` — ler antes de começar:
- `_memoria/preferencias.md` (tom de voz)
- `_memoria/empresa.md` (contexto do negócio)
- `_memoria/produtos.md` (nunca afirmar dado técnico de produto não confirmado)
- `identidade/design-guide.md` (cores, fontes, logo)
- `identidade/prompts-ia.md` (se precisar gerar foto)
- `_memoria/calendario-editorial.md` e `_memoria/dores-clientes.md` (pauta)

## Workflow

### Passo 1 — Escolher a pauta sozinho (sem perguntar)

Igual ao `/pauta-semana`, mas sem oferecer opções — decide e segue:

1. Checar `calendario-editorial.md`: se tem data comemorativa nos próximos ~10 dias, ela vence.
2. Senão, cruzar os **6 pilares de conteúdo** (`calendario-editorial.md`, seção "Pilares de conteúdo
   do feed") com o que já foi postado em `marketing/conteudo/` recente e escolher o pilar que está
   há mais tempo sem aparecer. Dentro do pilar escolhido, seguir a fonte indicada na tabela (ex:
   pilar "Produto" → checar `produtos.md`; pilar "Promoções" → **perguntar ao usuário qual promoção
   está ativa antes de seguir**, nunca supor).
3. Decidir o formato (carrossel texto, carrossel com foto, ou post único) usando os critérios do
   `/carrossel` — carrossel com foto é o default pra capa, a menos que o tema seja lista/comparativo.

### Passo 2 — Texto (sem checkpoint)

Escrever o texto completo (capa + slides + CTA) seguindo as regras do `/carrossel` (tom, estrutura,
regra da dor negativa só no slide 1). **Não parar pra mostrar e pedir aprovação aqui** — isso é o
ponto principal desta skill. Seguir direto.

### Passo 3 — Foto (sem checkpoint)

Ordem de prioridade igual ao `/carrossel`: foto real existente (`site/images/prova-social/`,
`marketing/imagem das lojas/`, `site/images/lojas/`) → gerar por IA (`scripts/gerar-imagem.js`,
qualidade `medium`) só se não tiver real adequada. Gerar e seguir direto pro próximo passo — a
aprovação da foto acontece junto com a revisão final (Passo 5), não isolada.

Anotar mentalmente se a foto é real ou gerada por IA, pra avisar no resumo final.

### Passo 4 — Montar e renderizar

Criar `carrossel.html` + `render.js`, renderizar os PNGs, gerar `legenda.md` — mesmas regras
visuais e de pasta do `/carrossel` (`marketing/conteudo/<tipo>-<tema>-<YYYY-MM-DD>/`).

### Passo 5 — Revisão única (o único ponto de parada)

Mostrar tudo de uma vez:

```
Post pronto — <tema>

Formato: <carrossel de N slides / post único>
Capa: <descrição curta> (foto: real / gerada por IA)
Slides: <resumo de 1 linha por slide>

Legenda:
<legenda.md inteira>

Arquivos: marketing/conteudo/<pasta>/instagram/

Aprova? Ou me diz o que ajustar (ex: "troca o título do slide 2", "foto mais clara",
"legenda mais curta").
```

### Passo 6 — Ajustes simples (loop curto)

Se o usuário pedir um ajuste, aplicar direto (editar texto/HTML, re-renderizar só o que mudou) e
mostrar de novo o que mudou — não repetir o resumo inteiro, só a parte alterada. Repetir até ele
aprovar.

### Passo 7 — Aprovado: publicar

Checar se `.env` tem `META_PAGE_ACCESS_TOKEN`, `META_PAGE_ID`, `META_IG_USER_ID`, `SITE_URL`.

**Se faltar:** avisar que a postagem automática não está configurada ainda, apontar pra
`marketing/automacao-meta-setup.md`, e deixar o caminho manual como fallback (PNGs +
`legenda.md` prontos em `marketing/conteudo/<pasta>/instagram/`).

**Se estiver configurado:**
1. Copiar os PNGs de `<pasta>/instagram/` pra `site/images/posts/<slug>/`
2. `git add site/images/posts/<slug>/ && git commit -m "post: <tema>" && git push origin main`
3. Aguardar deploy (checar `curl -sf -o /dev/null -w "%{http_code}" "$SITE_URL/images/posts/<slug>/slide-01.png"` até dar 200, timeout 5 min)
4. Perguntar: **"Confirma publicação no Instagram + Facebook agora? (sim/não)"** — só seguir com sim
5. `node --env-file=.env scripts/postar-instagram.js marketing/conteudo/<pasta>`
6. `node --env-file=.env scripts/postar-facebook.js marketing/conteudo/<pasta>`
7. Mostrar os links dos posts publicados

Se qualquer passo falhar, parar e relatar — não tentar nos dois canais se o primeiro já deu erro.

### Passo 8 — Publicado: impulsionar (opcional)

Só oferecer depois que o post estiver publicado de verdade (Passo 7 concluído).

1. Perguntar: **"Quer impulsionar esse post? Se sim, me diz o orçamento total e por quantos dias."**
   Se ele não quiser, parar aqui — impulsionar nunca é o padrão, sempre uma escolha explícita.
2. Com orçamento e dias em mãos, rodar em modo rascunho (não gasta nada):
   `node --env-file=.env scripts/impulsionar-post.js criar <post-id> <facebook|instagram> <orcamento> <dias>`
3. Mostrar o resumo que o script imprime (orçamento/dia, IDs criados) e confirmar de novo:
   **"Confirma ativar? Isso começa o gasto real de R$ <valor> em <dias> dia(s). (sim/não)"**
   — Essa confirmação é **obrigatória e nunca pode ser pulada**, mesmo que o usuário já tenha
   dito "impulsiona" antes — ele confirmou a intenção, não o valor final calculado.
4. Só com "sim" explícito: `node --env-file=.env scripts/impulsionar-post.js ativar <adset-id> <campaign-id>`
5. Confirmar que ativou e lembrar: segmentação default é só "Brasil, 18+" — para campanhas
   maiores, vale refinar pra raio das lojas / interesses antes (não faz parte desta skill, mas
   avisar que dá pra ajustar direto no Ads Manager depois de ativado).

## Regras

- **Um checkpoint só, no final.** Essa é a diferença central pro `/carrossel` — não parar no meio
  por padrão, mesmo em pontos onde `/carrossel` normalmente pararia (texto, foto IA).
- Nunca inventar dado técnico de produto — se faltar informação em `produtos.md`, usar a
  resposta-padrão do próprio arquivo em vez de supor.
- Se faltar contexto essencial pra decidir sozinho (ex: `dores-clientes.md` vazio, nenhuma pauta
  disponível), aí sim parar e perguntar — não inventar pauta do nada.
- Formato e estilo visual seguem `identidade/design-guide.md` e as regras do `/carrossel`
  integralmente — a única mudança aqui é *quando* o usuário é chamado, não o padrão de qualidade.
