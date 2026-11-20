# The Council Method

**Este projeto não gera código nem faz execução multiagente: vários modelos de linguagem deliberam sobre os seus ficheiros técnicos (código, decisões, investigações), cada afirmação classificada [Verificado / Inferência / Proposta], um registro de decisões vinculante e um presidente humano que decide por execução, nunca por votação.**

Idiomas: [English](README.md) · [العربية](README.ar.md) · [Français](README.fr.md) · [Español](README.es.md) · **Português** (este ficheiro)
Documento do método: [العربية (fonte)](docs/METHODE.md) · [Français (fonte)](docs/METHODE.fr.md) · [English](docs/METHODE.en.md) · [Español](docs/METHODE.es.md) · [Português](docs/METHODE.pt.md)

> Um único modelo dá-lhe uma única opinião confiante. Se estiver errado, nada lho diz. The Council Method transforma a pergunta numa pequena instituição de revisão: uma rodada independente, um debate anonimizado e um presidente que verifica executando — em uso real desde novembro de 2026, a rever projetos reais. Esta é a sua edição pública.

## Leia isto antes de instalar — expectativas, com nome

- **O que é**: um método (documentos, modelos, regras) mais um motor Node com zero dependências que o executa. Um só ficheiro, sem `npm install`: *instalar é descarregar*.
- **O que não é**: não é uma interface de conversação, nem um quadro de agentes, nem um gerador de código, nem um serviço alojado. Não há interface web e não haverá.
- **Política de manutenção — zero, por conceção**: publicado **tal como está, versão 1.1 fixa. Sem gestão de issues, sem pull requests, sem versões futuras.** Manutenção zero = um contrato de estabilidade, não um abandono. Para o adaptar: faça um fork. (Precedente documentado: uma famosa demo de «conselho» num único ficheiro alcançou dezenas de milhares de estrelas com exatamente esta política; a manutenção comunitária é uma dívida que este projeto recusa desde o primeiro dia.)
- **A quem serve**: a quem decide e os seus erros custam caro — um revisor de código, decisões, planos ou investigações, capaz de ler saídas e verificar afirmações. Não acrescenta nada a perguntas rápidas e simples.
- **O presidente é humano**: o motor não produz nenhum veredito. Se ninguém ler nem verificar, obtém várias opiniões confiantes em vez de uma.
- **As suas chaves, os seus custos**: os níveis gratuitos bastam (uma via nem sequer precisa de chave). Nada aqui «telefona para casa»; os seus ficheiros vão apenas para os fornecedores de modelos que configurar.

## Primeira sessão — zero chaves, cerca de 15 minutos

Requer Node ≥ 20 (verificado em Node 20 e 24). Sem conta, sem chave, sem custo: uma via integrada sem chave faz o conselho sesionar.

```bash
# 1. Obtenha os ficheiros (descarregue ou faça fork deste repositório), depois:
node moteur/conseil.mjs --init        # instala brief.md, DECISIONS.md e REFERENCE.md a partir dos modelos guiados
# 2. Edite esses três ficheiros para o seu projeto (os modelos explicam o que escrever)
node moteur/conseil.mjs --sujet "Revisão da proposta X" --source ./seus-ficheiros/
# 3. Leia revues/<data>_<tema>/ — saídas brutas dos membros, relatório de fragilidade
#    e um modelo guiado de synthese.md para o presidente completar
```

Opcional: `node moteur/conseil.mjs --assistant-cles` executa um assistente interativo que pergunta fornecedor por fornecedor, **testa cada chave em direto** e escreve ele próprio a configuração. `node moteur/test-cles.mjs` oferece um diagnóstico só de leitura de cada assento (estado + a linha de correção exata). (Só de leitura = não escreve nada; faz chamadas de rede em direto para verificar os assentos e pode consumir quota.) `--dry-run` reúne o dossiê sem nenhuma chamada de rede. `--poids legere|standard|complete` seleciona o peso da sessão (abaixo).

## Necessidade → processo → resultado com nome

