# Direção escolhida: vinil holográfico + álbum holográfico

Protótipo: [`prototypes/round3/index.html`](../prototypes/round3/index.html), na aba **★ Escolhida** (abre por padrão).

## Álbum
- **Capa:** fichário de 9 bolsos com argolas e sem zíper. A capa é de foil holográfico (rosa, amarelo, menta, azul e lilás), com listras finas e glitter. A cor do foil acompanha o dedo, ou o giroscópio no app.
- **Emblema:** Poké Ball gravada em baixo-relevo, numa forma só (aro, faixa e botão com a mesma profundidade). A metade de cima tem um leve tom rosado.
- **Lombada:** couro sintético grafite. A capa começa na dobra da lombada e gira nela.
- **Adesivos:** holo, com contorno preto e recorte branco. São candidatos a venda futura em pacotes.
- **Interior:** folhas grafite (#14121B) com 9 bolsos de plástico brilhante. As cartas reais ficam em miniatura, e as repetidas ganham o selo ×N.

## Interface
- **Topo:** título à esquerda ("Oi, Lia!", ou voltar + título) e o botão **Loja** à direita. Não há contador de cartas.
- **Navegação:** barra **Centro**. O Álbum é um mini fichário holográfico que salta da barra, entre Trocas e Amigos.
- **Material:** vinil fofinho, com gradiente sutil de cima para baixo, contorno preto de 2dp e degrau roxo-escuro (#2A1A7A) no lugar de sombra.
- **Holo só onde há ação:** item ativo da navegação, botão principal, botão Loja e borda do sheet. O gradiente é `#FFB3D9 → #D9B8FF → #A9DCFF → #B4F5DC → #FFF0A8` e se desloca com o toque.
- **Fundo:** lilás-claro (#F1ECFF → #E3EDFF), com manchas suaves de rosa, azul e menta.
- **Texto:** preto sobre o holo. Branco com contorno preto só nos títulos sobre a capa.

## Carta em foco
- Ao tocar numa carta, ela sai do bolso e fica grande no centro, com o fundo escurecido e **sem painel por cima**.
- Embaixo ficam o nome, a dica e os botões **Pôr pra troca** e **Guardar**.
- **Tocar vira a carta:** o verso mostra o anúncio (coleção, número, raridade, variante, condição, idioma, ilustrador e quantidade).
- **Arrastar para baixo fecha.** A carta segue o dedo e volta com mola se for solta antes de 100dp.

## Painéis (bottom sheets)
Todo painel segue o dedo quando arrastado pela alça ou pelo título. Ele fecha se passar de 28% da altura ou se o gesto for rápido; senão, volta com mola.

## Busca em todas as coleções
- O app traz o catálogo inteiro do Pokémon TCG: **176 coleções e 20.635 cartas**, de Base (1999) à Megaevolução (2026). São só metadados (nome, número, coleção, raridade, tipo), num arquivo de 506 KB que funciona sem internet.
- Ao digitar, aparece um **menu de sugestões** embaixo do campo, com miniatura, nome (o trecho digitado fica marcado), coleção, número e raridade.
- O campo entende **nome** ("char"), **número** ("6", "006", "TG05"), **número com total** ("006/165", que vai direto na carta certa) e **nome da coleção** ("151", "evolu"). Coleções aparecem no topo do menu.
- O fim do menu traz "Ver todas as N cartas", e Enter faz a mesma coisa.
- A busca aparece em **Trocas → Procurar** (ver quem tem, pôr na lista de desejos) e em **Guardar uma carta** (tocando num bolso livre).
- No app final, o catálogo deve vir de um serviço próprio, atualizado a cada coleção nova e com nomes em português.

## Carta (formato de marketplace)
Os campos são coleção e número (151 · 006/165), raridade, variante (Normal, Holo, Reverse Poké Ball/Master Ball), condição (NM "Novinha", LP "Pouco usada", MP "Usada"), idioma (PT, EN, JP), ilustrador e quantidade.

Ao guardar uma carta nova, a criança escolhe a condição e o idioma em um toque. O preço fica de fora por enquanto. Se entrar, vai para a área dos pais.

## Álbum infinito, na ordem da criança
- O álbum não tem total de cartas. Sempre existe uma **folha nova** vazia no fim, e as folhas crescem conforme a criança guarda cartas.
- **A ordem é da criança**, não da coleção nem da data. Ela segura uma carta (cerca de 0,4 s) e arrasta para outro bolso. Se o bolso tiver carta, as duas trocam de lugar. Levando a carta até a borda da folha, a página vira e a carta vai junto.
- Bolsos guardam só cartas que a criança tem. **Bolso livre** mostra um + e, ao ser tocado, abre "Guardar uma carta" (busca, condição e idioma).
- Carta recebida numa troca vai para o primeiro bolso livre. Ao dar a última cópia, o bolso fica livre.

## Ainda em aberto
1. **Licença:** o emblema de Poké Ball e as imagens das cartas pertencem à The Pokémon Company. Para publicar o app, é preciso licença ou uma fonte autorizada de imagens.
2. **Modo escuro e acessibilidade:** testar o contraste do texto sobre o holo e o comportamento com "remover animações".
