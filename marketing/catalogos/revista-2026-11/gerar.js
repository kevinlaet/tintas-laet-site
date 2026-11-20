// Catálogo-revista Tintas Laet — A4 retrato + 3 mm de sangria (216 x 303 mm), 20 páginas, SEM PREÇO.
// Tela de trabalho: 816 x 1145 px CSS (= 216 x 303 mm a 96 dpi). Render com deviceScaleFactor 3.125 -> 2550 x 3578 px (300 dpi).
// Sangria 3 mm = 11,3 px. Margem de segurança 5 mm do corte = 8 mm da borda = 30 px. Todo texto fica a >= 44 px da borda.
// Uso: PW_MOD=... PW_EXEC=... node gerar.js        -> saida/pagina-01.jpg ... 20 + saida/catalogo-laet-A4.pdf
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const QR = require('qrcode');
const { chromium } = require(process.env.PW_MOD || 'playwright');
const DIR = __dirname, OUT = path.join(DIR, 'saida');
const PAL = JSON.parse(fs.readFileSync(path.join(DIR, 'paleta-oficial.json'), 'utf8')).linhas;

const NAVY = '#062B63', BLUE = '#0D47A1', Y = '#FFC107', YD = '#B98A00', CREAM = '#F7F4EE', INK = '#1E2433';

