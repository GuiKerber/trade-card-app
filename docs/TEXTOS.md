# Textos do app — v1

Primeira versão de todos os textos da interface, para crianças de 6 a 12 anos e seus responsáveis. Os textos já estão aplicados no protótipo [`prototypes/app/`](../prototypes/app/index.html).

## Voz e tom

| Princípio | Faça | Evite |
|---|---|---|
| Curto | Botões com 1 a 3 palavras: "Pôr pra troca" | "Adicionar esta carta à sua lista de trocas disponíveis" |
| Falar com "você" | "Você tem 2." | "O usuário possui 2 unidades." |
| Palavras de criança | repetida, pra troca, combinada | duplicata, inventário, transação |
| Sempre positivo | "Ainda falta essa!" | "Carta não encontrada." |
| Erro com saída | "Não achamos esse código. Confira as letras e os números." | "Código inválido." |
| Sem pressão de compra | "Chame um adulto" | "Compre agora!", "Últimas unidades" |
| Nome sem artigo | "Pedido enviado para Bia!" | "Pedido enviado pra Bia!" / "do Theo" (o artigo marca gênero) |

- **"pra" e "para":** a criança lê "pra" (pra troca, pra você). Textos para adultos usam "para".
- **Números:** coleção e número como na carta (006/165). Quantidade em algarismos ("Você tem 2").
- **Exclamação:** no máximo uma por mensagem, só em conquistas e confirmações.

## Glossário

| Termo | Significado | Não usar |
|---|---|---|
| Álbum | O fichário com todas as cartas da criança | coleção, inventário |
| Folha | Uma página do álbum (9 bolsos) | página, slot |
| Bolso | O lugar de uma carta na folha | slot, espaço |
| Repetida | Cópia a mais de uma carta | duplicata |
| Pra troca | Carta que a criança marcou para trocar | disponível, listada |
| Oferta | Carta que um amigo pôs pra troca | anúncio |
| Pedido | Proposta de troca enviada ou recebida | proposta, solicitação |
| Combinada | Troca aceita pelos dois, com lugar e dia | agendada, confirmada |
| Código | Palavra e número de cada criança (ESTRELA-264) | ID, usuário |
| Capa | O visual do álbum, comprado ou grátis na Loja | skin, tema |
| Adesivo | Enfeite colado na capa | sticker |
| Adulto | Responsável que aprova amigos, encontros e compras | pais (nem toda criança tem os dois) |

## Navegação e topo

| Lugar | Texto |
|---|---|
| Barra de navegação (Centro) | Trocas · **Álbum** (mini fichário no meio) · Amigos |
| Botão do topo direito | Loja |
| Título da home | Oi, Lia! |
| Títulos das telas | Trocas · Amigos · Loja · Folha 1 |
| Contador | Não existe: o álbum é infinito, sem total de cartas |
| Voltar (acessibilidade) | Fechar o álbum · Voltar |

## Álbum

| Situação | Texto |
|---|---|
| Dica na capa fechada | Toque ou arraste a capa |
| Capa | MEU ÁLBUM |
| Última folha | Folha nova · Guarde aqui as próximas cartas |
| Contracapa | Este álbum é da Lia |
| Folha completa | Completei! |
| Bolso vazio (acessibilidade) | Venusaur ex, 003/165, falta essa |

### Detalhe da carta (no formato de anúncio)

| Campo | Exemplo |
|---|---|
| Coleção | MEW · 151 · Escarlate e Violeta |
| Número e raridade | 006/165 · ★★ Rara Dupla |
| Variante | Normal · Holo · Reverse Poké Ball · Reverse Master Ball |
| Condição | NM Novinha · LP Pouco usada · MP Usada |
| Idioma | PT · Português · EN · Inglês · JP · Japonês |
| Ilustração | Nome do ilustrador |

| Situação | Texto |
|---|---|
| Tem 1 | Você tem **1** guardada aqui. |
| Tem repetidas | Você tem **3**. Dá pra pôr **2** pra troca e continuar com uma. |
| Está pra troca (repetida) | Está na sua lista de troca. Seus amigos podem ver. Você tem 3. |
| Está pra troca (única) | Está na sua lista de troca. Seus amigos podem ver. É a sua única: se trocar, o bolso fica vazio. |
| Recém-chegada | **Nova!** Acabou de entrar no álbum. |
| Botões | Pôr pra troca · Tirar da troca · Guardar |
| Dica | Toque na carta para ver o verso. |
| Snackbar | Pikachu está na sua lista de troca. · Pikachu saiu da lista de troca. |

### Carta que falta

| Situação | Texto |
|---|---|
| Ninguém oferece | **Ainda falta essa!** Quando ganhar, guarde aqui. |
| Um amigo oferece | Theo pôs essa pra troca. |
| Dois ou mais | Theo e Bia puseram essa pra troca. |
| Botões | Pedir troca · Ganhei! Guardar no álbum · Agora não |

### Guardar carta nova

| Elemento | Texto |
|---|---|
| Título | Como ela está? |
| Idioma | PT · EN · JP |
| Opções | **Novinha** Sem marcas (NM) · **Pouco usada** Pontinhas brancas (LP) · **Usada** Riscos ou dobras (MP) |
| Snackbar | Venusaur ex foi pro álbum! |
| Snackbar (folha completa) | Folha completa! Venusaur ex foi pro álbum. |

## Trocas

