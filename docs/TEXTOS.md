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
| Barra de navegação (Centro) | Trocas · Amigos · **Álbum** (mini fichário no meio, sem ícone dentro) · Conquistas |
| Botão do topo direito | Avatar com a inicial (acessibilidade: Sua conta) |
| Título da home | Oi, Lia! (o apelido escolhido na conta) |
| Títulos das telas | Trocas · Amigos · Conquistas · Sua conta · Folha 1 |
| Contador | Não existe: o álbum é infinito, sem total de cartas |
| Voltar (acessibilidade) | Fechar o álbum · Voltar |

## Álbum

| Situação | Texto |
|---|---|
| Dica na capa fechada | Toque ou arraste a capa |
| Capa | MEU ÁLBUM |
| Última folha | Folha nova · Toque num bolso para guardar uma carta |
| Dica (primeira vez que abre) | Dica: segure uma carta e arraste para mudar de lugar. |
| Bolso livre (acessibilidade) | Bolso livre. Toque para guardar uma carta. |
| Carta no bolso (acessibilidade) | Pikachu, 025/165, Comum, você tem 3. Segure para mudar de lugar. |
| Contracapa | Este álbum é de Lia |
| Folha completa | Completei! |

### Carta em foco
A carta sai do bolso e fica grande no meio da tela, sem nenhum painel por cima. Embaixo dela aparecem o nome, a dica e dois botões. Tocar na carta vira e mostra os detalhes no verso, e arrastar a carta para baixo fecha.

| Elemento | Texto |
|---|---|
| Nome | Charizard ex · 006/165 |
| Dica | Toque na carta para ver os detalhes · arraste para baixo para fechar |
| Botões | Pôr pra troca · Tirar da troca · Guardar |

### Verso da carta (no formato de anúncio)

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

### Guardar carta nova (tocando num bolso livre)

| Elemento | Texto |
|---|---|
| Título | Guardar uma carta |
| Instrução | Escolha a carta que você ganhou. Ela vai para o bolso que você tocou. |
| Busca | Nome ou número da carta |
| Botão | Guardar |
| Sem resultado | Nenhuma carta com esse nome. As que já estão no álbum não aparecem aqui. |

Depois:

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

### Busca (Procurar e Guardar uma carta)

| Elemento | Texto |
|---|---|
| Campo | Nome ou número da carta |
| Ajuda | Todas as 176 coleções · 20.635 cartas. Ex.: Pikachu, 025, 006/165 |
| Sugestão de coleção | Prismatic Evolutions · Coleção · Escarlate e Violeta · 2025 · 180 cartas |
| Sugestão de carta | Charizard ex · 151 · 006/165 · Rara Dupla |
| Ver mais | Ver todas as 108 cartas |
| Sem resultado | Nada com "xyz". Tente o nome, o número (006) ou o número com o total (006/165). |
| Resultado | Resultado · Limpar |
| Lista padrão | Ofertas dos seus amigos · Sua lista de desejos |
| Carta repetida guardada | Umbreon já estava no álbum. Agora você tem 2! |

### Pedido de troca

| Elemento | Texto |
|---|---|
Uma pergunta por vez. Ao tocar numa opção, o pedido avança sozinho; a barra de 3 partes mostra o passo.

| Elemento | Texto |
|---|---|
| Título | Trocar com Theo |
| Rótulos | Você recebe · Você dá |
| Passo 1 | Qual carta sua você dá? |
| Passo 2 | Onde vocês vão se encontrar? · Na escola · No parque · No clube |
| Passo 3 | Que dia? · Amanhã · Sábado · Domingo (sem período) |
| Confirmação | Tudo certo? · Onde: Na escola · Quando: Sábado · Mudar |
| Voltar (acessibilidade) | Voltar · Trocar a carta que você dá |
| Sem carta pra troca | Você ainda não pôs cartas pra troca. No álbum, toque numa carta e escolha **Pôr pra troca**. |
| Botão | Enviar pedido |
| Aviso | Um adulto recebe um aviso para confirmar o encontro. |
| Snackbar | Pedido enviado para Theo! Veja em Pedidos. |

### Pedidos

