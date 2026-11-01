#!/usr/bin/env bash
# Baixa as miniaturas das cartas usadas no protótipo da rodada 3 (coleção 151, sv3pt5)
# para prototypes/round3/cards/. As imagens não vão para o repositório (veja .gitignore):
# são da The Pokémon Company e servem só para visualizar o protótipo localmente.
set -euo pipefail
cd "$(dirname "$0")/../prototypes/round3"
mkdir -p cards
ids=$(grep -o '"id": "sv3pt5-[0-9]*"' r3-cards.js | grep -o 'sv3pt5-[0-9]*')
for id in $ids; do
  n=${id#sv3pt5-}
  out="cards/${id}.png"
  [ -s "$out" ] && continue
  curl -fsSL --retry 3 -o "$out" "https://images.pokemontcg.io/sv3pt5/${n}.png"
  echo "ok $out"
done