| Elemento | Texto |
|---|---|
| Abas | Ofertas · Procurar · Pedidos |
| Ofertas, introdução | Cartas que seus amigos puseram pra troca. |
| Seções | Faltam no seu álbum · Você já tem |
| Selo | Falta |
| Procurar, campo | Nome ou número da carta |
| Filtro | Só as que faltam |
| Resultado | 006/165 · você tem 1 · falta pra você |
| Sem oferta | Ninguém pôs pra troca ainda |
| Botões | Trocar · Quero · Na lista |
| Sem resultado | Nenhuma carta com "xyz". Tente o nome ou o número, como 006. |
| Lista de desejos | Charizard ex está na sua lista de desejos. Seus amigos vão ver. · Tirei da sua lista de desejos. |

### Pedido de troca

| Elemento | Texto |
|---|---|
| Título | Trocar com Theo |
| Rótulos | Você recebe · Você dá |
| Passos | 1. Escolha uma carta sua · 2. Onde · 3. Quando |
| Lugares | Na escola · No parque · No clube |
| Dias | Amanhã · Sábado · Domingo |
| Período | De manhã · De tarde |
| Sem carta pra troca | Você ainda não pôs cartas pra troca. No álbum, toque numa carta e escolha **Pôr pra troca**. |
| Botão | Enviar pedido |
| Aviso | Um adulto recebe um aviso para confirmar o encontro. |
| Snackbar | Pedido enviado para Theo! Veja em Pedidos. |

### Pedidos

| Estado | Título | Botões | Snackbar |
|---|---|---|---|
| Novo | Bia quer trocar com você | Recusar · Aceitar | Combinado! Na escola, Amanhã · manhã. / Pedido recusado. Tudo bem! |
| Combinada | Troca combinada com Theo | Desmarcar · Já trocamos | Gengar foi pro seu álbum! / Troca desmarcada. Avisamos Theo. |
| Enviado | Esperando Davi responder | Cancelar pedido | Pedido cancelado. |
| Seções | Novos pedidos · Combinadas · Enviados | | |
| Vazio | Nenhum pedido por enquanto. Veja as ofertas dos seus amigos! | | |
| Linha de encontro | No parque · Sábado · tarde | | |

## Amigos

| Elemento | Texto |
|---|---|
| Cartão | Seu código · ESTRELA-264 · Mostre para um amigo escanear. Só vale pessoalmente! |
| Botão | Adicionar amigo |
| Lista | Seus amigos · 4 · Theo · 3 cartas pra troca / 1 carta pra troca |
| Segurança | Aqui não tem chat. Vocês combinam a troca pelo app e se encontram com um adulto por perto. |
| Amigo aberto | Código SOL-482 · Pra troca · Theo ainda não pôs cartas pra troca. · Fechar |

### Adicionar amigo

| Elemento | Texto |
|---|---|
| Título | Adicionar amigo |
| Instrução | Peça o código para o seu amigo. Vocês precisam estar juntos. |
| Botões | Escanear o código · Adicionar |
| Campo | Ou digite o código · Ex.: NUVEM-357 |
| Aviso | Um adulto precisa aprovar cada amigo novo. |
| Sucesso | Lucas agora é seu amigo! Já dá pra ver as cartas pra troca. |
| Erros | Digite o código do seu amigo. · Esse é o seu código! Digite o do seu amigo. · Vocês já são amigos. · Não achamos esse código. Confira as letras e os números. |

## Loja

| Elemento | Texto |
|---|---|
| Abas | Capas · 10 · Adesivos · 10 |
| Dicas | Toque numa capa para provar. · Arraste os adesivos na capa. |
| Estado da capa | Usando · Usar · R$ 3,90 |
| Estado do adesivo | Colar na capa · Na capa · colar outro · R$ 1,90 |
| Botão | Tirar adesivo |
| Snackbar | Capa Aurora no seu álbum! · Adesivo colado! Arraste para onde quiser. · Adesivo tirado da capa. · A capa já tem 6 adesivos. Tire um para colar outro. |

**Capas:** Arco-íris (grátis), Aurora (grátis), Pôr do sol, Oceano, Galáxia, Algodão-doce, Floresta, Vulcão, Gelo, Ouro.

**Adesivos:** Chama, Gota, Folha, Raio holo e Estrela holo (grátis), Fantasminha, Coração holo, Coroa, Lua, Nuvem.

### Porta para adultos (antes de qualquer compra)

| Elemento | Texto |
|---|---|
| Título | Chame um adulto |
| Texto | **Coroa** custa **R$ 2,90**. Para liberar, um adulto precisa responder: |
| Pergunta | Quanto é 7 + 8? |
| Botão | Agora não |
| Resposta errada | Essa parte é para um adulto. Tente com alguém junto. |

## Mensagens para o adulto (notificação ou e-mail)

| Momento | Texto |
|---|---|
| Amigo novo | Lia quer adicionar Lucas (NUVEM-357) como amigo. Vocês conhecem essa criança? **Aprovar** · **Recusar** |
| Troca combinada | Lia combinou uma troca com Theo: Charmander por Raichu, no parque, sábado à tarde. Confirme se ela pode ir. **Confirmar** · **Não pode** |
| Compra | Lia quer a capa Pôr do sol (R$ 3,90). **Comprar** · **Agora não** |
| Troca feita | Lia registrou a troca com Theo. Ela recebeu Raichu e deu Charmander. |

## Pontos a validar com crianças e responsáveis
1. **"Pra troca":** a expressão é clara para crianças de 6 e 7 anos, ou "Trocar" funciona melhor?
2. **Nomes de condição:** "Novinha / Pouco usada / Usada" ajudam a combinar trocas justas?
3. **"Chame um adulto":** é melhor que "Peça para um adulto"?
4. **Códigos de amigo:** palavra + número (ESTRELA-264) é fácil de ditar em voz alta?
