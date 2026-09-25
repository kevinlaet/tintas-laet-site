---
name: trafego-pago-especialista
description: >
  Estratégia de tráfego pago (Meta Ads) especializada no nicho exato da Laet — bairros periféricos/
  favela-adjacentes, público de baixa renda, diferencial de parcelamento 12x sem juros, negócio
  pequeno e familiar em ascensão. Sempre lê os dados reais da conta de anúncios (via painel) antes
  de recomendar qualquer coisa — nunca fala no genérico. Use quando o usuário pedir "estratégia de
  tráfego pago", "otimiza meus anúncios", "análise de campanha", "o que fazer com o orçamento de
  ads", "melhora meu tráfego pago", ou /trafego-pago-especialista.
---

# /trafego-pago-especialista — Estratégia de Meta Ads pro nicho da Laet

Não é um curso genérico de Meta Ads — é focado no público real da Laet e sempre grounded nos dados
reais da conta (a página "Tráfego pago" do painel já existe e mostra isso). Complementa o
`/relatorio-ads` (que lê CSV exportado manualmente e cobre Google+Meta) puxando direto da API viva
da Meta, com recomendação já filtrada pelo contexto do negócio.

## Contexto do nicho (fixo — não é pesquisa nova toda vez)

- **Público:** dono/dona de casa de baixa renda, muitas lojas em avenidas perto de/em áreas de
  favela, região ABC e Zona Leste de SP.
- **Diferencial comercial real:** preço abaixo do mercado, **parcelamento 12x sem juros**, frete
  justo. É o gancho mais forte que a Laet tem — a mensagem de anúncio deveria girar em torno disso,
  não só mencionar de passagem.
- **Produto:** mix real — a maioria excelente qualidade, mas alguns itens mais simples/baratos.
  **Nunca prometer qualidade que o produto específico não tem** — checar sempre
  `_memoria/produtos.md` antes de qualquer claim em anúncio.
- **Empresa:** pequena, familiar, em ascensão — comunicação de vizinho, não de rede corporativa
  (mesmo tom já documentado em `_memoria/preferencias.md`).
- **Orçamento:** teto de R$1.000/mês, sem margem pra pedir mais agora (ver `_memoria/estrategia.md`
  — estrutura já definida de campanhas A/B/C por loja).

## Princípios de tráfego pago pra esse público

*(Pesquisa de mercado geral — nunca copiado de concorrente específico, sempre destilado em
princípio, seguindo a mesma regra do `/pesquisa-mercado`.)*

1. **Parcelamento é a mensagem principal, não o rodapé.** Público de baixa renda responde mais a
   "cabe no bolso" (parcelamento, preço acessível) do que a apelo estético puro — o "12x sem juros"
   deveria abrir o anúncio, não aparecer só no meio do texto.
2. **Segmentação por faixa de renda existe na Meta e provavelmente nunca foi testada aqui.** O
   Gerenciador de Anúncios permite filtrar por faixa de renda familiar dentro da segmentação
   demográfica — vale testar isso dentro do raio de loja já configurado, em vez de confiar só na
   geografia.
3. **Sair da "fase de aprendizado" exige volume.** O algoritmo da Meta precisa de ±50 eventos de
   otimização por semana **por conjunto de anúncios** pra sair da fase instável/cara. Com
   R$1.000/mês, isso só é viável se o orçamento estiver concentrado em poucos conjuntos — reforça
   por que consolidamos em 3 campanhas (A/B/C) em vez de uma por post.
4. **Cliente que já te conhece converte bem mais, por bem menos.** Um público "quente" (quem já
   visitou o site, comentou, mandou DM, clicou no WhatsApp) costuma converter várias vezes melhor
   que público frio, a um custo bem menor. A estrutura atual (A/B/C) é toda de público frio por
   raio geográfico — uma fatia pro público quente é uma oportunidade real, mas **exige configurar
   evento de remarketing antes** (não existe ainda) — validar com o Kevin antes de montar.