| A sua necessidade | O processo | O resultado com nome que obtém |
|---|---|---|
| Uma segunda opinião que não seja um eco | Rodada 1: revisões independentes, membros cegos entre si | Pontos numerados (F-01...) com provas (ficheiro:linha) e classes de afirmação |
| Um desacordo utilizável, não diluído | Rodada 2: debate anonimizado por rotação | Acordos/desacordos com motivos; um campo de síntese **«desacordos conservados textualmente»** |
| Proteger as suas decisões passadas de um contorno silencioso | Um registro de decisões vinculante, lido em cada sessão | Toda a proposta contrária é marcada «contrária à decisão registrada n.º N» |
| Proteger-se contra o conselho que se cita a si mesmo | A regra contra a autocitação, com nome + rótulos de origem fixados na escrita | Uma afirmação só se torna [Verificado] mediante uma prova exterior ao conselho |
| Uma sessão que falhou em silêncio | A regra do quórum | As sessões com menos de 3 respostas substanciais são carimbadas **QUORUM_NON_ATTEINT** — vestígios, não um julgamento |
| Saber se o conselho acertou | O diário de resultados | Posição + probabilidade consignadas no fecho; «o que realmente aconteceu» acrescentado depois, sem reescrita |

## Em que se diferencia — uma comparação estrutural congelada

|  | Tema revisto | Governação (quem decide, como) | Rastreabilidade | Forma de publicação |
|---|---|---|---|---|
| llm-council (Karpathy) | Perguntas de conversação | Um modelo juiz classifica respostas anonimizadas | Classificação; sem classes de afirmação nem registro de decisões | Uma aplicação, zero manutenção |
| Metodologias de especificação (Spec Kit, BMAD) | Construir software a partir de especificações | O próprio processo de especificação | Documentos e modelos; sem registro de decisões vinculante imposto no momento da revisão | Kits com linhas de versões e manutenção comunitária |
| **The Council Method** | **Os seus ficheiros técnicos existentes: código, decisões, investigações, planos** | **Um presidente humano, por execução — nunca por votação** | **Classificação de afirmações obrigatória + registro de decisões vinculante + rótulos de origem + regra de quórum** | **Documentos do método + um ficheiro com zero dependências; zero manutenção, por contrato** |

Nenhum concorrente que tenhamos encontrado — num censo completo de ferramentas de deliberação em conselho, não uma amostra — combina os quatro elementos: um registro de decisões vinculante, uma classificação de afirmações obrigatória, um presidente que verifica por execução e uma regra de quórum de sessão.

## Pesos de sessão

- **Leve** — ponte de entrada e demonstração: apenas rodada 1, formato aligeirado, rigor de classificação íntegro.
- **Padrão** — a opção por defeito: formato completo, duas rodadas.
- **Completa** — auditoria: padrão + relatório de fragilidade detalhado + linha de custo/esforço da sessão.

A escala proporciona o esforço ao que está em jogo na decisão; é uma orientação documentada, não uma lei numerada.

## Duas portas

1. **O método primeiro** (recomendado para quem decide): leia `docs/METHODE.pt.md`, tome os modelos de `docs/` e faça o conselho sesionar com a skill de um só anfitrião em `skills/` — o motor é um executor opcional que um intermediário técnico pode operar por si.
2. **O motor**: `moteur/conseil.mjs` automatiza o protocolo completo (reunião do dossiê com impressões digitais, as duas rodadas, carimbos de identidade do modelo que realmente serviu cada resposta, carimbo de quórum, relatório de fragilidade, modelo guiado de síntese).

Uma sessão de exemplo completa e inteiramente fictícia — pessoas, empresa e tema inventados, saídas reais do motor — encontra-se em `examples/session-demo/`.

## Mapa do repositório

```
moteur/    conseil.mjs (o motor) · test-cles.mjs (diagnóstico de assentos, só leitura) · config.exemple.json
docs/      METHODE em 5 idiomas · modelos BRIEF / DECISIONS / REFERENCE / SYNTHESE
skills/    SKILL.md (skill de um só anfitrião) · PROMPT.md (versão prompt para qualquer anfitrião de conversação)
examples/  session-demo/ — uma sessão sintética completa
revues/    as suas sessões chegam aqui (criado em tempo de execução; conserve-as ou descarte-as)
```

## Licenças

- **Código** (`moteur/`): MIT — veja `LICENSE`.
- **Método e documentos** (`docs/`, `skills/`, README): CC BY 4.0 — veja `LICENSE-METHOD.md`. A atribuição é a autoria datada; se reutilizar o método, nomeie-o e ligue a ele.

*Regra de vocabulário, vinculante para os próprios textos deste projeto: isto é revisão e deliberação multimodelo com um único executor humano — o termo «multiagente» nunca se emprega para descrever este projeto.*
