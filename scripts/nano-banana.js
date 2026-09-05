// Gera ou edita imagem com o Gemini Image (nano banana) do Google.
//
// Uso:
//   node --env-file=.env scripts/nano-banana.js "PROMPT" "destino.png" [4:5] [flash|pro] [foto-base.jpg ...]
//
// Exemplos:
//   # Gerar do zero, formato feed do Instagram
//   node --env-file=.env scripts/nano-banana.js "vitrine de loja de tintas decorada com balões" "saidas/capa.png" 4:5
//
//   # Editar foto real da loja adicionando decoração de inauguração
//   node --env-file=.env scripts/nano-banana.js "adicione balões azuis e amarelos na fachada" "saidas/capa.png" 4:5 flash "marketing/imagem das lojas/loja6.jpg"
//
// Requer GEMINI_API_KEY no .env (pegue em https://aistudio.google.com/apikey).

const fs = require('fs');
const path = require('path');

const [, , prompt, destino, aspectArg, modeloArg, ...fotosBase] = process.argv;

if (!prompt || !destino) {
  console.error(
    'Uso: node --env-file=.env scripts/nano-banana.js "PROMPT" "destino.png" [4:5] [flash|pro] [foto-base.jpg ...]'
  );
  process.exit(1);
}

// 4:5 é o formato de feed do Instagram (1080x1350) — padrão nosso.
const aspect = aspectArg || '4:5';
const ASPECTOS = ['1:1', '2:3', '3:2', '3:4', '4:3', '4:5', '5:4', '9:16', '16:9', '21:9'];
if (!ASPECTOS.includes(aspect)) {
  console.error(`Proporção inválida: "${aspect}". Use uma de: ${ASPECTOS.join(', ')}`);
  process.exit(1);
}

const MODELOS = {
  flash: 'gemini-2.5-flash-image',      // nano banana — barato, padrão
  pro: 'gemini-3-pro-image-preview',    // nano banana pro — caro, melhor com texto
};
const modelo = MODELOS[modeloArg || 'flash'];
if (!modelo) {
  console.error(`Modelo inválido: "${modeloArg}". Use "flash" (padrão, barato) ou "pro" (caro).`);
  process.exit(1);
}

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error('GEMINI_API_KEY não encontrada. Adicione no .env na raiz do projeto.');
  console.error('Pegue a chave gratuitamente em https://aistudio.google.com/apikey');
  process.exit(1);
}

const MIMES = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
};

function carregarFoto(arquivo) {
  if (!fs.existsSync(arquivo)) {
    console.error(`Foto base não encontrada: ${arquivo}`);
    process.exit(1);
  }
  const mime = MIMES[path.extname(arquivo).toLowerCase()];
  if (!mime) {
    console.error(`Formato não suportado: ${arquivo}. Use png, jpg ou webp.`);
    process.exit(1);
  }
  return {
    inline_data: { mime_type: mime, data: fs.readFileSync(arquivo).toString('base64') },
  };
}

(async () => {
  const parts = [{ text: prompt }, ...fotosBase.map(carregarFoto)];

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${modelo}:generateContent`,
    {
      method: 'POST',
      headers: { 'x-goog-api-key': apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts }],
        generationConfig: { imageConfig: { aspectRatio: aspect } },
      }),
    }
  );

  if (!response.ok) {
    console.error(`Erro ${response.status} do Gemini:`);
    console.error(await response.text());
    process.exit(1);
  }

  const json = await response.json();
  const retornadas = json.candidates?.[0]?.content?.parts ?? [];
  const imagem = retornadas.find((p) => p.inlineData || p.inline_data);

  if (!imagem) {
    // Quando o modelo recusa ou só responde texto, o motivo vem aqui.
    const texto = retornadas.map((p) => p.text).filter(Boolean).join('\n');
    console.error('O Gemini não devolveu imagem.');
    if (texto) console.error(`Resposta: ${texto}`);
    if (json.promptFeedback) console.error(JSON.stringify(json.promptFeedback, null, 2));
    process.exit(1);
  }

  const dados = imagem.inlineData ?? imagem.inline_data;
  fs.mkdirSync(path.dirname(destino), { recursive: true });
  fs.writeFileSync(destino, Buffer.from(dados.data, 'base64'));

  const kb = Math.round(fs.statSync(destino).size / 1024);
  console.log(`Imagem salva em ${destino} (${kb} KB) — modelo ${modelo}, proporção ${aspect}`);
})();