| Estado | Título | Botões | Snackbar |
|---|---|---|---|
| Novo | Bia quer trocar com você | Recusar · Aceitar | Combinado! Na escola, Amanhã. / Pedido recusado. Tudo bem! |
| Combinada | Troca combinada com Theo | Desmarcar · Já trocamos | Troca desmarcada. Avisamos Theo. |
| Enviado | Esperando Davi responder | Cancelar pedido | Pedido cancelado. |
| Seções | Novos pedidos · Combinadas · Enviados | | |
| Vazio | Nenhum pedido por enquanto. Veja as ofertas dos seus amigos! | | |
| Cartão | Você dá · Pikachu / Você recebe · Gengar (carta em cima, texto embaixo, metade do cartão para cada) | | |
| Linha de encontro | No parque · Sábado | | |

### Troca feita (tela cheia)

| Elemento | Texto |
|---|---|
| Antes de cruzar | Theo dá · Você dá |
| Título | Troca feita! |
| Texto | Raichu foi pro seu álbum. |
| Progresso | +1 troca · faltam 15 para a insígnia Água |
| Insígnia nova | Nova insígnia! · Pedra |
| Botão | Legal! |
| Acessibilidade | Troca feita. Raichu foi pro seu álbum. |

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

## Conquistas

| Elemento | Texto |
|---|---|
| Abas | Ranking · Insígnias · Loja |
| Resumo | 9 trocas feitas · Próxima insígnia · Pedra · 9 de 10 · falta 1 troca |
| Ranking | Quem mais trocou · 1º · Theo · Insígnia Água · 31 trocas · Lia (você) · Sem insígnia ainda |
| Segurança | O ranking mostra só você e seus amigos. |
| Insígnias | Insígnias · 1 de 8 · Conquistada! · 25 trocas |
| Dica | Cada troca feita com um amigo conta. Toque numa insígnia para ver como ganhar. |
| Insígnia aberta | Insígnia Água · Ganhe fazendo **25 trocas** com seus amigos. · 10 de 25 · faltam 15 · Bora trocar! |
| Insígnia ganha | Insígnia Pedra · Você ganhou ao fazer **10 trocas** com seus amigos. · Legal! |

**Insígnias:** Pedra (10 trocas), Água (25), Raio (50), Planta (75), Psíquica (100), Fogo (150), Terra (200), Dragão (300).

## Loja (aba de Conquistas)

| Elemento | Texto |
|---|---|
| Filtros | Capas · 18 · Adesivos · 10 |
| Grupos de capas | Pokémon · Holográficas |
| Dicas | Toque numa capa para provar. · Arraste os adesivos na capa. |
| Estado da capa | Usando · Usar · R$ 3,90 |
| Estado do adesivo | Colar na capa · Na capa · colar outro · R$ 1,90 |
| Botão | Tirar adesivo |
| Snackbar | Capa Aurora no seu álbum! · Adesivo colado! Arraste para onde quiser. · Adesivo tirado da capa. · A capa já tem 6 adesivos. Tire um para colar outro. |

**Capas Pokémon** (arte inteira de uma carta Illustration Rare): Pikachu, Charizard, Eevee, Umbreon, Mew, Charmander, Squirtle, Bulbasaur.

**Capas holográficas:** Arco-íris (grátis), Aurora (grátis), Pôr do sol, Oceano, Galáxia, Algodão-doce, Floresta, Vulcão, Gelo, Ouro.

**Adesivos:** Chama, Gota, Folha, Raio holo e Estrela holo (grátis), Fantasminha, Coração holo, Coroa, Lua, Nuvem.

### Porta para adultos (antes de qualquer compra)

| Elemento | Texto |
|---|---|
| Título | Chame um adulto |
| Texto | **Coroa** custa **R$ 2,90**. Para liberar, um adulto precisa responder: |
| Pergunta | Quanto é 7 + 8? |
| Botão | Agora não |
| Resposta errada | Essa parte é para um adulto. Tente com alguém junto. |

## Entrar e criar conta

O nome do app nas telas é **Meu Álbum** (provisório).

