# Histórico da paleta oficial de cores

Cada mudança em `paleta-oficial.json` entra aqui: data, fonte, o que dizia antes → o que diz agora. Nada é corrigido sem deixar rastro.

## 25/09/2026 — PDFs originais mudaram de pasta

Os 5 PDFs do Canva que deram origem à paleta saíram de `marketing/catalogos/` e foram pra `marketing/catalogos/antigos-canva-2026-07/` (mesmos arquivos, só a pasta). O campo `referencia` do mestre foi atualizado. Em `marketing/catalogos/` agora ficam os catálogos atuais, gerados por `scripts/catalogos-pdf/gerar.js`.

## 24/09/2026 — criação do arquivo-mestre

**Fonte:** PDFs e fotos de catálogo que o Kevin mandou (`marketing/catalogos/` e `catalogos/`).

| Linha | Cores | Fonte |
|---|---|---|
| Paleta Grande (Premium, Emborrachada, Semi Brilho, Cobertura Absoluta) | 110 (fora o Branco) | `Premiumlavavel05.26.pdf` (decisão do Kevin: cartela única) |
| Standard | 84 | `NOVO CAT STAND.pdf (1).pdf` |
| Super Profissional / Direto no Gesso | 34 | fotos `catalogo profissional pag 1/2.jpg` |
| Látex Vinil | 18 | foto `catalogo vinil.jpg` |
| Esmalte Ecológico | 32 | fotos `catalogo esmalte pag 1/2.jpg` |
| Pisos & Fachadas | 13 | foto `catalogo piso e fachadas.jpg` |

**Antes de existir o mestre** (o que os arquivos diziam e foi corrigido ao conferir contra a fonte):
- Fogo Violeta: `#FF3C00` (laranja, vinha do PDF antigo da Flex) → `#6B24A2`. O erro estava no site, no leque da home, em Emborrachada e no catálogo impresso das lojas.
- Emborrachada, Premium e Standard: diferenças de 1 nível por canal e algumas cores herdadas de versão antiga (ex.: Palha) → iguais ao PDF, cor a cor.
- Látex Vinil, Super Profissional, Direto no Gesso, Esmalte e Pisos: hex antigos, sem fonte → alinhados às fotos do catálogo da Laet. Exemplos: Templo da Sabedoria `#DCCCEA` → `#A5A5ED`; Caixa Mágica `#D2CBEA` → `#AA9EE6`; Compota de Abacaxi `#F4F4C6` → `#FFFFA7`.
- Catálogo impresso das lojas (`saidas/catalogo-cores-loja/`, gerado em 19/08 com hex antigos): 259 cores conferidas, todas alinhadas ao mestre e o PDF gerado de novo em 24/09. Nomes corrigidos: "Coma de Mascar" → "Goma de Mascar"; "Fresco Marítimo" → "Frescor Marítimo".
- Piso & Fachadas, Esmalte e leque: ajustes de ±1 nível por canal (medida da foto) para ficar idêntico ao mestre.

Detalhe completo das rodadas de correção: `_memoria/correcao-cores-2026-09-24.md` (privado).

**Decisões e observações:**
- O PDF da Premium escreve "Vermelho B 10"; os demais escrevem "Vermelho D 10" (mesma cor `#966565`). Mestre usa D 10.
- Preto, Chumbo e Cinza foram retirados de Standard, Premium e Emborrachada no site em 24/09; seguem no mestre como referência.
- Sem catálogo de referência: Efeito Cimento Queimado, Spray, Corante.
