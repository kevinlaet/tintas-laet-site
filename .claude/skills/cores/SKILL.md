---
name: cores
description: >
  Guardião das cores da Tintas Laet: garante que TODA cor de tinta em qualquer material
  (site, catálogo, leque, post, story, carrossel, flyer, banner, placa, mockup, imagem de IA,
  catálogo impresso) seja IDÊNTICA à do catálogo oficial em PDF/foto que o Kevin mandou.
  Consulta o hex oficial de uma cor, confere e corrige o site e os catálogos, mede a cor de uma
  peça pronta, e atualiza a paleta quando chega catálogo novo. Use quando o usuário falar de
  "cor", "cores", "hex", "paleta", "leque", "a cor tá diferente", "Fogo Violeta", "confere as cores",
  "cor do PDF", ao criar qualquer peça que mostre cor de tinta, ou /cores.
---

# /cores — Guardião das cores da Tintas Laet

**Regra de ouro:** cor de tinta nunca é "de olho". Vem do arquivo-mestre, com hex igual ao do catálogo oficial, letra por letra. Se a cor não está no mestre, não se inventa: pergunta ao Kevin ou pede o PDF/foto.

Por que isso existe: cliente compra pela cor que viu. Fogo Violeta laranja no site, catálogo impresso com hex antigo, tom de uma linha diferente do da outra linha — cada um desses erros já aconteceu e vira reclamação e troca na loja.

## Onde está a verdade

| O quê | Onde |
|---|---|
| **Arquivo-mestre** (nome → hex, por linha, com a fonte de cada uma) | `identidade/cores/paleta-oficial.json` |
| Histórico de mudanças da paleta | `identidade/cores/historico.md` |
| Consulta rápida | `node scripts/cores/cor.js "nome da cor"` |
| Conferir/corrigir site e catálogos | `node scripts/cores/verificar.js` (`--corrigir` aplica) |
| Medir cor numa peça pronta | `node scripts/cores/medir.js <imagem> x,y,l,a "<cor>"` |
| Refazer o PDF impresso das lojas | `node scripts/cores/gerar-pdf-catalogo.js` |
| Extrair cor de PDF/foto novos | `scripts/cores/extracao/` (ver "Chegou catálogo novo") |

### Linhas e de onde vem cada cartela

- **Paleta Grande** (`paleta-grande`) = Premium Lavável + Emborrachada + Semi Brilho + Cobertura Absoluta. Decisão do Kevin (24/09): as quatro usam UMA cartela, a do PDF `Premiumlavavel05.26.pdf`. Os PDFs antigos da Flex, Cobertura e Semi Brilho têm Fogo Violeta laranja — não valem.
- **Standard** = `NOVO CAT STAND.pdf (1).pdf`.
- **Super Profissional** (e **Direto no Gesso**, mesma cartela), **Látex Vinil**, **Esmalte Ecológico**, **Pisos & Fachadas** = fotos de catálogo em `catalogos/`. Foto não é tão exata quanto PDF (±1 a 2 níveis por canal), mas é a melhor referência que existe.
- **Sem referência** ainda: Efeito Cimento Queimado, Spray, Corante. O site tem um hex pra elas, mas ninguém conferiu contra catálogo. Nunca afirmar que estão "iguais ao catálogo".

Preto, Chumbo e Cinza existem no PDF da Paleta Grande mas foram retirados de Standard, Premium e Emborrachada no site em 24/09 (`saidas/precos-cores-2026-09-24.md`). O mestre mantém como referência (campo `removidas_do_site`); o verificador não reclama da ausência.

## Ler antes de agir

1. `identidade/cores/paleta-oficial.json` — nunca copiar hex de memória, de conversa antiga ou de foto de tela.
2. `identidade/design-guide.md` se for peça visual (as cores da MARCA Laet — azul, amarelo — são outro assunto e estão lá; este skill cuida das cores das TINTAS).
3. `_memoria/produtos.md` se a peça também afirmar característica técnica do produto.

## O que fazer, por pedido

### "Qual é o hex de X?" / "usa a cor X nessa peça"
`node scripts/cores/cor.js "X"`. Se o nome existir em mais de uma linha com hex diferente, ele avisa — usar o da linha certa e dizer qual. Se não existir: não inventar; oferecer as mais próximas (`--perto "#HEX"`) e perguntar.

