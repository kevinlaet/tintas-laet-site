// Manual do Balcão Tintas Laet · guia de consulta rápida pros balconistas (26/11/2026).
// Mesmo visual do catálogo (catalogo-v7-final). Fonte dos dados: bula geral (26/11) + decisões do Kevin
// (_memoria/bulas/bula-geral-resumo.md) + aulas do Kevin (CLAUDE.md). Nada inventado: o que não está confirmado não aparece.
// Sem sombra, transparência ou filtro (é o que fazia "quadrados" no PDF do iPhone).
// Rodar: NODE_PATH=$(npm root -g) node marketing/catalogos/manual-balcao/gerar.js
const { chromium } = require("playwright"); const fs = require("fs"), path = require("path");
const D = __dirname, EMB = path.join(D, "../catalogo-v7-final/emb"), FONTES = path.join(D, "../catalogo-v7-final/fontes");
const LOGOS = path.resolve(D, "../../../saidas/banners-loja6-2026-11/assets");

// ---------- produtos ----------
// s = specs [rótulo, valor]; fale = como falar com o cliente; atencao = erros que não podem acontecer
const NOBRE = "Nobre", ECO = "Econômica", MADEIRA = "Madeiras & Metais", COMP = "Massas & Complementos", DECO = "Efeitos Decorativos", SEC = "Opção secundária";
const P = [
  { k: "cobertura", linha: NOBRE, nome: "Cobertura Absoluta", sub: "Ultra Premium · a que mais cobre",
    serve: "Para quem quer a maior cobertura possível e fechar a pintura com menos demãos. Totalmente lavável.",
    s: [["Acabamento", "Fosco"], ["Uso", "Interno e externo"], ["Rendimento", "18 L: até 350 m² acabado\n3,6 L: até 70 m² acabado"], ["Diluição", "Obrigatória: mínimo 10% e máximo 30% de água"],
        ["Secagem", "Toque 2h · entre demãos 4h · final 12h"], ["Ferramenta", "Rolo de lã de pelos médios ou trincha"], ["Superfícies", "Massa corrida preparada, repintura, concreto, blocos, texturas, reboco e fibrocimento"], ["Tamanhos", "18 L / 17 L · 3,6 L / 3,4 L"]],
    fale: "\"É a que mais cobre da Laet. Você fecha a parede com menos demãos.\"",
    atencao: ["A diluição é OBRIGATÓRIA (10% a 30%). Sem diluir, não aplica direito.", "Não aplicar com sol batendo, em parede sem preparo, muito quente ou úmida."] },
  { k: "emborrachada", linha: NOBRE, nome: "Emborrachada", sub: "Tinta que vira borracha",
    serve: "Seca e vira uma película de borracha: impermeabiliza e ajuda a diminuir a temperatura. Laje, telhado, muro e fachada.",
    s: [["Acabamento", "Semibrilho"], ["Uso", "Interno e externo"], ["Rendimento", "18 L: média de 200 m² por demão\n3,6 L: média de 40 m² por demão"], ["Diluição", "20% de água só na 1ª demão (pra penetrar)"],
        ["Secagem", "Toque 1h · entre demãos 4h · final 12h"], ["Demãos", "3 a 4 demãos pra impermeabilizar"], ["Cobre", "Trincas e fissuras de até 0,2 mm"], ["Tamanhos", "18 L / 17 L · 3,6 L / 3,4 L"]],
    fale: "\"É tinta que vira borracha. Resolve até 100% do problema de infiltração na laje, no telhado e no muro.\"",
    atencao: ["Pra impermeabilizar, oriente 3 a 4 demãos. Uma demão só não resolve.", "Fale \"tinta que vira borracha\", nunca \"tipo borracha\"."] },
  { k: "lavavel", linha: NOBRE, nome: "Premium Lavável", sub: "Fácil de limpar",
    serve: "Cobertura excelente, baixo odor, antimofo e antifungos. Para parede de dentro e de fora que precisa ser lavada.",
    s: [["Acabamento", "Fosco"], ["Uso", "Interno e externo"], ["Rendimento", "18 L: 200 m² por demão · 3,6 L: 40 m²\n900 ml: 10 m² por demão"], ["Diluição", "Até 10% de água"],
        ["Secagem", "Toque 1h · entre demãos 4h · final 12h"], ["Como lavar", "Sabão neutro, água corrente e bucha macia"], ["Cores", "Paleta Grande (mesma da Emborrachada e Cobertura)"], ["Tamanhos", "18 L / 17 L · 3,6 L / 3,4 L · 900 ml / 800 ml"]],
    fale: "\"Sujou, lava. Sabão neutro, água e bucha macia, sem medo.\"",
    atencao: ["17 L, 3,4 L e 800 ml são as embalagens das cores médias e fortes."] },
  { k: "pisos", linha: NOBRE, nome: "Pisos & Fachadas", sub: "Aguenta carro, chuva e sol",
    serve: "Para garagem, calçada, quadra e fachada. Resiste ao tráfego de carro e ao tempo.",
    s: [["Acabamento", "Fosco"], ["Uso", "Interno e externo"], ["Rendimento", "Até 300 m² por demão"], ["Diluição", "Até 10% de água"],
        ["Secagem", "Toque 1h · entre demãos 4h · final 12h"], ["Cores", "13 cores (não tem branca)"], ["Tamanhos", "17 L · 3,4 L"]],
    fale: "\"Pode passar o carro em cima. Foi feita pra garagem e calçada.\"",
    atencao: ["Essa linha não tem branca: são 13 cores do catálogo."] },
  { k: "epoxi", linha: NOBRE, nome: "Epóxi Base Água", sub: "Renove sem quebrar",
    serve: "Pinta azulejo, pastilha, PVC, alvenaria, madeira, metais (ferro, galvanizado e alumínio) sem obra. Resiste a água, umidade, mofo e limpeza frequente.",
    s: [["Acabamento", "Acetinado"], ["Uso", "Interno e externo"], ["Rendimento", "3,6 L: até 60 m² por demão\n900 ml: até 15 m² por demão"], ["Diluição", "Até 10% de água em todas as demãos"],
        ["Secagem", "Toque 1h · entre demãos 3h · final 5h"], ["Demãos", "2 a 3 demãos"], ["Ferramenta", "Rolo de lã pra epóxi, espuma, trincha, pincel ou pistola"], ["Tamanhos", "3,6 L · 900 ml · 16 cores"]],
    fale: "\"Renova o azulejo da cozinha e do banheiro sem quebrar nada. Sem cheiro forte.\"",
    atencao: ["Antes: limpeza profunda com removedor de gordura e, se brilhante, lixar.", "Limpar a pintura só após 20 dias: pano macio, água e detergente neutro."] },
  { k: "standard", linha: NOBRE, nome: "1ª Linha Standard", sub: "Acrílico concentrado",
    serve: "Tinta de baixo custo, mas concentrada, grossa e com bom poder de cobertura. Antimofo e baixo odor.",
    s: [["Acabamento", "Fosco"], ["Uso", "Interno e externo"], ["Rendimento", "18 L: até 300 m² por demão\n3,6 L: média de 60 m² por demão"], ["Diluição", "Até 20% de água"],
        ["Secagem", "Toque 1h · entre demãos 4h · final 12h"], ["Cores", "84 cores (cartela Standard)"], ["Tamanhos", "18 L / 17 L · 3,6 L / 3,4 L"]],
    fale: "\"Preço baixo, mas é grossa e rende: dá pra diluir até 20%.\"",
    atencao: ["É a de melhor custo-benefício pra quem quer economizar sem levar tinta fraca."] },
  { k: "gessostd", linha: NOBRE, nome: "Direto no Gesso Standard", sub: "Mais cobertura",
    serve: "Vai direto no gesso e no drywall, sem fundo preparador, e cobre mais que a Profissional. Sem cheiro e antimofo.",
    s: [["Uso", "Interno"], ["Rendimento", "Até 240 m² por demão"], ["Diluição", "Até 10% de água"], ["Secagem", "Toque 1h · entre demãos 4h · final 12h"],
        ["Superfícies", "Gesso, drywall, molduras e gesso 3D"], ["Cores", "Mesmas cores da 1ª Linha Standard"], ["Tamanhos", "18 L / 17 L · 3,6 L / 3,4 L"]],
    fale: "\"Não precisa de fundo preparador. E essa cobre mais.\"",
    atencao: ["Só uso interno."] },
  { k: "profissional", linha: ECO, nome: "Super Profissional", sub: "Econômica para dentro de casa",
    serve: "Acrílica de ótima qualidade, com propriedades antimofo, secagem rápida e baixo odor. Para parede interna.",
    s: [["Acabamento", "Fosco"], ["Uso", "Interno"], ["Rendimento", "18 L: até 330 m² por demão\n(média de 250 m²) · 3,6 L: média de 50 m²"], ["Diluição", "Até 10% de água"],
        ["Secagem", "Toque 1h · entre demãos 4h · final 12h"], ["Cores", "34 cores (mesma cartela da Direto no Gesso Profissional)"], ["Tamanhos", "18 L / 17 L · 3,6 L / 3,4 L"]],
    fale: "\"Rende até 330 m² com a parede preparada e selada. Na média, uns 250 m² por demão.\"",
    atencao: ["Os 330 m² são com a parede preparada e selada. Se a parede chupa muita tinta, ofereça a Seladora."] },
  { k: "gesso", linha: ECO, nome: "Direto no Gesso Profissional", sub: "Gesso e drywall",
    serve: "Vai direto no gesso e no drywall: não necessita de fundo preparador. Prática, econômica e antimofo.",
    s: [["Acabamento", "Fosco"], ["Uso", "Interno"], ["Rendimento", "Até 240 m² por demão"], ["Diluição", "Até 10% de água"],
        ["Secagem", "Toque 1h · entre demãos 4h · final 12h"], ["Superfícies", "Gesso, drywall, molduras e gesso 3D"], ["Tamanhos", "18 L / 17 L · 3,6 L / 3,4 L"]],
    fale: "\"Gesso novo? Limpa o pó e aplica. Não precisa passar fundo antes.\"",
    atencao: ["Só uso interno."] },
  { k: "esmalte", linha: MADEIRA, nome: "Esmalte Ecológico", sub: "Base água",
    serve: "Sem solventes, baixo odor e alta resistência. Totalmente lavável, alto brilho, antimofo e secagem rápida.",
    s: [["Acabamento", "Alto brilho"], ["Uso", "Interno e externo"], ["Rendimento", "18 L: até 300 m² · 3,6 L: 50 m²\n900 ml: 10 m² (por demão)"], ["Diluição", "Até 15% de água"],
        ["Secagem", "Toque 30 min · entre demãos 4h · final 6h"], ["Superfícies", "Madeira, metal e alvenaria"], ["Ferramenta", "Rolo de lã de poliéster, espuma ou lã mista; pistola 30/35 lb/pol²"], ["Tamanhos", "18 L / 17 L · 3,6 L / 3,4 L · 900 ml"]],
    fale: "\"É esmalte à base de água: quase sem cheiro e lava com água.\"",
    atencao: ["NÃO pode ser aplicado em cima de esmalte à base de solvente.", "O 18 L sai só na Branca."] },
  { k: "verniz", linha: MADEIRA, nome: "Verniz Base Água", sub: "Fundo e acabamento juntos",
    serve: "Dispensa seladora. Realça os veios da madeira e resiste à chuva. Portas, janelas e móveis, dentro e fora.",
    s: [["Acabamento", "Brilhante"], ["Uso", "Interno e externo"], ["Rendimento", "3,6 L: até 60 m² por demão\n900 ml: até 15 m² por demão"], ["Diluição", "Até 10% de água"],
        ["Secagem", "Toque 30 min · entre demãos 2h · final 4h"], ["Demãos", "Madeira nova: 3 · repintura: 1 a 2"], ["Ferramenta", "Pincel, rolo de espuma ou pistola (limpa com água)"], ["Tons", "Incolor (Natural), Mogno e Imbuia · 18 L, 3,6 L, 900 ml / 800 ml"]],
    fale: "\"Não precisa de seladora: ele já é fundo e acabamento.\"",
    atencao: ["Não aplicar em madeira úmida nem com chuva."] },
  { k: "cimento", linha: DECO, nome: "Efeito Cimento Queimado", sub: "Acabamento decorativo",
    serve: "Massa decorativa com cara de cimento queimado. Pode ser polida pra ganhar alto brilho. Antimofo.",
    s: [["Acabamento", "Fosco (polido: alto brilho)"], ["Uso", "Interno e externo (fórmula nova)"], ["Diluição", "Até 10% de água"], ["Secagem", "Toque 2h · entre demãos 6h · cura total 36h"],
        ["Ferramenta", "Aplicador de massa, desempenadeira e espátula de inox"], ["Cores", "15 cores"], ["Tamanhos", "5 kg · 20 kg"]],
    fale: "\"Dá o visual de cimento queimado sem obra. Quer brilho? É só polir.\"",
    atencao: ["A bula antiga diz \"uso interno\": está desatualizada. A fórmula nova é interna e externa.", "Não passar rendimento: o da bula está errado."] },
  { k: "massas", linha: COMP, nome: "Massa Corrida", sub: "Só área interna e seca",
    serve: "Nivela e corrige a parede antes de pintar. Fácil de lixar. Quarto e sala.",
    s: [["Uso", "Interno, só área seca"], ["Rendimento", "Depende da superfície"], ["Tamanhos", "1,5 kg · 5 kg · saco 23 kg · barrica 23 kg"]],
    fale: "\"Pra deixar a parede lisinha no quarto e na sala.\"",
    atencao: ["Nunca em banheiro, cozinha ou área externa: aí é a Massa Acrílica."] },
  { k: "massas", linha: COMP, nome: "Massa Acrílica", sub: "Dentro e fora",
    serve: "Nivela parede de dentro e de fora e lugares que pegam respingo de água, como banheiro e cozinha.",
    s: [["Uso", "Interno e externo"], ["Rendimento", "Depende da superfície"], ["Tamanhos", "1,5 kg · 5 kg · saco 23 kg · barrica 23 kg"]],
    fale: "\"Pra banheiro, cozinha e área de fora.\"",
    atencao: ["NUNCA diga que resolve ou resiste à umidade. Senão o cliente usa pra tratar umidade e o problema volta."] },
  { k: "seladora", linha: COMP, nome: "Seladora (Selador Acrílico)", sub: "Parede nova",
    serve: "Para parede nova ou reboco novo que chupa muita tinta. Preenche os poros e é mais barata que a tinta: economiza tinta.",
    s: [["Preparo", "Pronta pra uso: só misturar bem"], ["Quando", "Toda superfície nova"], ["Tamanhos", "18 L · 3,6 L"]],
    fale: "\"Passa a seladora antes e você gasta bem menos tinta.\"",
    atencao: ["Não é a mesma coisa que Fundo Preparador (veja abaixo)."] },
  { k: "fundo", linha: COMP, nome: "Fundo Preparador", sub: "Parede fraca",
    serve: "Para reboco fraco e parede velha que esfarela, descasca, com caliça, calcinação ou pintura queimada de sol. Firma a superfície.",
    s: [["Preparo", "Pronto pra uso, líquido"], ["Como aplicar", "De baixo pra cima, evitando desperdício"], ["Tamanhos", "18 L · 3,6 L · 900 ml"]],
    fale: "\"Ele firma a parede pra tinta não soltar depois.\"",
    atencao: ["Parede esfarelando sem Fundo Preparador = tinta descascando depois."] },
  { k: "vinil", linha: SEC, nome: "Látex Vinil", sub: "Opção secundária (não é marca Laet)",
    serve: "A opção mais barata, só pra parede interna e seca. Ofereça só quando o cliente pedir o mais barato possível.",
    s: [["Acabamento", "Fosco"], ["Uso", "Só interno"], ["Rendimento", "Em média 100 m² (18 L)"], ["Diluição", "Pronta pra uso"],
        ["Secagem", "Toque 5h · entre demãos 8h · final 16h"], ["Ferramenta", "Rolo de lã de carneiro ou pincel"], ["Tamanhos", "18 L · Branca e 18 cores"]],
    fale: "\"Ela é a mais simples. Pra durar mais, eu te indico a Standard.\"",
    atencao: ["8 horas entre demãos é obrigatório.", "Nunca em área externa, banheiro ou parede úmida: descasca e mancha."] },
];

