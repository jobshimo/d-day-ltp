import type { Lesson } from 'content-schema';

/**
 * Module 3 — "Fuego Alemán: Fundamentos"
 *
 * Covers §6 (German Fire, rules-text.txt lines 824–1091).
 *
 * German Fire Chart embedded as image block; table cell values NOT reproduced
 * (EXT-02 blocker). Lesson 3-2 describes procedure inputs/outputs only.
 * Worked examples at lines 1019–1072 used for inline scenarios.
 */
export const MODULE_3_LESSONS: Lesson[] = [
  // ------------------------------------------------------------------ Lesson 3-1
  {
    id: 'lesson-3-1',
    moduleId: 'module-3',
    order: 1,
    titleEs: 'Lectura de la fire card y campos de fuego',
    blocks: [
      {
        type: 'prose',
        content:
          'En la Fase de Fuego Alemán se extraen dos cartas de fuego (fire cards): una para el sector este y otra para el oeste. La fire card identifica qué posiciones alemanas disparan y qué unidades de EE.UU. son más propensas a ser alcanzadas.',
        ruleRefs: [{ section: '6', note: 'Dos fire cards por turno, una por sector' }],
      },
      {
        type: 'rule-callout',
        content:
          '§6.1 — Cada fire card contiene:\n' +
          '• Tres colores de posición alemana. Una posición no disrupta que coincida con un color puede disparar.\n' +
          '• Un símbolo simple indica que la posición dispara si está ocupada por cualquier unidad alemana (con o sin depth marker).\n' +
          '• Un símbolo doble indica que la posición solo dispara si tiene una unidad Y un depth marker.\n' +
          '• Un target symbol: las unidades de EE.UU. con ese símbolo son más propensas a ser alcanzadas.\n' +
          '• Opcionalmente: una estrella (★) en un color (§11.4), un símbolo de Armor Hit Bonus (§6.36), letras de acción (solo turnos 17–32, ignóralas hasta el Módulo 8).',
        ruleRefs: [{ section: '6.1', note: 'Contenido de la fire card: colores, símbolos, target symbol' }],
      },
      {
        type: 'prose',
        content:
          'La distinción entre símbolo simple y doble es fundamental. Un WN con solo una unidad y sin depth marker dispara solo si la fire card muestra su color con símbolo simple. Si aparece con símbolo doble, esa posición no dispara a menos que tenga tanto una unidad como un depth marker. Esta regla representa el nivel de dotación y despliegue de la posición.',
        ruleRefs: [{ section: '6.1', note: 'Símbolo simple vs doble: condiciones de disparo' }],
      },
      {
        type: 'rule-callout',
        content:
          '§6.1 — Armor Hit Bonus: cuando el color de una posición en la fire card incluye el símbolo de armor bonus, las unidades blindadas de EE.UU. atacadas por esas posiciones son tratadas como no blindadas al determinar impactos (§6.36). En la German Fire Chart, unidades blindadas en hexes de fuego intenso son golpeadas incluso sin el armor bonus.',
        ruleRefs: [{ section: '6.1', note: 'Armor Hit Bonus en la fire card' }, { section: '6.36' }],
      },
      {
        type: 'prose',
        content:
          'Campo de fuego (Field of Fire, §6.2): los hexes alrededor de cada posición alemana contienen "fire dots" del color de la posición. El conjunto de todos los fire dots de una posición forma su campo de fuego. Los WN tienen campos de fuego de hasta cinco hexes a lo largo de la playa; la mayoría de las posiciones de refuerzo tienen campos de uno o dos hexes en el terreno denso del interior.',
        ruleRefs: [{ section: '6.2', note: 'Campo de fuego: fire dots del color de la posición' }],
      },
      {
        type: 'rule-callout',
        content:
          '§6.2 — Tres intensidades de fire dot:\n' +
          '• Fuego Intenso (Intense): prioridad 1 — mayor riesgo para unidades de EE.UU.\n' +
          '• Fuego Sostenido (Steady): prioridad 2.\n' +
          '• Fuego Esporádico (Sporadic): prioridad 3 — menor riesgo.',
        ruleRefs: [{ section: '6.2', note: 'Tres intensidades y orden de prioridad' }],
      },
      {
        type: 'prose',
        content:
          'Reglas especiales de campo de fuego:\n' +
          '• WN de dos hexes (§6.21): un WN como el WN62 ocupa dos hexes pero tiene un único campo de fuego, ya sea que uno o los dos hexes estén ocupados.\n' +
          '• Fuego transfronterizo (§6.22): posiciones cerca del límite este/oeste pueden tener fire dots en el otro sector y disparar a esas unidades.\n' +
          '• Campos adyacentes (§6.23): los campos de fuego del mismo color pueden ser contiguos pero nunca se superponen. Si hay duda sobre qué posición proyecta un fire dot en un hex, el punto aparece en el lado más cercano a la posición proyectante.',
        ruleRefs: [
          { section: '6.21', note: 'WN de dos hexes: un campo de fuego único' },
          { section: '6.22', note: 'Fuego transfronterizo entre sectores' },
          { section: '6.23', note: 'Campos adyacentes del mismo color: nunca solapados' },
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ Lesson 3-2
  {
    id: 'lesson-3-2',
    moduleId: 'module-3',
    order: 2,
    titleEs: 'Resolución del fuego alemán',
    blocks: [
      {
        type: 'prose',
        content:
          'Tras extraer la fire card, resuelve el fuego de todas las posiciones que coincidan con los tres colores de la carta. Para cada posición que dispara, revisa cada hex de su campo de fuego que esté ocupado por unidades de EE.UU. y consulta la German Fire Chart.',
        ruleRefs: [{ section: '6.3', note: 'Resolver el fuego: una posición a la vez' }],
      },
      {
        type: 'rule-callout',
        content:
          '§6.3 — Condiciones de disparo:\n' +
          '• Una posición no disrupta ocupada por una unidad (con o sin depth marker) dispara si su color aparece como símbolo simple en la fire card.\n' +
          '• Una posición no disrupta ocupada por una unidad y un depth marker dispara si su color aparece como símbolo doble.\n' +
          '• En un WN de dos hexes: al menos una unidad en cualquiera de los dos hexes debe tener depth marker para que el símbolo doble active su fuego.',
        ruleRefs: [{ section: '6.3', note: 'Condiciones exactas de activación de disparo' }],
      },
      {
        type: 'image',
        content: 'assets/charts/german-fire-chart.jpg',
        altText:
          'German Fire Chart: tabla de referencia de fuego alemán con filas por intensidad de fire dot (Intense, Steady, Sporadic) y columnas por tipo de posición (WN/refuerzo revelado vs. refuerzo no revelado). Los resultados indican pérdida de escalón y/o disrupción según target symbol y tipo de unidad. Tabla reproducida de la comunidad (TTS); valores validados contra el reglamento.',
        ruleRefs: [{ section: '6.3', note: 'German Fire Chart: fila = intensidad; columna = tipo de posición' }],
      },
      {
        type: 'rule-callout',
        content:
          '§6.3 — Cómo leer la German Fire Chart: usa la fila correspondiente al tipo de fire dot en el hex (Intense, Steady o Sporadic). Lee en la columna correspondiente al tipo de posición que dispara: WN o refuerzo revelado, o refuerzo no revelado. El resultado del recuadro indica qué unidades de EE.UU. reciben impactos y de qué tipo (pérdida de escalón y/o disrupción).',
        ruleRefs: [{ section: '6.3', note: 'Procedimiento de lectura de la chart: fila × columna' }],
      },
      {
        type: 'prose',
        content:
          'Límites de impactos (§6.31): en un turno, una posición alemana puede impactar un número de unidades de EE.UU. igual al número de unidades alemanas y depth markers en esa posición. Ejemplo: un WN con 2 unidades y 1 depth marker puede alcanzar hasta 3 unidades de EE.UU. Si hay más unidades elegibles que el límite, se elige en este orden de prioridad:\n' +
          '• Prioridad 1: Unidades en hexes de fuego intenso.\n' +
          '• Prioridad 2: Unidades en hexes de fuego sostenido.\n' +
          '• Prioridad 3: Unidades en hexes de fuego esporádico.\n' +
          'Dentro de cada prioridad, elige primero la unidad más cercana a la posición que dispara; luego la que tiene más escalones. Si sigue habiendo empate, tú eliges.',
        ruleRefs: [{ section: '6.31', note: 'Límite de impactos y orden de prioridad' }],
      },
      {
        type: 'prose',
        content:
          'Pérdida de escalón (§6.32): una unidad alcanzada por fuego puede perder un escalón según lo indicado en la chart. Gira la ficha al lado de fuerza reducida. Si la unidad vuelve a ser alcanzada, retírala del juego. Si tiene un solo escalón, retírala directamente.',
        ruleRefs: [{ section: '6.32', note: 'Pérdida de escalón: girar o retirar la ficha' }],
      },
      {
        type: 'prose',
        content:
          'Disrupción (§6.33): una unidad alcanzada puede quedar disrupta en lugar de, o además de, perder un escalón. Coloca un marcador de disrupción sobre la unidad. Una unidad ya disrupta que recibe otro resultado de disrupción no se ve más afectada. Una unidad puede ser disrupta por una posición y perder un escalón por otra en la misma fase de fuego.',
        ruleRefs: [{ section: '6.33', note: 'Disrupción: marcador colocado; no acumula más allá de uno' }],
      },
      {
        type: 'rule-callout',
        content:
          '§6.34 — Limitación de pérdida de escalón: una unidad de EE.UU. no puede perder más de un escalón en una sola Fase de Fuego Alemán, aunque sea impactada por múltiples posiciones. Los impactos en exceso deben asignarse a otras unidades si están disponibles.',
        ruleRefs: [{ section: '6.34', note: 'Máximo 1 escalón perdido por unidad por fase de fuego' }],
      },
      {
        type: 'rule-callout',
        content:
          '§6.35 — Objetivo concentrado: si un hex tiene unidades con 5 o más escalones totales en total, todas las unidades allí se consideran con el target symbol de la fire card, independientemente de sus símbolos reales.',
        ruleRefs: [{ section: '6.35', note: 'Objetivo concentrado: 5+ escalones = todos con el target symbol de la carta' }],
      },
      {
        type: 'prose',
        content:
          'Los impactos son contra unidades individuales, no contra apilamientos (stacks, §6.37). Dos unidades en el mismo hex pueden recibir resultados distintos: una pierde un escalón y la otra no es impactada en absoluto. Si ambas son impactadas, ambas pueden perder un escalón.',
        ruleRefs: [{ section: '6.37', note: 'Impactos individuales, no por stack' }],
      },
    ],
  },

  // ------------------------------------------------------------------ Lesson 3-3
  {
    id: 'lesson-3-3',
    moduleId: 'module-3',
    order: 3,
    titleEs: 'Disrupción alemana y artillería',
    blocks: [
      {
        type: 'prose',
        content:
          'Una unidad alemana con marcador de disrupción no dispara y no proyecta campo de fuego (§6.4). La disrupción se elimina cuando el color de esa posición aparece en la siguiente fire card extraída para su sector. Tras resolver todo el fuego en la Fase de Fuego Alemán, retira los marcadores de disrupción de cada posición alemana cuyo color aparezca en la fire card (ya sea con símbolo simple o doble, independientemente de si tiene depth marker).',
        ruleRefs: [{ section: '6.4', note: 'Unidad disrupta: no dispara, no tiene campo de fuego; disrupción se elimina con siguiente fire card' }],
      },
      {
        type: 'rule-callout',
        content:
          '§6.41 — WN de dos hexes con disrupción parcial: si un WN de dos hexes tiene unidades en ambos hexes y una de ellas está disrupta, el hex no disrupto sigue teniendo campo de fuego y puede disparar. Sin embargo, la unidad disrupta y su depth marker no se cuentan para determinar si la posición es elegible para disparar ni cuántas unidades puede impactar.',
        ruleRefs: [{ section: '6.41', note: 'WN dos hexes: unidad disrupta no cuenta para elegibilidad ni límite de impactos' }],
      },
      {
        type: 'prose',
        content:
          'Fuego de artillería alemana (§6.5, a partir del turno 4): si la fire card muestra un valor de artillería, primero resuelve todo el fuego de posiciones alemanas del sector, luego comprueba si el fuego de artillería alcanza a una unidad de EE.UU. El valor de la izquierda del resultado de artillería es el valor de artillería. Cuenta las unidades de artillería no disruptas en el sector (en posiciones WN y en la Caja de Artillería del Sector) con los calibres indicados en la carta.',
        ruleRefs: [{ section: '6.5', note: 'Artillería alemana: comienza turno 4; resolución tras fuego de posiciones' }],
      },
      {
        type: 'rule-callout',
        content:
          '§6.5 — Si el número de unidades de artillería alemana no disruptas con los calibres listados es IGUAL O MAYOR que el valor de artillería, una unidad de EE.UU. con el target symbol de la carta pierde un escalón. Orden de prioridad:\n' +
          '1. Infantería de tu elección en una Beach Landing Box.\n' +
          '2. Unidad no de infantería en un hex de playa.\n' +
          '3. Unidad no de infantería en una Beach Landing Box.\n' +
          '4. Infantería en un hex de playa.\n' +
          'Selecciona la unidad con más escalones dentro de cada prioridad.',
        ruleRefs: [{ section: '6.5', note: 'Artillería: si unidades ≥ valor → 1 escalón; orden de prioridad' }],
      },
      {
        type: 'prose',
        content:
          'Eliminar artillería alemana (§6.51): cuando eliminas una unidad WN con artillería, deja de contribuir al fuego de artillería. Las unidades de artillería en las Cajas de Artillería del Sector no pueden eliminarse directamente, pero se inactivan si controlas todas las posiciones que sirven como observadores de esa unidad de artillería. Si cualquiera de esas posiciones vuelve a ser ocupada por unidades alemanas o recupera comunicación alemana, la unidad de artillería se reactiva.',
        ruleRefs: [
          { section: '6.51', note: 'Eliminar artillería WN: deja de contribuir' },
          { section: '6.51', note: 'Artillería en cajas: inactivar controlando todos los observadores' },
        ],
      },
      {
        type: 'rule-callout',
        content:
          '§6.53 — La batería de artillería de cohetes en WN69 no contribuye al fuego de artillería alemana (verifica las reglas de artillería de cohetes; WN69 es la excepción explícita).',
        ruleRefs: [{ section: '6.53', note: 'WN69 cohetes: no cuenta para artillería alemana' }],
      },
    ],
  },
];