| Tela | Texto |
|---|---|
| Boas-vindas | Meu Álbum · Guarde suas cartas num álbum de verdade e combine trocas com seus amigos. · Continuar com Google · Entrar com email · Ainda não tem conta? Criar conta |
| Legal | Ao continuar, você concorda com os Termos de Uso e a Política de Privacidade. |
| Entrar | Entrar · Use o email e a senha da sua conta. · Email · Senha · Esqueci minha senha · Entrar · ou · Continuar com Google |
| Erros | Confira o email. · A senha tem pelo menos 6 letras ou números. Confira e tente de novo. |
| Esqueci a senha | Esqueci minha senha · Digite o email da conta. Vamos mandar um link para você criar uma senha nova. · Enviar link |
| Link enviado | Olhe seu email · Mandamos um link para an••••@gmail.com. Abra o link para criar uma senha nova. Se não achar, olhe no spam. · Voltar para entrar · Não chegou? Reenviar · Reenviar em 30s |
| Idade (passo 1 de 4) | Quantos anos você tem? · Perguntamos para deixar o app seguro para você. · 6 a 12 · 13 ou mais |
| Menos de 13 anos | Chame um adulto · Para criar sua conta, um adulto da sua família precisa ajudar. É rapidinho. · Sou o adulto · Agora não |
| Conta (passo 2) | Conta do adulto · Use o **seu** email. É por ele que você aprova amigos, encontros e compras da criança. / Crie sua conta · Escolha o email e uma senha. |
| Aceites | Li e aceito os Termos de Uso e a Política de Privacidade. · Sou o responsável e autorizo esta criança a usar o Meu Álbum. |
| Código (passo 3) | Confirme o email · Digite o código de 6 números que mandamos para an••@email.com. · Reenviar código |
| Perfil (passo 4) | Como seus amigos vão te chamar? · Apelido · Use um apelido. Não coloque sobrenome, telefone ou endereço. · Pronto! |
| Erro do apelido | Use só letras no apelido, sem números nem símbolos. |
| Fim | Tudo pronto, Estrela! · Seu código de amigo é ESTRELA-264. Mostre para um amigo quando estiverem juntos. · Mandamos um email para o adulto confirmar a conta. · Abrir meu álbum |
| Google | Escolha uma conta · para continuar no Meu Álbum · Usar outra conta · O Google vai compartilhar seu nome, email e foto com o Meu Álbum. |
| Ao entrar | Oi, Lia! Seu álbum está aqui. |

## Sua conta

| Elemento | Texto |
|---|---|
| Cartão | Lia · Código de amigo · ESTRELA-264 · Editar |
| Números | 9 trocas · 21 cartas · 4 amigos |
| Conta | Entrou com Google / Entrou com email · an••••@gmail.com |
| Linhas | Área do adulto (Aprovações e avisos) · Termos e privacidade |
| Área do adulto | Só para adultos · Quanto é 7 + 8? → Aprovar cada encontro de troca · Aprovar amigos novos · Receber avisos por email · Excluir conta · Pronto |
| Editar perfil | Editar perfil · Apelido · Cancelar · Salvar · Perfil salvo! |
| Sair | Sair da conta · Sair da conta? · Seu álbum continua guardado. Para voltar, entre com o mesmo email ou com o Google. · Ficar · Sair |

## Mensagens para o adulto (notificação ou e-mail)

| Momento | Texto |
|---|---|
| Amigo novo | Lia quer adicionar Lucas (NUVEM-357) como amigo. Vocês conhecem essa criança? **Aprovar** · **Recusar** |
| Troca combinada | Lia combinou uma troca com Theo: Charmander por Raichu, no parque, no sábado. Confirme se ela pode ir. **Confirmar** · **Não pode** |
| Conta nova | Você criou a conta de Estrela no Meu Álbum. Confirme seu email para ativar. **Confirmar email** |
| Compra | Lia quer a capa Pôr do sol (R$ 3,90). **Comprar** · **Agora não** |
| Troca feita | Lia registrou a troca com Theo. Ela recebeu Raichu e deu Charmander. |

## Pontos a validar com crianças e responsáveis
1. **"Pra troca":** a expressão é clara para crianças de 6 e 7 anos, ou "Trocar" funciona melhor?
2. **Nomes de condição:** "Novinha / Pouco usada / Usada" ajudam a combinar trocas justas?
3. **"Chame um adulto":** é melhor que "Peça para um adulto"?
4. **Códigos de amigo:** palavra + número (ESTRELA-264) é fácil de ditar em voz alta?
