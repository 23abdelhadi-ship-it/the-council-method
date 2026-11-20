# The Council Method

**Este proyecto no genera código ni realiza ejecución multiagente: varios modelos de lenguaje deliberan sobre sus archivos técnicos (código, decisiones, investigaciones), cada afirmación clasificada [Verificado / Inferencia / Propuesta], un registro de decisiones vinculante y un presidente humano que resuelve por ejecución, nunca por votación.**

Idiomas: [English](README.md) · [العربية](README.ar.md) · [Français](README.fr.md) · **Español** (este archivo) · [Português](README.pt.md)
Documento del método: [العربية (fuente)](docs/METHODE.md) · [Français (fuente)](docs/METHODE.fr.md) · [English](docs/METHODE.en.md) · [Español](docs/METHODE.es.md) · [Português](docs/METHODE.pt.md)

> Un solo modelo le da una única opinión segura de sí misma. Si se equivoca, nada se lo dice. The Council Method convierte la pregunta en una pequeña institución de revisión: una ronda independiente, un debate anonimizado y un presidente que verifica ejecutando — en uso real desde noviembre de 2026, revisando proyectos reales. Esta es su edición pública.

## Lea esto antes de instalar — expectativas, con nombre

- **Qué es**: un método (documentos, plantillas, reglas) más un motor Node con cero dependencias que lo ejecuta. Un solo archivo, sin `npm install`: *instalar es descargar*.
- **Qué no es**: no es una interfaz de chat, ni un marco de agentes, ni un generador de código, ni un servicio alojado. No hay interfaz web y no la habrá.
- **Política de mantenimiento — cero, por diseño**: se publica **tal cual, versión 1.1 fija. Sin gestión de issues, sin pull requests.** Mantenimiento cero = un contrato de estabilidad, no un abandono. Para adaptarlo: haga un fork. (Precedente documentado: una famosa demo de «consejo» en un solo archivo alcanzó decenas de miles de estrellas con exactamente esta política; el mantenimiento comunitario es una deuda que este proyecto rechaza desde el primer día.)
- **A quién sirve**: a quien decide y sus errores cuestan caro — un revisor de código, decisiones, planes o investigaciones, capaz de leer salidas y verificar afirmaciones. No añade nada a las preguntas rápidas y simples.
- **El presidente es humano**: el motor no produce ningún veredicto. Si nadie lee ni verifica, obtendrá varias opiniones seguras en lugar de una.
- **Sus claves, sus costes**: los niveles gratuitos bastan (una vía ni siquiera necesita clave). Nada aquí «llama a casa»; sus archivos van solo a los proveedores de modelos que usted configure.

## Primera sesión — cero claves, unos 15 minutos

Requiere Node ≥ 20 (verificado en Node 20 y 24). Sin cuenta, sin clave, sin coste: una vía integrada sin clave hace sesionar al consejo.

```bash
# 1. Obtenga los archivos (descargue o haga fork de este repositorio), después:
node moteur/conseil.mjs --init        # instala brief.md, DECISIONS.md y REFERENCE.md desde las plantillas guiadas
# 2. Edite esos tres archivos para su proyecto (las plantillas explican qué escribir)
node moteur/conseil.mjs --sujet "Revisión de la propuesta X" --source ./sus-archivos/
# 3. Lea revues/<fecha>_<tema>/ — salidas brutas de los miembros, informe de fragilidad
#    y una plantilla guiada de synthese.md para que la complete el presidente
```

Opcional: `node moteur/conseil.mjs --assistant-cles` ejecuta un asistente interactivo que pregunta proveedor por proveedor, **prueba cada clave en directo** y escribe él mismo la configuración. `node moteur/test-cles.mjs` ofrece un diagnóstico de solo lectura de cada asiento (estado + la línea de corrección exacta). (Solo lectura = no escribe nada; sí realiza llamadas de red en directo para verificar los asientos y puede consumir cuota.) `--dry-run` reúne el dosier sin ninguna llamada de red. `--poids legere|standard|complete` selecciona el peso de la sesión (más abajo).

## Necesidad → proceso → resultado con nombre

