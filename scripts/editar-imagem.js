const fs = require('fs');
const path = require('path');

const [, , origem, prompt, destino] = process.argv;

if (!origem || !prompt || !destino) {
  console.error('Uso: node --env-file=.env scripts/editar-imagem.js "origem.png" "PROMPT" "destino.png"');
  process.exit(1);
}

// Na máquina local a chave vem do .env. Numa sessão de nuvem ela pode estar
// cadastrada como API credential do ambiente — aí o proxy da Anthropic anexa o
// Authorization depois que a requisição sai da VM, e a chave nunca chega aqui.
// Sem chave no ambiente, mandamos sem o header e deixamos o proxy resolver.
const apiKey = process.env.OPENAI_API_KEY;
const authHeaders = apiKey ? { Authorization: `Bearer ${apiKey}` } : {};

(async () => {
  const imageBuffer = fs.readFileSync(path.resolve(origem));
  const form = new FormData();
  form.append('model', 'gpt-image-1.5');
  form.append('prompt', prompt);
  form.append('image', new Blob([imageBuffer], { type: 'image/png' }), path.basename(origem));
  form.append('size', '1024x1536');
  form.append('quality', 'medium');

  const response = await fetch('https://api.openai.com/v1/images/edits', {
    method: 'POST',
    headers: authHeaders,
    body: form,
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
  console.log(`✓ Imagem editada salva em ${outPath}`);
})();
