#!/usr/bin/env bash
# Usado pelo netlify.toml (build.ignore) pra só gastar minuto de build
# no site oficial (branch main). Staging já é publicado de graça no
# GitHub Pages (.github/workflows/pages.yml), então não precisa duplicar
# no Netlify.
#
# Convenção do Netlify: exit 0 = pula o build, exit 1 = segue com o build.
if [ "$BRANCH" = "main" ]; then
  exit 1
else
  exit 0
fi
