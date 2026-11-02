#!/usr/bin/env bash
# Copia o protótipo v1 para dentro do APK (assets/www). device.html vira a página inicial.
set -euo pipefail
cd "$(dirname "$0")/.."
src=prototypes/app
dst=android/app/src/main/assets/www
rm -rf "$dst" && mkdir -p "$dst"
cp "$src"/{styles.css,album.css,r3.css,app.css,core.js,r3-cards.js,r3-data.js,r3.js,state.js,screens.js,album.js,app.js} "$dst"/
cp "$src/device.html" "$dst/index.html"
echo "Protótipo copiado para $dst"