| Su necesidad | El proceso | El resultado con nombre que obtiene |
|---|---|---|
| Una segunda opinión que no sea un eco | Ronda 1: revisiones independientes, miembros ciegos entre sí | Puntos numerados (F-01...) con pruebas (archivo:línea) y clases de afirmación |
| Un desacuerdo utilizable, no promediado | Ronda 2: debate anonimizado por rotación | Acuerdos/desacuerdos con motivos; un campo de síntesis **«desacuerdos conservados textualmente»** |
| Proteger sus decisiones pasadas de una elusión silenciosa | Un registro de decisiones vinculante, leído en cada sesión | Toda propuesta contraria se marca «contraria a la decisión registrada n.º N» |
| Protegerse contra el consejo que se cita a sí mismo | La regla contra la autocitación, con nombre + etiquetas de origen fijadas al escribir | Una afirmación solo se convierte en [Verificado] mediante una prueba exterior al consejo |
| Una sesión que fracasó en silencio | La regla del cuórum | Las sesiones con menos de 3 respuestas sustanciales se estampan **QUORUM_NON_ATTEINT** — rastros, no un juicio |
| Saber si el consejo acertó | El diario de resultados | Posición + probabilidad consignadas al cierre; «lo que realmente ocurrió» se añade después, sin reescritura |

## En qué se diferencia — una comparación estructural congelada

|  | Tema revisado | Gobernanza (quién resuelve, cómo) | Trazabilidad | Forma de publicación |
|---|---|---|---|---|
| llm-council (Karpathy) | Preguntas de chat | Un modelo juez clasifica respuestas anonimizadas | Clasificación; sin clases de afirmación ni registro de decisiones | Una aplicación, cero mantenimiento |
| Metodologías de especificación (Spec Kit, BMAD) | Construir software a partir de especificaciones | El propio proceso de especificación | Documentos y plantillas; sin registro de decisiones vinculante impuesto en el momento de la revisión | Kits con líneas de versiones y mantenimiento comunitario |
| **The Council Method** | **Sus archivos técnicos existentes: código, decisiones, investigaciones, planes** | **Un presidente humano, por ejecución — nunca por votación** | **Clasificación de afirmaciones obligatoria + registro de decisiones vinculante + etiquetas de origen + regla de cuórum** | **Documentos del método + un archivo con cero dependencias; cero mantenimiento, por contrato** |

Ningún competidor que hayamos encontrado — en un censo completo de herramientas de deliberación en consejo, no una muestra — combina los cuatro elementos: un registro de decisiones vinculante, una clasificación de afirmaciones obligatoria, un presidente que verifica por ejecución y una regla de cuórum de sesión.

## Pesos de sesión

- **Ligera** — puente de entrada y demostración: solo ronda 1, formato aligerado, rigor de clasificación íntegro.
- **Estándar** — la opción por defecto: formato completo, dos rondas.
- **Completa** — auditoría: estándar + informe de fragilidad detallado + línea de coste/esfuerzo de sesión.

La escala proporciona el esfuerzo a lo que está en juego en la decisión; es una orientación documentada, no una ley numerada.

## Dos puertas

1. **El método primero** (recomendado para quienes deciden): lea `docs/METHODE.es.md`, tome las plantillas de `docs/` y haga sesionar al consejo con la skill de un solo anfitrión de `skills/` — el motor es un ejecutor opcional que un intermediario técnico puede operar por usted.
2. **El motor**: `moteur/conseil.mjs` automatiza el protocolo completo (reunión del dosier con huellas, las dos rondas, sellos de identidad del modelo que realmente sirvió cada respuesta, sello de cuórum, informe de fragilidad, plantilla guiada de síntesis).

Una sesión de ejemplo completa y enteramente ficticia — personas, empresa y tema inventados, salidas reales del motor — se encuentra en `examples/session-demo/`.

## Mapa del repositorio

```
moteur/    conseil.mjs (el motor) · test-cles.mjs (diagnóstico de asientos, solo lectura) · config.exemple.json
docs/      METHODE en 5 idiomas · plantillas BRIEF / DECISIONS / REFERENCE / SYNTHESE
skills/    SKILL.md (skill de un solo anfitrión) · PROMPT.md (versión prompt para cualquier anfitrión de chat)
examples/  session-demo/ — una sesión sintética completa
revues/    sus sesiones llegan aquí (se crea en tiempo de ejecución; consérvelas o descártelas)
```

## Licencias

- **Código** (`moteur/`): MIT — véase `LICENSE`.
- **Método y documentos** (`docs/`, `skills/`, README): CC BY 4.0 — véase `LICENSE-METHOD.md`. La atribución es la autoría fechada; si reutiliza el método, nómbrelo y enlace a él.

*Regla de vocabulario, vinculante para los propios textos de este proyecto: esto es revisión y deliberación multimodelo con un único ejecutor humano — el término «multiagente» nunca se emplea para describir este proyecto.*
