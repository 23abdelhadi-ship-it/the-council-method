# The Council Method — o método (edição pública, português)

> **Definição numa linha**: vários modelos de linguagem deliberam sobre os seus ficheiros técnicos (código, decisões, investigações) em duas rodadas — uma independente e depois um debate anonimizado — com classificação obrigatória de cada afirmação, um registro de decisões vinculante e um único presidente humano que decide por execução, nunca por votação.

**Regra de vocabulário vinculante, em todos os textos do projeto e em todos os idiomas**: nunca se usa o termo «multiagente» (multi-agent) para descrever este projeto. Este projeto é **revisão e deliberação multimodelo** com um único executor humano (o presidente) — não execução multiagente. `The Council Method` é um nome próprio e não se traduz; `QUORUM_NON_ATTEINT` é um rótulo técnico mantido tal como está em todos os idiomas.

O árabe e o francês são os idiomas-fonte desta doutrina; as demais versões são traduções fiéis dela.

---

## 1. Porquê um conselho?

Um único modelo dá-lhe uma única opinião confiante; se estiver errado, você não o saberá: não há segunda voz, nem oposição, nem memória do que já decidiu. O conselho transforma a pergunta numa pequena instituição de revisão: um único brief com formato imposto, uma rodada independente em que os membros não se veem uns aos outros, uma rodada de debate anonimizado em que cada membro ataca os pontos dos outros sem conhecer os seus autores, e depois um presidente humano que verifica por execução e redige a síntese.

**O consenso é uma armadilha**: quando os modelos concordam com facilidade, geralmente estão a reproduzir a mesma resposta padrão. O sinal útil é **o desacordo** — onde os modelos divergem, e porquê. Por isso a síntese conserva os desacordos textualmente, em vez de os dissolver numa média.

## 2. Composição e papéis

- **Os membros**: modelos de famílias diferentes (a diversidade é uma condição; um conselho feito de um único modelo com vários papéis é uma simulação, não um conselho). Os níveis gratuitos bastam para começar; o silêncio técnico de um membro (quotas, tempos de espera, erros do servidor) é documentado, nunca ocultado.
- **O presidente**: um humano, único. Conduz a sessão, lê todas as saídas, verifica os pontos em disputa **por execução** ou na fonte primária, e redige a síntese com a sua própria voz. Não é substituído por uma síntese automática e nunca decide por votação.
- **O utilizador (quem decide)**: as suas decisões anteriores vinculam o conselho (secção 3); aquilo de que o presidente não tiver a certeza é-lhe perguntado, e a sua resposta torna-se a base adotada.

## 3. Os ficheiros sobre os quais o conselho trabalha

| Ficheiro | Função |
|---|---|
| `brief.md` — o brief permanente | O formato de resposta imposto e as regras vinculantes para os membros (modelo: `docs/BRIEF_TEMPLATE.md`) |
| `DECISIONS.md` — o registro de decisões | As decisões vinculantes do utilizador. Toda a proposta de um membro que contradiga uma decisão registrada é marcada explicitamente: «proposta contrária à decisão registrada n.º N» — nunca passa em silêncio, e uma proposta só se torna decisão pela palavra do utilizador |
| `REFERENCE.md` — a referência | A única referência vigente dentro do âmbito da revisão; não se supõe que exista nenhuma outra versão |
| O dossiê da sessão | Os ficheiros de texto submetidos a revisão, reunidos com uma impressão digital (SHA-256) por ficheiro e uma impressão global |
| `synthese.md` — a síntese | A saída apenas do presidente, sobre um modelo guiado (índice, procedimento passo a passo, campos obrigatórios) |

**Rótulo de origem**: cada saída de sessão traz, no momento da sua escrita, um rótulo de origem (membro/presidente/humano) **fixado na criação e que a edição nunca altera** — veja a regra na secção 6.

E como os ficheiros simples dentro de um repositório são tudo o que sobrevive, o brief traz um campo explícito: **«estado atual / próxima ação»** — as especificações, por si sós, não mostram onde o trabalho parou.

## 4. As duas rodadas

### Rodada 1 — independente
Cada membro revê o dossiê sozinho, com pontos numerados (F-01, F-02...), cada ponto: título curto / gravidade / prova (ficheiro:linha) / classificação da afirmação / correção proposta, se houver. **Cada resposta começa com uma linha de declaração de identidade**: o modelo que o membro acredita ser. E o motor carimba cada resposta com o modelo que **realmente a serviu** (lido nos metadados da resposta) e assinala qualquer discrepância entre o modelo declarado e o servido no relatório de fragilidade — a usurpação de identidade de um modelo dentro de um conselho está documentada, e só estas duas linhas a revelam.

### Rodada 2 — debate anonimizado por rotação
Cada membro recebe os pontos dos outros sob letras anonimizadas **geradas dinamicamente e rodadas de um leitor para outro** (nenhuma letra designa o mesmo modelo para dois leitores). Para cada ponto: acordo ou desacordo, com um motivo preciso retirado do texto. Depois, uma única secção: «pontos que mantenho».