const SITUACOES = [
  ["Laje, telhado ou muro com infiltração", "Emborrachada (3 a 4 demãos)"],
  ["Quer a maior cobertura possível", "Cobertura Absoluta"],
  ["Parede que precisa ser lavada", "Premium Lavável"],
  ["Garagem, calçada ou quadra", "Pisos & Fachadas"],
  ["Azulejo de cozinha ou banheiro", "Epóxi Base Água"],
  ["Quer economizar, dentro e fora", "1ª Linha Standard"],
  ["Gesso ou drywall novo", "Direto no Gesso (Standard ou Profissional)"],
  ["Parede interna, bom preço", "Super Profissional"],
  ["Portão, grade, porta de madeira", "Esmalte Ecológico"],
  ["Móvel ou porta de madeira natural", "Verniz Base Água"],
  ["Visual de cimento queimado", "Efeito Cimento Queimado"],
  ["Parede nova que chupa tinta", "Seladora"],
  ["Parede velha que esfarela ou descasca", "Fundo Preparador"],
  ["Corrigir parede de quarto e sala", "Massa Corrida"],
  ["Corrigir banheiro, cozinha ou área de fora", "Massa Acrílica"],
];
const RENDE = [
  ["Cobertura Absoluta", "até 350 m² acabado", "até 70 m² acabado", "—"], ["Emborrachada", "200 m²/demão", "40 m²/demão", "—"],
  ["Premium Lavável", "200 m²/demão", "40 m²/demão", "10 m²/demão"], ["Pisos & Fachadas", "até 300 m²/demão (17 L)", "—", "—"],
  ["1ª Linha Standard", "até 300 m²/demão", "60 m²/demão", "—"], ["Super Profissional", "até 330 m²/demão (média 250)", "50 m²/demão", "—"],
  ["Direto no Gesso (Std e Prof.)", "até 240 m²/demão", "—", "—"], ["Esmalte Ecológico", "até 300 m²/demão", "50 m²/demão", "10 m²/demão"],
  ["Epóxi Base Água", "—", "até 60 m²/demão", "até 15 m²/demão"], ["Verniz Base Água", "—", "até 60 m²/demão", "até 15 m²/demão"],
  ["Látex Vinil", "média 100 m²", "—", "—"],
];

