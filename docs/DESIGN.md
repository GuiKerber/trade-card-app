# Trade Card App — Design System v0.1

> Universo de adesivos infláveis sobre papel pastel, num álbum que parece de verdade.

**Plataforma:** Android (Material 3 Expressive) · **Tema:** claro (escuro na seção 3.6) · **Público:** crianças de 6 a 12 anos

Este guia adapta a referência visual **Slush** (pastel, adesivos com contorno preto, formas infladas em azul elétrico) para um app Android que segue o **Material Design 3**. O app é um álbum para colecionar cartas de criaturas e combinar trocas **ao vivo** entre amigos. Não tem chat. A primeira entrega é o **álbum**.

Os valores estão em `dp` (medidas) e `sp` (texto). Os nomes de papéis de cor, escala tipográfica, forma e movimento seguem os do Material 3 (Jetpack Compose), para que design e código falem a mesma língua.

---

## 1. Princípios

1. **Um objeto por tela.** O álbum é o herói. Cada tela tem um foco, no máximo uma ação principal e poucos controles além do próprio objeto.
2. **Mexer direto no objeto.** Abrir a capa, virar a folha e guardar a carta são gestos sobre o próprio álbum. Botões existem como alternativa, nunca como único caminho.
3. **Objetos reais, interface de adesivo.** O álbum, as cartas e o plástico imitam o mundo físico (luz, sombra, brilho). A interface em volta é adesivo chapado com contorno preto. As duas camadas nunca se misturam (seção 2).
4. **Tudo fofinho.** Cantos muito arredondados, contorno preto grosso, volume de inflável e respostas com mola.
5. **Seguro por padrão.** Amigos só se adicionam pessoalmente (QR Code). Sem chat e sem texto livre entre crianças. Pedido de troca usa opções prontas.

---

## 2. Duas camadas visuais

A referência Slush proíbe sombras e gradientes. Para o álbum parecer de verdade e os elementos terem volume, o sistema separa duas camadas com regras próprias:

