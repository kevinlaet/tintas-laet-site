---
name: auditoria-visual
description: >
  Confere se as peças publicadas recentemente (feed + stories) ainda seguem o padrão visual de
  identidade/design-guide.md — proporção de cor, logo, tipografia, slide final sempre azul,
  sequência de capa. Gera um relatório curto apontando desvios, sem regerar nada sozinho. Use
  quando o usuário pedir "confere o padrão visual", "os posts estão consistentes?", "auditoria
  de marca", ou /auditoria-visual.
---

# /auditoria-visual — Checagem de consistência da identidade visual

Feita pra quem está publicando em volume e não consegue mais olhar peça por peça: em vez de
avaliar cada post na hora, roda uma checagem periódica sobre o que já foi publicado e aponta onde
a identidade visual (`identidade/design-guide.md`) começou a fugir do padrão.

## Quando usar

- Kevin pede diretamente ("confere se os posts recentes estão no padrão")
- Proativamente, quando fizer sentido sugerir (ex: volume de posts cresceu bastante desde a última
  checagem) — nunca rodar sozinho sem avisar, só sugerir

## Quando NÃO usar

- Avaliação de uma peça só, antes de postar → isso já acontece no checkpoint do `/gerar-post`/`/carrossel`
- Não serve pra corrigir nada automaticamente — só relata, quem decide o que corrigir é o Kevin

## Dependências

- `identidade/design-guide.md` — fonte das regras (ler sempre a versão atual, não confiar em regra
  memorizada de conversa antiga, o guide pode ter mudado)
- `marketing/conteudo/` e `marketing/stories/` — onde estão as peças publicadas

## Workflow

### Passo 1 — Definir o período

Padrão: últimos 30 dias. Se o usuário pedir outro período/quantidade, usar o que ele pedir.

### Passo 2 — Listar as peças

Varrer `marketing/conteudo/<tipo>-<tema>-<data>/` e `marketing/stories/<YYYY-MM>/<DD>-<slug>/`
dentro do período, pegando os PNGs renderizados (`instagram/slide-*.png`) e o HTML de origem
(`carrossel.html`/`story.html`).

### Passo 3 — Checar cada peça

Olhar os PNGs diretamente (a IA lê imagem) e cruzar com `identidade/design-guide.md`:

- **Proporção de cor:** aproximadamente 60% Azul Principal / 20% Azul Escuro / 10% Amarelo Destaque
  / 10% neutros — não precisa ser exato, mas sinalizar se uma peça está claramente fora (ex: mais
  amarelo que azul)
- **Slide final:** sempre fundo azul, nunca amarelo sólido como fundo dominante
- **Logo:** presente, tamanho mínimo (270px carrossel/post; 280px story centralizado ou 110px story
  canto) — sinalizar se sumiu ou ficou pequeno demais
- **Tipografia:** títulos em Montserrat/Bebas Neue, corpo em Poppins — sinalizar fonte fora do padrão
- **Cor fora da paleta:** qualquer cor que não seja azul principal/escuro, amarelo destaque, cinza
  claro, branco ou grafite (exceto exceção de data comemorativa documentada no design-guide)
- **Sequência de capa:** comparando com a peça anterior, checar se não repetiu o mesmo tipo de fundo
  de capa (claro → foto/escuro → cor da marca → repete)

### Passo 4 — Relatório

Formato direto:

```
Auditoria visual — últimos <N> dias (<data início> a <data fim>)

<X> peças no período, <Y> dentro do padrão, <Z> com desvio

Desvios encontrados:
- <pasta/peça>: <regra violada> — <onde exatamente, ex: "slide 4">
- ...

Sem desvios: peças ok, nada a fazer.
```

Salvar em `dados/auditoria-visual-<YYYY-MM-DD>.md`.

### Passo 5 — Entrega

Mostrar o relatório resumido no chat, apontar pro arquivo completo, e perguntar se quer que algum
desvio específico seja corrigido agora (só se pedido — não corrigir proativamente).

## Regras

- Só relata, nunca regenera peça sozinho
- Sempre ler `identidade/design-guide.md` na hora, não confiar em versão antiga da conversa
- Sem desvio nenhum encontrado também é resultado válido — não forçar achar problema
- Peça antiga já publicada com desvio: reportar mesmo assim, mas deixar claro que corrigir uma peça
  já no ar é decisão do Kevin (pode não valer a pena mexer de novo, dependendo do caso)
