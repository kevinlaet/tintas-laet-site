# Prompt pro chat "🛠 LAET PAINEL" — inteligência do gerador de posts

Cola tudo abaixo no chat do painel.

---

Quero evoluir o gerador de posts do painel (`tintas-laet-painel`). O problema: os posts saem sem sentido
(título cortado tipo "5 passos para uma boa, não esqueça!"), com imagem que não combina com o assunto
(homem aleatório em "nova loja"; pintor suado em "dê nova vida à sua sala") e com cara de HTML amador.
Prioridade: qualidade, não quantidade. Quero o mínimo de intervenção manual e o máximo de qualidade.

**Antes de mexer em código:** leia o fluxo atual (`gerar-conteudo.js`, `sugerir-post.js`, `sugerir-tema.js`,
`gerar-foto-post.js`, render-worker), avalie criticamente por que saiu genérico/incoerente e me diga o que
acha. Seja crítico e honesto, sem concordar só pra agradar. Sem complexidade desnecessária.

**O que quero implementar (arquitetura em etapas, cada uma barrando a próxima):**
1. **Ideia + validação de marketing** — a IA responde por escrito: assunto, público, problema/desejo,
   objetivo comercial, formato, argumento e **ação que o cliente deve tomar**. Sem resposta clara, descarta.
2. **Direção de arte** — a IA descreve exatamente o que a pessoa vai ver (cena, foto, enquadramento)
   ANTES de escolher layout. Foto real da pasta de prova social/lojas primeiro; IA só se não cobrir.
3. **Auditoria de coerência** — uma chamada separada de IA confere: título é frase completa e faz sentido
   sozinho? A imagem mostra o que o título diz? Produto/preço/cor batem? Regras da marca ok?
4. **Produção** — arte e legenda finais (texto, logo, preço e cor exata sempre em HTML por cima da foto).
5. **Controle de qualidade** — reprova e refaz sozinho conteúdo genérico, incoerente, com título cortado
   ou layout igual ao do post anterior. Só chega pra mim o que passou.
6. **Radar de tendências** (opcional, só depois): sugere trend apenas se fizer sentido pra Laet; sem
   conexão real, não usa. Pode ler uma lista curta de trends aprovadas que eu mantenho, em vez de navegar ao vivo.

**A ideia escolhe o layout, nunca o contrário:** decoração → ambiente real; oferta → produto+preço;
pintor/equipe/loja → pessoas e lugares reais; educativo → demonstração visual; loja nova → mostrar a loja
(fachada, interior); data/causa → elementos que contam a mesma história.

**5 pilares (equilibrar na semana):** desejo, conhecimento, autoridade, comercial, entretenimento.

**Regras que nunca podem ser quebradas:**
- Título completo; imagem com relação direta ao assunto; nada genérico; não repetir layout em peças seguidas.
- Nunca inventar característica, benefício, preço ou dado de produto.
- CTA: Instagram @Tintaslaet + WhatsApp (11) 97714-0964 + tintaslaet.com.
- "12x sem juros" só com "consulte as condições".
- Nunca "a gente entrega" nem "frete justo" (entrega própria em teste).
- Nunca "atendimento humano", "sem robô" ou "atendente de verdade".
- Loja 6 = "São Bernardo do Campo" (nunca SB/SBC).
- Cor de tinta só da paleta oficial do catálogo.
- Evitar o mascote com mochila de entrega.

Visual: azul `#0D47A1`, amarelo `#FFC107`, Bebas Neue / Montserrat / Poppins. Premium brasileiro, mas
popular — nada elitista, frio ou amador. Referências de qualidade (aprender o princípio, nunca copiar):
CiaColor, Decor Colors, Suvinil, Mundo das Tintas. O guia completo está na skill `guia-conteudo` do repo
`tintas-laet-site` (branch `claude/mazy-os-ativo-wp81iv`, `.claude/skills/guia-conteudo/SKILL.md`).

**Me entregue primeiro:** diagnóstico do que está errado hoje, proposta de como encaixar as etapas sem
quebrar o que já funciona, e o que você recomenda (skill, biblioteca de referências, ou só ajustar os prompts).
Só depois de eu aprovar, implemente.

---

**Última coisa (importante) — contexto compartilhado com o chat "⭐ LAET CENTRAL":**
O painel já tem coisas minhas que o outro chat não enxerga (cérebro dos stories, `docs/PADRAO-DESIGN-STORIES.md`,
👍/👎, programação, fila, o que está quebrado). Pra eu não ter que repassar contexto toda hora, crie e **mantenha
atualizado** o arquivo `docs/CONTEXTO-PAINEL.md` no repo `tintas-laet-painel`, e atualize-o ao fim de TODA tarefa
(commit na `main` só com o "pode" do Kevin; senão na branch). Conteúdo, curto e sem nenhum segredo/chave:
1. O que o painel faz hoje (telas, ferramentas) e o que cada uma usa (OpenAI/Gemini/Meta/Notion) — só nomes, sem valores.
2. O "cérebro" atual: onde vivem as regras de texto e design, o que o 👍/👎 já ensinou, o que é travado.
3. Programação em vigor (datas, temas, status) e o que está na fila.
4. O que está quebrado ou pendente, e o que depende de decisão do Kevin.
5. Decisões já tomadas (pra ninguém re-perguntar).
O chat Central lê esse arquivo no início de cada sessão.