### Porquê apenas duas rodadas?
Porque um debate longo esgota em vez de convencer: após cerca de três rodadas, os modelos oponentes começam a capitular por «cortesia por esgotamento», não por convicção (Xiong et al., 2025). O limite de duas rodadas é uma regra de método, não uma limitação técnica. Pela mesma razão, preferem-se vereditos «passa/bloqueia, com motivo» a pontuações numéricas, que derivam ao longo das rodadas.

## 5. Classificação de afirmações — obrigatória

Cada afirmação, em cada resposta, é classificada numa de três categorias:

- **[Verificado]**: tem uma prova fora do conselho (ficheiro:linha, execução, documento, registro). A saída de outro membro **não** é uma prova.
- **[Inferência]**: um raciocínio a partir de elementos verificados, cuja base é enunciada.
- **[Proposta]**: uma opinião ou recomendação; nunca é consignada como se fosse uma decisão.

E aquilo que não puder ser verificado a partir do texto é marcado explicitamente: **[não verificável a partir do texto]**. Nada de preâmbulos literários nem elogios nas respostas dos membros.

## 6. A regra contra a autocitação (com nome próprio)

> **A saída de qualquer membro é uma hipótese em exame; só se torna [Verificado] mediante uma prova exterior ao conselho.**

A falha que esta regra nomeia está documentada entre os praticantes: um sistema cita notas geradas por membros anteriores, de modo que as respostas parecem «cada vez melhor documentadas» com o tempo, enquanto se citam a si mesmas. Os dois mecanismos de reparação aqui adotados:

1. **O rótulo de origem no momento da escrita** (secção 3): cada elemento traz a sua origem (humano/membro/presidente) fixada no momento da sua criação, e a edição nunca a altera.
2. **Dois controlos separados para cada prova citada** na síntese: (a) **sustenta a afirmação** realmente? (b) **trata a pergunta** realmente colocada? — porque uma citação real mas irrelevante é uma falha distinta de uma citação fabricada.

## 7. Limiar de validade da sessão — a regra do quórum

Uma sessão válida reúne **pelo menos 3 respostas substanciais** na sua primeira rodada (uma resposta substancial: bem-sucedida e com conteúdo real — não uma mensagem de erro nem uma única linha). Abaixo disso:

- a sessão é marcada **`QUORUM_NON_ATTEINT`** automaticamente no seu manifesto (MANIFEST) e num ficheiro dedicado;
- não há rodada 2 nem síntese — as saídas brutas ficam como vestígios legíveis, mas **não são apresentadas como um julgamento do conselho**;
- o remédio é uma nova execução (dossiê mais pequeno, outras vias, chaves adicionais), não uma conclusão extraída de uma sessão incompleta.

## 8. Pesos de sessão (orientação documentada, não limiares-lei)

- **Leve** — ponte de entrada e demonstração: apenas rodada 1, formato aligeirado com menos pontos, rigor de classificação íntegro. Serve para apresentar o método e para perguntas pequenas.
- **Padrão** — a opção por defeito: formato F completo e duas rodadas.
- **Completa** — auditoria: padrão + relatório de fragilidade detalhado + linha de custo/esforço da sessão (contada em chamadas, falhas e duração, não em pedidos isolados; em vias pagas, o custo do juiz/da avaliação aparece como linha separada, nunca fundido num total).

A escala é uma orientação para proporcionar o esforço ao que está em jogo na decisão — não uma lei numerada que proíba ou imponha uma sessão.

## 9. A síntese do presidente e a verificação por execução

O valor fabrica-se aqui, não nas rodadas. Procedimento do presidente:

1. Ler todas as respostas da rodada 1, depois os debates da rodada 2.
2. Para cada ponto em disputa: **verificar por execução** (executar, comparar, reproduzir) ou voltar à fonte primária. Nunca arbitrar por votação nem por maioria.
3. Preencher o modelo de síntese, cujos dois campos obrigatórios com nome são: **«desacordos conservados textualmente»** (as posições minoritárias nos seus próprios termos, não uma média dissolvida) e **«o contexto em falta que causou o desacordo»** (o que o dossiê não continha e produziu o desacordo — que será pedido depois ao utilizador em vez de adivinhado).
4. Aplicar os dois controlos (secção 6) a cada afirmação conservada na síntese.
5. Fechar com o diário de resultados (secção 10).

A carga de leitura é o verdadeiro estrangulamento do presidente; por isso as respostas se constroem sobre ponteiros verificáveis pontualmente (ficheiro:linha), e não sobre muros de texto.

## 10. O diário de resultados

