# Tintas Laet — MazyOS

> Workspace do marketing digital da Tintas Laet.
> Kevin é o responsável por essa operação — construindo o braço digital da empresa do zero.

## O que é esse workspace

Central de marketing digital da Tintas Laet. Aqui ficam campanhas, conteúdo, métricas, identidade visual e tudo que envolve a presença digital das 4 lojas.

**Estrutura de pastas:**
- `_memoria/` — quem é a empresa, como falamos, foco atual
- `identidade/` — marca aplicada em tudo que o sistema gera
- `marketing/` — campanhas, conteúdo, mídia paga
  - `conteudo/<slug>-<data>/` — carrosséis e posts de feed de Instagram/Facebook
  - `stories/<YYYY-MM>/<DD>-<slug>/` — stories de Instagram, agrupados por mês (meta é 2/dia, então nunca soltar story direto em `conteudo/`)
  - `status-whatsapp/<slug>-<data>/` — peças no formato 9:16 pra Status do WhatsApp
- `dados/` — relatórios, planilhas, métricas para análise
- `saidas/` — documentos e peças gerados
- `scripts/` — scripts e automações
- `templates/` — modelos reutilizáveis
- `site/` — código do site (tintaslaet.com, staging em tintas-laet-staging.netlify.app)
- `netlify/` — funções serverless do site (ex: notificação de WhatsApp pro cupom de sorteio)

## Sobre a empresa

Tintas Laet é um comércio de tintas e materiais de pintura com 4 lojas na região do ABC e Zona Leste de SP. Atende donos e donas de casa na periferia que querem economizar — com preços abaixo do mercado, parcelamento em 12x sem juros e frete justo.

Fundada por Anderson Laet e Robson Laet. Kevin cuida do marketing digital, sozinho por enquanto.

## Instagram

- **Perfil:** @Tintaslaet
- **Situação atual:** 5.550 seguidores, perfil amador mas com alto potencial (vídeos com mais de 150k visualizações)
- **Direção:** Profissionalizar o perfil e transformar o mascote em protagonista — como um influencer próprio da marca, com voz e presença consistentes

## Tom de voz

Direto, simples, acolhedor. Fala com a comunidade como vizinho — sem jargão de guru, sem textão, uma ideia por vez. Quer conduzir à compra sem pressionar.

**Evitar:** cara de IA, comunicação poluída, "alavancar", "escalar", emoji em excesso, formalidade excessiva.

## Regras do sistema

- Antes de qualquer peça visual, ler `identidade/design-guide.md`
- Antes de qualquer texto, ler `_memoria/preferencias.md`
- Métricas e relatórios salvos em `dados/`
- Peças e documentos gerados salvam em `saidas/`

## Ferramentas conectadas

- [x] WhatsApp (11) 97714-0964
- [x] Meta Ads (tráfego pago)
- [x] Instagram @Tintaslaet
- [ ] Google Ads
- [ ] Google Analytics

---

## Contexto do negócio

No início de toda conversa, ler os seguintes arquivos (quando existirem e estiverem preenchidos):

1. `_memoria/empresa.md` — quem é o usuário, o que faz, como funciona o negócio
2. `_memoria/preferencias.md` — tom de voz, estilo de escrita, o que evitar
3. `_memoria/estrategia.md` — foco atual, prioridades, prazos

Usar essas informações como base pra qualquer resposta ou decisão.

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