// ---------- HTML ----------
const esc = (t) => String(t).replace(/\n/g, "<br>");
const W = (s) => `<div class="pg">${s}</div>`;
let N = 0;
const pagina = (titulo, rot, corpo) => { N++; return `<div class="page"><div class="topo"></div><div class="trim">
  <div class="hd"><div class="sl">${rot}</div><div class="st">${titulo}</div><div class="su"></div></div><img class="hlogo" src="IMG/logo-azul.png">
  <div class="corpo">${corpo}</div>
  <div class="rod"><span>Manual do Balcão · uso interno das lojas</span><b>${String(N).padStart(2, "0")}</b></div></div></div>`; };
const ficha = (p) => `<div class="ficha"><div class="fl"><div class="foto"><img src="IMG/${p.k}.png"></div><div class="tag">${p.linha}</div></div>
  <div class="fr"><div class="fn">${p.nome}</div><div class="fs">${p.sub}</div><div class="fserve">${p.serve}</div>
    <div class="grid">${p.s.map(([r, v]) => `<div class="box"><div class="br">${r}</div><div class="bv">${esc(v)}</div></div>`).join("")}</div>
    <div class="fale"><b>No balcão:</b> ${p.fale}</div>
    <div class="atn">${p.atencao.map((a) => `<div>! ${a}</div>`).join("")}</div></div></div>`;

