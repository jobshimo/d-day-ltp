import type { DrillScenario, QuizItem } from 'content-schema';

/**
 * Module 3 drills — 3 drills + quiz.
 *
 * Drill 3-1 (multiple-choice): symbol eligibility (§6.1)
 * Drill 3-2 (interactive-select): field of fire selection (§6.2)
 * Drill 3-3 (multiple-choice): hit limit + priority (§6.31)
 *
 * German Fire Chart values NOT reproduced (EXT-02 blocker).
 * Inline scenario values used for drills.
 * All rules verified against rules-text.txt lines 824–1091.
 */
export const MODULE_3_DRILLS: DrillScenario[] = [
  // ---- Drill 3-1: Single vs double symbol eligibility (§6.1) ----
  {
    id: 'drill-3-1',
    moduleId: 'module-3',
    type: 'multiple-choice',
    questionEs:
      'Extraes una fire card que muestra: posición ROJA con símbolo doble, posición AZUL con símbolo simple. En el mapa tienes: posición roja WN con 1 unidad y SIN depth marker; posición azul WN con 1 unidad y SIN depth marker. ¿Cuál o cuáles de estas posiciones DISPARAN?',
    choices: [
      {
        id: 'a',
        labelEs: 'Solo la posición roja dispara.',
        isCorrect: false,
      },
      {
        id: 'b',
        labelEs: 'Solo la posición azul dispara.',
        isCorrect: true,
      },
      {
        id: 'c',
        labelEs: 'Ambas posiciones disparan.',
        isCorrect: false,
      },
      {
        id: 'd',
        labelEs: 'Ninguna dispara porque ambas carecen de depth marker.',
        isCorrect: false,
      },
    ],
    correctAnswer: 'b',
    ruleRefs: [
      { section: '6.1', note: 'Símbolo simple: dispara con cualquier unidad; símbolo doble: necesita unidad + depth marker' },
      { section: '6.3', note: 'Condiciones de elegibilidad para disparar' },
    ],
    explanationEs:
      'Según §6.1 y §6.3: el símbolo doble en rojo significa que la posición roja SOLO dispara si tiene una unidad Y un depth marker. Como la posición roja solo tiene una unidad sin depth marker, no cumple la condición y no dispara. El símbolo simple en azul significa que la posición azul dispara si está ocupada por cualquier unidad alemana (con o sin depth marker), así que la posición azul sí dispara.',
  },

  // ---- Drill 3-2: Interactive-select — field of fire identification (§6.2) ----
  {
    id: 'drill-3-2',
    moduleId: 'module-3',
    type: 'interactive-select',
    questionEs:
      'La posición verde (WN en hex-wn-green) tiene fire dots en los hexes de su campo de fuego. La unidad verde está disrupta. ¿Cuáles hexes forman el campo de fuego ACTIVO de esta posición? Selecciona todos los hexes con fire dots de la posición verde.',
    boardSnippet: {
      hexes: [
        // German WN position (disrupted)
        {
          hexId: 'hex-wn-green',
          terrain: 'bluff',
          sector: 'east',
          isBeachBox: false,
          isGermanPosition: true,
          germanPositionColor: 'green',
          isVPPosition: false,
          fireDots: [],
        },
        // hex-a: green intense fire dot
        {
          hexId: 'hex-a',
          terrain: 'beach',
          sector: 'east',
          isBeachBox: false,
          isGermanPosition: false,
          isVPPosition: false,
          fireDots: [{ positionId: 'hex-wn-green', intensity: 'intense' }],
        },
        // hex-b: green steady fire dot
        {
          hexId: 'hex-b',
          terrain: 'beach',
          sector: 'east',
          isBeachBox: false,
          isGermanPosition: false,
          isVPPosition: false,
          fireDots: [{ positionId: 'hex-wn-green', intensity: 'steady' }],
        },
        // hex-c: green sporadic fire dot
        {
          hexId: 'hex-c',
          terrain: 'pavilion',
          sector: 'east',
          isBeachBox: false,
          isGermanPosition: false,
          isVPPosition: false,
          fireDots: [{ positionId: 'hex-wn-green', intensity: 'sporadic' }],
        },
        // hex-d: NO green fire dot (different position)
        {
          hexId: 'hex-d',
          terrain: 'beach',
          sector: 'east',
          isBeachBox: false,
          isGermanPosition: false,
          isVPPosition: false,
          fireDots: [{ positionId: 'hex-wn-red', intensity: 'intense' }],
        },
      ],
      units: [
        // Disrupted German unit in the WN position
        {
          kind: 'german',
          id: 'german-unit-green',
          type: 'WN',
          isRevealed: false,
          strength: 3,
          weaponRequirements: [],
          hasDepthMarker: false,
          isDisrupted: true,
          hexId: 'hex-wn-green',
        },
        // A US infantry unit in hex-a
        {
          kind: 'us',
          id: 'unit-us-a',
          type: 'infantry',
          steps: 3,
          targetSymbol: 'triangle',
          weapons: ['BZ'],
          attackStrength: 3,
          isDisrupted: false,
          hexId: 'hex-a',
        },
      ],
    },
    // Correct: all three hexes that have green fire dots (hex-a, hex-b, hex-c).
    // hex-d has a different position's fire dot.
    // Note: even though the unit is disrupted (no active field of fire),
    // the question asks which hexes FORM the field of fire (the printed dots),
    // not which are currently active. This teaches the distinction.
    correctAnswer: 'hex-a,hex-b,hex-c',
    ruleRefs: [
      { section: '6.2', note: 'Campo de fuego: todos los hexes con fire dots del color de la posición' },
      { section: '6.4', note: 'Unidad disrupta: no dispara ni proyecta campo de fuego activo' },
    ],
    explanationEs:
      'Según §6.2, el campo de fuego de una posición es el conjunto de todos los hexes que contienen fire dots del color de esa posición. Los hexes hex-a (intenso), hex-b (sostenido) y hex-c (esporádico) tienen fire dots verdes del WN verde. El hex-d tiene fire dots de otra posición (rojo). Importante: aunque la unidad verde está disrupta (§6.4), el campo de fuego es una propiedad impresa del mapa — la disrupción impide que la posición dispare, pero no borra los fire dots del tablero.',
  },

  // ---- Drill 3-3: Hit limit + priority (§6.31) ----
  {
    id: 'drill-3-3',
    moduleId: 'module-3',
    type: 'multiple-choice',
    questionEs:
      'Una posición WN tiene 1 unidad y 2 depth markers (límite de impactos: 3). Hay 4 unidades de EE.UU. en su campo de fuego: Unidad A en hex de fuego intenso, Unidad B en hex de fuego intenso, Unidad C en hex de fuego sostenido, Unidad D en hex de fuego esporádico. Según §6.31, ¿cuáles tres unidades son impactadas primero?',
    choices: [
      {
        id: 'a',
        labelEs: 'A, B y C — se priorizan los hexes de mayor intensidad primero, y luego el siguiente nivel.',
        isCorrect: true,
      },
      {
        id: 'b',
        labelEs: 'A, B y D — las unidades en hexes extremos (intenso y esporádico) siempre son las primeras.',
        isCorrect: false,
      },
      {
        id: 'c',
        labelEs: 'B, C y D — se ignora la Unidad A porque ya fue impactada antes.',
        isCorrect: false,
      },
      {
        id: 'd',
        labelEs: 'A, C y D — el fuego sostenido tiene prioridad sobre el intenso en turnos impares.',
        isCorrect: false,
      },
    ],
    correctAnswer: 'a',
    ruleRefs: [
      { section: '6.31', note: 'Prioridad: intenso (1) > sostenido (2) > esporádico (3); límite = unidades + depth markers' },
    ],
    explanationEs:
      'Según §6.31, el límite de impactos es 3 (1 unidad + 2 depth markers). La prioridad es: primero todos los hexes de fuego intenso (Unidades A y B), luego todos los de fuego sostenido (Unidad C), luego los de fuego esporádico (Unidad D). Con un límite de 3, se alcanzan A (intenso), B (intenso) y C (sostenido). La Unidad D en hex esporádico no se ve afectada porque el límite ya fue alcanzado.',
  },
];

