---
name: carrossel
description: >
  Cria carrosséis e posts visuais pra Instagram, TikTok, LinkedIn com a identidade visual da marca.
  Gera HTML estilizado + renderiza em PNG 1080x1350 via Playwright, com legenda pronta no final.
  Suporta carrossel texto puro, carrossel com foto IA (gerada via OpenAI) e post único.
  Use quando o usuário pedir "carrossel", "post", "conteúdo pro instagram", "criar imagem",
  "gerar foto", "post educativo", ou /carrossel.
---

# /carrossel — Carrossel e posts visuais

Skill central de criação de conteúdo visual. Pega um tema → entrega HTMLs estilizados + PNGs prontos pra postar + legenda no padrão da marca.

## Dependências

- **Identidade visual:** `identidade/design-guide.md` — LER ANTES de criar qualquer visual
- **Contexto do negócio:** `_memoria/empresa.md`
- **Tom de voz:** `_memoria/preferencias.md`
- **Pauta:** `_memoria/dores-clientes.md` — fonte preferencial de tema. Se o usuário não trouxer um tema específico, sugerir a próxima dor não usada ainda dessa lista (em vez de inventar um ângulo de produto solto)
- **Playwright:** pra renderizar HTML em PNG (`npx playwright screenshot` ou via `render.js`)
- **OpenAI API (opcional):** pra gerar fotos realistas — só se o cliente tiver chave configurada
- **Outputs vão em:** `marketing/conteudo/<tipo>-<tema>-<YYYY-MM-DD>/` — **exceto stories**, que vão em `marketing/stories/<YYYY-MM>/<DD>-<slug>/` (ver Passo 5)

---

## Tipos de conteúdo

Ao receber um pedido, identificar qual tipo se encaixa:

### 1. CARROSSEL TEXTO PURO
- **Quando usar:** posts educacionais, dicas, listas, explicações
- **Formato:** 1080x1350 (4:5) — sempre
- **Estilo:** tipografia clean, cores da marca alternadas, sem fotos

### 2. CARROSSEL COM FOTO
- **Quando usar:** é o **default** pra capa de qualquer carrossel — só pular foto se o tema for puramente uma lista/comparativo onde foto não ajuda
- **Formato:** 1080x1350 (4:5)
- **Estilo:** foto como capa com gradient overlay + slides internos no padrão alternado
- **Foto:** ordem de prioridade — real já existente (`site/images/prova-social/`, `marketing/imagem das lojas/`, `site/images/lojas/`) → real nova pedida à loja → gerada por IA (`scripts/gerar-imagem.js`) só quando as anteriores não cobrirem o tema. Ver `identidade/design-guide.md` → "Direção visual 2.0"

### 3. POST ÚNICO
- **Quando usar:** frase de impacto, dado/estatística, depoimento, bastidores
- **Formato:** 1080x1350
- **Estilo:** varia conforme o conteúdo (citação, número grande, foto com overlay)

### 4. STORY
- **Quando usar:** peça rápida pro Stories do Instagram (meta: mínimo 2/dia) — enquete, caixinha de pergunta, lembrete, promoção do dia, repost de carrossel já publicado
- **Formato:** 1080x1920 (9:16) — sempre
- **Estilo:** reaproveitar o mesmo template HTML/render.js entre stories, só trocando foto e texto — não recriar do zero a cada peça
- **Pasta:** `marketing/stories/<YYYY-MM>/<DD>-<slug>/` (ver Passo 5) — nunca em `marketing/conteudo/`

Se o tipo não estiver claro, perguntar:
> "Que tipo de conteúdo? (1) carrossel texto, (2) carrossel com foto, (3) post único, (4) story"

---

## Estilo visual base

O MazyOS tem um estilo próprio — editorial, calmo, premium. Sem clip-art, sem emoji decorativo, sem gradiente arco-íris, sem template genérico de IA. `identidade/design-guide.md` sobrescreve esses padrões; quando o design-guide for vago ou estiver em branco, usar o que tá aqui (não parar pra pedir `/instalar` — o `/carrossel` funciona com defaults bons).

