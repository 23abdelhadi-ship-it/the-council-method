# The Council Method — el método (edición pública, español)

> **Definición en una línea**: varios modelos de lenguaje deliberan sobre sus archivos técnicos (código, decisiones, investigaciones) en dos rondas — una independiente y luego un debate anonimizado — con clasificación obligatoria de cada afirmación, un registro de decisiones vinculante y un único presidente humano que resuelve por ejecución, nunca por votación.

**Regla de vocabulario vinculante, en todos los textos del proyecto y en todos los idiomas**: nunca se emplea el término «multiagente» (multi-agent) para describir este proyecto. Este proyecto es **revisión y deliberación multimodelo** con un único ejecutor humano (el presidente) — no ejecución multiagente. `The Council Method` es un nombre propio y no se traduce; `QUORUM_NON_ATTEINT` es una etiqueta técnica que se conserva tal cual en todos los idiomas.

El árabe y el francés son los idiomas fuente de esta doctrina; las demás versiones son traducciones fieles de ella.

---

## 1. ¿Por qué un consejo?

Un solo modelo le da una única opinión segura de sí misma; si se equivoca, usted no lo sabrá: no hay segunda voz, ni oposición, ni memoria de lo que ya decidió. El consejo convierte la pregunta en una pequeña institución de revisión: un único brief con formato impuesto, una ronda independiente en la que los miembros no se ven entre sí, una ronda de debate anonimizado en la que cada miembro ataca los puntos de los demás sin conocer a sus autores, y después un presidente humano que verifica por ejecución y redacta la síntesis.

**El consenso es una trampa**: cuando los modelos coinciden con facilidad, por lo general están reproduciendo la misma respuesta estándar. La señal útil es **el desacuerdo** — dónde divergen los modelos, y por qué. Por eso la síntesis conserva los desacuerdos textualmente en lugar de disolverlos en un promedio.

## 2. Composición y roles

- **Los miembros**: modelos de familias diferentes (la diversidad es una condición; un consejo hecho de un solo modelo con varios roles es una simulación, no un consejo). Los niveles gratuitos bastan para empezar; el silencio técnico de un miembro (cuotas, tiempos de espera, errores del servidor) se documenta, nunca se oculta.
- **El presidente**: un humano, único. Dirige la sesión, lee todas las salidas, verifica los puntos en disputa **por ejecución** o en la fuente primaria, y redacta la síntesis con su propia voz. No se le sustituye por una síntesis automática y nunca resuelve por votación.
- **El usuario (quien decide)**: sus decisiones anteriores vinculan al consejo (sección 3); aquello de lo que el presidente no esté seguro se le pregunta, y su respuesta se convierte en la base adoptada.

## 3. Los archivos sobre los que trabaja el consejo

| Archivo | Función |
|---|---|
| `brief.md` — el brief permanente | El formato de respuesta impuesto y las reglas vinculantes para los miembros (plantilla: `docs/BRIEF_TEMPLATE.md`) |
| `DECISIONS.md` — el registro de decisiones | Las decisiones vinculantes del usuario. Toda propuesta de un miembro que contradiga una decisión registrada se marca explícitamente: «propuesta contraria a la decisión registrada n.º N» — nunca pasa en silencio, y una propuesta solo se convierte en decisión por la palabra del usuario |
| `REFERENCE.md` — la referencia | La única referencia vigente dentro del alcance de la revisión; no se supone que exista ninguna otra versión |
| El dosier de sesión | Los archivos de texto sometidos a revisión, reunidos con una huella (SHA-256) por archivo y una huella global |
| `synthese.md` — la síntesis | La salida del presidente únicamente, sobre una plantilla guiada (índice, procedimiento paso a paso, campos obligatorios) |

**Etiqueta de origen**: cada salida de sesión lleva, en el momento de su escritura, una etiqueta de origen (miembro/presidente/humano) **fijada en la creación y que la edición nunca cambia** — véase la regla de la sección 6.

Y como los archivos sencillos dentro de un repositorio son todo lo que sobrevive, el brief lleva un campo explícito: **«estado actual / próxima acción»** — las especificaciones por sí solas no muestran dónde se detuvo el trabajo.

## 4. Las dos rondas

### Ronda 1 — independiente
Cada miembro revisa el dosier en solitario, con puntos numerados (F-01, F-02...), cada punto: título corto / gravedad / prueba (archivo:línea) / clasificación de la afirmación / corrección propuesta si la hay. **Cada respuesta comienza con una línea de declaración de identidad**: el modelo que el miembro cree ser. Y el motor estampa cada respuesta con el modelo que **realmente la sirvió** (leído en los metadatos de la respuesta) y señala cualquier discrepancia entre el modelo declarado y el servido en el informe de fragilidad — la suplantación de identidad de un modelo dentro de un consejo está documentada, y solo estas dos líneas la revelan.

