#!/usr/bin/env bash
# Baixa as miniaturas das cartas usadas no protótipo da rodada 3 (coleção 151, sv3pt5)
# e converte para WebP em prototypes/round3/cards/. As imagens não vão para o
# repositório (veja .gitignore): são da The Pokémon Company e servem só para
# visualizar o protótipo localmente. Requer curl e python3 com Pillow.
set -euo pipefail
cd "$(dirname "$0")/../prototypes/round3"
mkdir -p cards
tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT
ids=$(grep -o '"id": "sv3pt5-[0-9]*"' r3-cards.js | grep -o 'sv3pt5-[0-9]*')
for id in $ids; do
  out="cards/${id}.webp"
  [ -s "$out" ] && continue
  curl -fsSL --retry 3 -o "$tmp/${id}.png" "https://images.pokemontcg.io/sv3pt5/${id#sv3pt5-}.png"
  python3 -I -c 'import sys; from PIL import Image; Image.open(sys.argv[1]).convert("RGB").save(sys.argv[2], "WEBP", quality=82, method=6)' "$tmp/${id}.png" "$out"
  echo "ok $out"
done

# Artes das capas "Pokémon" da loja (cartas Illustration Rare em alta resolução, 600px de largura)
for id in sv3pt5-173 sv3pt5-199 sv8pt5-167 sv8pt5-161 sv3pt5-193 sv3pt5-168 sv3pt5-170 sv3pt5-166; do
  out="cards/${id}-hi.webp"
  [ -s "$out" ] && continue
  curl -fsSL --retry 3 -o "$tmp/${id}-hi.png" "https://images.pokemontcg.io/${id%%-*}/${id#*-}_hires.png"
  python3 -I -c 'import sys; from PIL import Image; im = Image.open(sys.argv[1]).convert("RGB"); im.thumbnail((600, 900)); im.save(sys.argv[2], "WEBP", quality=80, method=6)' "$tmp/${id}-hi.png" "$out"
  echo "ok $out"
done
