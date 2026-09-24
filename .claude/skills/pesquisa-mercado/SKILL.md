---
name: pesquisa-mercado
description: >
  Faz uma pesquisa de mercado breve e comercial antes de criar conteúdo — o que outras lojas de
  tinta (principalmente varejo/loja física, secundariamente fabricantes) estão postando, promovendo
  ou testando agora. Não é auditoria interna nem SEO técnico, é "o que está rolando lá fora que é
  relevante pra gente". Use quando o usuário pedir "pesquisa de mercado", "o que a concorrência tá
  fazendo", "tem algo novo no mercado de tintas", antes de uma sessão de criação de conteúdo se
  fizer tempo que não roda, ou /pesquisa-mercado.
---

# /pesquisa-mercado — Radar comercial de lojas de tinta

Pesquisa curta (não é um relatório de SEO/concorrência completo — isso já existe no Passo 2 do
skill `/seo`) pra manter o conteúdo antenado no que outras lojas de tinta estão fazendo de
relevante agora, sem virar um projeto de pesquisa toda vez que for criar um post.

## Foco (importante)

- **Prioridade: lojas de tinta / varejo** — é o nosso negócio de verdade (comércio, não fábrica).
  O que uma loja de tinta concorrente está promovendo, que formato de post está usando, que
  gancho de venda está testando.
- **Secundário: fabricantes** (Suvinil, Coral, Sherwin-Williams, etc.) — a Laet também fabrica, então
  vale de vez em quando, mas nunca no lugar do foco comercial/varejo.
- **Nunca:** pesquisa técnica de fabricação/química de tinta — isso não é o que o Kevin precisa
  daqui, é puramente comercial/marketing.

## Quando usar

- Antes de uma sessão de criação de conteúdo (`/pauta-semana`, `/gerar-post`, `/carrossel`), se já
  fez mais de ~2 semanas desde a última pesquisa — perguntar/sugerir, nunca rodar escondido
- Kevin pede diretamente
- Quando um formato ou promoção específica aparecer repetido nos achados anteriores, vale checar
  se ainda está ativo antes de reciclar a ideia

## Workflow

### Passo 1 — Checar a última pesquisa

Olhar `dados/pesquisa-mercado-<data>.md` mais recente (se existir) — não repetir a mesma busca de
poucos dias atrás, e comparar se algo que apareceu antes ainda está valendo.

### Passo 2 — Buscar (`WebSearch`)

3-5 buscas curtas, não uma investigação exaustiva. Exemplos de busca (ajustar termos pelo tema do
momento, se houver um):

- "loja de tintas promoção instagram [mês/ano atual]"
- "tinta parcelamento 12x sem juros loja" (compara com o próprio diferencial da Laet)
- "[concorrente regional conhecido, se houver] instagram tintas"
- "tendência conteúdo instagram loja de material de construção [ano atual]"
- Se tiver um tema específico em mãos (ex: vai criar post sobre "cheiro de tinta"): "loja tinta post
  cheiro tinta instagram" — pra ver se alguém já fez esse ângulo e como

### Passo 3 — Filtrar pelo que é relevante de verdade

Descartar qualquer achado que seja só "notícia genérica de fabricante grande" sem nada replicável
pro tamanho da Laet (6 lojas de bairro, não rede nacional). Manter só o que for:

- Um formato de post/story que uma loja (não fabricante) está usando com frequência
- Uma promoção/mecânica comercial (parcelamento, frete, sorteio, indicação) que apareça em mais de
  um lugar — sinal de tendência, não caso isolado
- Um gancho de conteúdo (dor, humor, bastidor) que pareça estar funcionando bem pra lojas do mesmo
  porte/público

### Passo 4 — Relatório curto

Formato direto, sem enrolação — 3 a 5 achados, nunca uma lista longa:

```
Pesquisa de mercado — <data>

1. <achado> — de onde veio (loja/fabricante) — por que é relevante pra Laet
2. ...
3. ...

Vale considerar pra pauta: <1-2 sugestões concretas de ângulo/formato, ligando a um achado>
```

Salvar em `dados/pesquisa-mercado-<YYYY-MM-DD>.md`.

### Passo 5 — Entrega

Mostrar o resumo no chat. Se for parte de uma sessão de criação de conteúdo já em andamento
(`/pauta-semana` etc.), oferecer pra incorporar um achado na pauta da semana — não impor, o Kevin
decide se usa.

## Regras

- Breve de verdade — isso é um radar, não uma auditoria. Se a busca não achar nada relevante, dizer
  isso e seguir em frente, não forçar achado fraco só pra preencher.
- Nunca copiar ideia de concorrente 1:1 — o achado é inspiração de formato/mecânica, o texto/tom
  final sempre segue `_memoria/preferencias.md` e a voz da Laet
- Nunca inventar dado técnico de produto a partir de pesquisa externa — isso continua vindo só de
  `_memoria/produtos.md`
- Se WebSearch não achar nada específico de lojas de tinta na região, ampliar pra "loja de material
  de construção"/varejo de bairro em geral antes de desistir — o padrão de conteúdo comercial se
  aplica mesmo fora do nicho exato