// ------------------------------------------------------------------ dados
// Textos só com fatos do site / aulas do Kevin (CLAUDE.md) / rótulos. Nenhum preço.
const TINTAS = [
  { id: 'super-profissional', nome: 'Tinta Super Profissional', img: 'emb/profissional-remove-bg-io.png', tag: 'Acrílica · uso interno',
    txt: 'Tinta acrílica de ótima qualidade e resistência, com anti-mofo. Rende até 330 m² por demão com a parede preparada e selada.',
    onde: ['Sala', 'Quarto', 'Corredor', 'Teto'], tam: ['18L · Branca', '18L · Cores', '3,6L · Branca', '3,6L · Cores'] },
  { id: 'standard', nome: 'Tinta 1ª Linha Standard', img: 'emb/standard-remove-bg-io.png', tag: 'Acrílica concentrada · dentro e fora',
    txt: 'Tinta de baixo custo, mas concentrada, grossa e com bom poder de cobertura. Pode ser diluída em até 20%. Anti-mofo.',
    onde: ['Paredes internas', 'Paredes externas', 'Muro'], tam: ['18L · Branca', '3,6L · Branca'] },
  { id: 'premium-lavavel', nome: 'Tinta Premium Lavável', img: 'emb/premiumlavavel-remove-bg-io.png', tag: 'Lavável · dentro e fora',
    txt: 'Mega qualidade e excelente cobertura. Dá pra limpar com facilidade, tem anti-mofo, anti-fungos e baixo odor. Rende até 200 m² no balde de 18L.',
    onde: ['Sala', 'Cozinha', 'Quarto de criança', 'Fachada'], tam: ['18L · Branca', '3,6L · Branca', '900ml · Branca'] },
  { id: 'direto-no-gesso', nome: 'Tinta Direto no Gesso', img: 'emb/direto no gesso-remove-bg-io.png', tag: 'Gesso e drywall · uso interno',
    txt: 'Vai direto no gesso e no drywall. Não necessita de fundo preparador. Prática, econômica e com ótimo acabamento.',
    onde: ['Forro de gesso', 'Sanca', 'Drywall'], tam: ['18L · Branca', '18L · Cores', '3,6L · Branca', '3,6L · Cores'] },
  { id: 'emborrachada', nome: 'Tinta Emborrachada', img: 'emb/emborrachada-remove-bg-io.png', tag: 'Tinta de borracha · impermeabiliza',
    txt: 'Tinta de borracha: seca e vira uma película elástica que protege contra sol, chuva e microfissuras. Resolve até 100% do problema de infiltração. Rende até 200 m² no balde de 18L.',
    onde: ['Laje', 'Telhado', 'Muro', 'Calha'], tam: ['18L · Branca', '3,6L · Branca'] },
  { id: 'latex-vinil', nome: 'Latex Vinil', img: 'emb/vinil-remove-bg-io.png', tag: 'Econômica · só uso interno',
    txt: 'A opção mais econômica. Use só em parede de dentro e seca, e espere pelo menos 8 horas entre uma demão e outra.',
    onde: ['Parede interna seca'], tam: ['18L · Branca', '18L · Cores'] },
  { id: 'piso-fachada', nome: 'Tinta Pisos & Fachadas', img: 'emb/pisos efachadas-remove-bg-io.png', tag: 'Alta resistência · 13 cores',
    txt: 'Aguenta tráfego de carro, chuva e sol. Totalmente lavável, super aderente, acabamento fosco. Rende até 300 m² por demão.',
    onde: ['Garagem', 'Quintal', 'Calçada', 'Fachada'], tam: ['17L · Cores', '18L · Branca', '3,4L · Cores', '3,6L · Branca'] },
  { id: 'epoxi', nome: 'Tinta Epóxi Base Água', img: 'emb/epoxibaseagua.png', tag: 'Renove sem quebrar',
    txt: 'Renova azulejo, cozinha, banheiro e metal sem quebrar nada. Secagem rápida, alta resistência, totalmente lavável e sem cheiro forte.',
    onde: ['Azulejo', 'Cozinha', 'Banheiro', 'Metal'], tam: ['3,6L · Branca', '900ml · Branca'] },
  { id: 'esmalte', nome: 'Esmalte Ecológico Base Água', img: 'emb/esmalte-ecologico.png', tag: 'Base água · baixo odor',
    txt: 'Baixo odor, boa cobertura e qualidade premium. Acabamento brilhante. Pinta ferro, madeira, parede e teto, dentro e fora de casa.',
    onde: ['Portão', 'Grade', 'Porta', 'Janela'], tam: ['18L · Branca', '3,6L · Branca', '900ml · Branca'] },
  { id: 'verniz', nome: 'Verniz Base Água', img: 'emb/verniz-premium-remove-bg-io.png', tag: 'Fundo e acabamento em 1',
    txt: 'Realça os veios da madeira. É fundo e acabamento no mesmo produto, dispensa seladora. Odor baixíssimo e secagem rápida.',
    onde: ['Porta', 'Móvel', 'Deck', 'Madeira em geral'], tam: ['18L · Incolor', '3,6L · Incolor', '900ml · Incolor', '18L · Mogno e Imbuia', '3,6L · Mogno e Imbuia', '900ml · Mogno e Imbuia'] },
];
const MASSAS = [
  { nome: 'Massa Corrida', uso: 'Nivela e corrige a parede antes de pintar. Lixamento fácil.', onde: 'Área interna e seca', tam: '1,5kg · 5kg · Saco 23kg · Barrica 23kg' },
  { nome: 'Massa Acrílica', uso: 'Prepara a parede que pega respingo de água e a parede de fora.', onde: 'Banheiro, cozinha e área externa', tam: '5kg · Saco 23kg · Barrica 23kg' },
  { nome: 'Grafiato', uso: 'Textura com acabamento rústico e moderno. Cor branca.', onde: 'Interna e externa', tam: 'Saco 23kg · Barrica 23kg' },
  { nome: 'Textura Lisa', uso: 'Acabamento decorativo liso e uniforme. Cor branca.', onde: 'Área interna', tam: 'Saco 23kg · Barrica 23kg' },
  { nome: 'Textura Design', uso: 'Efeito decorativo diferenciado na parede. Cor branca.', onde: 'Interna e externa', tam: 'Saco 23kg · Barrica 23kg' },
];
const COMPL = [
  { nome: 'Seladora', img: 'emb/seladora.png', txt: 'Pra parede nova e reboco novo que chupa muita tinta. Fecha os poros e economiza tinta.', tam: '18L · 3,6L' },
  { nome: 'Fundo Preparador', img: 'emb/fundo-preparador.png', txt: 'Pra reboco fraco e parede velha, que descasca ou esfarela. Firma a superfície antes da tinta.', tam: '18L · 3,6L · 900ml' },
  { nome: 'Resina Acqua', img: 'emb/liqui-brilho.png', txt: 'Resina transparente que protege, embeleza e impermeabiliza telha, tijolo, concreto aparente e pedra.', tam: '18L · 3,6L · 900ml' },
  { nome: 'Corante Premium', img: 'emb/Corantesbisnaga.webp', txt: 'Colore tinta base água, como a Epóxi, na cor que você quiser. Fácil de misturar e rende muito.', tam: 'Bisnaga 50ml' },
];
const FERR_A = [ // rolos, refis, cabos, extensor
  ['Rolo Anti-Respingo 5cm', '5cm · com cabo', 'rolo-anti-respingo-5cm.png'], ['Rolo Anti-Respingo 9cm', '9cm · com cabo', 'rolo-anti-respingo-9cm.png'],
  ['Rolo Anti-Respingo 15cm', '15cm · com cabo', 'rolo-anti-respingo-15cm.png'], ['Refil Anti-Respingo 23cm', '23cm · refil, sem cabo', 'refil-anti-respingo-23cm.png'],
  ['Refil Anti-Respingo BIG 46cm', '46cm BIG · refil, sem cabo', 'refil-anti-respingo-46cm.png'], ['Rolo Poliéster Preto 5cm', '5cm · com cabo', 'rolo-poliester-5cm.png'],
  ['Rolo Poliéster Preto 9cm', '9cm · com cabo', 'rolo-poliester-9cm.png'], ['Rolo Poliéster Preto 15cm', '15cm · com cabo', 'rolo-poliester-15cm.png'],
  ['Refil Poliéster Preto 23cm', '23cm · refil, sem cabo', 'refil-poliester-23cm.png'], ['Refil Espuma POP 23cm', '23cm · refil, sem cabo', 'rolo-espuma-pop.png'],
  ['Rolo Lã de Carneiro 9cm', '9cm · com cabo', 'rolo-la-carneiro-9cm.png'], ['Rolo Lã de Carneiro 15cm', '15cm · com cabo', 'rolo-la-carneiro-15cm.png'],
  ['Refil Lã de Carneiro 23cm', '23cm · refil, sem cabo', 'rolo-la-carneiro.png'], ['Refil Lã Microfibra 46cm', '46cm · refil, sem cabo', 'refil-la-microfibra-46cm.png'],
  ['Refil Lã Super 23cm', '23cm · refil, sem cabo', 'rolo-la-super.png'], ['Rolo Textura Cabelo de Anjo 10cm', '10cm · com cabo', 'rolo-textura-cabelo-anjo-10cm.png'],
  ['Refil Textura Cabelo de Anjo 23cm', '23cm · refil, sem cabo', 'refil-textura-cabelo-anjo-23cm.png'], ['Refil Rolo para Massas 23cm', '23cm · refil, sem cabo', 'refil-rolo-massas-23cm.png'],
  ['Cabo para Rolo Reforçado 23cm', 'Cabo reforçado 23cm', 'cabo-rolo.png'], ['Cabo para Rolo Reforçado 46cm', 'Cabo reforçado 46cm', 'cabo-rolo-46cm.png'],
  ['Extensor para Rolo', '2 metros · 3 metros', 'extensor.png'],
];
const FERR_B = [ // proteger, aplicar, lixar, limpar
  ['Lona Preta', 'Metro (1 x 4m)', 'lona-preta.png'], ['Papelão Protege-Piso', 'Metro (1 x 1,20m)', 'papelao-protege-piso.png'],
  ['Fita Crepe', 'M · G', 'fita-crepe-m.png'], ['Trincha', '2" · 3" · 4"', 'trincha-3pol.png'],
  ['Pad de Pintura', 'Pad de pintura', 'pad-pintura.png'], ['Tinta Spray', 'Várias cores', 'sprays.png'],
  ['Aguarrás', '900ml · 5L', 'aguarras-900ml.png'], ['Thinner', '900ml · 5L', 'thinner-900ml.png'],
  ['Desempenadeira de Aço 23cm', '23cm', 'desempenadeira-aco.png'], ['Desempenadeira Decorativa INOX', 'Retangular · Trapézio', 'desempenadeiras-de-inox.png'],
  ['Desempenadeira PVC 23cm (Grafiato)', '23cm', 'desempenadeira-pvc-grafiato.png'], ['Lixa de Massa (Tatu)', 'Numeração 80 a 220', 'lixa-massa.png'],
  ['Lixa de Madeira (Tatu)', 'Numeração 80 a 220', 'lixa-madeira.png'], ['Lixa de Ferro (Adere)', 'Numeração 80 a 220', 'lixa-ferro.png'],
  ['Espátula de Silicone', 'Espátula', 'espatula-silicone.png'], ['Espátula INOX 6cm', '6cm', 'espatula-inox-6cm.png'],
  ['Espátula INOX 10cm', '10cm', 'espatula-inox-10cm.png'], ['Espátula Aço 6cm', '6cm', 'espatula-aco-6cm.png'],
  ['Espátula Aço 10cm', '10cm', 'espatula-aco-10cm.png'],
];
const LOJAS = [
  [1, 'Vila Bela', 'São Paulo', 'Av. Sapopemba, 25.723', '(11) 98082-0686'],
  [2, 'Jd. São João', 'Mauá', 'Rua do Britador, 2', '(11) 97750-4434'],
  [3, 'Jd. Santa Cecília', 'Mauá', 'Av. Ayrton Senna da Silva, 235', '(11) 97749-8813'],
  [4, 'Vila Luzita', 'Santo André', 'Av. São Bernardo do Campo, 757', '(11) 94855-1977'],
  [5, 'Jd. Itapark', 'Mauá', 'Av. Itapark, 4377', '(11) 91433-4875'],
  [6, 'Santa Terezinha', 'São Bernardo do Campo', 'Av. Luís Pequini, 899', '(11) 91875-5095'],
];