### "Confere as cores" / depois de mexer em qualquer arquivo com cor
1. `node scripts/cores/verificar.js` (só relata, não altera nada).
2. Ler o relatório inteiro: cores diferentes, nomes que não existem na linha oficial, cores do oficial que não aparecem na página.
3. Se tudo certo e o Kevin quer aplicar: `--corrigir`, rodar de novo e mostrar "todas batem".
4. Se mexeu no catálogo impresso: `node scripts/cores/gerar-pdf-catalogo.js` e olhar 2 ou 3 páginas do PDF.
5. Cor diferente NÃO é sempre erro do site. Pode ser que o mestre esteja desatualizado — nesse caso vale o PDF/foto mais novo do Kevin, e o mestre é que muda (ver abaixo).

O verificador olha: `site/produto.html`, `site/catalogo/*.html`, o leque da `site/index.html` e o catálogo impresso. Se criar página nova com cor, incluir no verificador (`scripts/cores/verificar.js`) no mesmo commit.

### Peça visual nova (post, story, carrossel, flyer, banner, placa)
- Cor de tinta entra **como código**, hex literal do mestre, em bloco chapado (CSS `background:#HEX`). Sem transparência, sem gradiente, sem filtro por cima.
- Depois de renderizar a peça, **medir**: `medir.js peca.png x,y,l,a "Nome da cor"`. Chapado digital tem que dar ΔE 0. Se não deu, tem opacidade, sombra, `mix-blend-mode` ou perfil de cor no meio.
- Ao citar o nome da cor, usar a grafia do mestre.
- Texto padrão de rodapé/aviso quando a cor aparece pro cliente: o mesmo do site/catálogo ("a tela pode mostrar a cor um pouco diferente, confira no catálogo físico na loja"). Não prometer "cor exata".

### Imagem feita por IA (mockup de parede, ambiente pintado, lata)
IA **não acerta hex**: ela pinta "um roxo parecido". Portanto:
1. Nunca pedir "parede na cor Fogo Violeta" e usar o resultado como está.
2. Caminho seguro: gerar a cena neutra (parede branca/cinza claro) e **recolorir por código** a área da parede (máscara + a cor oficial, mantendo a luz), ou desenhar os quadrados de cor por cima em HTML.
3. Sempre medir o miolo da parede com `medir.js`. Em foto/render a luz muda a cor: ΔE até 3 é aceitável **só** pra isso; acima, refazer.
4. Rótulo e texto de lata gerada por IA: ler antes de usar (ver `identidade/prompts-ia.md`).
5. Custo: gerar imagem por API é pago. Avisar o valor e esperar confirmação antes (regra do guardrail financeiro).

### Catálogos de cores em PDF (os de mandar no WhatsApp)
`node scripts/catalogos-pdf/gerar.js` gera os 11 PDFs em `saidas/catalogos-pdf/` (ou só um: `gerar.js premium-lavavel`). Primeira vez: `cd scripts/catalogos-pdf && npm install`. Precisa de internet (fontes).
- Mesmo modelo dos PDFs do Canva (formato 9:16): capa, tabela COR / NOME DA COR / BALDE / GALÃO / (1/4), rodapé de aviso e página final com botões clicáveis (Orçamento, Instagram, Site).
- Cor vem do mestre, preço vem do site (`site/produto.html`). Mudou preço no site → rodar de novo. Nunca digitar preço à mão no PDF.
- Premium, Emborrachada, Cobertura, Semi Brilho e Standard reaproveitam a capa do PDF antigo (`marketing/catalogos/`); as outras 6 linhas têm capa desenhada no mesmo estilo (`identidade/catalogo-pdf/` guarda logo, leque, mascote e fundo).
- Páginas antigas com texto que não vale mais ficaram de fora (Flex e Standard falavam em "entregas disponíveis" e "4 lojas").
- Cobertura Absoluta e Semi Brilho usam o MESMO preço da Emborrachada (confirmado pelo Kevin em 25/09). Se um dia mudar, trocar `produtoPrecos` em `scripts/catalogos-pdf/lib/linhas.js`.
- Rodapé só com o aviso de cor. Não colocar variação de litragem/embalagem (pedido do Kevin, 25/09).
- Depois de gerar, conferir lendo de volta: rodar o extrator de PDF (`scripts/cores/extracao`) apontando pra `saidas/catalogos-pdf` e comparar hex e preço de cada linha com o mestre e o site. Em 25/09: 652 linhas, zero diferença.
- Os PDFs não vão pro git (são regeráveis e pesados).