### Tipografia padrão

- **Fonte:** Inter (Google Fonts), pesos 400/500/600/700/800/900
- **Título de capa:** 90-100px, weight 900, line-height 0.98, letter-spacing **-0.04em**
- **H2 (slides internos):** 60-72px, weight 800, line-height 1.04, letter-spacing **-0.035em**
- **Corpo:** 20-24px, weight 500, line-height 1.5
- **Eyebrow/kicker:** 13-16px, weight 700-800, **UPPERCASE**, letter-spacing **0.22-0.32em**, cor de destaque
- **Page counter (canto sup. dir.):** 14-16px, weight 500-600, letter-spacing 0.18em, cor muted
- **Meta/handle (@):** 15-18px, weight 600

Regra do tipo: títulos grandes com kerning **apertado** (-0.035em), eyebrows pequenos com kerning **aberto** (0.22em+). Esse contraste é o coração do estilo.

### Cores padrão (quando design-guide for vago)

Paleta sóbria: fundo dark + off-white + **UMA** cor de destaque. Nunca quatro cores brigando.

- Fundo escuro: `#0E1116` ou `#1A1A1A`
- Fundo claro alternativo: `#F5ECD7` (cream) ou `#FAFAF7`
- Texto sobre escuro: `#FAFAF7`
- Texto sobre claro: `#1A1A1A` (h2) e `#444` (corpo)
- Destaque: cor da marca (uma só)

### Elementos visuais recorrentes

- **Régua fina** (3-4px de altura, 60-80px de largura, cor de destaque) entre kicker e h2 ou como divisor
- **Logo top-left + page counter top-right** em todos os slides
- **Border-top 1px** `rgba(255,255,255,0.12)` separando rodapé do conteúdo (em slides escuros)
- **Stamps circulares** (200x200, border 3px translúcida, rotate -10deg) pra selos/datas/dados
- **Tags/pills** uppercase, padding generoso, kerning 0.2em, pra rotular categoria do slide
- Padding base: 70-100px nas laterais

### Layouts nomeados

Vocabulário de layout — cada slide tem um nome. Variar entre eles pra criar ritmo:

- **CAPA** — eyebrow + título grande + subtítulo + @handle. Fundo: foto com gradient overlay (`rgba(12,10,9,0.55)` → `rgba(12,10,9,0.85)`) OU sólido (escuro/claro/destaque)
- **SOLO** — split horizontal: foto à esquerda 50% + texto à direita 50% (kicker + h2 + régua + parágrafo)
- **DUO** — texto em cima (kicker + h2 + régua + p) + 2 fotos lado a lado embaixo (ou 1 foto larga)
- **NÚMERO** — numeral gigante (200-320px, weight 800, cor de destaque) como elemento gráfico + h2 + parágrafo de apoio
- **CITAÇÃO** — aspas grandes em watermark + frase em h2 + atribuição
- **CTA FINAL** — fundo na cor de destaque, logo centralizado, headline curta, botão/CTA, telefone/@handle
- **TIPO IMPACTO** — título gigante ocupando a peça inteira como elemento gráfico (estilo arquitetônico, não só texto informativo) — fundo sólido ou foto discreta atrás, tipografia é o protagonista do slide. Usar em peças de declaração/destaque, não em todo slide

**Ritmo de slide a slide:** alternar fundo escuro ↔ claro ↔ destaque. Nunca dois slides seguidos com o mesmo fundo.

---

## Padrão do carrossel

**Estrutura base (5 a 10 slides):**
- **Slide 1:** layout `CAPA`
- **Slides internos:** usar 2-3 layouts diferentes entre `SOLO` / `DUO` / `NÚMERO` / `CITAÇÃO`
- **Slide final:** layout `CTA FINAL`