/**
 * Module 3 review quiz — 4 items.
 * Covers §6 (German Fire).
 */
export const MODULE_3_QUIZ: QuizItem[] = [
  // ---- Quiz 3-1: Distinción símbolo simple vs doble ----
  {
    id: 'quiz-3-1',
    moduleId: 'module-3',
    type: 'multiple-choice',
    questionEs:
      'Una posición naranja tiene 1 unidad y 1 depth marker. La fire card muestra la posición naranja con símbolo simple. ¿Dispara esta posición?',
    choices: [
      { id: 'a', labelEs: 'Sí, porque el símbolo simple requiere solo una unidad (con o sin depth marker).', isCorrect: true },
      { id: 'b', labelEs: 'No, porque el símbolo simple requiere que la posición esté vacía.', isCorrect: false },
      { id: 'c', labelEs: 'Sí, pero solo si el depth marker está revelado.', isCorrect: false },
      { id: 'd', labelEs: 'No, el símbolo simple nunca activa posiciones WN.', isCorrect: false },
    ],
    correctAnswer: 'a',
    ruleRefs: [{ section: '6.1', note: 'Símbolo simple: dispara con cualquier unidad, con o sin depth marker' }],
    explanationEs:
      'Según §6.1, el símbolo simple en la fire card significa que la posición dispara si está ocupada por cualquier unidad alemana, con o sin depth marker. Tener una unidad y un depth marker cumple plenamente la condición del símbolo simple.',
  },

  // ---- Quiz 3-2: Cálculo del límite de impactos ----
  {
    id: 'quiz-3-2',
    moduleId: 'module-3',
    type: 'multiple-choice',
    questionEs:
      'Un WN de dos hexes tiene: en hex-norte 1 unidad sin depth marker, en hex-sur 2 unidades y 1 depth marker. ¿Cuál es el límite de impactos de esta posición en un turno?',
    choices: [
      { id: 'a', labelEs: '2 (solo cuenta un hex)', isCorrect: false },
      { id: 'b', labelEs: '3 (unidades en un hex + depth marker)', isCorrect: false },
      { id: 'c', labelEs: '4 (1 + 2 unidades + 1 depth marker en ambos hexes)', isCorrect: true },
      { id: 'd', labelEs: '1 (límite máximo para WN de dos hexes)', isCorrect: false },
    ],
    correctAnswer: 'c',
    ruleRefs: [
      { section: '6.31', note: 'Límite de impactos = número total de unidades alemanas + depth markers en la posición' },
      { section: '6.21', note: 'WN de dos hexes: una sola posición con campo de fuego único' },
    ],
    explanationEs:
      'Según §6.31, el límite de impactos es el número de unidades alemanas y depth markers en la posición. Un WN de dos hexes (§6.21) es una sola posición. Suma: 1 unidad (hex norte) + 2 unidades + 1 depth marker (hex sur) = 4. Límite de impactos = 4.',
  },

  // ---- Quiz 3-3: Orden de prioridad de fuego ----
  {
    id: 'quiz-3-3',
    moduleId: 'module-3',
    type: 'multiple-choice',
    questionEs:
      '¿En qué orden se seleccionan los objetivos cuando el número de unidades de EE.UU. elegibles supera el límite de impactos de una posición?',
    choices: [
      {
        id: 'a',
        labelEs: 'Primero las unidades con el target symbol de la carta, luego las demás.',
        isCorrect: false,
      },
      {
        id: 'b',
        labelEs: 'Primero fuego intenso, luego sostenido, luego esporádico; dentro de cada nivel, la unidad más cercana a la posición, luego la de más escalones.',
        isCorrect: true,
      },
      {
        id: 'c',
        labelEs: 'Primero las unidades con más escalones en cualquier hex.',
        isCorrect: false,
      },
      {
        id: 'd',
        labelEs: 'El jugador elige libremente qué unidades reciben impactos.',
        isCorrect: false,
      },
    ],
    correctAnswer: 'b',
    ruleRefs: [{ section: '6.31', note: 'Prioridad: intensidad del fire dot, luego distancia, luego escalones' }],
    explanationEs:
      'Según §6.31, la prioridad es: primero las unidades en hexes de fuego intenso, luego las de fuego sostenido, luego las de fuego esporádico. Dentro de cada grupo, se selecciona primero la unidad más cercana a la posición que dispara; si hay empate, la que tiene más escalones. Si queda un empate final, el jugador elige.',
  },

  // ---- Quiz 3-4: Disrupción alemana ----
  {
    id: 'quiz-3-4',
    moduleId: 'module-3',
    type: 'multiple-choice',
    questionEs:
      '¿Cuándo se retira el marcador de disrupción de una posición alemana?',
    choices: [
      {
        id: 'a',
        labelEs: 'Al inicio de la siguiente Fase de Fuego Alemán, automáticamente.',
        isCorrect: false,
      },
      {
        id: 'b',
        labelEs: 'Cuando el color de la posición aparece en la fire card extraída para su sector, al final de la resolución del fuego de esa fase.',
        isCorrect: true,
      },
      {
        id: 'c',
        labelEs: 'Cuando una unidad de EE.UU. ataca la posición y falla.',
        isCorrect: false,
      },
      {
        id: 'd',
        labelEs: 'Al inicio de la Fase de Acción de EE.UU. del siguiente turno.',
        isCorrect: false,
      },
    ],
    correctAnswer: 'b',
    ruleRefs: [{ section: '6.4', note: 'Disrupción se retira cuando el color aparece en la fire card del sector' }],
    explanationEs:
      'Según §6.4, después de resolver todo el fuego en la Fase de Fuego Alemán, se retiran los marcadores de disrupción de las posiciones cuyo color aparece en la fire card del sector. Esto aplica independientemente de si el símbolo es simple o doble, y de si la unidad tiene depth marker o no. La unidad disrupta no dispara en esa fase, pero puede eliminar su disrupción al final de ella si su color apareció.',
  },
];