const capa = `<div class="page capa"><div class="trim">
  <img class="clogo" src="IMG/logo-branco.png"><div class="cbar"></div>
  <div class="ctit">Manual do Balcão</div><div class="csub">Tudo o que você precisa pra atender bem e vender o produto certo</div>
  <div class="cind">${["Qual produto pra cada problema", "Quanta tinta o cliente precisa", "Rendimento, diluição e secagem", "O que nunca falar e nunca fazer"].map((t) => `<div>${t}</div>`).join("")}</div>
  <div class="cfoot">Uso interno das lojas Tintas Laet · dados da bula oficial</div></div></div>`;

const p2 = pagina("Como usar este manual", "Comece aqui", `
  <div class="intro">Você não precisa ler tudo. Procure o produto ou a situação do cliente e vá direto na página. Cada produto tem o que ele faz, os números certos e o que <b>não</b> pode acontecer.</div>
  <div class="h2">As 5 perguntas pro cliente</div>
  <div class="perg">${["Onde vai pintar? (parede, teto, laje, piso, madeira, metal, azulejo)", "É dentro ou fora de casa? Pega chuva ou água?", "Como está a parede? (nova, velha, esfarelando, com mofo, já pintada)", "Qual o tamanho? (largura e altura das paredes)", "Qual cor? Branca, clara ou forte?"].map((t, i) => `<div><span>${i + 1}</span>${t}</div>`).join("")}</div>
  <div class="h2">Regras de ouro</div>
  <div class="ouro">${[
    ["Cor média ou forte tem embalagem menor", "18 L vira 17 L, 3,6 L vira 3,4 L e 900 ml vira 800 ml. É normal: a cor leva mais pigmento."],
    ["Parcelamento", "Sempre: \"Parcele em até 12x sem juros (consulte as condições)\". Não tem valor mínimo de compra."],
    ["Não prometa o que não está aqui", "Não sabe o rendimento ou uso de um produto? Não chute. Pergunte antes."],
    ["Cor na tela é aproximada", "Sempre mostre a cartela física da loja antes de fechar a cor."],
    ["Ordem certa da pintura", "1º Fundo Preparador ou Seladora · 2º Massa · 3º Tinta."],
  ].map(([a, b]) => `<div class="oc"><b>${a}</b><span>${b}</span></div>`).join("")}</div>`);

