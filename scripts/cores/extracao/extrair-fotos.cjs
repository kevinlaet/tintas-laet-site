// Extrai as cores das FOTOS de catálogo (pasta catalogos/): acha cada quadradinho/bolinha, lê a cor do miolo e associa ao nome
// pela ordem de leitura. Os nomes (FOLHAS abaixo) são transcritos à mão de cada foto — conferir a contagem (esperado x achei).
// Foto não é exata como PDF: medir o miolo tira a sombra da borda, mas a incerteza é de ±1 a 2 níveis por canal.
// Precisa de: cd scripts/cores/extracao && npm install
// Saída: scripts/cores/extracao/saida-fotos.json — revisar antes de mexer em identidade/cores/paleta-oficial.json.
// Lê as fotos dos catálogos (bolinhas de cor + nome) e devolve nome -> hex.
// Os nomes foram transcritos das próprias fotos, na ordem de leitura (linha por linha, da esquerda pra direita).
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const PASTA = path.join(__dirname, "..", "..", "..", "catalogos") + path.sep;
const FOLHAS = {
  "catalogo esmalte pag 1.jpg": { linha: "esmalte-ecologico", nomes: ["Vermelho Goya", "Vermelho", "Laranja Cítrico", "Laranja Suave", "Amarelo", "Marfim", "Rosa Big-Big", "Rosa Bebê", "Pérola", "Cinza Claro", "Crômio", "Gelo", "Platina", "Cinza Médio", "Cinza Escuro", "Escuridão"] },
  "catalogo esmalte pag 2.jpg": { linha: "esmalte-ecologico", nomes: ["Azul França", "Azul Del Rey", "Jeans", "Azul Celeste", "Azul Cadeirante", "Roxo", "Verde Caribe", "Verde Uva", "Verde Casual", "Verde Folha", "Floresta Amazônica", "Verde Colonial", "Tabaco", "Conhaque", "Argila", "Camurça"] },
  "catalogo piso e fachadas.jpg": { linha: "piso-fachada", nomes: ["Cinza", "Cinza C-04", "Chumbo", "Concreto", "Profundidade", "Preto", "Camurça", "Vermelho", "Vermelho C-09", "Azul", "Espaço Verde", "Verde B-10", "Amarelo Piso"] },
  "catalogo vinil.jpg": { linha: "latex-vinil", nomes: ["Cinza A", "Cinza B", "Cinza C", "Marfim", "Amarelo Laet", "Compota de Abacaxi", "Areia", "Pêssego", "Sapatilha", "Rosa Vinho", "Goma de Mascar", "Cacto Dália", "Rosado", "Templo da Sabedoria", "Chiffon Azul", "Paisagem Leve", "Frescor Marítimo", "Fonte da Sorte", "Branco"] },
  "catalogo profissional pag 1.jpg": { linha: "super-profissional", nomes: ["Linho Americano", "Areia", "Palha", "Madeira Enfumaçada", "Bambu Tropical", "Camurça", "Rosado", "Rosas Híbridas", "Caixa Mágica", "Azul Laet", "Lagoa Azul", "Azul Rei", "Mergulho Tranquilo", "Olhar Encantador", "Verde Piscina", "Branco"] },
  "catalogo profissional pag 2.jpg": { linha: "super-profissional", nomes: ["Paraíso Secreto", "Refresco de Menta", "Folha de Trevo", "Hortelã Crespa", "Névoa", "Trevo da Sorte", "Amarelo Laet", "Compota de Abacaxi", "Vitamina", "Amêndoa Confeitada", "Conto Infantil", "Camponesa", "Papel de Bala", "Rosa Gloss", "A-04", "Perfume de Figo", "Mousse de Uva", "Cinza Medieval", "Tubarão Cinza"] },
};

const hex = (r, g, b) => "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("").toUpperCase();

