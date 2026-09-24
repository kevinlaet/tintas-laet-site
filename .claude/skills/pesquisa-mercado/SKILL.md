---
name: pesquisa-mercado
description: >
  Faz uma pesquisa de mercado breve e comercial antes de criar conteúdo — resume pro Kevin o que
  está em alta, o que geralmente funciona pra outras lojas de tinta (principalmente varejo/loja
  física, secundariamente fabricantes), com foco em resolução de problema e criação de ideia. Entrega
  sempre a tendência/princípio geral, nunca "o site X fez isso, copia" — informa, não copia. Não é
  auditoria interna nem SEO técnico. Use quando o usuário pedir "pesquisa de mercado", "o que a
  concorrência tá fazendo", "tem algo novo no mercado de tintas", antes de uma sessão de criação de
  conteúdo se fizer tempo que não roda, ou /pesquisa-mercado.
---

# /pesquisa-mercado — Radar comercial de lojas de tinta

Pesquisa curta (não é um relatório de SEO/concorrência completo — isso já existe no Passo 2 do
skill `/seo`) pra manter o Kevin informado sobre o que está em alta e o que geralmente funciona pra
outras lojas de tinta — sem virar um projeto de pesquisa toda vez que for criar um post, e sem virar
"copia esse site aqui". A entrega é sempre um insight/tendência geral que o Kevin decide como (ou
se) usar, nunca uma cópia disfarçada de achado.

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

### Passo 3 — Extrair o padrão, não o post

**O objetivo não é levantar "o que o site/perfil X postou"** — é destilar disso um princípio ou
tendência geral que o Kevin possa usar com a cara da Laet. Pra cada busca, perguntar:

- Que **problema do cliente** essa ideia resolve (é isso que mais importa: resolução de problema)?
- Que **mecânica de criação de ideia** está por trás (formato, gancho, gatilho de venda) — o
  "porquê funciona", não o "como foi executado especificamente"?
- Isso aparece mais de uma vez, em lugares diferentes? Um caso isolado não é tendência.

Descartar notícia genérica de fabricante grande sem nada replicável pro tamanho da Laet (6 lojas de
bairro, não rede nacional) — e descartar qualquer achado que só faça sentido "copiado", sem virar
um princípio generalizável.

### Passo 4 — Relatório curto (insight, não citação)

Formato direto — 3 a 5 pontos, nunca uma lista longa, e **nunca estruturado como "fulano postou
isso"**. O relatório informa uma tendência/prática/ideia geral, não aponta uma fonte pra copiar:

```
Pesquisa de mercado — <data>

1. <tendência ou prática geral> — problema que resolve — por que se aplica à Laet
2. ...
3. ...

Vale considerar pra pauta: <1-2 sugestões concretas de ângulo/formato, adaptadas à voz da Laet,
nunca uma réplica do que foi encontrado>
```

Sem citar nome de site/plataforma/perfil específico no corpo do relatório — a fonte é só rastro de
onde a IA pesquisou, não o que interessa entregar ao Kevin.

Salvar em `dados/pesquisa-mercado-<YYYY-MM-DD>.md`.

### Passo 5 — Entrega

Mostrar o resumo no chat. Se for parte de uma sessão de criação de conteúdo já em andamento
(`/pauta-semana` etc.), oferecer pra incorporar um achado na pauta da semana — não impor, o Kevin
decide se usa.

## Regras

- **Informa o Kevin, não copia pra ele.** A entrega é sempre "o que está em alta / o que geralmente
  funciona / que problema isso resolve", nunca "olha o que o site/plataforma X fez, faz igual".
  Nunca basear a sugestão numa plataforma ou site específico visto na busca — sempre subir um nível
  de abstração pro princípio geral por trás.
- Foco em **resolução de problema e criação de ideia**, não em estética ou execução copiável —
  é sobre entender por que algo funciona, não sobre reproduzir a peça.
- Breve de verdade — isso é um radar, não uma auditoria. Se a busca não achar nada relevante, dizer
  isso e seguir em frente, não forçar achado fraco só pra preencher.
- Nunca copiar ideia de concorrente 1:1 — mesmo generalizado, o texto/tom final sempre segue
  `_memoria/preferencias.md` e a voz da Laet
- Nunca inventar dado técnico de produto a partir de pesquisa externa — isso continua vindo só de
  `_memoria/produtos.md`
- Se WebSearch não achar nada específico de lojas de tinta na região, ampliar pra "loja de material
  de construção"/varejo de bairro em geral antes de desistir — o padrão de conteúdo comercial se
  aplica mesmo fora do nicho exato
