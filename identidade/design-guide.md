# Identidade visual

> Como a marca aparece em tudo que o MazyOS gera.
> As skills de conteúdo, carrossel e post leem esse arquivo antes de criar qualquer visual.

---

## Cores

- **Fundo principal:** Azul Principal `#0D47A1` (60% das peças)
- **Cor de destaque / CTA:** Amarelo Destaque `#FFC107` (10% — botões, chamadas, preços)
- **Texto principal:** Branco `#FFFFFF` sobre fundos azuis
- **Fundo alternativo / cards:** Cinza Claro `#F0F2F5` ou Branco `#FFFFFF`
- **Azul escuro (profundidade):** `#062B63` (20%)
- **Amarelo apoio (sombra/suporte):** `#FFE082`
- **Grafite (texto sobre fundo claro):** `#212529`
- **Cor proibida:** Qualquer cor fora da paleta oficial

**Proporção de uso:** 60% Azul Principal · 20% Azul Escuro · 10% Amarelo Destaque · 10% Neutros

**Exceção — datas comemorativas:** em campanhas de datas comemorativas (Copa do Mundo, Natal, Dia das Crianças, etc.), pode-se usar a cor que representa o evento (ex: verde `#009739` na Copa) como destaque pontual, somada ao azul/amarelo da marca. Fora dessas datas, manter só a paleta oficial.

---

## Tipografia

- **Títulos e destaques institucionais:** Montserrat Extra Bold (36–72pt)
- **Subtítulos:** Montserrat Bold (18–32pt)
- **Destaques promocionais (ofertas, preços, chamadas de impacto):** Bebas Neue Regular (28–120pt)
- **Corpo de texto / apoio / legendas:** Poppins Regular ou Medium (10–16pt)
- **Peso do título:** Extra Bold para institucional, Bold para subtítulos

---

## Estilo geral

Azul Royal Premium — forte, vibrante e confiável. Transmite qualidade, modernidade, profissionalismo e proximidade com a comunidade. Visual limpo, contraste alto, direto ao ponto.

---

## Direção visual 2.0 (fotografia + tipografia ousada)

O card com ícone dentro de círculo (badge SVG) é genérico — qualquer loja de tinta usa esse formato. A partir de agora, **fotografia real em alta definição (ou gerada por IA quando não houver foto real adequada) é a base visual padrão** de capa e de pelo menos um slide interno em qualquer peça — não é mais uma opção condicional, é o default. Os cards de ícone continuam existindo, mas como apoio (lista de benefícios, diferenciais), nunca como elemento principal da peça.

**Ordem de prioridade da foto:**
1. Foto real já existente em `site/images/prova-social/`, `marketing/imagem das lojas/`, `site/images/lojas/` — sempre que servir pro tema
2. Foto real nova (pedida à loja, ver `_memoria/calendario-editorial.md`)
3. Foto gerada por IA — só quando as opções acima não cobrirem o tema. **Fluxo atual: manual**, sem orçamento pra API da OpenAI (precisa de créditos pré-pagos separados do plano ChatGPT). Montar o prompt (template abaixo), entregar pro Kevin colar no ChatGPT (plano Go, já tem geração de imagem incluída), e ele manda a imagem gerada de volta pra seguir o carrossel/story. `scripts/gerar-imagem.js` já existe e fica pronto pra automatizar isso quando houver orçamento de API — não usar por enquanto.

**Regra de qualidade:** nunca usar foto de baixa resolução, desfocada, pixelada ou com watermark. Sem foto boa disponível → gerar por IA em vez de usar uma fraca.

**Tipografia como elemento gráfico:** em peças de destaque, o título (Bebas Neue) pode ocupar a peça como elemento visual principal — grande, confiante, quase arquitetônico — não só como texto informativo em cima do fundo. Ver layout `TIPO IMPACTO` na skill `/carrossel`.

**Adiado (não fazer ainda, registrar pra depois):**
- Etiqueta de nome de cor sobre foto real (ex: "Vermelho Batom") — quando entrar, sempre referenciar uma cor real do catálogo (`site/catalogo/latex-vinil.html`), nunca nome genérico/inventado
- Paleta de cor extraída de foto real (amostras de cor tiradas da própria imagem)

---

## Template padrão de peça (foto + scrim) — referência obrigatória