// ------------------------------------------------------------------ estilo
const CSS = `
@font-face { font-family:'Bebas Neue'; src:url('fonts/BebasNeue-Regular.woff2') format('woff2'); }
@font-face { font-family:'Montserrat'; font-weight:400 900; src:url('fonts/Montserrat-Variable.woff2') format('woff2'); }
@font-face { font-family:'Poppins'; font-weight:400; src:url('fonts/Poppins-Regular.woff2') format('woff2'); }
@font-face { font-family:'Poppins'; font-weight:500; src:url('fonts/Poppins-Medium.woff2') format('woff2'); }
@font-face { font-family:'Poppins'; font-weight:600; src:url('fonts/Poppins-SemiBold.woff2') format('woff2'); }
@font-face { font-family:'Poppins'; font-weight:700; src:url('fonts/Poppins-Bold.woff2') format('woff2'); }
*,*::before,*::after { margin:0; padding:0; box-sizing:border-box; }
html,body { background:#888; }
.pg { position:relative; width:816px; height:1145px; overflow:hidden; background:${CREAM}; color:${INK}; font-family:'Poppins',sans-serif; margin:0 0 20px; }
.abs { position:absolute; }
.kick { font:800 10.5px/1 'Montserrat',sans-serif; letter-spacing:.3em; color:${YD}; text-transform:uppercase; }
.kick.w { color:${Y}; }
.h { font:800 44px/1.02 'Montserrat',sans-serif; letter-spacing:-.02em; color:${NAVY}; }
.h em { font-style:normal; color:${BLUE}; }
.lead { font:400 14px/1.6 'Poppins',sans-serif; color:#4A5266; }
.rule { height:3px; width:44px; background:${Y}; border-radius:2px; }
.foot { position:absolute; left:48px; right:48px; bottom:40px; display:flex; justify-content:space-between; align-items:center; font:600 9.5px/1 'Poppins',sans-serif; color:#8A90A0; letter-spacing:.02em; }
.foot b { font:800 11px/1 'Montserrat',sans-serif; color:${NAVY}; }
.foot .n { display:inline-flex; width:24px; height:24px; border-radius:50%; background:${NAVY}; color:#fff; align-items:center; justify-content:center; font:800 10px/1 'Montserrat',sans-serif; }
.card { background:#fff; border-radius:16px; box-shadow:0 1px 0 rgba(6,43,99,.06), 0 10px 30px rgba(6,43,99,.07); }
.chip { display:inline-block; font:600 10.5px/1 'Poppins',sans-serif; color:${NAVY}; background:#EEF2F9; border-radius:30px; padding:6px 11px; margin:0 5px 6px 0; }
.sz { display:flex; flex-wrap:wrap; gap:6px; }
.sz span { font:700 10.5px/1 'Montserrat',sans-serif; color:${NAVY}; border:1.5px solid ${NAVY}; border-radius:6px; padding:6px 9px; }
.lbl { font:800 9.5px/1 'Montserrat',sans-serif; letter-spacing:.2em; color:#8A90A0; text-transform:uppercase; margin:16px 0 8px; }
`;
let PAGE = 0;
const foot = (secao) => `<div class="foot"><span><span class="n">${PAGE}</span>&nbsp;&nbsp;<b>Tintas Laet</b> · ${secao}</span><span>Parcele em até 12x sem juros (consulte as condições) · tintaslaet.com</span></div>`;
const pg = (html, secao, bg) => { PAGE++; return `<section class="pg" style="${bg ? 'background:' + bg : ''}">${html}${secao ? foot(secao) : ''}</section>`; };
const ph = (src, css) => `<div class="abs" style="${css};background:url('img/${src}') center/cover no-repeat"></div>`;

