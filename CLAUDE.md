# Tintas Laet — MazyOS

> Workspace do marketing digital da Tintas Laet.
> Kevin é o responsável por essa operação — construindo o braço digital da empresa do zero.

## O que é esse workspace

Central de marketing digital da Tintas Laet. Aqui ficam campanhas, conteúdo, métricas, identidade visual e tudo que envolve a presença digital das 6 lojas (5 funcionando + 1 em abertura).

**Estrutura de pastas:**
- `_memoria/` — quem é a empresa, como falamos, foco atual
- `identidade/` — marca aplicada em tudo que o sistema gera
  - `ferramentas/` — fotos e renders de ferramentas e acessórios vendidos nas lojas
  - `embalagens/` — renders de produtos (tintas, solventes) + label da Proteção Emborrachada (em stand-by — foco atual são as aberturas de loja)
  - `placas-lojas/` — templates de placas de loja (tabela de preço, avisos legais, vaga preferencial, proibido fumar, etc.)
- `marketing/` — campanhas, conteúdo, mídia paga
  - `catalogos/` — PDFs de catálogo de produtos (Cobertura Absoluta, Flex Emborrachada, Standard, Premium Lavável, Semibrilho)
  - `conteudo/<slug>-<data>/` — carrosséis e posts de feed de Instagram/Facebook
  - `stories/<YYYY-MM>/<DD>-<slug>/` — stories de Instagram, agrupados por mês (meta é 2/dia, então nunca soltar story direto em `conteudo/`)
  - `status-whatsapp/<slug>-<data>/` — peças no formato 9:16 pra Status do WhatsApp
  - `banco-de-midia/` — banco de imagens avulsas reutilizáveis (mascote, cimento queimado, sorteio, etc.)
  - `prova social/` — fotos reais de eventos, ganhadores de sorteio, equipe e clientes (uso em feed/stories de humanização)
  - `imagem das lojas/` — fotos das lojas (fachada e interior, uma por loja)
  - `sorteio/` — dossiê e material do sorteio mensal
  - `logotipos de redessociais/` — logos da Laet adaptados para cada plataforma
- `dados/` — relatórios, planilhas, métricas para análise
  - `dados/gestao/` — ferramentas de gestão operacional das lojas (tarefas, checklists)
  - `dados/preços de tintas/` — fotos de listas de preço reais enviadas pelos balconistas (preço praticado de fato na loja), usadas pra corrigir divergências entre o site e o preço real de loja
- `saidas/` — documentos e peças gerados
- `scripts/` — scripts e automações
- `templates/` — modelos reutilizáveis
- `site/` — código do site (tintaslaet.com, staging em tintas-laet-staging.netlify.app)
- `netlify/` — funções serverless do site: notificação push pro celular do Kevin (via ntfy.sh, tópico `tintaslaet-18e3366de0`, configurado como env var `NTFY_TOPIC` no painel do Netlify) quando chega cupom de sorteio, candidatura da página "Trabalhe Conosco" (ambos em `submission-created.js`) ou mensagem do widget de chat do site (`chat-message.js`). Ativo e funcionando desde 27/08/2026. Currículo em PDF não tem upload no formulário — candidato manda pelo WhatsApp (obrigatório pra candidatura ser considerada, via botão em `curriculo.html`).

## Sobre a empresa

Tintas Laet é um comércio de tintas e materiais de pintura com 6 lojas — 5 já funcionando (a Loja 5 com festa de inauguração realizada em 08/08/2026) e a 6ª ainda vazia (sem estoque), com contrato assinado, entrando em manutenção do salão (pintura e reparos) antes de abrir —, na região do ABC e Zona Leste de SP. Atende donos e donas de casa na periferia que querem economizar — com preços abaixo do mercado, parcelamento em 12x sem juros e frete justo.

Fundada por Anderson Laet e Robson Laet. Kevin cuida do marketing digital e da gestão operacional das lojas, sozinho por enquanto.

## Instagram

- **Perfil:** @Tintaslaet
- **Situação atual:** 6.251 seguidores (09/08/2026), perfil amador mas com alto potencial (vídeos com mais de 150k visualizações)
- **Direção:** Profissionalizar o perfil e transformar o mascote em protagonista — como um influencer próprio da marca, com voz e presença consistentes

## Tom de voz

Direto, simples, acolhedor. Fala com a comunidade como vizinho — sem jargão de guru, sem textão, uma ideia por vez. Quer conduzir à compra sem pressionar.

**Evitar:** cara de IA, comunicação poluída, "alavancar", "escalar", emoji em excesso, formalidade excessiva.

## Regras do sistema

- Antes de qualquer peça visual, ler `identidade/design-guide.md`
- Antes de gerar foto por IA, ler `identidade/prompts-ia.md`
- Antes de qualquer texto, ler `_memoria/preferencias.md`
- Métricas e relatórios salvos em `dados/`
- Peças e documentos gerados salvam em `saidas/`

## Ferramentas conectadas

- [x] WhatsApp (11) 97714-0964
- [x] Meta Ads (tráfego pago)
- [x] Instagram @Tintaslaet
- [ ] Google Ads
- [x] Google Analytics (G-V8RP9PV579 — ativo desde 15/07/2026 — script adicionado em todos os HTMLs do site)
- [x] API de imagem OpenAI (ativa desde 29/07/2026, modelo `gpt-image-1.5`, crédito pré-pago configurado — `scripts/gerar-imagem.js` gera do zero, com qualidade `low`/`medium`/`high` via 3º argumento — padrão `medium` — e tamanho `1024x1536`/`1536x1024`/`1024x1024` via 4º argumento — padrão `1024x1536`; `scripts/editar-imagem.js` edita imagem existente, com qualidade e tamanho fixos em `medium`/`1024x1536`, sem argumento pra mudar)

---

## Contexto do negócio

No início de toda conversa, ler os seguintes arquivos (quando existirem e estiverem preenchidos):

1. `_memoria/empresa.md` — quem é o usuário, o que faz, como funciona o negócio
2. `_memoria/preferencias.md` — tom de voz, estilo de escrita, o que evitar
3. `_memoria/estrategia.md` — foco atual, prioridades, prazos

Usar essas informações como base pra qualquer resposta ou decisão.

**Antes de qualquer texto ou peça que afirme característica técnica de produto** (rendimento, uso interno/externo, lavável ou não, diluição, secagem, preço, cor), ler `_memoria/produtos.md` — dossiê mestre de produtos, fonte única de verdade, com regra explícita de nunca inventar dado técnico não confirmado (usa a resposta-padrão do próprio arquivo quando faltar informação).

Pra qualquer tarefa visual (carrossel, post, landing page), consultar `identidade/design-guide.md` como referência de estilo.

---

## Fluxo de trabalho

Antes de executar qualquer tarefa, verificar se existe skill relevante em `.claude/skills/`. Se encontrar, seguir as instruções da skill.

Ao concluir uma tarefa que não tinha skill mas parece repetível, perguntar:
> "Isso pode virar uma skill pra próxima vez. Quer que eu crie?"

---

## Aprender com correções

Quando Kevin corrigir algo ou dar instrução permanente, perguntar:
> "Quer que eu salve isso pra não precisar repetir?"

Se sim, salvar no arquivo mais adequado (`_memoria/empresa.md`, `preferencias.md`, `estrategia.md` ou `CLAUDE.md`).

---

## Manter contexto atualizado

Ao terminar uma tarefa que mudou algo relevante, perguntar:
> "Isso mudou algo no teu contexto. Quer que eu atualize a memória?"
