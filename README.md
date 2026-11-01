# Trade Card App

App Android para crianças colecionarem cartas num álbum que parece de verdade e combinarem trocas **pessoalmente** com amigos.

## Funcionalidades

**Fase 1 — Álbum (foco atual)**
- Álbum fechado na tela inicial: a criança abre a capa e folheia as páginas
- Cartas guardadas em bolsos de plástico, com bolsos vazios mostrando o que falta
- Cartas repetidas destacadas (são as que dá para trocar)

**Fase 2 — Amigos e trocas**
- Amigos adicionados só pessoalmente, por QR Code
- Pedidos de troca com cartas, lugar e horário escolhidos de listas prontas
- Sem chat e sem texto livre entre crianças
- Aprovação opcional dos pais

## Design

- [`docs/DESIGN.md`](docs/DESIGN.md) — design system da rodada 1 (Material 3 Expressive + referência Slush adaptada para crianças)
- [`docs/REFERENCIAS.md`](docs/REFERENCIAS.md) — rodada 2: direção de arte a partir de Pokémon e apps de coleção, com fontes
- [`prototypes/home/index.html`](prototypes/home/index.html) — rodadas 1 e 2: 6 variações interativas da tela inicial
- [`prototypes/round3/index.html`](prototypes/round3/index.html) — rodada 3: fichário chapado, de vinil, holográfico e de vinil holográfico, com 5 barras de navegação e cartas reais da coleção 151. Para ver as fotos das cartas, rode `scripts/fetch-card-images.sh` (as imagens não ficam no repositório)

## Stack sugerida

- Kotlin + Jetpack Compose (Material 3 Expressive)

## Status

Projeto em fase inicial de design.
