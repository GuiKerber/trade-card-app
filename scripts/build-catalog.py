#!/usr/bin/env python3
"""Gera prototypes/app/catalog.js com todas as coleções e cartas do Pokémon TCG (inglês),
a partir do conjunto aberto PokemonTCG/pokemon-tcg-data. Só metadados (nome, número,
coleção, raridade, tipo); nenhuma imagem."""
import json, sys, urllib.request, concurrent.futures as cf, pathlib

BASE = 'https://raw.githubusercontent.com/PokemonTCG/pokemon-tcg-data/master'
OUT = pathlib.Path(__file__).resolve().parent.parent / 'prototypes' / 'app' / 'catalog.js'

def get(path):
    with urllib.request.urlopen(f'{BASE}/{path}', timeout=60) as r:
        return json.load(r)

sets = sorted(get('sets/en.json'), key=lambda s: s.get('releaseDate', ''), reverse=True)
def cards_of(s):
    try:
        return s['id'], get(f"cards/en/{s['id']}.json")
    except Exception as e:  # coleção sem arquivo de cartas
        print('sem cartas:', s['id'], e, file=sys.stderr)
        return s['id'], []
with cf.ThreadPoolExecutor(12) as ex:
    by_set = dict(ex.map(cards_of, sets))

rarities, types, out_sets, groups, total = [], [], [], [], 0
def idx(lst, v):
    if v not in lst: lst.append(v)
    return lst.index(v)
for si, s in enumerate(sets):
    out_sets.append([s['id'], s['name'], s.get('series', ''), s.get('printedTotal', s.get('total', 0)), s.get('releaseDate', '')[:4], s.get('ptcgoCode', '')])
    rows = []
    for c in by_set.get(s['id'], []):
        r = idx(rarities, c.get('rarity') or '')
        t = idx(types, (c.get('types') or [c.get('supertype', '')])[0])
        rows.append([c['name'], c['number'], r, t])
    groups.append(rows); total += len(rows)

data = {'sets': out_sets, 'rarities': rarities, 'types': types, 'cards': groups}
OUT.write_text('/* Catálogo completo (gerado por scripts/build-catalog.py): todas as coleções do Pokémon TCG, só metadados. */\n'
               f'const CATALOG = {json.dumps(data, ensure_ascii=False, separators=(",", ":"))};\n', encoding='utf-8')
print(f'{len(out_sets)} coleções, {total} cartas, {OUT.stat().st_size // 1024} KB -> {OUT}')
