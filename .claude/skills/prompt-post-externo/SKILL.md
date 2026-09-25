---
name: prompt-post-externo
description: >
  Devolve o prompt de especificação pronto pra colar na ferramenta externa
  (fora deste repositório) que Kevin está construindo pra gerar post de
  Instagram via questionário curto de múltipla escolha. Use quando o usuário
  pedir "manda o prompt do gerador de post", "prompt da ferramenta externa",
  "questionário de post pra outra IA", "atualiza o prompt do gerador
  externo", ou /prompt-post-externo.
---

# /prompt-post-externo — Spec do questionário de post pra ferramenta externa

Kevin está construindo, em outro chat/ferramenta (fora deste repositório), uma
ferramenta própria que gera post de Instagram a partir de um questionário
curto de múltipla escolha (objetivo/funil, tom, público, tema). Essa skill
guarda a versão atual, pronta pra colar, desse prompt de especificação — pra
não precisar reconstruir do zero toda vez que ele precisar dela de novo.

## Quando usar

- Kevin pede o prompt de novo (recomeçar setup, colar em outra ferramenta)
- Kevin pede ajuste no questionário, no tom, ou na barra de qualidade —
  aplicar o ajuste **e atualizar o bloco abaixo, nesta mesma skill**, pra não
  ficar desatualizado
- Algo que alimenta o prompt mudou (tom de voz em `preferencias.md`, produto
  novo confirmado, novo produto publicado no site) — sinalizar pra Kevin que
  o prompt pode precisar de atualização, sem esperar ele pedir

## Dependências

Antes de qualquer ajuste no conteúdo do prompt, ler:
- `_memoria/empresa.md` (persona, perfil de cliente)
- `_memoria/preferencias.md` (tom de voz + seção "Barra de qualidade")
- `_memoria/dores-clientes.md` (segmentos e dores reais)
- `_memoria/estrategia.md` (lacunas conhecidas do site, ex: produtos ainda
  fora do catálogo online)

## Prompt atual (versão 18/09/2026)