| | **Camada Interface** (barra de navegação, botões, chips, sheets) | **Camada Objeto** (álbum, folhas, plástico, cartas, adesivos colados na capa) |
|---|---|---|
| Inspiração | Adesivo recortado (Slush) | Objeto físico fotografado |
| Contorno | 2dp `outline` (#000000) sempre | Só em adesivos e cartas; capa e plástico sem contorno |
| Volume | **Degrau** sólido (sombra dura, sem blur) + brilho chapado | Sombras suaves, luz, reflexos |
| Gradiente | Proibido | Permitido só para simular material (plástico, vinil, foil holográfico, papel) |
| Textura | Nenhuma | Grão leve (vinil, papel, tecido) |
| Forma | Escala de forma do M3 (seção 5) | Proporção física real (carta 63×88 mm) |
| Modo escuro | Muda de cor | **Não muda**: objetos físicos mantêm suas cores |

---

## 3. Cores

### 3.1 Paleta-base (herdada do Slush)

| Nome | Hex | Papel no app |
|---|---|---|
| Carbono | `#000000` | Texto principal, contorno de adesivo (2dp), degrau de volume, snackbar |
| Papel | `#FFFFFF` | Containers, cartas, botões contornados |
| Céu | `#DCEEFF` | Fundo das telas (o "mural") |
| Concreto | `#CCCCCC` | Neutro de apoio (bolsos vazios, estados desabilitados) |
| Névoa | `#E9E9E9` | Divisores suaves, trilhos |
| Azul Elétrico | `#4DA2FF` | Cor-assinatura: capa inflável do álbum e tipo **Água** |
| Menta | `#55DB9C` | Tipo **Planta**, adesivo de "completei!" |
| Lavanda | `#E9CCFF` | `primaryContainer`, tipo **Sonho** |
| Brasa | `#FB4903` | Tipo **Fogo**, adesivo "NOVA" |
| Sol | `#FFD731` | Tipo **Elétrico**, contador de repetidas, estrelas de raridade |
| Violeta | `#5C4ADE` | `primary` (ação principal) e tipo **Fantasma** |

**As seis cores vivas são os seis tipos de criatura.** Assim a paleta de adesivos ganha um significado que a criança aprende sozinha: cor = tipo. A cor nunca aparece sozinha; vem sempre com o ícone do tipo.

| Tipo | Cor | Ícone | Texto sobre a cor |
|---|---|---|---|
| Fogo | Brasa `#FB4903` | chama | preto (6,1:1) |
| Água | Azul Elétrico `#4DA2FF` | gota | preto (7,9:1) |
| Planta | Menta `#55DB9C` | folha | preto (12,0:1) |
| Elétrico | Sol `#FFD731` | raio | preto (15,0:1) |
| Fantasma | Violeta `#5C4ADE` | fantasminha | **branco** (6,0:1) |
| Sonho | Lavanda `#E9CCFF` | estrela | preto (14,6:1) |

> **Regra de texto sobre adesivo:** texto sobre cores vivas é **preto**, exceto sobre Violeta e Carbono, onde é **branco**. Branco sobre Azul Elétrico (2,6:1) e sobre Brasa (3,5:1) é proibido.

### 3.2 Esquema claro (papéis do Material 3)

| Papel M3 | Hex | Uso |
|---|---|---|
| `primary` | `#5C4ADE` | Botão principal, FAB, item ativo, links de ação |
| `onPrimary` | `#FFFFFF` | Texto/ícone sobre primary (6,0:1) |
| `primaryContainer` | `#E9CCFF` | Indicador ativo da navigation bar, botão tonal |
| `onPrimaryContainer` | `#2A1A7A` | (9,5:1) |
| `secondary` | `#0A5CB8` | Azul Elétrico escurecido para texto e ícones (6,5:1 no branco) |
| `onSecondary` | `#FFFFFF` | |
| `secondaryContainer` | `#DCEEFF` | Chips selecionados, áreas informativas |
| `onSecondaryContainer` | `#0A3D73` | (9,2:1) |
| `tertiary` | `#B53A00` | Brasa escurecida: destaques que precisam ser lidos (5,9:1) |
| `onTertiary` | `#FFFFFF` | |
| `tertiaryContainer` | `#FFDCCB` | Avisos amigáveis ("falta pouco!") |
| `onTertiaryContainer` | `#4A1600` | (11,6:1) |
| `error` / `onError` | `#BA1A1A` / `#FFFFFF` | Erros reais (sem internet, falha ao salvar) |
| `errorContainer` / `onErrorContainer` | `#FFDAD6` / `#410002` | |
| `surface` | `#DCEEFF` | Fundo da tela (mural Céu) |
| `onSurface` | `#000000` | Texto principal (17,7:1) |
| `onSurfaceVariant` | `#3F4656` | Texto secundário (8,0:1 no Céu) |
| `surfaceContainerLowest` | `#FFFFFF` | Cartões e sheets ("papel") |
| `surfaceContainerLow` | `#F4F9FF` | Bottom sheet |
| `surfaceContainer` | `#FFFFFF` | Navigation bar |
| `surfaceContainerHigh` | `#EEF6FF` | Campos, áreas agrupadas |
| `surfaceContainerHighest` | `#E4F0FF` | Card preenchido |
| `surfaceDim` / `surfaceBright` | `#C8DDF2` / `#EAF4FF` | |
| `outline` | `#000000` | **Contorno de adesivo** (2dp) |
| `outlineVariant` | `#B9C6DA` | Divisores, trilhos de progresso |
| `inverseSurface` / `inverseOnSurface` | `#000000` / `#FFFFFF` | Snackbar |
| `inversePrimary` | `#C9BEFF` | Ação dentro da snackbar |
| `scrim` | `#0A0C1E` a 55% | Atrás de sheets e da carta ampliada |

> **Desvio intencional do M3:** no baseline do Material, os `surfaceContainer*` são mais escuros que o `surface`. Aqui eles são **papel sobre o mural**, por isso são mais claros. Os componentes do M3 que usam esses papéis (navigation bar, sheets, cards) ficam brancos sobre o Céu, que é o visual desejado.

### 3.3 Cor dinâmica (Material You)

**Desligada.** A paleta é a identidade do produto e carrega significado (cor = tipo). Em Compose, não use `dynamicLightColorScheme()`.

### 3.4 Cores de estado

O M3 usa camadas de estado (state layers). Aqui os estados também mudam a forma, porque crianças leem melhor movimento do que transparência:

| Estado | Interface |
|---|---|
| Pressionado | O elemento desce até a base do degrau (o degrau some) e encolhe para 96% |
| Foco (teclado/controle) | Anel de 3dp em `primary`, afastado 2dp |
| Arrastando | Escala 1,04 + degrau de 8dp (como se levantasse da mesa) |
| Desabilitado | Fundo Névoa `#E9E9E9`, contorno `#9AA3B5`, conteúdo a 50%, sem degrau |

### 3.5 Contraste

Mínimo **4,5:1** para texto e **3:1** para ícones e contornos (WCAG 2.1 AA). Todos os pares das tabelas acima passam. Texto cinza claro (`#7A8296`, 3,2:1) não é usado para conteúdo.

### 3.6 Esquema escuro (rascunho)

A interface escurece, mas **o álbum e as cartas não mudam**. Um objeto físico não troca de cor quando a luz apaga.

| Papel | Hex |
|---|---|
| `surface` | `#12141C` |
| `onSurface` | `#EEF2FF` (16,4:1) |
| `primary` / `onPrimary` | `#C9BEFF` / `#2A1A7A` |
| `primaryContainer` / `onPrimaryContainer` | `#4231B8` / `#E9E2FF` |
| `secondary` | `#A8CDFF` (11,2:1) |
| `tertiary` | `#FFB59A` (10,8:1) |
| `surfaceContainer` | `#1C1F2B` |
| `outline` | `#EEF2FF` (no escuro, o contorno do adesivo fica claro) |

---

## 4. Tipografia

| Família | Substitui | Uso | Pesos |
|---|---|---|---|
| **Baloo 2** (Google Fonts) | Lateral | Display: capa do álbum, títulos de seção, números grandes | 700, 800 |
| **Nunito** (Google Fonts) | Aeonik Pro | Toda a interface: corpo, rótulos, botões, navegação | 600, 700, 800 |

**Por que essas duas:** as duas têm terminais arredondados (mais amigáveis e fáceis de ler para quem está aprendendo), cobrem todos os acentos do português e estão no Google Fonts, então funcionam como *downloadable fonts* no Android (`androidx.compose.ui:ui-text-google-fonts`).

### 4.1 Escala (papéis do Material 3, ajustada para crianças)

| Papel M3 | Família | Peso | Tamanho / Entrelinha | Espaçamento | Onde |
|---|---|---|---|---|---|
| `displayLarge` | Baloo 2 | 800 | 57 / 52 sp | 0 | Título da capa ("MEU ÁLBUM") |
| `displayMedium` | Baloo 2 | 800 | 45 / 42 sp | 0 | Número de cartas grande, celebração |
| `displaySmall` | Baloo 2 | 800 | 36 / 34 sp | 0 | Nome da carta ampliada |
| `headlineLarge` | Baloo 2 | 800 | 32 / 32 sp | 0 | Título de seção do álbum |
| `headlineMedium` | Baloo 2 | 700 | 28 / 30 sp | 0 | Título de tela |
| `headlineSmall` | Baloo 2 | 700 | 24 / 28 sp | 0 | Título de sheet |
| `titleLarge` | Nunito | 800 | 22 / 28 sp | 0 | Top app bar |
| `titleMedium` | Nunito | 800 | 18 / 24 sp | +0,01em | Cabeçalho de lista |
| `titleSmall` | Nunito | 800 | 16 / 22 sp | +0,01em | |
| `bodyLarge` | Nunito | 600 | **18 / 26 sp** | 0 | Texto principal (o M3 usa 16) |
| `bodyMedium` | Nunito | 600 | **16 / 24 sp** | 0 | Texto de apoio (o M3 usa 14) |
| `bodySmall` | Nunito | 600 | 14 / 20 sp | 0 | Legendas |
| `labelLarge` | Nunito | 800 | **16 / 20 sp** | +0,03em | Botões |
| `labelMedium` | Nunito | 800 | 14 / 18 sp | +0,03em | Navigation bar, chips |
| `labelSmall` | Nunito | 800 | **12 / 16 sp** | +0,03em | Badges (**mínimo absoluto**) |

### 4.2 Regras

- **Entrelinha espremida, mas não tanto.** O Slush usa 0,75–0,80. Em português, letras acentuadas (Á, Ã, Ç) colidem nessa entrelinha. Use **0,88–0,95** em display de várias linhas.
- **Display com contorno de adesivo:** na capa, o título pode ser branco com contorno preto de 2–3dp (`drawStyle = Stroke` desenhado por baixo do preenchimento).
- **Caixa alta só no display e em badges curtos** ("NOVA", "×2"). Rótulos, botões e textos em caixa normal. Crianças em alfabetização leem melhor minúsculas.
- **Frases curtas,** de 2 a 6 palavras: "Toque para abrir", "Guardar no álbum".
- O nome da carta nunca é truncado. Se não couber, a fonte diminui até `labelSmall` (`autoSize`).

---

## 5. Forma

Escala de forma do **Material 3 Expressive**, com os papéis do app:

| Token M3 | Valor | No app |
|---|---|---|
| `extraSmall` | 4dp | Não usado na interface (só nos cantos de proteção das cartas) |
| `small` | 8dp | Badge numérico |
| `medium` | 12dp | Snackbar |
| `large` | 16dp | Campos de texto, menus |
| `largeIncreased` | 20dp | **Cards da interface** (Slush: 20px) |
| `extraLarge` | 28dp | Topo do bottom sheet, dialogs |
| `extraLargeIncreased` | 32dp | Cards de destaque |
| `extraExtraLarge` | 48dp | Painéis de celebração (Slush: 40px) |
| `full` | 50% | **Botões, chips, FAB, navigation bar flutuante, indicador ativo** |

**Proibido** na interface: canto menor que 16dp em cards e qualquer canto que não seja `full` em botões e chips.

**Objetos físicos seguem a física:**
- Carta: proporção **63:88**, canto = **4,8% da largura** (3 mm numa carta real).
- Capa do álbum: 18–28dp, com borda acolchoada.
- Bolso de plástico: canto = canto da carta + 2dp.

> O Material 3 Expressive permite **morph de forma** (por exemplo, o indicador ativo vira um círculo maior ao ser tocado). Use com parcimônia, só em feedback de toque.

---

## 6. Contorno, volume e elevação

### 6.1 Contorno de adesivo
**2dp sólido `outline` (#000000)** em todo elemento interativo da camada Interface. O Slush usa 1px; em telas de alta densidade, 1dp some e fica frágil para crianças.

### 6.2 Degrau (o volume da interface)
O volume vem de um **degrau sólido**: uma cópia preta da forma, deslocada para baixo, **sem blur**. Ele substitui as sombras do M3 e mantém o visual de adesivo.

| Nível M3 | Degrau | Onde |
|---|---|---|
| 0 | 0dp | Superfícies, chips não selecionados |
| 1 | 2dp | Chips selecionados, cards |
| 2 | 4dp | Botões |
| 3 | 6dp | FAB, botão principal da tela |
| 4 | 8dp | Elemento sendo arrastado |
| 5 | 8dp + escala 1,04 | Carta ampliada (camada Objeto) |

**Ao pressionar:** o elemento desce a altura do degrau (`translateY = degrau`) e o degrau vai a 0, com a mola rápida de efeitos. Ao soltar, ele volta com a mola espacial rápida (pequeno quique).

Em Compose: desenhe o degrau com `Modifier.drawBehind { drawOutline(shape.createOutline(...).translate(0, ledge)) }` e use `tonalElevation = 0.dp` e `shadowElevation = 0.dp` nos componentes do M3.

### 6.3 Brilho de inflável
Para o efeito "cheio de ar" sem gradiente na interface, adicione **um realce chapado**: uma cápsula branca a 45% de opacidade, no terço superior esquerdo da forma, com 40% da largura. Pense no brilho de desenho animado.

### 6.4 Sombras da camada Objeto
Objetos ficam sobre a mesa com luz vinda do alto e à esquerda:
- **Contato:** `0 2dp 3dp rgba(10,20,60,0.35)`
- **Ambiente:** `0 18dp 30dp −10dp rgba(10,30,90,0.40)`
- **Capa inflável:** sombra interna clara no alto (`inset 8dp 10dp 18dp rgba(255,255,255,0.45)`) e escura embaixo (`inset −10dp −14dp 22dp rgba(0,20,80,0.35)`).

---

## 7. Espaçamento e layout

**Base: 4dp.** Tokens usados: 4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 48 · 64.

| | Compacto (< 600dp) | Médio (600–839dp) | Expandido (≥ 840dp) |
|---|---|---|---|
| Margem lateral | 16dp | 24dp | 32dp |
| Navegação | Navigation bar (embaixo) | Navigation rail | Navigation rail |
| Álbum aberto | 1 folha | 1 folha grande | **2 folhas lado a lado** (como um álbum real aberto) |

- **Alvo de toque:** mínimo de **48dp** (regra do M3). No app, o padrão é **56dp**, e ações principais têm **64dp ou mais**. Entre alvos, espaço de pelo menos 8dp.
- **Edge-to-edge:** desenhe atrás das barras do sistema e respeite `WindowInsets.safeDrawing`.
- **Densidade:** no máximo 5 controles da interface visíveis além do álbum.

---

## 8. Movimento

### 8.1 Molas (Material 3 Expressive)
Use `MaterialExpressiveTheme(motionScheme = MotionScheme.expressive())`. Valores do esquema expressivo (confira na versão da biblioteca):

| Token | Amortecimento | Rigidez | Para quê |
|---|---|---|---|
| `fastSpatialSpec` | 0,6 | 800 | Quique de botão, carta pulando do bolso |
| `defaultSpatialSpec` | 0,8 | 380 | Virar folha, sheets |
| `slowSpatialSpec` | 0,8 | 200 | Abrir/fechar a capa do álbum |
| `fastEffectsSpec` | 1,0 | 3800 | Cor e opacidade de estados |
| `defaultEffectsSpec` | 1,0 | 1600 | Fade de conteúdo |
| `slowEffectsSpec` | 1,0 | 800 | Scrim |

Movimento espacial **quica** (amortecimento abaixo de 1). Cor e opacidade **não quicam**.

### 8.2 Momentos do álbum

| Momento | Gesto | Animação | Háptico (Android) |
|---|---|---|---|
| Abrir a capa | Toque ou arrastar a capa para a esquerda | Capa gira na lombada (`rotationY` 0 → −180°), mola lenta | `GESTURE_THRESHOLD_ACTIVATE` ao passar de 35% |
| Virar folha | Arrastar na horizontal (segue o dedo 1:1) ou tocar nas setas | Folha gira na argola; ao soltar, mola padrão até a folha mais próxima | `SEGMENT_TICK` ao trocar de folha |
| Tocar numa carta | Toque | A carta sai do bolso e cresce até o centro (container transform), mola rápida | `CONTEXT_CLICK` |
| Guardar carta nova | Botão "Guardar no álbum" | A carta desce até o bolso, entra no plástico com leve achatamento e solta adesivos de festa | `CONFIRM` |
| Completar uma folha | Automático | Adesivo "Completei!" carimba a folha (escala 0 → 1,15 → 1) | `CONFIRM` duplo |

### 8.3 Movimento reduzido
Se "Remover animações" estiver ativo (`ANIMATOR_DURATION_SCALE == 0`), troque giros e voos por **fade de 150ms**. Os gestos continuam funcionando.

### 8.4 Som (opcional, desligado por padrão)
"Fwip" ao virar a folha, "crec" de plástico ao guardar a carta, "plim" ao completar. Ligado nas configurações, ao lado de um controle para os pais.

---

## 9. Componentes

### Botão fofinho (Button, FilledTonalButton, OutlinedButton)
- Altura **56dp** (principal: 64dp), forma `full`, contorno 2dp, degrau nível 2.
- Rótulo `labelLarge`, ícone de 24dp à esquerda quando ajuda a entender.
- **Filled:** `primary` / `onPrimary`. **Tonal:** `primaryContainer`. **Contornado:** Papel com texto preto.
- O Azul Elétrico **não** é cor de botão (regra do Slush). Uma ação principal por tela.

### Navigation bar
- 3 destinos: **Álbum** · **Amigos** · **Trocas**. Ícone de 28dp **sempre com rótulo** (`labelMedium`).
- Fundo `surfaceContainer` com contorno superior de 2dp. Indicador ativo em pílula `primaryContainer` com contorno de 2dp e morph ao tocar.
- Badge em **Trocas** com o número de pedidos pendentes (adesivo Brasa, texto preto).

### Top app bar (pequena)
- Esquerda: avatar da criança (adesivo redondo de 40dp) ou seta de voltar quando o álbum está aberto.
- Direita: chip contador **"15/24"** (cartas que tem / total).
- Sem menu de três pontos: as configurações ficam no perfil, atrás do controle dos pais.

### FAB
- Só onde não houver ação direta no objeto. No álbum, **tocar no bolso vazio** substitui o FAB "adicionar".
- Quando usado: FAB médio de 80dp, `primary`, degrau nível 3.

### Chips
- Filtro por tipo: chip com ícone do tipo e cor do tipo quando selecionado. Altura 40dp, alvo de toque de 48dp.
- Contador e informações: assist chip Papel com contorno.

### Adesivos (badges)
- **×2, ×3 (repetidas):** círculo Sol de 28dp, contorno 2dp, texto preto. Repetida é carta de troca, então é o badge mais importante.
- **NOVA:** pílula Brasa girada −8°, texto preto.
- **Completei!:** estrela Menta, aparece na folha completa.

### Bottom sheet modal
- Topo `extraLarge` (28dp), alça de 32×4dp, fundo `surfaceContainerLow`, contorno 2dp.
- Até 2 botões, empilhados na largura total quando o texto for longo.

### Snackbar
- `inverseSurface` (Carbono), forma `full`, texto `bodyMedium` branco, ação em `inversePrimary`. Fica acima da navigation bar. Duração de 4s.

### Indicador de progresso
- **Indicador linear ondulado** do M3 Expressive (`LinearWavyProgressIndicator`) para o progresso da coleção. A onda é lúdica e mostra que está vivo.
- Trilho `outlineVariant`, indicador `primary`.

---

## 10. O álbum (camada Objeto)

### 10.1 Capa
- Material: **vinil inflável** no Azul Elétrico, como as fitas 3D do Slush, com costura tracejada a 12dp da borda e grão leve.
- Título "MEU ÁLBUM" em `displayLarge`, branco com contorno preto.
- **Personalizável:** a criança cola adesivos de tipo na capa e escreve o nome (ex.: "da Lia").
- Adesivo de progresso na capa: "15 de 24".

### 10.2 Lombada e argolas
- Lombada como um tubo inflado mais escuro (`#2E7FE0` com brilho).
- Com o álbum aberto, 3 argolas metálicas atravessam os furos da folha à esquerda.

### 10.3 Folha de bolsos
- **3×3 (9 bolsos)** em telas compactas: o padrão dos fichários reais. **2×2** em versões para os mais novos.
- Plástico PVC: reflexo diagonal (gradiente branco de 25% para 0%), borda superior do bolso visível (o "lábio"), solda entre os bolsos.
- Fundo da folha escuro (`#1B2033`), para as cartas se destacarem.
- **Realismo:** cada carta tem rotação aleatória de ±0,6° e deslocamento de ±1dp no bolso. Nada fica alinhado perfeitamente.

### 10.4 Carta
- Proporção 63:88. Moldura na cor do tipo, janela da arte, nome, PV, número (#004) e raridade (● comum, ◆ incomum, ★ rara).
- **Holográfica:** camada de foil arco-íris com `blend mode` color-dodge. Ela se move com o giroscópio (`TYPE_GAME_ROTATION_VECTOR`, que dispensa permissão) ou com o dedo.
- Toque: a carta sai do bolso e amplia. Toque de novo: vira para mostrar o verso.

### 10.5 Bolso vazio
- Silhueta da criatura que falta, número e "?" (como os álbuns de figurinha impressos).
- Toque: sheet "Ainda falta essa!" com o botão **"Ganhei! Guardar no álbum"**.

### 10.6 Bolso sem uso
- Plástico vazio, sem número. Aparece quando a coleção não completa a folha.

---

## 11. Diretrizes para crianças

**Leitura e compreensão**
- Ícone + rótulo sempre. Nenhuma informação só por cor.
- Dicas animadas em vez de texto (mãozinha mostrando o gesto). A dica some depois de usada 2 vezes.
- Nada de jargão: "repetida", não "duplicata"; "guardar", não "adicionar ao inventário".

**Gestos**
- Todo gesto tem alternativa de toque (setas para virar, botão para abrir).
- Nenhuma ação depende só de toque longo ou pinça.
- Arrastes são tolerantes: abaixo de 8dp de movimento conta como toque.

**Erros e feedback**
- Sem mensagem de erro para ações da criança. O app desfaz em silêncio ou oferece "Desfazer" na snackbar.
- Todo toque tem resposta visível em até 100ms (degrau + háptico).

**Segurança e privacidade**
- Amigos só se adicionam **pessoalmente**, lendo o QR Code no app do outro. Sem busca de usuários.
- **Sem chat e sem texto livre.** O pedido de troca é feito de cartas + lugar + horário escolhidos de listas prontas ("Na escola", "No parque").
- Opção de **aprovação dos pais** para novos amigos e trocas.
- Sem anúncios e sem compras dentro do app.
- Conformidade a validar com assessoria jurídica: **LGPD art. 14** (dados de crianças pedem consentimento específico de um dos pais), **ECA Digital (Lei 15.211/2025)** e a **Política de Famílias do Google Play**.

---

## 12. Faça e não faça

**Faça**
- Use as seis cores vivas juntas, uma por tipo. Várias cores por tela é o normal.
- Contorne em preto (2dp) todo elemento interativo da interface.
- Deixe o álbum ocupar a maior parte da tela.
- Dê volume com degrau sólido e brilho chapado na interface, e com luz real nos objetos.
- Faça cada gesto responder com mola e háptico.

**Não faça**
- Não use sombra com blur nem gradiente na camada Interface.
- Não use o Azul Elétrico como botão ou link. Ele é a cor da capa e do tipo Água.
- Não use branco sobre Azul Elétrico, Brasa, Menta, Sol ou Lavanda.
- Não use texto abaixo de 12sp nem alvo de toque abaixo de 48dp.
- Não use entrelinha abaixo de 0,88 em títulos com acento.
- Não alinhe as cartas perfeitamente nos bolsos: a pequena imperfeição é o que faz parecer real.

---

## 13. O que mudou em relação ao Slush

| Slush | No app | Por quê |
|---|---|---|
| Sem sombras, sem gradientes | Proibidos na interface; permitidos na camada Objeto | Realismo do álbum e volume pedido para o público infantil |
| Contorno de 1px | 2dp | Visibilidade em telas densas e leitura infantil |
| Display Lateral 200–640px, entrelinha 0,75 | Baloo 2 de 36–57sp, entrelinha 0,88–0,95 | Tela de celular e acentos do português |
| CTA preto | CTA Violeta (`primary`), preto no degrau e na snackbar | Mais lúdico e compatível com os papéis do M3 |
| Seis cores decorativas | Seis cores = seis tipos | A cor ganha significado para a criança |
| Verde não é sucesso | Menta é o tipo Planta e o adesivo "Completei!" | Celebração, não estado de sistema |
| Página web de 1440px | Classes de janela do M3 (compacto/médio/expandido) | Android |
| Movimento quase nulo | Molas expressivas do M3 em todo gesto | Interatividade e resposta tátil para crianças |
| Marquee rolante | Não usado | Distrai e prejudica a leitura infantil |

---

## 14. Tokens para código

### 14.1 Jetpack Compose

```kotlin
val AlbumLightColors = lightColorScheme(
    primary = Color(0xFF5C4ADE), onPrimary = Color(0xFFFFFFFF),
    primaryContainer = Color(0xFFE9CCFF), onPrimaryContainer = Color(0xFF2A1A7A),
    secondary = Color(0xFF0A5CB8), onSecondary = Color(0xFFFFFFFF),
    secondaryContainer = Color(0xFFDCEEFF), onSecondaryContainer = Color(0xFF0A3D73),
    tertiary = Color(0xFFB53A00), onTertiary = Color(0xFFFFFFFF),
    tertiaryContainer = Color(0xFFFFDCCB), onTertiaryContainer = Color(0xFF4A1600),
    error = Color(0xFFBA1A1A), onError = Color(0xFFFFFFFF),
    errorContainer = Color(0xFFFFDAD6), onErrorContainer = Color(0xFF410002),
    background = Color(0xFFDCEEFF), onBackground = Color(0xFF000000),
    surface = Color(0xFFDCEEFF), onSurface = Color(0xFF000000),
    surfaceVariant = Color(0xFFE4F0FF), onSurfaceVariant = Color(0xFF3F4656),
    surfaceContainerLowest = Color(0xFFFFFFFF), surfaceContainerLow = Color(0xFFF4F9FF),
    surfaceContainer = Color(0xFFFFFFFF), surfaceContainerHigh = Color(0xFFEEF6FF),
    surfaceContainerHighest = Color(0xFFE4F0FF),
    surfaceDim = Color(0xFFC8DDF2), surfaceBright = Color(0xFFEAF4FF),
    outline = Color(0xFF000000), outlineVariant = Color(0xFFB9C6DA),
    inverseSurface = Color(0xFF000000), inverseOnSurface = Color(0xFFFFFFFF),
    inversePrimary = Color(0xFFC9BEFF), scrim = Color(0xFF0A0C1E),
)

object CreatureTypeColors {
    val Fogo = Color(0xFFFB4903); val Agua = Color(0xFF4DA2FF)
    val Planta = Color(0xFF55DB9C); val Eletrico = Color(0xFFFFD731)
    val Fantasma = Color(0xFF5C4ADE); val Sonho = Color(0xFFE9CCFF)
}

private val provider = GoogleFont.Provider(
    providerAuthority = "com.google.android.gms.fonts",
    providerPackage = "com.google.android.gms",
    certificates = R.array.com_google_android_gms_fonts_certs,
)
val Baloo = FontFamily(
    Font(GoogleFont("Baloo 2"), provider, FontWeight.Bold),
    Font(GoogleFont("Baloo 2"), provider, FontWeight.ExtraBold),
)
val Nunito = FontFamily(
    Font(GoogleFont("Nunito"), provider, FontWeight.SemiBold),
    Font(GoogleFont("Nunito"), provider, FontWeight.Bold),
    Font(GoogleFont("Nunito"), provider, FontWeight.ExtraBold),
)

val AlbumShapes = Shapes(
    extraSmall = RoundedCornerShape(4.dp), small = RoundedCornerShape(8.dp),
    medium = RoundedCornerShape(12.dp), large = RoundedCornerShape(16.dp),
    extraLarge = RoundedCornerShape(28.dp),
)

object Ledge { val L1 = 2.dp; val L2 = 4.dp; val L3 = 6.dp; val L4 = 8.dp }
val StickerOutline = 2.dp
```

### 14.2 CSS (protótipos)

```css
:root {
  --carbono: #000000; --papel: #ffffff; --ceu: #dceeff; --concreto: #cccccc; --nevoa: #e9e9e9;
  --azul-eletrico: #4da2ff; --menta: #55db9c; --lavanda: #e9ccff;
  --brasa: #fb4903; --sol: #ffd731; --violeta: #5c4ade;

  --md-primary: #5c4ade; --md-on-primary: #ffffff;
  --md-primary-container: #e9ccff; --md-on-primary-container: #2a1a7a;
  --md-surface: #dceeff; --md-on-surface: #000000; --md-on-surface-variant: #3f4656;
  --md-surface-container: #ffffff; --md-outline: #000000; --md-outline-variant: #b9c6da;

  --font-display: "Baloo 2", "Nunito", system-ui, sans-serif;
  --font-ui: "Nunito", system-ui, sans-serif;

  --outline-w: 2px; --ledge-1: 2px; --ledge-2: 4px; --ledge-3: 6px; --ledge-4: 8px;
  --shape-card: 20px; --shape-sheet: 28px; --shape-full: 999px;
  --touch-min: 48px; --touch-default: 56px; --touch-primary: 64px;
}
```

---

## 15. Marca e imagens

Pokémon é marca registrada da Nintendo, Creatures Inc. e GAME FREAK. O app **não deve usar** o nome, logotipo ou personagens no nome do app, no ícone ou na loja sem licença.

Os protótipos usam **criaturas originais de exemplo** (Brasinha, Gotinha, Brotinho…) e uma moldura de carta genérica. Na versão real, as imagens das cartas viriam de uma fonte licenciada ou de uma foto que a própria criança tira da sua carta.
