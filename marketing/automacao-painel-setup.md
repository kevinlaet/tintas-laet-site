# Painel de Gestão — guia de configuração

> Passo a passo pra destravar o painel completo (login seguro + dados +
> análise de Instagram + criador de conteúdo com IA + fila + postagem
> automática). Feito uma vez só, em fases.
> Ninguém além de você consegue fazer essas partes — envolvem contas e login
> em serviços externos.
>
> Plano técnico completo (arquitetura, modelo de segurança, o que cada fase
> constrói) foi aprovado em 08/09/2026 — me pede que eu explico o raciocínio
> a qualquer momento.

## O que isso destrava, por fase

- **Fase 1**: login com senha + 2FA, painel com métricas do site (GA4) e
  histórico de posts/stories já publicados
- **Fase 2**: gráficos de seguidores/engajamento do Instagram
- **Fase 3**: botão "Gerar com IA" que cria legenda, imagem e carrossel
  seguindo a identidade visual e o tom de voz da Laet, guardado numa fila
- **Fase 4**: aprovar um post da fila com um clique publica automático no
  Instagram/Facebook no horário agendado, com impulsionamento (Meta Ads)
  opcional e sempre com orçamento confirmado antes de gastar

## Ordem recomendada

Cada bloco abaixo destrava uma fase — não precisa fazer tudo de uma vez.

---

## Antes da Fase 1

### 1 — Criar o repositório GitHub privado do painel

1. Ir em [github.com/new](https://github.com/new)
2. Nome sugerido: `tintas-laet-painel`
3. **Marcar como "Private"** — obrigatório, não opcional. O painel vai
   carregar lógica de login, esquema de banco de dados e configurações
   sensíveis — mesmo motivo pelo qual `_memoria/` e `dados/` já são privados
   nesse repositório
4. Não precisa adicionar README, .gitignore ou licença — eu cuido disso

Depois de criado, me avisa o link (`github.com/kevinlaet/tintas-laet-painel`).

### 2 — Criar o site Netlify novo + apontar o subdomínio

1. No painel do Netlify (mesma conta do site principal), **Add new site →
   Import an existing project**
2. Conectar ao repositório `tintas-laet-painel` (fica "vazio" até eu começar
   a construir, sem problema)
3. Em **Domain settings**, adicionar o domínio customizado
   `painel.tintaslaet.com`
4. O Netlify mostra um registro DNS pra adicionar (geralmente `CNAME`). Se o
   DNS do `tintaslaet.com` já está no próprio Netlify, é automático — só
   confirmar. Se estiver em outro registrador, eu te passo o valor exato
   quando chegar nessa etapa

### 3 — Criar conta no Supabase (grátis)

O painel guarda dados ali desde o início — não só métricas depois, mas o
controle de tentativas de login (trava automática após senha errada demais
vezes seguidas).

1. Criar conta grátis em [supabase.com](https://supabase.com)
2. Não precisa criar tabela nem configurar nada — eu crio quando começar a
   construir a Fase 1

### 4 — Instalar um app autenticador (2FA)

O login do painel vai pedir senha **+ um código de segundo fator**. Instala
um desses no celular (qualquer um serve):

- Google Authenticator
- Microsoft Authenticator
- Authy

Não precisa configurar nada agora — você escaneia um QR code quando o login
estiver pronto.

---

## Antes da Fase 2

### 5 — Estender a permissão do app Meta pra incluir análise de Instagram

O token que já existe (guia em `marketing/automacao-meta-setup.md`) só tem
permissão de **publicar** — não de ler métricas. Quando chegarmos na Fase 2,
volto no app da Meta com você pra adicionar a permissão
`instagram_manage_insights` e gerar um token novo. Nada pra fazer sozinho
antes disso, só aviso que existe esse passo extra.

---

## Antes da Fase 3

### 6 — Criar conta no Render.com ou Fly.io (grátis, pro motor de geração)

Precisa de um serviço separado do Netlify pra rodar a parte pesada (montar
carrossel com Playwright, chamar a IA de imagem) — o Netlify sozinho não
aguenta esse tipo de tarefa no plano grátis.

1. Criar conta grátis em [render.com](https://render.com) (recomendação
   inicial — decido com você qual serve melhor quando chegar a hora, pode
   trocar pro Fly.io)
2. Não precisa configurar nada além da conta

### 7 — Decidir um limite mensal de gasto com IA

O painel mostra o custo estimado antes de qualquer geração e nunca gasta sem
confirmação — além disso, um **teto mensal configurável** bloqueia gerações
novas automaticamente se bater o limite (sem afastar posts já aprovados de
saírem no horário).

Pensa num valor mensal confortável (ex: R$30, R$50, R$100) — não precisa
decidir agora. Referência: gerar uma imagem custa centavos de dólar (~$0,02
a $0,19 dependendo da qualidade).

---

## Antes da Fase 4

Nada novo — usa o token do Meta que já existe (item de "terminar o setup do
Meta Graph API" em `marketing/automacao-meta-setup.md`, se ainda não tiver
sido feito).

---

## Onde isso vai ser usado

- Item 1-2 → repositório e hospedagem do painel
- Item 3 → banco de dados (login seguro desde a Fase 1, depois métricas,
  fila e gasto com IA)
- Item 4 → 2FA do login
- Item 5 → análise de Instagram (Fase 2)
- Item 6 → motor de geração de conteúdo por IA (Fase 3)
- Item 7 → trava de segurança financeira do painel (Fase 3)