const p3 = pagina("Qual produto pra cada situação", "Consulta rápida", `<div class="tab">${SITUACOES.map(([a, b]) => `<div class="tr"><span>${a}</span><b>${b}</b></div>`).join("")}</div>
  <div class="nota">Na dúvida entre duas tintas, pergunte se é dentro ou fora e se pega água. Isso já decide a maioria.</div>`);

const p4 = pagina("Quanta tinta o cliente precisa", "Conta de balcão", `
  <div class="passos">${[
    ["Área de cada parede", "largura × altura. Some todas as paredes."],
    ["Desconte portas e janelas", "porta ≈ 1,6 m² · janela ≈ 1,5 m² (meça se der)."],
    ["Multiplique pelas demãos", "normalmente 2 demãos (veja a ficha do produto)."],
    ["Divida pelo rendimento", "o resultado é quantas latas levar. Arredonde pra cima."],
  ].map(([a, b], i) => `<div class="ps"><i>${i + 1}</i><div><b>${a}</b><span>${b}</span></div></div>`).join("")}</div>
  <div class="ex"><b>Exemplo:</b> quarto de 3 × 4 m com 2,6 m de altura → paredes: (3 + 4 + 3 + 4) × 2,6 = 36,4 m² · menos 1 porta e 1 janela ≈ 33 m² · 2 demãos = 66 m² · Standard 3,6 L rende 60 m² por demão → <b>1 galão 3,6 L + sobra pouca; se for cor forte ou parede que chupa, leve 2 ou passe Seladora.</b></div>
  <div class="h2">Rendimento de cada produto</div>
  <div class="rt"><div class="rh"><span>Produto</span><span>18 L / balde</span><span>3,6 L / galão</span><span>900 ml</span></div>
    ${RENDE.map((r) => `<div class="rr">${r.map((c) => `<span>${c}</span>`).join("")}</div>`).join("")}</div>
  <div class="nota">O rendimento muda com o estado da parede: parede nova, áspera ou que chupa tinta rende menos. Massas não têm rendimento fixo: depende da superfície.</div>`);

const p5 = pagina("Preparar a superfície e aplicar", "Antes de pintar", `
  <div class="dois"><div class="cx"><div class="h3">Preparação</div>
    <div class="li">A superfície tem que estar <b>firme, limpa, seca</b> e sem poeira, gordura, mofo ou partes soltas.</div>
    <div class="li"><b>Parede nova:</b> Seladora, pra uniformizar a absorção e gastar menos tinta.</div>
    <div class="li"><b>Reboco fraco, caliça, pintura queimada de sol, calcinação:</b> Fundo Preparador.</div>
    <div class="li"><b>Corrigir imperfeições:</b> Massa Corrida (área seca, interna) ou Massa Acrílica (área com água ou externa).</div>
    <div class="li"><b>Azulejo ou superfície brilhante:</b> desengordurar e lixar antes (Epóxi).</div></div>
  <div class="cx"><div class="h3">Condições pra pintar</div>
    <div class="li">Não pintar com <b>sol batendo</b>, parede muito quente ou úmida.</div>
    <div class="li">Evitar chuva nos <b>primeiros 20 dias</b>: pingos podem manchar. Se acontecer, enxágue sem esfregar; se ficar, mais uma demão.</div>
    <div class="li">Não pintar com umidade do ar acima de <b>80%</b>, nem abaixo de <b>10 °C</b> ou acima de <b>40 °C</b>.</div>
    <div class="li">Evitar retoque isolado depois de seco.</div>
    <div class="li">Limpar a pintura só depois de <b>20 dias</b> (cura total).</div>
    <div class="li">Cores fortes podem desbotar com maresia e tempo, sem perder a proteção.</div></div></div>
  <div class="h2">Ferramenta certa</div>
  <div class="ferr">${[["Tintas acrílicas", "Rolo de lã de carneiro, rolo anti-respingo, pincel"], ["Esmalte", "Rolo de lã de poliéster, espuma ou lã mista · pistola 30/35 lb/pol²"], ["Epóxi", "Rolo de lã pra epóxi, espuma, trincha, pincel ou pistola"], ["Cimento Queimado", "Aplicador de massa, desempenadeira e espátulas de inox"], ["Textura lisa / design", "Rolo de textura, cabelo de anjo, espátula, desempenadeira"], ["Grafiato", "Desempenadeira de aço, inox ou PVC"]].map(([a, b]) => `<div class="fc"><b>${a}</b><span>${b}</span></div>`).join("")}</div>`);