5. **Raio em camadas performa melhor que raio único.** Em vez de um raio fixo igual pra toda a
   verba, concentrar orçamento maior nos primeiros km (maior chance de visita real) e mais enxuto
   nas bordas do raio — a ferramenta de raio por loja já existe no painel, é questão de testar essa
   distribuição de orçamento dentro dela.
6. **A primeira frase decide tudo.** Só os primeiros ~125 caracteres aparecem antes do "ver mais" —
   a frase de abertura precisa parar o scroll (e, por #1, isso geralmente significa falar de preço/
   parcelamento logo de cara).
7. **Título curto, focado em benefício** (5-7 palavras) — nunca frase de efeito longa.

## Workflow

### Passo 1 — Buscar os dados reais (nunca recomendar no genérico)

Puxar a function `trafego-pago-dados` do painel (`tintas-laet-painel/netlify/functions/
trafego-pago-dados.js` — devolve `serieDiaria`, `totais`, `campanhas`, `lojas`) ou, se não tiver
acesso direto, pedir pro Kevin abrir a página "Tráfego pago" no painel e descrever/printar:

- Gasto total no período x teto de R$1.000/mês (estourou? sobrou margem?)
- CTR médio (faixa saudável de referência pra Meta feed/reels: ~1-2%; abaixo disso, o criativo ou a
  segmentação provavelmente precisam de ajuste)
- Quantas campanhas estão de fato ativas e com que orçamento cada uma
- Campanha rodando há muitos dias com pouco gasto/resultado — sinal de conjunto preso na fase de
  aprendizado (ver princípio #3)

### Passo 2 — Cruzar com a estrutura já definida

Ler `_memoria/estrategia.md` (campanhas A/B/C, segmentação por loja) — a recomendação sempre refina
o que já foi decidido, nunca ignora ou propõe reconstruir do zero sem motivo.

### Passo 3 — Recomendação priorizada (3-5 ações concretas)

Mesmo padrão do `/relatorio-ads`: ação nomeada, com número e motivo — nunca "otimizar campanhas".

```
1. Ativar segmentação por faixa de renda na Campanha A (raio Vila Bela) — nunca testado
2. Reescrever a legenda do anúncio ativo — primeira frase não menciona parcelamento, mover "12x sem
   juros" pra abertura
3. [Se aplicável] Considerar uma fatia pequena (~R$100/mês) pra público quente — precisa configurar
   pixel/evento de remarketing antes, validar comigo se vale o esforço agora
```

### Passo 4 — Aprovação antes de qualquer mudança real

Nenhuma sugestão desta skill ativa, pausa ou realoca orçamento sozinha — o mesmo desenho de
segurança de todo o resto do sistema (ver `impulsionar-criar.js`/`impulsionar-ativar.js` no painel):
só sugere, o Kevin decide e executa (ou pede pra eu executar, com confirmação explícita).

## Sobre "incluir no mecanismo automático do painel"

Ainda não existe uma automação que mexe em lance/orçamento sozinha — fazer isso sem supervisão é um
risco financeiro real, e `CLAUDE.md` §"Segurança em primeiro lugar" pede conversa antes de qualquer
automação nova que mexe com dinheiro. O que já existe hoje: a página "Tráfego pago" mostra gasto
real e histórico de 120 dias, e essa skill lê esses dados quando chamada.

Próximo passo possível, a confirmar com o Kevin antes de construir (não fazer sem esse aval): um
alerta automático no painel — nunca mexe no gasto sozinho, só avisa (reusando o mesmo "Próximos 10
minutos" que já existe no dashboard) quando um conjunto está preso na fase de aprendizado ou o CTR
caiu muito.

## Regras

- Nunca recomendar sem antes olhar os dados reais — se não conseguir os dados, dizer isso
  explicitamente e pedir, em vez de dar conselho genérico
- Nunca prometer qualidade que o produto específico não tem — checar `_memoria/produtos.md` antes
  de qualquer claim de produto no texto do anúncio
- Nunca mudar orçamento/status de campanha sozinho — só sugere
- Linguagem do dono, não jargão de agência — mesma regra do `/relatorio-ads`
