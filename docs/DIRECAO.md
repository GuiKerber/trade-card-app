# Direção escolhida: vinil holográfico + álbum holográfico

Protótipo: [`prototypes/round3/index.html`](../prototypes/round3/index.html), na aba **★ Escolhida** (abre por padrão).

## Álbum
- **Capa:** fichário de 9 bolsos com argolas e sem zíper. A capa é de foil holográfico (rosa, amarelo, menta, azul e lilás), com listras finas e glitter. A cor do foil acompanha o dedo, ou o giroscópio no app.
- **Emblema:** Poké Ball gravada em baixo-relevo, numa forma só (aro, faixa e botão com a mesma profundidade). A metade de cima tem um leve tom rosado.
- **Lombada:** couro sintético grafite. A capa começa na dobra da lombada e gira nela.
- **Adesivos:** holo, com contorno preto e recorte branco. São candidatos a venda futura em pacotes.
- **Interior:** folhas grafite (#14121B) com 9 bolsos de plástico brilhante. As cartas reais ficam em miniatura, e as repetidas ganham o selo ×N.

## Interface
- **Topo:** título à esquerda ("Oi, Lia!", ou voltar + título) e o **avatar** da criança à direita, que abre **Sua conta**. Não há contador de cartas.
- **Navegação:** barra **Centro** com 5 destinos: Trocas e Amigos à esquerda, **Álbum** no centro (mini fichário holográfico que salta da barra, liso, sem ícone dentro), Conquistas e **Loja** (último lugar) à direita.
- **Material:** vinil fofinho, com gradiente sutil de cima para baixo, contorno preto de 2dp e degrau roxo-escuro (#2A1A7A) no lugar de sombra.
- **Holo só onde há ação:** item ativo da navegação, botão principal, botão Loja e borda do sheet. O gradiente é `#FFB3D9 → #D9B8FF → #A9DCFF → #B4F5DC → #FFF0A8` e se desloca com o toque.
- **Fundo:** lilás-claro (#F1ECFF → #E3EDFF), com manchas suaves de rosa, azul e menta.
- **Texto:** preto sobre o holo. Branco com contorno preto só nos títulos sobre a capa.

## Carta em foco
- Ao tocar numa carta, ela sai do bolso e fica grande no centro, com o fundo escurecido e **sem painel por cima**.
- Embaixo ficam o nome, a dica e os botões **Pôr pra troca** e **Guardar**.
- **Tocar vira a carta:** o verso mostra o anúncio (coleção, número, raridade, variante, condição, idioma, ilustrador e quantidade).
- **Arrastar para baixo fecha.** A carta segue o dedo e volta com mola se for solta antes de 100dp.

## Troca
- **Pedido em etapas:** uma pergunta por vez (carta sua → onde → que dia → tudo certo?). Tocar numa opção avança sozinho; a barra de 3 partes mostra o passo, a seta volta e "Mudar" reabre um passo. Não há período (manhã/tarde): só o dia.
- **Cartões de pedido:** cada carta ocupa metade do cartão, com a carta em cima e "Você dá / Pikachu" embaixo. O ícone de troca fica no meio, entre as duas.
- **Já trocamos:** abre uma tela cheia escura com raios holográficos. A sua carta começa embaixo e a do amigo em cima; as duas se cruzam no meio com um clarão, a sua sai pelo topo e a nova cresce no centro com brilho. Depois vem "Troca feita!", o progresso da próxima insígnia (ou a insígnia nova) e confete. Com "remover animações", aparece direto o resultado.

## Conquistas
- Duas abas: **Ranking** e **Insígnias**.
- **Ranking:** pódio com os 3 que mais trocaram e a lista completa. Só aparecem a criança e os amigos dela, nunca desconhecidos.
- **Insígnias:** uma a cada marco de trocas: Pedra (10), Água (25), Raio (50), Planta (75), Psíquica (100), Fogo (150), Terra (200) e Dragão (300). São desenhos originais: uma forma por tipo (hexágono, gota, estrela, flor, círculo, chama, escudo e losango) com o ícone do tipo, contorno preto e degrau roxo. As bloqueadas ficam cinza com cadeado, e a próxima tem borda tracejada e barra de progresso.

## Loja
- Último item da barra. Tem 18 capas (8 com **arte inteira de Pokémon**, recortada de cartas Illustration Rare sem o texto, e 10 holográficas) e 10 adesivos. Itens pagos pedem um adulto antes.

## Conta e login
- **Boas-vindas:** leque com 3 cartas, o nome **Meu Álbum** (provisório), **Continuar com Google**, **Entrar com email** e **Criar conta**.
- **Entrar:** email e senha (com mostrar/esconder), "Esqueci minha senha" com link por email e reenvio em 30 s.
- **Criar conta (4 passos):** idade → email e senha → código de 6 números → apelido e cor do avatar. Abaixo de 13 anos entra "Chame um adulto": a conta é do adulto, com o email dele e o aceite de responsável (LGPD, art. 14). O Google também serve para o adulto.
- **Apelido:** só letras, de 2 a 12. O app pede para não usar sobrenome, telefone nem endereço.
- **Sua conta:** avatar, apelido, código de amigo, números (trocas, cartas, amigos), forma de entrar, **Área do adulto** (com pergunta de adulto antes) e **Sair da conta**.
- No protótipo, nenhum dado sai do aparelho: o login fica guardado só no navegador ou no APK.

## Foto da carta
- No APK, as fotos vêm da internet (images.pokemontcg.io), de qualquer coleção.
- Quando a foto não carrega (sem internet, ou no link do protótipo no Claude, que bloqueia imagens de fora), aparece uma moldura com a cor do tipo, o nome, uma Poké Ball e o número com a sigla da coleção.

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
