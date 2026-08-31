# Automação do Painel de Postagens — guia de configuração

> Passo a passo pra destravar o painel completo (fila visual + geração de conteúdo
> com IA + postagem automática agendada). Feito uma vez só.
> Ninguém além de você consegue fazer essas partes — envolvem contas e pagamento
> em serviços externos.

## O que isso destrava

- Uma tela própria (`painel.tintaslaet.com`) onde você vê a fila de posts, aprova
  com um clique e agenda o horário de publicação
- Um botão "Gerar com IA" que cria legenda, imagem, carrossel e story sozinho,
  seguindo a identidade visual e o tom de voz da Laet
- Postagem automática no Instagram/Facebook no horário aprovado, sem precisar
  abrir o Claude Code toda vez

Arquitetura completa (por que cada peça existe) está documentada em
`.claude/plans/` — se quiser entender o raciocínio técnico antes de seguir os
passos, me pede que eu explico.

## Ordem recomendada

Os itens abaixo **não precisam ser feitos todos de uma vez**. O painel é construído
em fases — o essencial pra começar (Fase 1: fila + aprovação + postagem automática)
só depende dos itens 1 a 3. Os itens 4 a 6 destravam a geração de conteúdo por IA
dentro do painel (Fases 2 em diante), dá pra fazer depois com calma.

---

## 1 — Terminar o setup do Meta Graph API (pré-requisito de tudo)

**Status: pendente.** Esse é o item mais importante e trava tudo o resto — sem ele,
nada publica automaticamente, nem no painel enxuto nem no completo.

Guia completo já existe: `marketing/automacao-meta-setup.md`. Segue os passos 1 a 7
de lá (criar app na Meta, gerar token de longa duração, pegar os IDs, preencher o
`.env`). Quando terminar, me avisa que eu testo com você.

## 2 — Criar o repositório GitHub privado do painel

1. Ir em [github.com/new](https://github.com/new)
2. Nome sugerido: `tintas-laet-painel`
3. **Marcar como "Private"** — isso é obrigatório, não opcional. O painel vai
   carregar o tom de voz, as dores de cliente e a estratégia de conteúdo da Laet, e
   isso não pode ficar público (mesmo motivo pelo qual `_memoria/` e `dados/` já
   foram movidos pra repositórios privados em 28/08/2026)
4. Não precisa adicionar README, .gitignore ou licença — eu cuido disso quando
   começar a construir

Depois de criado, só me avisa o link do repositório (`github.com/kevinlaet/tintas-laet-painel`)
que eu sigo a partir daí.

## 3 — Criar o site Netlify novo + apontar o subdomínio

1. No painel do Netlify (mesma conta que já hospeda o site principal), clicar em
   **Add new site → Import an existing project**
2. Conectar ao repositório `tintas-laet-painel` criado no passo anterior (só vai
   ter conteúdo depois que eu começar a construir — pode deixar o site "vazio" por
   enquanto, sem problema)
3. Ir em **Domain settings** do site novo e adicionar o domínio customizado
   `painel.tintaslaet.com`
4. O Netlify vai te mostrar um registro DNS pra adicionar (geralmente um `CNAME`
   apontando pro endereço do site Netlify). Se o DNS do `tintaslaet.com` já está
   configurado no próprio Netlify, esse passo é automático — só confirmar. Se
   estiver em outro lugar (registrador de domínio), eu te passo o valor exato pra
   copiar lá quando você chegar nessa etapa — me chama que eu acompanho junto.

## 4 — Criar conta no Render.com ou Fly.io (grátis, pro motor de geração)

Precisa de um serviço separado do Netlify pra rodar a parte pesada (montar
carrossel com Playwright, chamar a IA de imagem) — o Netlify sozinho não aguenta
esse tipo de tarefa no plano grátis.

1. Criar conta grátis em [render.com](https://render.com) (recomendação inicial —
   decido junto com você qual dos dois serve melhor quando chegar a hora de
   construir a Fase 3/4, pode ser que troquemos pro Fly.io)
2. Não precisa configurar nada além da conta por enquanto — eu crio o serviço
   quando chegarmos nessa fase

## 5 — Decidir um limite mensal de gasto com IA

O painel vai mostrar o custo estimado antes de qualquer geração e nunca vai gastar
sem você confirmar — mas além disso, ele vai ter um **teto mensal configurável**
que bloqueia gerações novas automaticamente se bater o limite (sem afastar posts já
aprovados de saírem no horário).

Pensa num valor mensal que te deixe confortável (ex: R$30, R$50, R$100) — não
precisa decidir agora, só ter em mente. Referência: gerar uma imagem custa
centavos de dólar (~$0,02 a $0,19 dependendo da qualidade), então mesmo um uso
diário fica bem abaixo da maioria dos orçamentos de marketing.

## 6 — Instalar um app autenticador (2FA)

Como o painel vai ter acesso de postagem direto na conta oficial da loja, o login
vai pedir senha **+ um código de segundo fator**. Instala um desses no celular
(qualquer um serve):

- Google Authenticator
- Microsoft Authenticator
- Authy

Não precisa configurar nada agora — só ter o app instalado, a configuração em si
acontece quando o login do painel estiver pronto (você escaneia um QR code na
hora).

---

## Onde isso vai ser usado

- Item 1 → todos os scripts de postagem (`scripts/postar-instagram.js`,
  `scripts/postar-facebook.js`, `scripts/postar-story.js`) e a futura função de
  publicação automática do painel
- Itens 2-3 → hospedagem do painel (frontend + fila + agendador)
- Item 4 → motor de geração de conteúdo por IA
- Item 5 → trava de segurança financeira do painel
- Item 6 → login seguro do painel
