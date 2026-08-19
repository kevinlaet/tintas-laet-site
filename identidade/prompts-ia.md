# Prompts de imagem (API OpenAI) — como não ficar com cara de IA

> Guia de referência pra escrever prompts pro `scripts/gerar-imagem.js` (modelo `gpt-image-1.5`).
> Ler ANTES de gerar qualquer foto por IA. Complementa `identidade/design-guide.md` — as regras de cor, logo e template de peça continuam valendo por cima da foto gerada aqui.

---

## Por que uma imagem "parece IA"

Os erros mais comuns que entregam a imagem como gerada por IA:

- **Simetria perfeita demais** — composição centralizada, tudo alinhado, ninguém fica assim na vida real
- **Pele/superfície "plástica"** — muito lisa, sem poro, sem textura, iluminação de estúdio genérica
- **Objetos flutuando ou sem peso** — sombra errada, produto "colado" na cena em vez de apoiado
- **Fundo genérico de banco de imagem** — gradiente bonito demais, ambiente que não existe em lugar nenhum
- **Texto quebrado** — o modelo erra letras quase sempre; nunca pedir texto dentro da imagem
- **Cara de "americano de catálogo"** — rosto, roupa e ambiente que não batem com periferia do ABC/Zona Leste SP
- **Cor estourada** — saturação alta demais, briga com a paleta azul/amarelo da marca

O antídoto pra tudo isso é o mesmo: **tratar o prompt como um briefing pra um fotógrafo real**, não como pedido pra uma IA "criar uma imagem bonita". Fotógrafo real erra o enquadramento, pega luz ruim de tarde, mão suja de tinta — é essa imperfeição controlada que vende como foto de verdade.

---

## Estrutura do prompt (usar sempre essa ordem)

```
[1. Tipo de foto + assunto]
[2. Ambiente/contexto real]
[3. Iluminação]
[4. Câmera/lente]
[5. Enquadramento e posição do assunto]
[6. Textura/imperfeição realista]
[7. Negativos]
```

1. **Tipo de foto + assunto** — "Documentary-style photo of a Brazilian woman in her 30s painting a wall" (nunca "illustration", "render", "digital art")
2. **Ambiente/contexto real** — casa simples de periferia, obra residencial em andamento, loja de bairro — nunca "modern studio" ou ambiente genérico de classe alta
3. **Iluminação** — específica, nunca "studio lighting":
   - `soft natural window light, slightly overcast`
   - `late afternoon golden hour light through a window`
   - `warm fluorescent store lighting, slightly uneven`
4. **Câmera/lente** — isso sozinho já reduz metade do "AI look":
   - `shot on 35mm lens, f/2.8, shallow depth of field`
   - `handheld, slight motion blur`
   - `phone camera photo, slightly grainy, realistic compression`
5. **Enquadramento e posição** — seguir o checklist de scrim do `design-guide.md` (foto aberta, produto/pessoa no terço inferior, espaço livre em cima pro texto)
6. **Textura/imperfeição realista** — respingo de tinta na mão, pano velho, parede real com marca de rolo, poeira — não "clean, pristine, polished"
7. **Negativos** — sempre no fim do prompt (ver seção abaixo)

### Exemplo completo

```
Documentary-style photo of a Brazilian man in his 40s wearing a paint-splattered blue
uniform, rolling paint on an interior wall of a modest home, ABC region São Paulo style
residential setting, soft natural window light from the side, shot on 35mm lens f/2.8,
shallow depth of field, handheld feel, slight grain, visible paint texture on the wall
and roller, subject positioned in the lower two-thirds of the frame with open space
above for text overlay, no text, no logos, no watermark, not overly symmetric, realistic
skin texture, avoid glossy plastic look, avoid stock photo feel
```

---

## Regra da embalagem real (crítico)

O `gpt-image-1.5` em modo texto-pra-imagem **não conhece a lata da Laet** — se o prompt pedir "a can of Laet paint", ele inventa um rótulo genérico ou errado. Isso é o que mais grita "cara de IA" quando alguém que conhece a marca vê a peça.

**Regra:** nunca pedir pra a lata/produto aparecer dentro do prompt de geração.

- Gerar a cena **sem produto visível** — foco na pessoa, na parede, no ambiente, na mão com o rolo/pincel
- Depois, compor a lata real por cima no HTML/CSS, usando o PNG de `identidade/embalagens/<linha>-remove-bg-io.png`
- Isso também resolve enquadramento: já que a lata é um elemento HTML separado, dá pra posicionar ela com precisão em vez de torcer pro modelo acertar