Fundo de cor sólida/gradiente com mascote flutuando do lado (sem foto) ficou com **cara genérica de template de IA** — Kevin pediu pra abandonar esse caminho como padrão. A referência boa, validada por Kevin, é o story `marketing/stories/2026-06/20-parcelamento/story.html` ("12x sem juros"). Esse é o template a aplicar em qualquer peça nova (carrossel, post único, story):

1. **Fundo:** foto real (ou IA, seguindo a ordem de prioridade já descrita) cobrindo o slide inteiro — nunca cor sólida/gradiente puro como fundo principal de capa
2. **Scrim claro no topo** (gradiente do creme `#F5ECD7` pra transparente) — garante contraste pro logo e título mesmo a foto sendo clara
3. **Logo centralizado** no topo, dentro da área do scrim claro, no tamanho grande já padronizado (270–320px de altura)
4. **Título com "chip" de destaque:** uma palavra-chave da headline ganha fundo amarelo `#FFC107`, padding generoso, levemente rotacionado (-2deg), texto azul escuro — não o título inteiro
5. **Scrim escuro na base** (gradiente de transparente pra azul bem escuro quase opaco) — é onde ficam os benefícios/CTA, sempre legível sobre a foto
6. **Cards de benefício** sobre o scrim escuro: fundo azul translúcido, borda branca sutil, ícone circular (amarelo ou verde) + texto bold branco — não badges/pills genéricos soltos
7. **Rodapé** (@handle + linha de apoio) com borda superior sutil, sempre dentro do scrim escuro

Cards de ícone em fundo sólido sem foto (como o slide de bullets claro que foi feito antes desse ajuste) só valem como **slide de apoio dentro do carrossel** (explicação, comparativo), nunca como capa — e mesmo esses slides de apoio devem incluir a foto real quando possível (layout SOLO: foto de um lado, texto do outro), não ficar 100% sem imagem.

**Checklist de enquadramento (checar ANTES de gerar a foto, não depois):** se a foto vai ter embalagem/produto em cena, mapear mentalmente onde caem o scrim claro (topo, ~38-50% da peça) e o scrim escuro (base, ~55-65% da peça) antes de montar o prompt — esses dois trechos ficam escurecidos/clareados por cima e qualquer elemento importante preso ali perde legibilidade. Pra isso:
- Pedir um enquadramento **mais aberto** ("de longe", com folga generosa em volta do produto) — isso dá margem pra crop diferente em carrossel (4:5) e story (9:16) sem cortar o produto na borda
- Especificar no prompt uma **posição estratégica explícita** pro produto (ex: "positioned in the lower-third of the frame, fully visible, not touching the edges, with clear space above for text overlay") — não deixar a composição genérica e só ajustar depois
- As duas coisas juntas, não uma ou outra: enquadramento aberto sem posição definida ainda pode jogar o produto pra zona de scrim; posição definida sem folga ainda corta nas bordas ao trocar a proporção

---

## Elementos-chave

- Bordas: mínimas, sem ornamentos
- Border-radius dos cards: suave (4–8px)
- Botões: fundo amarelo `#FFC107` com texto grafite `#212529` ou branco sobre azul
- Sombras: leves, apenas para separar planos

---

## O que NUNCA fazer

- Usar cores fora da paleta oficial
- Distorcer, inclinar ou modificar as proporções das fontes
- Poluir a peça com muita informação
- Usar fontes que não sejam as oficiais
- Espaçamento excessivo entre letras ou palavras

---

## Logo

- **Arquivo principal:** `identidade/logo tipo original.jpg`
- **Versão fundo escuro:** `identidade/logotipo branco.jpg`
- **Mascote:** `identidade/mascote oficial pose 1.jpg`
- **Onde usar:** slide final de carrossel (CTA), header de propostas, posts institucionais
- **Tamanho mínimo (atualizado):** o logo estava saindo pequeno demais nas peças — aumentar em pelo menos 50% sobre o padrão antigo (120–200px de largura / ~180px de altura) a partir de agora:
  - Carrossel/post (1080px largura): altura mínima de **270px**
  - Stories (1080x1920): altura mínima de **300px**
  - O logo precisa ter presença visual clara, nunca discreto/pequeno no canto

---

## Observações adicionais

O mascote (pintor com uniforme azul da marca) é um diferencial da identidade. Usar em campanhas promocionais e posts de destaque reforça o reconhecimento da marca na comunidade.