async function processar(arquivo, cfg) {
  const { data, info } = await sharp(PASTA + arquivo).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height, ch = 3;
  const px = (x, y) => { const i = (y * W + x) * ch; return [data[i], data[i + 1], data[i + 2]]; };
  const mascara = new Uint8Array(W * H);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const [r, g, b] = px(x, y);
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
    if (mx - mn >= 10 || mn < 222) mascara[y * W + x] = 1;
  }
  const visto = new Uint8Array(W * H);
  const comps = [];
  const yMin = Math.floor(H * 0.22);
  for (let y0 = yMin; y0 < H; y0++) for (let x0 = 0; x0 < W; x0++) {
    const i0 = y0 * W + x0;
    if (!mascara[i0] || visto[i0]) continue;
    const pilha = [i0]; visto[i0] = 1;
    let minx = x0, maxx = x0, miny = y0, maxy = y0, area = 0;
    const pontos = [];
    while (pilha.length) {
      const i = pilha.pop(); const x = i % W, y = (i - x) / W;
      area++; pontos.push(i);
      if (x < minx) minx = x; if (x > maxx) maxx = x; if (y < miny) miny = y; if (y > maxy) maxy = y;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = x + dx, ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
        const j = ny * W + nx;
        if (mascara[j] && !visto[j]) { visto[j] = 1; pilha.push(j); }
      }
    }
    const w = maxx - minx + 1, h = maxy - miny + 1;
    const preenchimento = area / (w * h);
    const razao = w / h;
    if (w < W * 0.08 || w > W * 0.3 || h < W * 0.07 || razao < 0.8 || razao > 1.3) continue;
    if (preenchimento > 0.6) comps.push({ tipo: "cheia", cx: (minx + maxx) / 2, cy: (miny + maxy) / 2, w, h, pontos });
    else if (preenchimento < 0.25) comps.push({ tipo: "anel", cx: (minx + maxx) / 2, cy: (miny + maxy) / 2, w, h, pontos: [] });
  }
  // ordem de leitura: agrupa por linha (cy próximo) e ordena por x
  comps.sort((a, b) => a.cy - b.cy);
  const linhas = [];
  for (const c of comps) {
    const l = linhas.find((l) => Math.abs(l[0].cy - c.cy) < c.h * 0.5);
    if (l) l.push(c); else linhas.push([c]);
  }
  const ordenados = linhas.flatMap((l) => l.sort((a, b) => a.cx - b.cx));
  const saida = [];
  ordenados.forEach((c, k) => {
    let cor;
    if (c.tipo === "anel") cor = "#FFFFFF";
    else {
      const rs = [], gs = [], bs = [];
      for (let dy = -Math.floor(c.h * 0.22); dy <= Math.floor(c.h * 0.22); dy++) for (let dx = -Math.floor(c.w * 0.22); dx <= Math.floor(c.w * 0.22); dx++) {
        const [r, g, b] = px(Math.round(c.cx + dx), Math.round(c.cy + dy)); rs.push(r); gs.push(g); bs.push(b);
      }
      const med = (a) => a.sort((p, q) => p - q)[Math.floor(a.length / 2)];
      cor = hex(med(rs), med(gs), med(bs));
    }
    saida.push({ nome: cfg.nomes[k] || "(sem nome)", hex: cor, x: Math.round(c.cx), y: Math.round(c.cy) });
  });
  return { arquivo, linha: cfg.linha, esperado: cfg.nomes.length, achados: ordenados.length, cores: saida };
}

(async () => {
  const todas = [];
  for (const [arq, cfg] of Object.entries(FOLHAS)) {
    const r = await processar(arq, cfg);
    console.log(arq.padEnd(34), "esperado", r.esperado, "| achei", r.achados, r.esperado === r.achados ? "OK" : "<<< DIVERGE");
    todas.push(r);
  }
  fs.writeFileSync(path.join(__dirname, "saida-fotos.json"), JSON.stringify(todas, null, 1));
})();