```
Contexto da marca (Tintas Laet):
Loja de tintas focada em quem mora na periferia e quer economizar — preço baixo,
parcelamento 12x sem juros, entrega rápida. Cliente típico: dono/dona de casa que
compara preço, pechincha, e decide por confiança + parcelamento, não por marca.
Tom de voz: direto, simples, acolhedor — fala como vizinho, uma ideia por post,
zero jargão de marketing ("alavancar", "imperdível", "aproveite essa oportunidade
única"), zero formalidade ("prezado", "caro cliente"), emoji com moderação.

Fonte de informação de produto: tintaslaet.com (catálogo e páginas de produto do
site) é a base pra qualquer dado técnico citado (preço, cor, uso interno/externo,
lavável, rendimento). Regra obrigatória: se um produto ou dado não estiver no
site, NÃO INVENTAR — usar frase genérica sem esse dado específico, ou pedir pra
confirmar antes de publicar. Alguns produtos da linha (ex: Cobertura Absoluta,
Semibrilho, Verniz) podem não estar publicados no site ainda — nesse caso, tratar
como dado não confirmado, não como "produto não existe".

Construa um questionário de 4 perguntas que roda ANTES de gerar o texto do post
de Instagram. Cada pergunta é de múltipla escolha (botões), nunca campo aberto,
exceto a última. Objetivo: quem for usar a ferramenta responde em menos de 20
segundos, sem precisar saber termos de marketing.

Pergunta 1 — Objetivo do post
"O que esse post precisa fazer?"
( ) Atrair atenção — pessoa ainda nem conhece a loja. Post educa, entretém ou
    gera identificação (dica, curiosidade, bastidor). [tag interna: topo]
( ) Convencer — pessoa já conhece, mas não decidiu comprar. Post mostra prova,
    diferencial ou resolve uma dúvida/objeção. [tag interna: meio]
( ) Vender agora — pessoa está quase decidida, falta o empurrão. Post é oferta,
    preço ou promoção direta com CTA claro de compra. [tag interna: fundo]

Pergunta 2 — Tom
"Que jeito esse post deve ter?"
( ) Leve e de conversa — bem-humorado, próximo, sem parecer anúncio
( ) Emocional/humano — história real, prova social, depoimento, bastidor
( ) Direto ao ponto — foco em preço/oferta, sem enrolação

Pergunta 3 — Público
"Pra quem é esse post?" (padrão pré-selecionado: primeira opção)
(•) Dona/dono de casa economizando na pintura (público padrão da marca)
( ) Profissional da pintura (pintor, empreiteiro, pedreiro)
( ) Vizinhança de uma loja específica → se marcar, perguntar qual loja

Pergunta 4 — Tema (único campo de texto, curto)
"Sobre o que é o post? (produto, dor do cliente, ou situação)"
Ex: "tinta que não descasca no banheiro", "Tinta Piso", "cliente satisfeito com
a emborrachada"

Depois de coletado, gerar o post cruzando as respostas assim:
- Objetivo "Atrair" → gancho educativo ou curiosidade, sem pedir venda no final,
  CTA leve (comenta, segue, compartilha)
- Objetivo "Convencer" → gancho com prova/diferencial, CTA médio (manda
  mensagem, visita a loja, pede orçamento)
- Objetivo "Vender agora" → gancho com preço/oferta, CTA forte (chama no
  WhatsApp, aproveita agora, parcelamento em destaque)
- Tom escolhido define o vocabulário e a estrutura de frase, mas NUNCA
  sobrescreve as regras de tom de voz do contexto acima
- Público "profissional" → pode citar rendimento, cobertura, resistência
  técnica; público "dona de casa" → foco em economia, facilidade, parcelamento
- Sempre 1 ideia por post, frases curtas, sem textão

Barra de qualidade — o resultado só pode ser entregue se passar nisso:

1. GENIAL (ângulo, não fórmula):
   - Gere 3 ganchos de abertura diferentes internamente, compare e entregue só
     o mais forte — nunca a primeira ideia que vier.
   - Teste cada gancho com a pergunta: "isso poderia ter sido postado por
     qualquer loja de tinta do Brasil?" Se sim, descartar e escrever outro.
   - Proibido abrir com fórmula genérica de IA: "Você sabia que...", "Descubra
     o segredo...", "Chegou a hora de...".

2. PERTINENTE (ancorado em fato real do site, não em generalidade):
   - Toda característica técnica citada precisa vir do que está publicado em
     tintaslaet.com — nunca supor ou arredondar um número.
   - Toda dor/emoção citada deve corresponder a uma dor real do público (medo
     de gastar errado, precisar fechar o serviço com o cliente, medo de errar
     reformando sozinha, não poder ter problema na obra) — não emoção genérica
     de "todo mundo quer economizar".
   - Sempre que fizer sentido, ancorar em fala real de cliente em vez de
     reescrever a dor de forma mais "limpa" — fala real vende mais que versão
     polida.

3. PROFISSIONAL (acabamento, não rascunho):
   - Zero erro de português, zero frase truncada, zero repetição de palavra
     na mesma legenda.
   - Consistente com uma marca que está profissionalizando a presença digital
     — não é postagem amadora de loja pequena, é conteúdo de marca que compete
     de igual pra igual com concorrente maior, mesmo vendendo mais barato.
   - CTA sempre claro e único — nunca dois pedidos de ação na mesma legenda.

Formato de saída: legenda pronta pro Instagram (gancho + corpo + CTA) mais 3-5
ideias de imagem/slide pra acompanhar o texto.
```

## Regras

- Sempre entregar o prompt inteiro, pronto pra copiar — nunca só um resumo.
- Se Kevin pedir ajuste, aplicar direto no bloco acima (editar este arquivo) e
  mostrar só o trecho que mudou, não o prompt inteiro de novo, a menos que ele
  peça.
- Esse prompt roda numa ferramenta **fora** deste repositório — uma mudança
  aqui (ex: tom de voz, produto novo) não se propaga sozinha pra lá. Kevin
  precisa colar a versão nova manualmente na ferramenta externa.
- Manter a barra de qualidade sincronizada com a seção "Barra de qualidade" de
  `_memoria/preferencias.md` — se aquela seção mudar, atualizar aqui também.
