---
name: abrir
description: >
  Abre uma sessão de trabalho carregando a memória do negócio (empresa, preferências, estratégia, identidade)
  e devolve um resumo curto pro usuário. Use quando o usuário disser "abrir",
  "começar o dia", "/abrir" ou no primeiro turno de uma sessão depois do /instalar.
---

# /abrir — Abertura de sessão

Curto e direto. O objetivo é carregar contexto e devolver uma síntese de uma frase pra o usuário começar a trabalhar.

## Workflow

0. **Sincronizar memória primeiro** (repo privado `kevinlaet/tintas-laet-memoria`
   — `_memoria/` do site é gitignored por ser repo público, então é lá que o
   contexto sobrevive entre sessões):
   - Se o repositório já estiver anexado à sessão, dar um `git pull` nele.
   - Senão, usar `add_repo` (owner `kevinlaet`, repo `tintas-laet-memoria`,
     access `push`) e clonar em `/home/user/tintas-laet-memoria`.
   - Copiar `_memoria/*.md` de lá pra `_memoria/` do `tintas-laet-site`
     (sobrescrevendo — a cópia privada é a fonte de verdade entre sessões).
   - Se esse repositório não existir ou não puder ser acessado, seguir com
     o que já estiver local em `_memoria/` (pode estar desatualizado) e
     avisar o Kevin depois do resumo: "não consegui sincronizar a memória
     privada — usei o que já tinha aqui."

1. Ler, em ordem:
   - `_memoria/empresa.md`
   - `_memoria/preferencias.md`
   - `_memoria/estrategia.md`
   - `identidade/design-guide.md` (só pra saber se está preenchido ou em branco)

2. Se algum dos três primeiros estiver em branco (placeholder), responder:
   > "Vi que `_memoria/<arquivo>.md` ainda não foi preenchido. Quer rodar `/instalar` agora?"
   E parar.

3. Se tudo estiver preenchido, devolver UMA mensagem curta no formato:

```
[Nome do negócio] — [o que faz em 5-8 palavras]
Foco atual: [prioridade da estratégia, em uma frase]
Tom: [resumo de 3-4 palavras do tom de voz]

Pronto. O que vamos fazer?
```

4. Não listar quais arquivos foram lidos. Não confirmar leitura. Só usar o contexto.

## Regras

- Resposta tem que caber em 5 linhas no terminal
- Não fazer perguntas além de "o que vamos fazer?"
- Se o `design-guide.md` estiver em branco, não mencionar — só vira problema quando alguma skill visual for chamada