// ------------------------------------------------------------------ páginas
function capa() {
  const baldes = [['emb/pisos efachadas-remove-bg-io.png', 150, 150, -6], ['emb/premiumlavavel-remove-bg-io.png', 290, 168, 0], ['emb/profissional-remove-bg-io.png', 446, 186, 0], ['emb/standard-remove-bg-io.png', 600, 168, 0], ['emb/emborrachada-remove-bg-io.png', 718, 150, 6]];
  const b = baldes.map(([s, cx, w, r]) => `<img class="abs" src="img/${s}" style="left:${cx - w / 2}px;bottom:${178}px;width:${w}px;transform:rotate(${r}deg);z-index:${w > 180 ? 4 : 3};filter:drop-shadow(0 16px 18px rgba(0,0,0,.35))">`).join('');
  return pg(`
${ph('foto/sala-areia.webp', 'left:-380px;top:0;width:1250px;height:835px')}
<div class="abs" style="left:0;top:0;width:816px;height:835px;background:linear-gradient(90deg, rgba(247,244,238,.92) 0%, rgba(247,244,238,.75) 40%, rgba(247,244,238,0) 68%)"></div>
<img class="abs" src="img/logo-azul.png" style="left:40px;top:44px;height:118px">
<div class="abs kick" style="left:56px;top:206px">Catálogo 2026 · Edição de balcão</div>
<div class="abs h" style="left:54px;top:228px;width:640px;font-size:58px;line-height:1">Cores e produtos<br>para sua <em>obra</em></div>
<div class="abs rule" style="left:56px;top:372px"></div>
<div class="abs lead" style="left:56px;top:390px;width:310px;font-size:15px">Tintas, massas, ferramentas e um monte de cor pra deixar a casa do jeito que você sonhou.</div>
<div class="abs" style="left:0;top:835px;width:816px;height:310px;background:${NAVY}"></div>
<div class="abs" style="left:0;top:829px;width:816px;height:6px;background:${Y}"></div>
${b}
<div class="abs" style="left:48px;right:48px;bottom:56px;display:flex;justify-content:space-between;align-items:center;color:#fff">
  <div style="font:800 15px/1.2 'Montserrat',sans-serif">6 lojas no ABC<br>e Zona Leste de SP</div>
  <div style="text-align:right;font:600 12px/1.5 'Poppins',sans-serif;color:rgba(255,255,255,.8)">Parcele em até 12x sem juros (consulte as condições)<br><b style="color:${Y};font:800 15px/1.4 'Montserrat',sans-serif">tintaslaet.com</b></div>
</div>`, '');
}

function indice() {
  const it = [['03', 'Como escolher a tinta certa'], ['04', 'Cores Super Profissional e Direto no Gesso'], ['05', 'Cores Premium Lavável e Emborrachada'], ['06', 'Cores Standard'], ['07', 'Cores Pisos & Fachadas e Esmalte'],
    ['08', 'Tintas para cada parede'], ['09', 'Interior: Super Profissional e Standard'], ['10', 'Premium Lavável e Direto no Gesso'], ['11', 'Emborrachada e Latex Vinil'], ['12', 'Piso, fachada e azulejo'], ['13', 'Madeira e metal'],
    ['14', 'Massas e texturas'], ['15', 'Efeito Cimento Queimado e Kit Pintura'], ['16', 'Complementos'], ['17', 'Rolos e refis'], ['18', 'Para proteger, aplicar e lixar'], ['19', 'Passo a passo da pintura'], ['20', 'Nossas lojas']];
  return pg(`
${ph('foto/banner-leque.jpg', 'left:0;top:0;width:816px;height:420px;background-position:60% 40%')}
<div class="abs kick" style="left:48px;top:464px">Nesta edição</div>
<div class="abs h" style="left:46px;top:486px;font-size:40px">Do balcão<br>pra sua <em>casa</em></div>
<div class="abs lead" style="left:48px;top:590px;width:280px">A gente juntou aqui o que mais sai nas nossas lojas: tinta pra cada parede, as cores, as massas e as ferramentas certas.<br><br>Ficou na dúvida? Chama a gente no balcão ou no WhatsApp que a gente te ajuda a escolher.</div>
<div class="abs" style="left:360px;top:464px;width:408px;columns:1">
${it.map(([n, t]) => `<div style="display:flex;align-items:baseline;gap:14px;padding:7px 0;border-bottom:1px solid #E3DED3"><span style="font:800 13px/1 'Montserrat',sans-serif;color:${YD};width:22px">${n}</span><span style="font:600 12.5px/1.25 'Poppins',sans-serif;color:${NAVY}">${t}</span></div>`).join('')}
</div>`, 'Índice');
}

function escolher() {
  const L = [
    ['Parede interna', 'Sala, quarto, corredor', ['Premium Lavável', 'Super Profissional', 'Standard', 'Latex Vinil (só parede seca)']],
    ['Parede externa e fachada', 'Pega sol e chuva', ['Premium Lavável', 'Standard']],
    ['Gesso e drywall', 'Forro, sanca, divisória', ['Direto no Gesso']],
    ['Laje, telhado e muro', 'Infiltração e calor', ['Tinta Emborrachada (tinta de borracha)']],
    ['Piso, garagem e calçada', 'Tráfego de carro e chuva', ['Pisos & Fachadas']],
    ['Azulejo, cozinha e banheiro', 'Renovar sem quebrar', ['Epóxi Base Água']],
    ['Madeira e metal', 'Porta, portão, grade, móvel', ['Esmalte Ecológico Base Água', 'Verniz Base Água (madeira)']],
  ];
  const prep = [['Parede nova ou reboco novo', 'Seladora'], ['Parede velha, que esfarela', 'Fundo Preparador'], ['Nivelar parede de dentro', 'Massa Corrida'], ['Parede de fora ou que pega respingo', 'Massa Acrílica']];
  return pg(`
<div class="abs kick" style="left:48px;top:62px">Guia rápido</div>
<div class="abs h" style="left:46px;top:84px;width:640px">Como escolher a <em>tinta certa</em></div>
<div class="abs lead" style="left:48px;top:186px;width:560px">Primeiro, olha onde vai pintar. Depois é só seguir o quadro.</div>
<div class="abs card" style="left:48px;top:232px;width:720px;overflow:hidden">
  <div style="display:grid;grid-template-columns:250px 1fr;background:${NAVY};color:#fff;font:800 10px/1 'Montserrat',sans-serif;letter-spacing:.2em;padding:13px 22px"><span>ONDE VAI PINTAR</span><span>USE</span></div>
  ${L.map(([a, b, c], i) => `<div style="display:grid;grid-template-columns:250px 1fr;align-items:center;padding:20px 22px;${i ? 'border-top:1px solid #EEE9DF' : ''}">
    <div><div style="font:800 14.5px/1.15 'Montserrat',sans-serif;color:${NAVY}">${a}</div><div style="font:500 11px/1.3 'Poppins',sans-serif;color:#8A90A0;margin-top:3px">${b}</div></div>
    <div>${c.map(x => `<span class="chip" style="margin-bottom:3px;margin-top:3px">${x}</span>`).join('')}</div></div>`).join('')}
</div>
<div class="abs" style="left:48px;top:880px;width:720px">
  <div class="kick" style="margin-bottom:12px">Antes de pintar</div>
  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px">
  ${prep.map(([a, b]) => `<div class="card" style="padding:15px 14px;border-top:4px solid ${Y}"><div style="font:500 11px/1.35 'Poppins',sans-serif;color:#6A7184">${a}</div><div style="font:800 14px/1.15 'Montserrat',sans-serif;color:${NAVY};margin-top:8px">${b}</div></div>`).join('')}
  </div>
</div>`, 'Como escolher');
}