### Chegou catálogo novo (PDF ou foto)
1. Salvar o arquivo em `marketing/catalogos/` (PDF) ou `catalogos/` (foto).
2. `cd scripts/cores/extracao && npm install` (uma vez) e rodar:
   - PDF: `node extrair-pdf.mjs` (lê a tabela COR / NOME DA COR / BALDE e mede o quadradinho)
   - Foto: editar a lista de nomes de cada folha em `extrair-fotos.cjs` (transcrita da foto, na ordem de leitura) e rodar `node extrair-fotos.cjs`. O script avisa se achou quantidade diferente de quadradinhos (`DIVERGE`): parar e revisar antes de seguir.
3. Comparar a saída com o mestre. Diferença = cor mudou na fonte. Mostrar pro Kevin antes/depois.
4. Atualizar `identidade/cores/paleta-oficial.json` (campo `referencia` e valores) e registrar em `identidade/cores/historico.md`: data, fonte, o que dizia antes → o que diz agora (regra: nunca corrigir dado sem deixar rastro).
5. `verificar.js` → `--corrigir` → regenerar catálogo impresso se preciso → conferir.
6. Deploy do site: só com o "pode" explícito do Kevin (regra do CLAUDE.md).

### "A cor tá diferente" (reclamação do Kevin)
Antes de mexer, achar ONDE ele está vendo: link/print, aparelho, linha, cor. Depois:
1. `cor.js` pra pegar o oficial.
2. `medir.js` no print dele ou na peça, pra saber se é hex diferente (erro nosso) ou percepção (sombra, tela, vizinhança).
3. Só então corrigir. Se o hex está igual ao oficial, explicar isso ao Kevin com o número e o motivo provável (sombra do leque, brilho da tela, cor ao lado), sem dizer que "está tudo certo" antes de medir.

## Pegadinhas conhecidas

- **Leque da home:** as fatias sobrepostas têm sombra; medir no meio de cada fatia. Cor certa na origem pode parecer mais escura na vitrine.
- **Site em produção ≠ branch:** o Kevin vê o site publicado. Uma correção só existe pro cliente depois do deploy. Antes de dizer "arrumado", conferir no ar (`curl` na página ou Playwright).
- **±1 na leitura:** o pdf.js e o visualizador do Edge divergem em 1 nível por canal na mesma cor. O mestre segue o pdf.js; ao comparar prints de tela com o mestre, ΔE abaixo de 1 é ruído.
- **Nomes:** o PDF da Premium escreve "Vermelho B 10", os outros escrevem "Vermelho D 10" (mesma cor `#966565`); o mestre usa D 10. "Goma de Mascar" e "Frescor Marítimo" (Látex Vinil) já foram digitados errado antes.
- **Site usa CRLF:** ao editar com script, respeitar quebra de linha (o verificador já respeita).
- **Preço não é tema aqui:** `scripts/precos-cores/` cuida de preço e nunca mexe em hex.
- **Repo do site é público:** hex de cor de tinta já aparece no site, tudo bem; mas nada de `_memoria/` ou `dados/` em commit.

## Pendências registradas (24/09/2026)
- Super Profissional: o mestre tem "A 04" (`#BFB9AD`), o site não lista. Precisa do preço pra entrar no site — perguntar ao Kevin.
- Catálogo impresso ainda lista Preto, Chumbo e Cinza na Paleta Grande (Cobertura Absoluta e Semi Brilho podem ter). Decidir com o Kevin se saem do impresso como saíram de Premium/Emborrachada/Standard.
- Cimento Queimado, Spray e Corante sem catálogo de referência.
- Foto de catálogo nas linhas Vinil/Super/Direto/Esmalte/Piso: se o Kevin achar o PDF original, trocar (PDF é exato).

## Como reportar
Sempre com número: "N cores conferidas em M arquivos, X diferentes do oficial". Mostrar antes → depois das que mudaram. Nunca dizer "todas iguais" sem ter rodado o verificador na hora.
