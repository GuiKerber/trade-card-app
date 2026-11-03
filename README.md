# Trade Card App

App Android para crianças colecionarem cartas num álbum que parece de verdade e combinarem trocas **pessoalmente** com amigos.

## Funcionalidades

**Fase 1 — Álbum (foco atual)**
- Álbum fechado na tela inicial: a criança abre a capa e folheia as páginas
- Cartas guardadas em bolsos de plástico, com bolsos vazios mostrando o que falta
- Cartas repetidas destacadas (são as que dá para trocar)

**Fase 2 — Amigos e trocas**
- Amigos adicionados só pessoalmente, por QR Code
- Pedidos de troca em etapas: carta, lugar e dia escolhidos de listas prontas
- Sem chat e sem texto livre entre crianças
- Aprovação opcional dos pais

**Fase 3 — Conquistas e conta**
- Ranking de trocas só entre amigos e insígnias a cada marco de trocas
- Loja com capas holográficas, capas com arte de Pokémon e adesivos
- Login por email ou Google, com um adulto criando a conta de quem tem menos de 13 anos

## Design

- [`docs/DIRECAO.md`](docs/DIRECAO.md) — **direção escolhida**: interface de vinil holográfico + álbum em foil holográfico
- [`prototypes/app/index.html`](prototypes/app/index.html) — **app v1**: login, álbum, trocas, amigos e conquistas (ranking, insígnias e loja) na direção escolhida
- [`docs/TEXTOS.md`](docs/TEXTOS.md) — textos do app, v1 (voz e tom, glossário, telas e mensagens para adultos)
- [`docs/DESIGN.md`](docs/DESIGN.md) — design system da rodada 1 (Material 3 Expressive + referência Slush adaptada para crianças)
- [`docs/REFERENCIAS.md`](docs/REFERENCIAS.md) — rodada 2: direção de arte a partir de Pokémon e apps de coleção, com fontes
- [`prototypes/home/index.html`](prototypes/home/index.html) — rodadas 1 e 2: 6 variações interativas da tela inicial
- [`prototypes/round3/index.html`](prototypes/round3/index.html) — rodada 3: fichário chapado, de vinil, holográfico e de vinil holográfico, com 5 barras de navegação e cartas reais da coleção 151. Para ver as fotos das cartas, rode `scripts/fetch-card-images.sh` (as imagens não ficam no repositório)

## Dados

- `scripts/build-catalog.py` gera `prototypes/app/catalog.js` com todas as coleções e cartas (só metadados) a partir de PokemonTCG/pokemon-tcg-data.
- `scripts/fetch-card-images.sh` baixa as miniaturas da coleção 151 e as artes das capas Pokémon para ver o protótipo localmente (as imagens não ficam no repositório).

## Stack sugerida

- Kotlin + Jetpack Compose (Material 3 Expressive)

## Status

Projeto em fase inicial de design.
