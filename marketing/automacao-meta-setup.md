# Automação Meta (Instagram + Facebook) — guia de configuração

> Passo a passo pra destravar postagem e impulsionamento automáticos. Feito uma vez só.
> Ninguém além de você consegue fazer essa parte — envolve login e permissão na sua conta.

## O que isso destrava

- `/gerar-post` conseguir publicar direto no Instagram + Facebook depois que você aprovar
- `/gerar-post` conseguir impulsionar (Meta Ads) o post publicado, sempre com orçamento confirmado por você antes de gastar

## Antes de começar

Confirme 2 coisas:
- [ ] @Tintaslaet é uma conta **Instagram Business** (não pessoal/criador) — checar em Instagram → Configurações → Conta → tipo de conta
- [ ] Essa conta está **conectada a uma Página do Facebook** da Tintas Laet — checar em Instagram → Configurações → Conta vinculada, ou em business.facebook.com

Se algum dos dois não estiver certo, ajustar isso primeiro (é dentro do app do Instagram, Configurações → Contas vinculadas).

---

## Passo 1 — Criar o App na Meta

1. Ir em [developers.facebook.com/apps](https://developers.facebook.com/apps)
2. **Criar app** → tipo **"Negócios"** (Business)
3. Nome do app: algo como "Tintas Laet Automação" (só uso interno, não aparece pro público)
4. Vincular ao seu Business Manager (o mesmo onde já roda o Meta Ads hoje)

## Passo 2 — Adicionar os produtos certos

Dentro do app criado, no menu lateral, adicionar:
- **Instagram Graph API**
- **Facebook Login** (necessário pra gerar token)
- **Marketing API** (só se for usar o impulsionamento automático — Fase C)

## Passo 3 — Gerar o token de acesso

1. Ir em **Ferramentas → Graph API Explorer** (ainda em developers.facebook.com)
2. No topo, selecionar o App criado no Passo 1
3. Em "Usuário ou Página", trocar pra **sua Página do Facebook** da Tintas Laet
4. Em "Permissões", marcar:
   - `pages_show_list`
   - `pages_read_engagement`
   - `pages_manage_posts`
   - `instagram_basic`
   - `instagram_content_publish`
   - `ads_management` (só se for usar impulsionamento — Fase C)
   - `ads_read` (idem)
5. Clicar **Gerar Token de Acesso** e autorizar
6. Esse token gerado dura poucas horas — o próximo passo troca ele por um de longa duração (~60 dias, renovável)

## Passo 4 — Trocar por token de longa duração

Ainda no Graph API Explorer, ou via terminal, rodar (trocando os valores):

```
GET /oauth/access_token
  ?grant_type=fb_exchange_token
  &client_id=<APP_ID>
  &client_secret=<APP_SECRET>
  &fb_exchange_token=<TOKEN_CURTO_DO_PASSO_3>
```

APP_ID e APP_SECRET ficam em **Configurações do App → Básico**, no painel do app.

O resultado é o `META_PAGE_ACCESS_TOKEN` — um token de página que dura ~60 dias. Guardar esse valor.

> **Renovação:** perto de vencer (marcar lembrete pra ~50 dias), repetir o Passo 4 usando o token
> antigo como `fb_exchange_token`. Se vencer sem renovar, a postagem automática para até gerar de novo.

## Passo 5 — Pegar os IDs

- **META_PAGE_ID**: Página do Facebook → Configurações → Sobre → ID da Página (ou `GET /me/accounts` com o token do Passo 3, retorna a lista de páginas com o `id`)
- **META_IG_USER_ID**: `GET /{META_PAGE_ID}?fields=instagram_business_account` com o token — retorna o ID da conta Instagram vinculada
- **META_AD_ACCOUNT_ID** (só pra impulsionamento — Fase C): Ads Manager → Configurações da conta → ID da conta (formato `act_XXXXXXXXX`)

## Passo 6 — Preencher o `.env`

Na raiz do projeto, adicionar (sem apagar o que já tem, como `OPENAI_API_KEY`):

```bash
META_PAGE_ACCESS_TOKEN=<do Passo 4>
META_PAGE_ID=<do Passo 5>
META_IG_USER_ID=<do Passo 5>
META_AD_ACCOUNT_ID=<do Passo 5, só se for usar impulsionamento>
SITE_URL=https://tintaslaet.com
```

**Nunca commitar o `.env`** — ele já deve estar no `.gitignore`. Se não estiver, avisar antes de continuar.

## Passo 7 — Testar

Depois de preenchido, rodar um teste simples (eu conduzo isso com você quando o `.env` estiver pronto):

```bash
node --env-file=.env scripts/postar-instagram.js marketing/conteudo/<uma-pasta-de-teste>
```

Se der erro de permissão, o motivo mais comum é: conta ainda em "modo de desenvolvimento" — funciona
normalmente pra postar na **sua própria** Página/Instagram (é o seu caso), só trava se um dia
quiser que outra empresa use o mesmo app.

---

## Ordem recomendada

1. **Fase B primeiro (postar automático)** — validar por 1-2 semanas antes de mexer em impulsionamento
2. **Fase C depois (impulsionar automático)** — só ligar depois que a Fase B estiver estável e você
   já tiver visto pelo menos alguns posts publicados automaticamente sem erro

Impulsionar cedo demais, num post que ainda pode ter erro de fluxo, é dinheiro saindo do seu bolso
à toa — não vale a pena apressar essa parte.

## Onde isso é usado

- `scripts/postar-instagram.js` e `scripts/postar-facebook.js` — chamados por `/gerar-post` (depois
  da aprovação) e por `/aprovar-post`
- `scripts/impulsionar-post.js` — chamado só quando você confirmar orçamento e duração explicitamente