### Ronda 2 — debate anonimizado por rotación
Cada miembro recibe los puntos de los demás bajo letras anonimizadas **generadas dinámicamente y rotadas de un lector a otro** (ninguna letra designa al mismo modelo para dos lectores). Para cada punto: acuerdo o desacuerdo, con un motivo preciso extraído del texto. Después, una única sección: «puntos que mantengo».

### ¿Por qué solo dos rondas?
Porque un debate largo agota en lugar de convencer: tras unas tres rondas, los modelos oponentes empiezan a capitular por «cortesía por agotamiento», no por convicción (Xiong et al., 2025). El límite de dos rondas es una regla de método, no una limitación técnica. Por la misma razón, se prefieren los veredictos «pasa/bloquea, con motivo» a las puntuaciones numéricas, que derivan a lo largo de las rondas.

## 5. Clasificación de afirmaciones — obligatoria

Cada afirmación, en cada respuesta, se clasifica en una de tres categorías:

- **[Verificado]**: tiene una prueba fuera del consejo (archivo:línea, ejecución, documento, registro). La salida de otro miembro **no** es una prueba.
- **[Inferencia]**: un razonamiento a partir de elementos verificados, cuya base se enuncia.
- **[Propuesta]**: una opinión o recomendación; nunca se consigna como si fuera una decisión.

Y lo que no pueda verificarse a partir del texto se marca explícitamente: **[no verificable a partir del texto]**. Nada de preámbulos literarios ni elogios en las respuestas de los miembros.

## 6. La regla contra la autocitación (con nombre propio)

> **La salida de cualquier miembro es una hipótesis en examen; solo se convierte en [Verificado] mediante una prueba exterior al consejo.**

El fallo que esta regla nombra está documentado entre los practicantes: un sistema cita notas generadas por miembros anteriores, de modo que las respuestas parecen «cada vez mejor documentadas» con el tiempo mientras se citan a sí mismas. Los dos mecanismos de reparación adoptados aquí:

1. **La etiqueta de origen en el momento de la escritura** (sección 3): cada elemento lleva su origen (humano/miembro/presidente) fijado en el momento de su creación, y la edición nunca lo cambia.
2. **Dos controles separados para cada prueba citada** en la síntesis: (a) ¿**respalda la afirmación** realmente? (b) ¿**trata la pregunta** realmente planteada? — porque una cita real pero irrelevante es un fallo distinto de una cita fabricada.

## 7. Umbral de validez de sesión — la regla del cuórum

Una sesión válida reúne **al menos 3 respuestas sustanciales** en su primera ronda (una respuesta sustancial: exitosa y con contenido real — no un mensaje de error ni una sola línea). Por debajo de eso:

- la sesión se marca **`QUORUM_NON_ATTEINT`** automáticamente en su manifiesto (MANIFEST) y en un archivo dedicado;
- no hay ronda 2 ni síntesis — las salidas brutas quedan como rastros legibles, pero **no se presentan como un juicio del consejo**;
- el remedio es una nueva ejecución (dosier más pequeño, otras vías, claves adicionales), no una conclusión extraída de una sesión incompleta.

## 8. Pesos de sesión (orientación documentada, no umbrales-ley)

- **Ligera** — puente de entrada y demostración: solo ronda 1, formato aligerado con menos puntos, rigor de clasificación íntegro. Sirve para presentar el método y para preguntas pequeñas.
- **Estándar** — la opción por defecto: formato F completo y dos rondas.
- **Completa** — auditoría: estándar + informe de fragilidad detallado + línea de coste/esfuerzo de sesión (contada en llamadas, fallos y duración, no en peticiones aisladas; en vías de pago, el coste del juez/de la evaluación aparece como línea separada, nunca fundido en un total).

La escala es una orientación para proporcionar el esfuerzo a lo que está en juego en la decisión — no una ley numerada que prohíba o imponga una sesión.

## 9. La síntesis del presidente y la verificación por ejecución

El valor se fabrica aquí, no en las rondas. Procedimiento del presidente:

1. Leer todas las respuestas de la ronda 1, luego los debates de la ronda 2.
2. Para cada punto en disputa: **verificar por ejecución** (ejecutar, comparar, reproducir) o volver a la fuente primaria. Nunca arbitrar por votación ni por mayoría.
3. Rellenar la plantilla de síntesis, cuyos dos campos obligatorios con nombre son: **«desacuerdos conservados textualmente»** (las posiciones minoritarias en sus propios términos, no un promedio disuelto) y **«el contexto que faltaba y causó el desacuerdo»** (lo que el dosier no contenía y produjo el desacuerdo — que se pedirá después al usuario en lugar de adivinarlo).
4. Aplicar los dos controles (sección 6) a cada afirmación conservada en la síntesis.
5. Cerrar con el diario de resultados (sección 10).

La carga de lectura es el verdadero cuello de botella del presidente; por eso las respuestas se construyen sobre punteros verificables puntualmente (archivo:línea), no sobre muros de texto.

## 10. El diario de resultados