Cada sessão fecha, na sua síntese, com duas linhas: **a posição adotada** e **a probabilidade estimada**. Quando a realidade resolver mais tarde o assunto, acrescenta-se uma terceira linha — **«o que realmente aconteceu»** — sem nunca reescrever a posição original. O registro de decisões deixa assim de ser um arquivo e torna-se um instrumento cumulativo de calibração: o conselho fica consignado e depois é classificado pela realidade.

## 11. Doutrina geral (porque é isto difícil de copiar?)

- **O uso antes da ferramenta; a profundidade antes do alargamento; a execução antes do guia.** Uma ideia nova é implementada primeiro com as ferramentas atuais; mudar para uma ferramenta nova é uma exceção que exige uma justificação escrita.
- **O teste do fosso de cinco perguntas** para cada passo futuro (publicação, parceria, funcionalidade): supera as perguntas de **impacto, alcance de quem segue, contorno, durabilidade e retenção**? O que não as supera é uma camada copiável: é entregue deliberadamente, a sua autoria fica datada e não se constrói proteção alguma sobre ela.
- **O núcleo que não se entrega**, nos seus conceitos gerais: dados operacionais acumulados ao longo do tempo, uma rede de confiança que não se pode comprar, a permissão de uma parte que o escolhe a si, um custo de mudança real para quem o adotou, e um corpus de juízos (um registro de decisões e sínteses) que mais ninguém possui.
- **Rituais**: um radar de usos periódico que pergunta «que uso novo para o nosso trabalho real?» e não «que ferramenta nova?»; e uma autorrevisão periódica que pergunta: o que acumulámos que não se possa copiar? Um ciclo que só produz camadas copiáveis é um ciclo falhado, produza o que produzir.
- O conselho julga **a investigação, os planos e os factos — nunca a prosa**. Os textos destinados a humanos são escritos com uma única voz de autor, e controlados depois apenas ao nível das citações, dos números e das datas.

## 12. Limites do método, com honestidade

- Não acrescenta nada a perguntas rápidas e simples; o seu valor aparece onde o custo de um erro supera o custo da sessão.
- **A roleta de fornecedores** é real: as probabilidades de falha de cada passo multiplicam-se através das fases. As suas mitigações adotadas: tentar de novo no limite da fase em vez de relançar tudo, e um relatório de fragilidade por sessão que agrega as falhas classificadas (quotas/tamanho/tempos de espera/rede) em vez de as descobrir dispersas.
- O conselho amplifica o juízo do presidente, não o substitui: sem um presidente que leia e verifique, são cinco opiniões confiantes em vez de uma.
- Nenhum segredo no dossiê, nunca: as chaves e os segredos ficam sempre fora dos ficheiros, e o ficheiro de configuração local não é publicado nem enviado para nenhum repositório.

---

## Anexo A — Protocolo de avaliação «o conselho contra um modelo único» (D-10)

Um pedido recorrente dos praticantes; aqui está a sua forma executável, para quem quiser comprovar por si mesmo que o conselho acrescenta algo:

1. Tome cerca de **20 tarefas** reais do seu trabalho (revisões, decisões, planos) já resolvidas ou resolúveis.
2. Execute ambas as partes sobre **exatamente as mesmas provas**: (a) um modelo forte único com uma lista de controlo estruturada; (b) um conselho padrão segundo este método.
3. Compare **a exatidão dos vereditos** (o juízo final corresponde ao que a realidade/a referência estabeleceu?) — não a taxa de acordo entre as duas partes, porque um acordo pode ser uma cegueira partilhada.
4. Consigne também: o custo (chamadas e tempo do presidente) de cada parte, e o número de erros apanhados por uma parte e falhados pela outra.
5. Publique o resultado tal como está, incluindo se o conselho perder.

## Anexo B — Terminologia unificada entre idiomas

| Conceito | Árabe | Francês | Inglês | Espanhol | Português |
|---|---|---|---|---|---|
| Nome do projeto | The Council Method | The Council Method | The Council Method | The Council Method | The Council Method |
| O presidente | الرئيس | le président | the chair | el presidente | o presidente |
| O membro | العضو | le membre | the member | el miembro | o membro |
| A rodada | الجولة | la ronde | the round | la ronda | a rodada |
| O brief | الإحاطة | le brief | the brief | el brief | o brief |
| O registro de decisões | سجلّ القرارات | le registre des décisions | the decisions register | el registro de decisiones | o registro de decisões |
| A síntese | التوليف | la synthèse | the synthesis | la síntesis | a síntese |
| Afirmação verificada | [مثبت] | [établi] | [Verified] | [Verificado] | [Verificado] |
| Inferência | [استنتاج] | [inférence] | [Inference] | [Inferencia] | [Inferência] |
| Proposta | [اقتراح] | [proposition] | [Proposal] | [Propuesta] | [Proposta] |
| Rótulo de quórum | QUORUM_NON_ATTEINT | QUORUM_NON_ATTEINT | QUORUM_NON_ATTEINT | QUORUM_NON_ATTEINT | QUORUM_NON_ATTEINT |
