// O fetch nativo do Node 22 ignora HTTPS_PROXY: a requisição sai por fora do
// proxy e, numa sessão de nuvem, perde a credencial que o proxy anexaria — o
// erro que aparece é "Host not in allowlist". A flag que corrige isso só vale
// se estiver setada na partida do processo, então reexecutamos com ela quando
// há proxy configurado. Na máquina local não há HTTPS_PROXY e isso não roda.
if (!process.env.NODE_USE_ENV_PROXY && (process.env.HTTPS_PROXY || process.env.https_proxy)) {
  const { spawnSync } = require('child_process');
  const { status } = spawnSync(process.execPath, [__filename, ...process.argv.slice(2)], {
    stdio: 'inherit',
    env: { ...process.env, NODE_USE_ENV_PROXY: '1' },
  });
  process.exit(status ?? 1);
}

const fs = require('fs');
const path = require('path');

const [, , prompt, destino, qualidadeArg, sizeArg] = process.argv;

if (!prompt || !destino) {
  console.error('Uso: node --env-file=.env scripts/gerar-imagem.js "PROMPT" "destino.png" [low|medium|high] [1024x1536|1536x1024|1024x1024]');
  process.exit(1);
}

const qualidade = qualidadeArg || 'medium';
if (!['low', 'medium', 'high'].includes(qualidade)) {
  console.error(`Qualidade inválida: "${qualidade}". Use low, medium ou high.`);
  process.exit(1);
}

const size = sizeArg || '1024x1536';
if (!['1024x1536', '1536x1024', '1024x1024'].includes(size)) {
  console.error(`Tamanho inválido: "${size}". Use 1024x1536 (retrato, padrão), 1536x1024 (paisagem) ou 1024x1024 (quadrado).`);
  process.exit(1);
}

// Na máquina local a chave vem do .env. Numa sessão de nuvem ela pode estar
// cadastrada como API credential do ambiente — aí o proxy da Anthropic anexa o
// Authorization depois que a requisição sai da VM, e a chave nunca chega aqui.
// Sem chave no ambiente, mandamos sem o header e deixamos o proxy resolver.
const apiKey = process.env.OPENAI_API_KEY;
const authHeaders = apiKey ? { Authorization: `Bearer ${apiKey}` } : {};

(async () => {
  const response = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      ...authHeaders,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-image-1.5',
      prompt,
      size,
      quality: qualidade,
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
  console.log(`✓ Imagem salva em ${outPath} (qualidade: ${qualidade})`);
})();