const p6 = pagina("O que não pode acontecer", "Erros que geram reclamação", `<div class="erros">${[
  ["Esmalte base água em cima de esmalte base solvente", "NÃO pode. Não adere e solta."],
  ["Massa Corrida em banheiro, cozinha ou área externa", "É só área interna e seca. Lá fora e com água: Massa Acrílica."],
  ["Dizer que Massa Acrílica resolve umidade", "Nunca. Ela aguenta respingo, não trata umidade."],
  ["Látex Vinil em área externa ou parede úmida", "Descasca e mancha. Só interno e seco, 8h entre demãos."],
  ["Cobertura Absoluta sem diluir", "Diluição é obrigatória: 10% a 30% de água."],
  ["Emborrachada com uma demão só pra impermeabilizar", "Oriente 3 a 4 demãos. 1ª demão com 20% de água."],
  ["Epóxi em azulejo engordurado ou brilhante", "Limpeza profunda com removedor de gordura e lixar antes."],
  ["Parede esfarelando sem Fundo Preparador", "A tinta solta depois. Primeiro firma, depois pinta."],
  ["Verniz em madeira úmida ou com chuva", "Esperar a madeira secar."],
  ["Prometer cor exata pela foto do celular", "Cor na tela é aproximada. Mostre a cartela física."],
  ["Afirmar entrega feita pela loja", "Hoje a entrega é por aplicativo, pedida pelo cliente."],
].map(([a, b]) => `<div class="er"><b>${a}</b><span>${b}</span></div>`).join("")}</div>`);

// fichas: 2 por página
const fichasPgs = []; for (let i = 0; i < P.length; i += 2) fichasPgs.push(pagina(P[i].linha === P[i + 1]?.linha || !P[i + 1] ? `Linha ${P[i].linha}` : `${P[i].linha} · ${P[i + 1].linha}`, "Ficha dos produtos", ficha(P[i]) + (P[i + 1] ? ficha(P[i + 1]) : "")));

const fim = pagina("Segurança e contatos", "Importante", `<div class="dois"><div class="cx"><div class="h3">Segurança (da bula)</div>
    <div class="li">Pode causar alergia na pele: use luvas, óculos e roupa adequada.</div>
    <div class="li">Contato com pele ou olhos: lave com bastante água. Se irritar, procure um médico.</div>
    <div class="li">Guarde longe de crianças e animais.</div>
    <div class="li">Derramou? Contenha com areia ou terra. Nunca descarte em via pública.</div>
    <div class="li">Engoliu? <b>Não provoque vômito</b>: procure um médico. CEATOX: 0800 014 8110 · (11) 2661-8571.</div></div>
  <div class="cx"><div class="h3">Contatos</div>
    <div class="li"><b>WhatsApp central:</b> (11) 97714-0964</div>
    <div class="li"><b>Instagram:</b> @tintaslaet</div>
    <div class="li"><b>Site:</b> tintaslaet.com</div>
    <div class="li"><b>SAC do fabricante (rótulo):</b> (11) 95318-9216 · (11) 94891-0470</div>
    <div class="li"><b>Dúvida que não está aqui?</b> Pergunte antes de responder o cliente.</div></div></div>`);

const PAGS = [capa, p2, p3, p4, p5, p6, ...fichasPgs, fim];
if (PAGS.length % 2) PAGS.push(pagina("Anotações", "Espaço livre", `<div class="linhas">${"<div></div>".repeat(22)}</div>`));