Cada sesión se cierra, en su síntesis, con dos líneas: **la posición adoptada** y **la probabilidad estimada**. Cuando la realidad resuelva más tarde el asunto, se añade una tercera línea — **«lo que realmente ocurrió»** — sin reescribir nunca la posición original. El registro de decisiones deja así de ser un archivo y se convierte en un instrumento acumulativo de calibración: el consejo queda consignado y después lo califica la realidad.

## 11. Doctrina general (¿por qué es difícil copiar esto?)

- **El uso antes que la herramienta; la profundidad antes que la ampliación; la ejecución antes que la guía.** Una idea nueva se implementa primero con las herramientas actuales; cambiar a una herramienta nueva es una excepción que exige una justificación escrita.
- **La prueba del foso de cinco preguntas** para cada paso futuro (publicación, alianza, funcionalidad): ¿supera las preguntas de **impacto, alcance de los seguidores, elusión, durabilidad y retención**? Lo que no la supera es una capa copiable: se entrega deliberadamente, su autoría queda fechada y no se construye protección alguna sobre ella.
- **El núcleo que no se entrega**, en sus conceptos generales: datos operativos acumulados con el tiempo, una red de confianza que no se puede comprar, el permiso de una parte que le elige a usted, un coste de cambio real para quienes le adoptaron, y un corpus de juicios (un registro de decisiones y síntesis) que nadie más posee.
- **Rituales**: un radar de usos periódico que pregunta «¿qué uso nuevo para nuestro trabajo real?» y no «¿qué herramienta nueva?»; y una autorrevisión periódica que pregunta: ¿qué hemos acumulado que no se pueda copiar? Un ciclo que solo produce capas copiables es un ciclo fracasado, produzca lo que produzca.
- El consejo juzga **la investigación, los planes y los hechos — nunca la prosa**. Los textos destinados a humanos se escriben con una única voz de autor, y se controlan después solo en el nivel de las citas, las cifras y las fechas.

## 12. Límites del método, con honestidad

- No añade nada a las preguntas rápidas y simples; su valor aparece donde el coste de un error supera el coste de la sesión.
- **La ruleta de proveedores** es real: las probabilidades de fallo de cada paso se multiplican a través de las fases. Sus mitigaciones adoptadas: reintentar en el límite de la fase en lugar de relanzar todo, y un informe de fragilidad por sesión que agrega los fallos clasificados (cuotas/tamaño/tiempos de espera/red) en lugar de descubrirlos dispersos.
- El consejo amplifica el juicio del presidente, no lo sustituye: sin un presidente que lea y verifique, son cinco opiniones seguras en lugar de una.
- Ningún secreto en el dosier, nunca: las claves y los secretos quedan siempre fuera de los archivos, y el archivo de configuración local no se publica ni se sube a ningún repositorio.

---

## Anexo A — Protocolo de evaluación «el consejo contra un modelo único» (D-10)

Una petición recurrente de los practicantes; aquí está su forma ejecutable, para quien quiera comprobar por sí mismo que el consejo aporta algo:

1. Tome unas **20 tareas** reales de su trabajo (revisiones, decisiones, planes) ya resueltas o resolubles.
2. Ejecute ambas partes sobre **exactamente las mismas pruebas**: (a) un modelo fuerte único con una lista de control estructurada; (b) un consejo estándar según este método.
3. Compare **la exactitud de los veredictos** (¿coincide el juicio final con lo que la realidad/la referencia estableció?) — no la tasa de acuerdo entre ambas partes, porque un acuerdo puede ser una ceguera compartida.
4. Consigne también: el coste (llamadas y tiempo del presidente) de cada parte, y el número de errores atrapados por una parte y pasados por alto por la otra.
5. Publique el resultado tal cual, incluso si el consejo pierde.

## Anexo B — Terminología unificada entre idiomas

| Concepto | Árabe | Francés | Inglés | Español | Portugués |
|---|---|---|---|---|---|
| Nombre del proyecto | The Council Method | The Council Method | The Council Method | The Council Method | The Council Method |
| El presidente | الرئيس | le président | the chair | el presidente | o presidente |
| El miembro | العضو | le membre | the member | el miembro | o membro |
| La ronda | الجولة | la ronde | the round | la ronda | a rodada |
| El brief | الإحاطة | le brief | the brief | el brief | o brief |
| El registro de decisiones | سجلّ القرارات | le registre des décisions | the decisions register | el registro de decisiones | o registro de decisões |
| La síntesis | التوليف | la synthèse | the synthesis | la síntesis | a síntese |
| Afirmación verificada | [مثبت] | [établi] | [Verified] | [Verificado] | [Verificado] |
| Inferencia | [استنتاج] | [inférence] | [Inference] | [Inferencia] | [Inferência] |
| Propuesta | [اقتراح] | [proposition] | [Proposal] | [Propuesta] | [Proposta] |
| Etiqueta de cuórum | QUORUM_NON_ATTEINT | QUORUM_NON_ATTEINT | QUORUM_NON_ATTEINT | QUORUM_NON_ATTEINT | QUORUM_NON_ATTEINT |
