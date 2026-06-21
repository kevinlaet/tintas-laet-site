const fs = require('fs');
const path = require('path');

const [, , prompt, destino] = process.argv;

if (!prompt || !destino) {
  console.error('Uso: node --env-file=.env scripts/gerar-imagem.js "PROMPT" "destino.png"');
  process.exit(1);
}

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  console.error('OPENAI_API_KEY não encontrada. Adicione no .env na raiz do projeto (Tintas Laet OS/.env).');
  process.exit(1);
}

(async () => {
  const response = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-image-1',
      prompt,
      size: '1024x1536',
      quality: 'high',
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    console.error('Erro na API da OpenAI:', err);
    process.exit(1);
  }

  const data = await response.json();
  const b64 = data.data[0].b64_json;
  const outPath = path.resolve(destino);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, Buffer.from(b64, 'base64'));
  console.log(`✓ Imagem salva em ${outPath}`);
})();