const CSS = (b) => `@font-face{font-family:"Montserrat";font-weight:700;src:url("file://${FONTES}/Montserrat-Bold.ttf")}
@font-face{font-family:"Montserrat";font-weight:800;src:url("file://${FONTES}/Montserrat-ExtraBold.ttf")}
@page{size:${210 + 2 * b}mm ${297 + 2 * b}mm;margin:0}*{margin:0;padding:0;box-sizing:border-box}
html,body{-webkit-print-color-adjust:exact;print-color-adjust:exact}body{font-family:'Poppins',sans-serif;color:#212529}
.page{position:relative;width:${210 + 2 * b}mm;height:${297 + 2 * b}mm;overflow:hidden;page-break-after:always;background:#F0F2F5}
.trim{position:absolute;left:${b}mm;top:${b}mm;width:210mm;height:297mm}
.topo{position:absolute;left:0;right:0;top:0;height:${b + 2.6}mm;background:#062B63;border-bottom:.9mm solid #FFC107}
.hd{position:absolute;left:12mm;top:9mm}.sl{font-family:'Montserrat';font-weight:700;font-size:7pt;letter-spacing:.3em;text-transform:uppercase;color:#1976D2}
.st{font-family:'Montserrat';font-weight:800;font-size:17pt;text-transform:uppercase;color:#062B63;margin-top:.6mm;line-height:1.05}.su{width:9mm;height:1.1mm;background:#FFC107;border-radius:.6mm;margin-top:1.6mm}
.hlogo{position:absolute;right:12mm;top:8mm;height:14mm}
.corpo{position:absolute;left:12mm;right:12mm;top:28mm;bottom:16mm}
.rod{position:absolute;left:12mm;right:12mm;bottom:7mm;height:6mm;border-top:.25mm solid #D3DAE4;display:flex;align-items:flex-end;justify-content:space-between;font-size:7.4pt;color:#4A5568}
.rod b{font-family:'Bebas Neue';font-weight:400;font-size:12pt;color:#fff;background:#062B63;border-radius:3mm;padding:.4mm 3.2mm .1mm}
.h2{font-family:'Montserrat';font-weight:800;font-size:11pt;color:#062B63;text-transform:uppercase;margin:6mm 0 2.6mm}.h2::after{content:"";display:inline-block;width:8mm;height:1mm;background:#FFC107;margin-left:3mm;vertical-align:middle}
.h3{font-family:'Montserrat';font-weight:800;font-size:10.5pt;color:#062B63;text-transform:uppercase;margin-bottom:2.4mm}
.intro{font-size:10.5pt;line-height:1.5;background:#fff;border-left:1.6mm solid #FFC107;border-radius:0 3mm 3mm 0;padding:5mm 6mm}
.perg div{display:flex;align-items:center;gap:3.4mm;background:#fff;border-radius:3mm;padding:3.2mm 4mm;margin-bottom:2mm;font-size:9.6pt;font-weight:500}
.perg span{flex:none;width:7.5mm;height:7.5mm;border-radius:50%;background:#062B63;color:#FFC107;font-family:'Bebas Neue';font-size:13pt;display:flex;align-items:center;justify-content:center}
.ouro{display:grid;grid-template-columns:1fr 1fr;gap:3mm}.oc{background:#0D3D86;color:#fff;border-radius:3mm;padding:4mm 4.4mm}.oc:last-child{grid-column:1/3}
.oc b{display:block;font-family:'Montserrat';font-weight:800;font-size:8.6pt;color:#FFC107;text-transform:uppercase;margin-bottom:1mm}.oc span{font-size:8.6pt;line-height:1.4}
.tab .tr{display:flex;justify-content:space-between;gap:6mm;background:#fff;border-radius:2.4mm;padding:3.6mm 5mm;margin-bottom:2mm;font-size:9.8pt}.tab .tr:nth-child(odd){background:#E6ECF5}
.tab b{font-family:'Montserrat';font-weight:700;color:#0D47A1;text-align:right}
.nota{font-size:8.6pt;color:#4A5568;margin-top:3.4mm;line-height:1.45}
.passos{display:grid;grid-template-columns:1fr 1fr;gap:3mm}.ps{display:flex;gap:3mm;background:#fff;border-radius:3mm;padding:3.6mm 4mm}
.ps i{flex:none;font-style:normal;width:8mm;height:8mm;border-radius:50%;background:#FFC107;color:#062B63;font-family:'Bebas Neue';font-size:14pt;display:flex;align-items:center;justify-content:center}
.ps b{display:block;font-family:'Montserrat';font-weight:800;font-size:8.8pt;color:#062B63}.ps span{font-size:8.6pt}
.ex{margin-top:3mm;background:#FFF3CC;border-radius:3mm;padding:4mm 5mm;font-size:8.8pt;line-height:1.5}
.rt{background:#fff;border-radius:3mm;overflow:hidden;font-size:8.4pt}.rh,.rr{display:grid;grid-template-columns:1.3fr 1.3fr 1fr .9fr;gap:2mm;padding:2.5mm 4mm}
.rh{background:#062B63;color:#FFC107;font-family:'Montserrat';font-weight:800;font-size:7.6pt;text-transform:uppercase}.rr:nth-child(even){background:#EEF2F8}.rr span:first-child{font-weight:600;color:#062B63}
.dois{display:grid;grid-template-columns:1fr 1fr;gap:4mm}.cx{background:#fff;border-radius:3mm;padding:5mm}
.li{font-size:8.8pt;line-height:1.45;padding:1.6mm 0 1.6mm 4mm;border-bottom:.25mm solid #E6EAF0;position:relative}.li::before{content:"";position:absolute;left:0;top:3.4mm;width:1.6mm;height:1.6mm;border-radius:50%;background:#FFC107}
.ferr{display:grid;grid-template-columns:1fr 1fr;gap:2.6mm}.fc{background:#0D3D86;color:#fff;border-radius:3mm;padding:3.4mm 4mm;font-size:8.4pt}.fc b{display:block;color:#FFC107;font-family:'Montserrat';font-weight:800;font-size:8.2pt;text-transform:uppercase}
.erros .er{display:grid;grid-template-columns:1.05fr 1fr;gap:5mm;align-items:center;background:#fff;border-left:1.6mm solid #C62828;border-radius:0 2.6mm 2.6mm 0;padding:3.6mm 5mm;margin-bottom:2.2mm}
.er b{font-family:'Montserrat';font-weight:700;font-size:9pt;color:#062B63}.er span{font-size:8.8pt}
/* ficha */
.ficha{display:flex;gap:5mm;background:#fff;border-radius:3.2mm;padding:4.4mm;height:122mm;margin-bottom:5mm;overflow:hidden}
.fl{flex:none;width:42mm;display:flex;flex-direction:column;gap:3mm}
.foto{height:52mm;border-radius:2.4mm;background:#E8EEF7;display:flex;align-items:center;justify-content:center;padding:3mm}.foto img{max-width:100%;max-height:100%;object-fit:contain}
.tag{text-align:center;font-family:'Montserrat';font-weight:800;font-size:7.6pt;text-transform:uppercase;color:#062B63;background:#FFC107;border-radius:1.6mm;padding:1.4mm}
.fr{flex:1;min-width:0}.fn{font-family:'Montserrat';font-weight:800;font-size:15pt;color:#0D47A1;text-transform:uppercase;line-height:1.05}
.fs{font-style:italic;font-weight:600;font-size:8.6pt;color:#1976D2;margin-top:.6mm}.fserve{font-size:8.8pt;line-height:1.42;margin-top:1.8mm}
.grid{display:grid;grid-template-columns:1fr 1fr;gap:1.8mm;margin-top:2.6mm}.box{background:#F0F3F8;border-radius:2mm;padding:2mm 2.6mm}
.br{font-family:'Montserrat';font-weight:700;font-size:6.4pt;letter-spacing:.06em;text-transform:uppercase;color:#1976D2}.bv{font-size:8pt;font-weight:500;line-height:1.3;margin-top:.3mm}
.fale{margin-top:2.4mm;background:#0D3D86;color:#fff;border-radius:2.4mm;padding:2.6mm 3.4mm;font-size:8.4pt;line-height:1.4}.fale b{color:#FFC107}
.atn{margin-top:2mm;font-size:8.2pt;line-height:1.4;color:#7A1F1F}.atn div{background:#FDECEC;border-radius:1.8mm;padding:1.6mm 2.8mm;margin-bottom:1.2mm;font-weight:500}
/* capa */
.capa{background:#0D47A1}.clogo{position:absolute;left:50%;transform:translateX(-50%);top:40mm;width:120mm}
.cbar{position:absolute;left:50%;margin-left:-10mm;top:112mm;width:20mm;height:1.4mm;background:#FFC107;border-radius:.7mm}
.ctit{position:absolute;left:0;right:0;top:118mm;text-align:center;font-family:'Bebas Neue';font-size:54pt;color:#fff;line-height:1}
.csub{position:absolute;left:25mm;right:25mm;top:142mm;text-align:center;font-size:11pt;color:#FFE082;line-height:1.4}
.cind{position:absolute;left:35mm;right:35mm;top:170mm}.cind div{background:#062B63;color:#fff;border-left:1.6mm solid #FFC107;border-radius:0 2.4mm 2.4mm 0;padding:4mm 6mm;margin-bottom:3mm;font-weight:600;font-size:10.5pt}
.cfoot{position:absolute;left:0;right:0;bottom:16mm;text-align:center;color:#C9D5EA;font-size:8.6pt}
.linhas div{height:9.5mm;border-bottom:.3mm solid #C9D2DE}`;