Antes de criar HTML: ler `identidade/design-guide.md`. Se estiver em branco, usar o "Estilo visual base" acima como default.

### Sequência de capas no feed (planejamento de grade)

Antes de definir a capa, considerar a **última capa publicada** pra alternar:
- claro → próxima é foto/escuro
- foto/escuro → próxima é cor da marca
- cor da marca → próxima é claro
- nunca duas capas iguais em sequência

Se o usuário não souber qual foi a última, perguntar.

### Linguagem (regra crítica)

Seguir `_memoria/preferencias.md`. Em geral: frases naturais, sem jargão de marketing, sem corporativês. O público real raramente fala "ticket médio", "performance", "B2B". Falar como ele fala.

### Legenda — sempre gerar junto

Ao terminar de renderizar os PNGs, gerar **automaticamente** a legenda do post e salvar em `legenda.md` na mesma pasta. **Não esperar o usuário pedir.** Estrutura padrão:

1. Hook (pergunta ou afirmação)
2. Contexto (1-2 frases sobre o conteúdo)
3. CTA pra arrastar ("Arraste pro lado e confere")
4. Bloco de oferta (diferenciais da empresa, contato)
5. Hashtags (10-15 — público + nicho + local se aplicável)

---

## Workflow

### Passo 1 — Entender e planejar

1. Ler `_memoria/preferencias.md` e `_memoria/empresa.md`
2. Ler `identidade/design-guide.md` pra cores, fontes e logo
3. Identificar o tipo de conteúdo (1, 2 ou 3)
4. Definir o tema e o ângulo

### Passo 2 — Texto

Escrever o conteúdo seguindo as regras de tom:

**Pra carrossel (5-10 slides):**
- Slide 1 (Capa): título impactante, máx 8 palavras. Oferecer 3 opções
- Slides internos: um insight por slide, frases naturais, sem bullet points
- Slide final: CTA + logo

**Pra post único:**
- Frase principal em destaque
- Contexto de apoio (se necessário)
- CTA sutil

**CHECKPOINT:** Mostrar o texto completo. Esperar aprovação antes do visual.

### Passo 3 — Foto da capa (default)

Antes de gerar qualquer foto por IA, checar `site/images/prova-social/`, `marketing/imagem das lojas/` e `site/images/lojas/` — se tiver foto real que sirva pro tema, usar ela e pular pro Passo 4. Só gerar por IA quando não tiver nada real adequado.

**Fluxo atual: manual, via ChatGPT (plano Go do Kevin)** — sem orçamento pra API da OpenAI (precisa de créditos pré-pagos separados do plano de chat).

1. Montar prompt em inglês (modelos de imagem funcionam melhor em inglês)
2. Padrão genérico de prompt:

```
Professional [TIPO] photography of [ASSUNTO],
[DETALHES], [AMBIENTE/CONTEXTO],
[ESTILO DE LUZ] lighting, shallow depth of field,
shot from [ÂNGULO], [ESTILO/ESTÉTICA],
editorial quality
```

3. Entregar o prompt pronto pro usuário colar no ChatGPT (já tem geração de imagem incluída no plano Go) e pedir pra ele mandar a imagem gerada de volta aqui no chat.
4. Salvar a imagem recebida em `marketing/conteudo/<pasta>/foto-<nome>.png` e seguir.

**Regra da embalagem:** se o prompt incluir lata/embalagem de tinta no quadro, **sempre avisar o usuário pra enviar junto a foto real da embalagem da Laet** (`identidade/embalagens/<linha>-remove-bg-io.png`) quando for colar o prompt no ChatGPT. Sem a referência, o ChatGPT inventa um produto genérico/aleatório em vez da embalagem real da marca.

**Checklist de enquadramento (antes de gerar, ver `identidade/design-guide.md` → "Template padrão de peça"):** se vai ter embalagem/produto em cena, checar mentalmente onde caem os scrims do template (claro no topo, escuro na base) antes de escrever o prompt. Pedir enquadramento aberto ("de longe", com folga em volta) **e** posição estratégica explícita do produto no prompt (ex: terço inferior, totalmente visível, sem tocar as bordas) — as duas coisas juntas, não só uma.

