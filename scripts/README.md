# scripts/ — utilitários do MazyOS

Scripts Node.js e Python que as skills chamam quando precisam fazer coisas fora do alcance da IA pura (gerar imagem, postar em rede social, renderizar HTML em PNG).

Cada skill que precisa de script tem instrução de como criar (e geralmente é um único setup por integração que você vai ativar). Já tem alguns scripts ativos — ver tabela abaixo.

## Scripts comuns

Conforme você for ativando skills, isso aqui vai sendo populado. Lista do que cada skill espera encontrar:

| Skill | Script esperado | O que faz |
|---|---|---|
| `/carrossel` (com foto IA) | `gerar-imagem.js` | Gera foto realista do zero via OpenAI API (`gpt-image-1.5`) — ver `identidade/prompts-ia.md` pro guia de prompt |
| `/carrossel` (editar foto existente) | `editar-imagem.js` | Edita uma imagem já existente via OpenAI API (`gpt-image-1.5`) — uso: `node --env-file=.env scripts/editar-imagem.js "origem.png" "prompt" "destino.png"` |
| `/carrossel` (render PNG) | `render.js` (gerado por carrossel, fica na pasta do conteúdo) | Playwright tira screenshot 1080x1350 de cada slide |
| `/gerar-post`, `/aprovar-post` | `postar-instagram.js` | Publica carrossel no Instagram via Meta Graph API |
| `/gerar-post`, `/aprovar-post` | `postar-facebook.js` | Publica carrossel no Facebook via Meta Graph API |
| `/gerar-post` (impulsionar) | `impulsionar-post.js` | Cria (modo `criar`, sempre pausado) e ativa (modo `ativar`) campanha de impulsionamento via Meta Marketing API — ver `marketing/automacao-meta-setup.md` |
| `/postar-story` | `postar-story.js` | Publica story (imagem ou vídeo) no Instagram via Meta Graph API — uso: `node --env-file=.env scripts/postar-story.js <pasta> <imagem\|video>` |
| `/anuncio-google` | (nenhum — gera CSV direto) | — |
| `/relatorio-ads` | (lê CSV exportado das plataformas) | — |
| deploy (staging) | `netlify-ignore-branch.sh` | Cancela build do Netlify em branch que não seja `main`, pra economizar minuto de build |

## Pré-requisitos comuns

A maioria dos scripts depende de:

**Node.js 20+** instalado na máquina

**.env** na raiz do projeto com as chaves de API:
```bash
OPENAI_API_KEY=sk-...               # pra gerar-imagem.js
META_PAGE_ACCESS_TOKEN=...          # pra postar-instagram.js + postar-facebook.js + impulsionar-post.js
META_PAGE_ID=...
META_IG_USER_ID=...
META_AD_ACCOUNT_ID=act_...          # só pra impulsionar-post.js — ver marketing/automacao-meta-setup.md
SITE_URL=https://seudominio.com.br
```

**Playwright** (pra renderizar HTML em PNG):
```bash
npm install playwright
npx playwright install chromium
```

## Como o MazyOS lida com isso

Quando você roda uma skill que precisa de script ausente, o Claude vai:

1. Detectar que falta o script
2. Te perguntar se quer configurar agora
3. Te guiar no setup das chaves de API (Meta, OpenAI, etc.)
4. Criar o script já configurado
5. Rodar a skill

Você não precisa decorar nada. Roda a skill, segue o fluxo.