const HTML = (b, img) => `<!doctype html><html><head><meta charset="utf-8"><link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Poppins:ital,wght@0,400;0,500;0,600;1,600&display=swap" rel="stylesheet"><style>${CSS(b)}</style></head><body>${PAGS.join("\n")}</body></html>`.replace(/IMG\//g, img + "/");

(async () => {
  // imagens: alta e leve
  const { execFileSync } = require("child_process");
  for (const t of ["alta", "leve"]) fs.mkdirSync(path.join(D, "build", t), { recursive: true });
  execFileSync("python3", ["-I", "-c", `
import glob, os, sys
from PIL import Image
emb, logos, out = sys.argv[1], sys.argv[2], sys.argv[3]
for f in glob.glob(emb + "/*.png") + [logos + "/logo-branco.png", logos + "/logo-azul.png"]:
    i = Image.open(f).convert("RGBA"); n = os.path.basename(f)
    a = i.copy(); a.thumbnail((1300, 1300), Image.LANCZOS); a.save(out + "/alta/" + n)
    l = i.copy(); l.thumbnail((520, 520), Image.LANCZOS); l.save(out + "/leve/" + n, optimize=True)
`, EMB, LOGOS, path.join(D, "build")]);
  const b = await chromium.launch(); const p = await b.newPage();
  for (const [bleed, img, arq] of [[3, "alta", "manual-balcao-laet-grafica.pdf"], [0, "leve", "manual-balcao-laet-whatsapp.pdf"]]) {
    const h = path.join(D, "build", `manual-${img}.html`); fs.writeFileSync(h, HTML(bleed, path.join(D, "build", img)));
    await p.goto("file://" + h, { waitUntil: "networkidle" }); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(500);
    await p.pdf({ path: path.join(D, arq), preferCSSPageSize: true, printBackground: true });
    console.log("ok", arq, (fs.statSync(path.join(D, arq)).size / 1e6).toFixed(1) + " MB", PAGS.length, "páginas");
  }
  await b.close();
})();