**CHECKPOINT:** Foto aprovada → seguir. Se não, ajustar prompt e pedir nova geração.

> Nota: existe `scripts/gerar-imagem.js`, que automatiza isso via API da OpenAI — só usar se o Kevin confirmar que já tem créditos de API configurados em `.env`. Por padrão, seguir o fluxo manual acima.

### Passo 4 — Criar visuais (HTML + PNG)

1. Criar **um único `carrossel.html`** com TODOS os slides como `<div class="slide">` dentro do mesmo arquivo. Inline CSS, Google Fonts como única dependência externa. Aplicar:
   - Cores e tipografia de `identidade/design-guide.md`
   - Mínimo 2 layouts diferentes (não repetir o mesmo em todos os slides)
   - Logo top-left + slide-counter top-right em todos os slides
   - Slide final: logo + CTA, fundo na cor principal

   **Pra incluir foto IA no HTML:**
   ```html
   <div class="slide" style="
     background-image: linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.7)), url('foto-xxx.png');
     background-size: cover;
     background-position: center;
   ">
     <div class="content">
       <h2>Texto sobre a foto</h2>
     </div>
   </div>
   ```

2. Criar `render.js` na mesma pasta — script Node com Playwright que abre o HTML e tira screenshot de cada `.slide` em 1080x1350. Pode reutilizar `node_modules` de uma pasta anterior (não precisa rodar `npm install` toda vez):
```bash
NODE_PATH="<pasta-com-node_modules>/node_modules" node render.js
```

3. Mostrar slide 1, 2 e o CTA final renderizados. Se aprovado, mostrar os intermediários.

### Passo 5 — Salvar e organizar

**Carrossel / post único (feed):**
```
marketing/conteudo/<tipo>-<tema>-<YYYY-MM-DD>/
  texto.md              ← texto aprovado + legenda
  foto-<nome>.png       ← fotos geradas por IA (se houver)
  carrossel.html
  render.js
  instagram/
    slide-01.png → slide-NN.png
  tiktok/ (se pedido — formato 9:16)
    slide-01.png → ...
  legenda.md            ← legenda Insta+FB
  legenda-linkedin.md   ← (se pedido, mais formal)
```

**Story:** sempre em `marketing/stories/<YYYY-MM>/<DD>-<slug>/` (mês como pasta-mãe, nunca solto em `conteudo/` — com 2 stories/dia isso vira bagunça rápido):
```
marketing/stories/2026-06/20-parcelamento/
  story.html
  render.js
  instagram/
    slide-01.png (1080x1920)
```

### Passo 6 — Conexão com blog (opcional)

Depois de criar o conteúdo visual, perguntar:

> "Esse conteúdo dá pra virar artigo no blog também. Quer que eu crie a versão blog pra SEO?"

Se sim, chamar `/publicar-tema` com o mesmo tema.

---

## Regras

- Sempre ler `identidade/design-guide.md` antes de criar qualquer visual
- Carrossel: 1080x1350 (4:5 retrato) — sempre. TikTok/Reels: 1080x1920 (9:16) — só quando pedido explicitamente
- Linguagem segue `_memoria/preferencias.md` estritamente
- Sempre considerar a sequência de capa no feed antes de definir capa nova
- Sempre gerar legenda automaticamente ao final, salvando em `legenda.md`
- Fotos IA: sempre pedir aprovação antes de usar no carrossel
- Fotos IA: prompts em inglês
- Fotos IA: nunca gerar fotos de pessoas/rostos identificáveis
- HTMLs: um único arquivo `carrossel.html` com todos os slides + `render.js` na mesma pasta. Inline CSS
- Render: reutilizar `node_modules` quando possível (não rodar `npm install` em cada pasta)
- Não repetir layout entre slides — usar variação visual