Se um dia for necessário colocar a lata real *dentro* da foto gerada (não como overlay), existe o endpoint `images.edit` da OpenAI, que aceita uma imagem de referência (a lata real) e edita a cena ao redor dela — mas isso ainda não está implementado em `scripts/gerar-imagem.js`. Avisar Kevin antes de implementar, é mudança de script.

---

## Mascote — nunca gerar por IA

O mascote é ilustração vetorial oficial (`identidade/mascote alta qualidade-remove-bg-io.png`), não fotografia. Gerar ele via IA quebra a consistência do personagem (traço muda a cada geração). Sempre usar o PNG oficial como elemento composto no HTML, nunca pedir "the Laet mascot" dentro de um prompt de foto.

---

## Negativos padrão (colar no fim de todo prompt)

```
no text, no logos, no watermark, not overly symmetric, not airbrushed,
realistic skin texture, avoid glossy plastic look, avoid stock photo feel,
avoid perfect studio lighting, avoid oversaturated colors
```

Ajustar conforme o caso (ex: se a cena não tem gente, tirar "realistic skin texture").

---

## Templates por uso comum

**Cliente pintando (capa de carrossel/post):**
```
Documentary-style photo of a [gênero/idade] Brazilian person wearing paint-splattered
clothes, [ação: rolling paint on a wall / opening a paint can / painting a door],
modest residential setting typical of São Paulo's periphery, [luz], shot on 35mm f/2.8,
shallow depth of field, handheld feel, slight grain, subject in lower two-thirds of
frame, open space above for text, [negativos padrão]
```

**Textura de parede/material:**
```
Close-up documentary photo of [textura: freshly painted wall / cimento queimado
finish / paint roller texture], natural side light emphasizing texture, shot on
35mm macro-ish framing, shallow depth of field, slight grain, realistic imperfections,
[negativos padrão]
```

**Fachada/interior de loja (quando não houver foto real disponível):**
```
Documentary-style photo of a small neighborhood paint store [exterior/interior],
modest Brazilian commercial street, [luz: overcast daylight / warm interior
fluorescent], shot on 35mm f/4, straight-on angle, slight grain, realistic wear
and everyday clutter, [negativos padrão]
```

---

## Fluxo técnico

```bash
node --env-file=.env scripts/gerar-imagem.js "PROMPT" "destino.png" [low|medium|high] [1024x1536|1536x1024|1024x1024]
```

- **Qualidade:** `medium` é o padrão (omitir o 3º argumento) — custa ~$0,05/imagem no tamanho que usamos. Só pedir `high` (~$0,20/imagem, ~4x mais caro) pra peça de investimento alto: capa de catálogo impresso, anúncio pago de destaque, post de campanha importante (ex: inauguração de loja). Ainda assim é barato — não hesitar em usar `high` quando a peça justificar.
- **Tamanho:** `1024x1536` (retrato) é o padrão pra carrossel/story (4:5 e 9:16). Pra peça landscape (banner de site, capa larga), usar `1536x1024` — pedir no prompt uma composição pensada pra formato horizontal (assunto de um lado, espaço livre do outro), não só cortar depois uma foto de retrato. Gerar sempre enquadramento aberto (ver checklist abaixo) pra sobrar margem no crop final.

## Checklist antes de gerar (não depois)

Ver `identidade/design-guide.md` → "Template padrão de peça": mapear onde caem o scrim claro (topo, ~38-50%) e o scrim escuro (base, ~55-65%) e escrever o prompt já considerando isso —
- Enquadramento **aberto** ("de longe", folga generosa em volta do assunto)
- Posição do assunto **explícita no prompt** (ex: "positioned in the lower two-thirds of the frame, fully visible, not touching the edges, with clear space above for text overlay")

As duas coisas juntas — uma sem a outra ainda corta o assunto ou joga ele pra dentro do scrim.

## Depois de gerar

1. Mostrar a imagem antes de usar em qualquer peça — nunca aplicar direto sem aprovação
2. Se saiu com cara de IA (simetria, pele plástica, texto quebrado, produto genérico), ajustar o prompt com mais especificidade de câmera/luz/imperfeição, não só regenerar igual
3. Salvar em `marketing/conteudo/<pasta>/foto-<nome>.png` (peça específica) ou `marketing/banco-de-midia/` (reutilizável)
4. Aplicar por cima o template padrão do `design-guide.md` (scrim claro + logo + chip + scrim escuro + cards) — a foto sozinha nunca é a peça final