// cores: amostra uniforme + ordem por claridade (fica bonito e equilibrado)
const lum = h => { const n = parseInt(h.slice(1), 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255; return .299 * r + .587 * g + .114 * b; };
function pick(linha, n) {
  const rem = new Set(PAL[linha].removidas_do_site || []);
  const c = PAL[linha].cores.filter(x => x.hex && !rem.has(x.nome));
  if (c.length <= n) return c;
  const out = []; for (let i = 0; i < n; i++) out.push(c[Math.floor(i * c.length / n)]); return out;
}
const sw = (c, h) => `<div><div style="height:${h}px;border-radius:10px;background:${c.hex};box-shadow:inset 0 0 0 1px rgba(0,0,0,.07)"></div><div style="font:600 10.5px/1.2 'Poppins',sans-serif;color:${NAVY};margin-top:6px;min-height:26px">${c.nome}</div></div>`;
const AVISO = `<div style="font:500 10px/1.3 'Poppins',sans-serif;color:#8A90A0">As cores impressas podem variar. Confira no leque da loja.</div>`;
function cores(titulo, sub, usada, linha, n, cols, h, total) {
  const c = pick(linha, n);
  return pg(`
<div class="abs kick" style="left:48px;top:62px">Cores</div>
<div class="abs h" style="left:46px;top:84px;width:700px;font-size:40px">${titulo}</div>
<div class="abs lead" style="left:48px;top:${titulo.includes('<br>') ? 184 : 140}px;width:640px">${sub}</div>
<div class="abs" style="left:48px;top:${titulo.includes('<br>') ? 238 : 196}px;width:720px;display:grid;grid-template-columns:repeat(${cols},1fr);gap:16px 12px">${c.map(x => sw(x, h)).join('')}</div>
<div class="abs" style="left:48px;right:48px;top:1056px;display:flex;justify-content:space-between">${AVISO}<div style="font:600 10px/1.3 'Poppins',sans-serif;color:${NAVY}">${usada}${total ? ` · ${total} cores na loja` : ''}</div></div>`, 'Cores');
}
function cores4() {
  const p = pick('piso-fachada', 13), e = pick('esmalte-ecologico', 21);
  return pg(`
<div class="abs kick" style="left:48px;top:62px">Cores</div>
<div class="abs h" style="left:46px;top:84px;font-size:36px">Pisos &amp; Fachadas</div>
<div class="abs lead" style="left:48px;top:128px">As 13 cores da linha, prontas pra garagem, quintal e fachada.</div>
<div class="abs" style="left:48px;top:172px;width:720px;display:grid;grid-template-columns:repeat(7,1fr);gap:14px 12px">${p.map(x => sw(x, 72)).join('')}</div>
<div class="abs" style="left:48px;top:440px;width:720px;height:1px;background:#E3DED3"></div>
<div class="abs h" style="left:46px;top:474px;font-size:36px">Esmalte Ecológico</div>
<div class="abs lead" style="left:48px;top:518px">Algumas das 32 cores, das claras às fortes. Acabamento brilhante.</div>
<div class="abs" style="left:48px;top:562px;width:720px;display:grid;grid-template-columns:repeat(7,1fr);gap:14px 12px">${e.map(x => sw(x, 72)).join('')}</div>
<div class="abs" style="left:48px;right:48px;top:1056px">${AVISO}</div>`, 'Cores');
}

function abertura() {
  return pg(`
${ph('foto/sala-azul-laet.webp', 'left:0;top:0;width:816px;height:610px;background-position:72% 50%')}
<div class="abs kick" style="left:48px;top:652px">Tintas</div>
<div class="abs h" style="left:46px;top:674px;width:600px;font-size:54px">Tinta certa pra <em>cada parede</em></div>
<div class="abs rule" style="left:48px;top:806px"></div>
<div class="abs lead" style="left:48px;top:826px;width:340px">Do quarto à laje, da garagem à porta de madeira. São 10 linhas Laet, cada uma feita pra um trabalho. Nas próximas páginas você vê pra que serve cada uma, onde usar e os tamanhos.</div>
<div class="abs" style="left:430px;top:826px;width:338px;display:grid;grid-template-columns:1fr 1fr;gap:6px 14px;font:600 11.5px/1.3 'Poppins',sans-serif;color:${NAVY}">
${TINTAS.map(t => `<div style="display:flex;gap:8px;align-items:center"><i style="width:7px;height:7px;border-radius:50%;background:${Y};flex:none"></i>${t.nome.replace('Tinta ', '')}</div>`).join('')}
</div>`, 'Tintas');
}

function prodBloco(t, top) {
  return `<div class="abs card" style="left:48px;top:${top}px;width:720px;height:448px;overflow:hidden">
  <div class="abs" style="left:0;top:0;width:300px;height:448px;background:linear-gradient(180deg,#FFFFFF 0%,#F2F4F8 100%)"></div>
  <div class="abs" style="left:24px;top:24px;width:252px;height:400px;display:flex;align-items:center;justify-content:center"><img src="img/${t.img}" style="max-width:100%;max-height:100%;filter:drop-shadow(0 14px 16px rgba(6,43,99,.18))"></div>
  <div class="abs" style="left:328px;top:34px;width:362px">
    <div class="kick">${t.tag}</div>
    <div style="font:800 27px/1.08 'Montserrat',sans-serif;color:${NAVY};letter-spacing:-.015em;margin-top:9px">${t.nome}</div>
    <div class="rule" style="margin:14px 0 14px"></div>
    <div style="font:400 13px/1.6 'Poppins',sans-serif;color:#4A5266">${t.txt}</div>
    <div class="lbl">Onde usar</div><div>${t.onde.map(o => `<span class="chip">${o}</span>`).join('')}</div>
    <div class="lbl" style="margin-top:10px">Tamanhos</div><div class="sz">${t.tam.map(s => `<span>${s}</span>`).join('')}</div>
  </div></div>`;
}
function dupla(a, b, secao, kick) {
  return pg(`
<div class="abs kick" style="left:48px;top:62px">${kick}</div>
${prodBloco(TINTAS.find(x => x.id === a), 92)}
${prodBloco(TINTAS.find(x => x.id === b), 562)}`, secao);
}

function massas() {
  return pg(`
<div class="abs kick" style="left:48px;top:62px">Massas e texturas</div>
<div class="abs h" style="left:46px;top:84px;width:420px">Parede lisa começa <em>aqui</em></div>
<div class="abs lead" style="left:48px;top:186px;width:380px">Massa boa deixa a parede reta e a tinta bonita. Todas vêm em saco ou na barrica Laet.</div>
<img class="abs" src="img/emb/barrica+plastico.png" style="left:470px;top:40px;width:270px;filter:drop-shadow(0 18px 20px rgba(6,43,99,.2))">
<div class="abs card" style="left:48px;top:440px;width:720px;overflow:hidden">
  <div style="display:grid;grid-template-columns:170px 1fr 160px;gap:18px;background:${NAVY};color:#fff;font:800 9.5px/1 'Montserrat',sans-serif;letter-spacing:.18em;padding:13px 22px"><span>PRODUTO</span><span>PRA QUE SERVE</span><span>ONDE USAR</span></div>
  ${MASSAS.map((m, i) => `<div style="display:grid;grid-template-columns:170px 1fr 160px;gap:18px;padding:16px 22px;${i ? 'border-top:1px solid #EEE9DF' : ''}">
    <div style="font:800 15px/1.15 'Montserrat',sans-serif;color:${NAVY}">${m.nome}</div>
    <div><div style="font:400 12px/1.45 'Poppins',sans-serif;color:#4A5266">${m.uso}</div><div style="font:700 10.5px/1.3 'Montserrat',sans-serif;color:${NAVY};margin-top:6px">${m.tam}</div></div>
    <div style="font:600 11.5px/1.35 'Poppins',sans-serif;color:${NAVY}">${m.onde}</div></div>`).join('')}
</div>`, 'Massas e texturas');
}

function cimento() {
  return pg(`
${ph('foto/usando-cimento-queimado.png', 'left:0;top:0;width:430px;height:610px;background-position:50% 50%')}
<div class="abs kick" style="left:466px;top:62px">Efeito decorativo</div>
<div class="abs h" style="left:464px;top:84px;width:320px;font-size:38px">Efeito Cimento <em>Queimado</em></div>
<div class="abs lead" style="left:466px;top:180px;width:300px">Acabamento moderno, com cara de cimento queimado, e aplicação fácil. Vai em parede e teto, dentro e fora de casa. São 15 cores.</div>
<img class="abs" src="img/emb/efeitocimentoqueimado.png" style="left:500px;top:300px;width:220px">
<div class="abs" style="left:466px;top:540px"><div class="lbl" style="margin-top:0">Tamanhos</div><div class="sz"><span>5kg</span><span>20kg</span></div></div>
<div class="abs card" style="left:48px;top:660px;width:720px;height:340px;overflow:hidden">
  <div class="abs" style="left:24px;top:24px;width:230px;height:292px;display:flex;align-items:center;justify-content:center"><img src="img/ferr/kit-5-itens.jfif" style="max-width:100%;max-height:100%"></div>
  <div class="abs" style="left:290px;top:40px;width:400px">
    <div class="kick">Pra começar já</div>
    <div style="font:800 27px/1.08 'Montserrat',sans-serif;color:${NAVY};margin-top:9px">Kit Pintura 5 itens</div>
    <div class="rule" style="margin:14px 0"></div>
    <div style="font:400 13px/1.6 'Poppins',sans-serif;color:#4A5266">Tudo o que você precisa pra começar a pintar, num kit só.</div>
    <div class="lbl">Vem no kit</div>
    <div>${['Rolo 23cm', 'Cabo para rolo 23cm', 'Rolo com cabo P', 'Pincel M', 'Bandeja G'].map(x => `<span class="chip">${x}</span>`).join('')}</div>
  </div></div>`, 'Efeito e kit');
}

function complementos() {
  return pg(`
<div class="abs kick" style="left:48px;top:62px">Complementos</div>
<div class="abs h" style="left:46px;top:84px;width:640px">O segredo de uma <em>pintura que dura</em></div>
<div class="abs lead" style="left:48px;top:186px;width:560px">Preparar bem a parede faz a tinta render mais e durar muito mais.</div>
<div class="abs" style="left:48px;top:240px;width:720px;display:grid;grid-template-columns:1fr 1fr;gap:18px">
${COMPL.map(c => `<div class="card" style="height:370px;position:relative;overflow:hidden">
  <div style="height:190px;display:flex;align-items:center;justify-content:center;background:linear-gradient(180deg,#fff,#F2F4F8);padding:16px"><img src="img/${c.img}" style="max-width:100%;max-height:100%"></div>
  <div style="padding:18px 22px"><div style="font:800 19px/1.1 'Montserrat',sans-serif;color:${NAVY}">${c.nome}</div>
  <div style="font:400 12px/1.5 'Poppins',sans-serif;color:#4A5266;margin-top:8px;min-height:54px">${c.txt}</div>
  <div class="sz" style="margin-top:10px">${c.tam.split(' · ').map(s => `<span>${s}</span>`).join('')}</div></div></div>`).join('')}
</div>`, 'Complementos');
}

function ferramentas(lista, titulo, sub, kick, cols, rows) {
  const cw = (720 - (cols - 1) * 12) / cols;
  return pg(`
<div class="abs kick" style="left:48px;top:62px">${kick}</div>
<div class="abs h" style="left:46px;top:84px;font-size:38px">${titulo}</div>
<div class="abs lead" style="left:48px;top:132px;width:600px">${sub}</div>
<div class="abs" style="left:48px;top:180px;width:720px;display:grid;grid-template-columns:repeat(${cols},1fr);gap:12px">
${lista.map(([n, s, f]) => `<div class="card" style="height:${rows}px;padding:10px 10px 12px;display:flex;flex-direction:column">
  <div style="flex:1;display:flex;align-items:center;justify-content:center;min-height:0"><img src="img/ferr/${f}" style="max-width:100%;max-height:100%"></div>
  <div style="font:700 11px/1.2 'Montserrat',sans-serif;color:${NAVY};margin-top:6px;min-height:26px">${n}</div>
  <div style="font:500 9.5px/1.2 'Poppins',sans-serif;color:#8A90A0;margin-top:3px">${s}</div></div>`).join('')}
</div>`, 'Ferramentas e acessórios');
}

function passos() {
  const P = [['Proteja', 'Forre o chão com lona preta ou papelão e passe fita crepe no rodapé e nas tomadas.'],
    ['Prepare', 'Parede velha que esfarela: Fundo Preparador. Parede nova: Seladora.'],
    ['Nivele', 'Dentro de casa, Massa Corrida. Fora ou onde pega respingo de água, Massa Acrílica. Depois, lixa.'],
    ['Pinte', 'Comece pelos cantos com a trincha e termine com o rolo. Duas demãos, respeitando o tempo de secagem.'],
    ['Capriche', 'Tire a fita com a tinta ainda fresca e limpe as ferramentas logo depois.']];
  return pg(`
${ph('foto/banner-pintando.jpg', 'left:0;top:0;width:816px;height:470px;background-position:50% 35%')}
<div class="abs kick" style="left:48px;top:510px">Passo a passo</div>
<div class="abs h" style="left:46px;top:532px;width:560px">Pintura bem feita em <em>5 passos</em></div>
<div class="abs" style="left:48px;top:650px;width:720px;display:grid;grid-template-columns:repeat(5,1fr);gap:12px">
${P.map(([t, d], i) => `<div class="card" style="padding:18px 14px;height:320px"><div style="font:400 46px/1 'Bebas Neue',sans-serif;color:${Y}">${String(i + 1).padStart(2, '0')}</div>
<div style="font:800 16px/1.1 'Montserrat',sans-serif;color:${NAVY};margin-top:8px">${t}</div><div style="font:400 11.5px/1.5 'Poppins',sans-serif;color:#4A5266;margin-top:8px">${d}</div></div>`).join('')}
</div>`, 'Passo a passo');
}

function lojas(qr) {
  return pg(`
<img class="abs" src="img/logo-branco.png" style="left:40px;top:44px;height:104px">
<div class="abs kick w" style="left:56px;top:178px">Venha nos visitar</div>
<div class="abs h" style="left:54px;top:200px;color:#fff;font-size:46px">Nossas <em style="color:${Y}">6 lojas</em></div>
<div class="abs" style="left:56px;top:266px;font:500 13px/1.4 'Poppins',sans-serif;color:rgba(255,255,255,.8)">Seg a sex 8h às 18h · Sáb 8h às 14h</div>
<div class="abs" style="left:48px;top:316px;width:720px;display:grid;grid-template-columns:1fr 1fr;gap:12px">
${LOJAS.map(([n, b, c, e, w]) => `<div style="border:1.5px solid rgba(255,255,255,.18);border-radius:16px;padding:16px 18px;background:rgba(255,255,255,.05)">
 <div style="display:flex;align-items:center;gap:10px"><span style="background:${Y};color:${NAVY};font:400 21px/1 'Bebas Neue',sans-serif;padding:4px 8px 1px;border-radius:5px;letter-spacing:.04em">LOJA ${n}</span><span style="font:800 14px/1 'Montserrat',sans-serif;color:#fff">${b}</span></div>
 <div style="font:600 11px/1.35 'Poppins',sans-serif;color:${Y};margin-top:9px">${c}</div>
 <div style="font:500 11.5px/1.35 'Poppins',sans-serif;color:rgba(255,255,255,.85)">${e}</div>
 <div style="font:800 17px/1 'Montserrat',sans-serif;color:#fff;margin-top:9px">WhatsApp ${w}</div></div>`).join('')}
</div>
<div class="abs" style="left:48px;top:808px;width:720px;display:flex;gap:26px;align-items:center;background:#fff;border-radius:18px;padding:22px">
 <div style="width:150px;height:150px;flex:none">${qr}</div>
 <div><div class="kick" style="color:${YD}">Aponte a câmera</div>
 <div style="font:800 26px/1.1 'Montserrat',sans-serif;color:${NAVY};margin-top:8px">Fale com a Laet<br>no WhatsApp</div>
 <div style="font:800 20px/1 'Montserrat',sans-serif;color:${BLUE};margin-top:10px">(11) 97714-0964</div>
 <div style="font:600 12px/1.4 'Poppins',sans-serif;color:#4A5266;margin-top:8px">@Tintaslaet · tintaslaet.com</div></div>
</div>
<div class="abs" style="left:48px;right:48px;top:1030px;display:flex;justify-content:space-between;align-items:center;color:#fff">
 <div style="font:800 15px/1.3 'Montserrat',sans-serif">Parcele em até 12x sem juros<br><span style="font:500 12px/1.3 'Poppins',sans-serif;color:rgba(255,255,255,.75)">(consulte as condições)</span></div>
 <div style="font:800 22px/1 'Montserrat',sans-serif;color:${Y}">tintaslaet.com</div>
</div>`, '', NAVY);
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const qr = (await QR.toString('https://wa.me/5511977140964?text=' + encodeURIComponent('Olá! Vi o catálogo da Tintas Laet na loja e quero saber mais.'), { type: 'svg', margin: 0, errorCorrectionLevel: 'M', color: { dark: NAVY, light: '#FFFFFF' } })).replace('<svg ', '<svg width="150" height="150" ');
  const pages = [
    capa(), indice(), escolher(),
    cores('Super Profissional<br>e Direto no Gesso', 'As 34 cores da cartela. Mesmas cores nas duas linhas.', 'Super Profissional · Direto no Gesso', 'super-profissional', 34, 6, 92, 34),
    cores('Premium Lavável<br>e Emborrachada', 'Uma seleção da Paleta Grande Laet. Peça o leque completo no balcão.', 'Premium Lavável · Emborrachada', 'paleta-grande', 36, 6, 92, 107),
    cores('Standard', 'Uma seleção das cores da 1ª Linha Standard. Peça o leque completo no balcão.', '1ª Linha Standard', 'standard', 36, 6, 92, 83),
    cores4(),
    abertura(),
    dupla('super-profissional', 'standard', 'Tintas', 'Tintas · interior'),
    dupla('premium-lavavel', 'direto-no-gesso', 'Tintas', 'Tintas · dentro e fora'),
    dupla('emborrachada', 'latex-vinil', 'Tintas', 'Tintas · proteção e economia'),
    dupla('piso-fachada', 'epoxi', 'Tintas', 'Tintas · piso, fachada e azulejo'),
    dupla('esmalte', 'verniz', 'Tintas', 'Tintas · madeira e metal'),
    massas(), cimento(), complementos(),
    ferramentas(FERR_A, 'Rolos e refis', 'Com cabo, já sai pintando. O refil encaixa no cabo reforçado.', 'Ferramentas', 4, 136),
    ferramentas(FERR_B, 'Proteger, aplicar e lixar', 'Tudo o que faz a pintura sair limpa e bem acabada.', 'Acessórios', 4, 162),
    passos(), lojas(qr),
  ];
  if (pages.length % 4) throw new Error('páginas não múltiplas de 4: ' + pages.length);
  const html = `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><title>Catálogo Tintas Laet 2026</title><style>${CSS}</style></head><body>${pages.join('\n')}</body></html>`;
  const src = path.join(DIR, 'catalogo.html'); fs.writeFileSync(src, html);

  const browser = await chromium.launch(process.env.PW_EXEC ? { executablePath: process.env.PW_EXEC } : {});
  const page = await browser.newPage({ viewport: { width: 816, height: 1145 }, deviceScaleFactor: 3.125 });
  await page.goto('file://' + src, { waitUntil: 'networkidle' }); await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(800);
  // conferência automática: texto fora da margem de segurança (30 px) e qualquer "R$"
  const prob = await page.evaluate(() => {
    const out = [];
    document.querySelectorAll('.pg').forEach((pg, i) => {
      const r0 = pg.getBoundingClientRect();
      if (/R\$\s?\d/.test(pg.innerText)) out.push(`p${i + 1}: tem preço`);
      const walker = document.createTreeWalker(pg, NodeFilter.SHOW_TEXT);
      while (walker.nextNode()) {
        const t = walker.currentNode; if (!t.textContent.trim()) continue;
        const rg = document.createRange(); rg.selectNodeContents(t);
        for (const r of rg.getClientRects()) {
          if (r.left - r0.left < 30 || r0.right - r.right < 30 || r.top - r0.top < 30 || r0.bottom - r.bottom < 30) { out.push(`p${i + 1}: fora da margem "${t.textContent.trim().slice(0, 30)}"`); break; }
        }
        const el = t.parentElement; if (el.scrollWidth > el.clientWidth + 1 && getComputedStyle(el).overflow !== 'visible') out.push(`p${i + 1}: cortado "${t.textContent.trim().slice(0, 30)}"`);
      }
    });
    return out;
  });
  console.log(prob.length ? 'ATENÇÃO:\n' + prob.join('\n') : '✓ margens e preço ok');
  const els = await page.$$('.pg'); const jpgs = [];
  for (let i = 0; i < els.length; i++) {
    const f = path.join(OUT, `pagina-${String(i + 1).padStart(2, '0')}.jpg`);
    await els[i].screenshot({ path: f, type: 'jpeg', quality: 92 }); jpgs.push(f);
  }
  console.log('✓', jpgs.length, 'páginas');
  // PDF: cada página = 1 imagem achatada de 300 dpi em 216 x 303 mm
  const p2 = await browser.newPage(); const parts = [];
  for (const [i, f] of jpgs.entries()) {
    const h = path.join(DIR, `_p${i}.html`);
    fs.writeFileSync(h, `<!DOCTYPE html><html><head><style>@page{size:216mm 303mm;margin:0}html,body{margin:0}img{display:block;width:216mm;height:303mm}</style></head><body><img src="file://${f}"></body></html>`);
    await p2.goto('file://' + h, { waitUntil: 'networkidle' });
    const t = path.join(DIR, `_p${i}.pdf`); await p2.pdf({ path: t, preferCSSPageSize: true, printBackground: true, margin: { top: 0, right: 0, bottom: 0, left: 0 } });
    parts.push(t); fs.unlinkSync(h);
  }
  execFileSync('pdfunite', [...parts, path.join(OUT, 'catalogo-laet-A4-com-sangria.pdf')]); parts.forEach(f => fs.unlinkSync(f));
  console.log('✓ PDF');
  await browser.close();
})();
