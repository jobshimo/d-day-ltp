import type { DrillScenario, QuizItem } from 'content-schema';

/**
 * Module 4 — Interactive fire-resolution drill (REQ-M4-03).
 *
 * ONE interactive-select drill exercising:
 * - §6.3: target symbol match and fire resolution
 * - §6.31: hit limits and priority order (intense before steady)
 * - §6.2: fire dot intensity determines priority
 *
 * Scenario: WN at a red position with 1 unit + 1 depth marker (hit limit = 2).
 * Fire card shows: red single symbol, target symbol ▲.
 * Board: 3 US units in the WN's field of fire at different intensities.
 * Correct answer: the TWO units that should be hit, in priority order.
 *
 * The correctAnswer is "unit-a,unit-b" (comma-separated, sorted by hex/unit ID).
 * The evaluator in domain-drill handles comma-separated IDs for interactive-select.
 */
export const MODULE_4_DRILLS: DrillScenario[] = [
  {
    id: 'drill-4-1',
    moduleId: 'module-4',
    type: 'interactive-select',
    questionEs:
      'El WN rojo (posición A) tiene 1 unidad y 1 depth marker (límite: 2 impactos). La fire card muestra rojo (símbolo simple) con target symbol ▲. Selecciona las DOS unidades de EE.UU. que reciben impacto según las reglas de prioridad.',
    boardSnippet: {
      hexes: [
        // German position (WN)
        {
          hexId: 'hex-wn-red',
          terrain: 'bluff',
          sector: 'east',
          isBeachBox: false,
          isGermanPosition: true,
          germanPositionColor: 'red',
          isVPPosition: false,
          fireDots: [],
        },
        // hex with INTENSE fire dot — highest priority
        {
          hexId: 'hex-a',
          terrain: 'beach',
          sector: 'east',
          isBeachBox: false,
          isGermanPosition: false,
          isVPPosition: false,
          fireDots: [{ positionId: 'hex-wn-red', intensity: 'intense' }],
        },
        // hex with INTENSE fire dot — also highest priority
        {
          hexId: 'hex-b',
          terrain: 'beach',
          sector: 'east',
          isBeachBox: false,
          isGermanPosition: false,
          isVPPosition: false,
          fireDots: [{ positionId: 'hex-wn-red', intensity: 'intense' }],
        },
        // hex with STEADY fire dot — lower priority
        {
          hexId: 'hex-c',
          terrain: 'pavilion',
          sector: 'east',
          isBeachBox: false,
          isGermanPosition: false,
          isVPPosition: false,
          fireDots: [{ positionId: 'hex-wn-red', intensity: 'steady' }],
        },
      ],
      units: [
        // Unit A — in hex-a (intense), target symbol ▲ (matches fire card)
        {
          kind: 'us',
          id: 'unit-a',
          type: 'infantry',
          steps: 3,
          targetSymbol: 'triangle',
          weapons: ['BZ'],
          attackStrength: 3,
          isDisrupted: false,
          hexId: 'hex-a',
        },
        // Unit B — in hex-b (intense), target symbol ● (does not match fire card, but still eligible)
        {
          kind: 'us',
          id: 'unit-b',
          type: 'infantry',
          steps: 3,
          targetSymbol: 'circle',
          weapons: ['BZ'],
          attackStrength: 3,
          isDisrupted: false,
          hexId: 'hex-b',
        },
        // Unit C — in hex-c (steady), target symbol ▲ (matches fire card)
        {
          kind: 'us',
          id: 'unit-c',
          type: 'infantry',
          steps: 2,
          targetSymbol: 'triangle',
          weapons: ['BZ'],
          attackStrength: 2,
          isDisrupted: false,
          hexId: 'hex-c',
        },
      ],
    },
    fireCard: {
      entries: [
        {
          color: 'red',
          symbol: 'single',
          hasArmorBonus: false,
          hasStar: false,
        },
      ],
      targetSymbol: 'triangle',
    },
    // Correct: unit-a (intense hex, priority 1) and unit-b (also intense hex, priority 1).
    // unit-c is in a steady hex (priority 2) but the hit limit is 2 and both intense
    // hexes each have 1 unit, so both intense-hex units are hit first.
    // Hit limit = 2 (1 unit + 1 depth marker per §6.31).
    correctAnswer: 'unit-a,unit-b',
    ruleRefs: [
      {
        section: '6.3',
        note: 'Resolución de fuego alemán: target symbol y condiciones de impacto',
      },
      {
        section: '6.31',
        note: 'Límite de 2 impactos (1 unidad + 1 depth marker); prioridad: intenso > sostenido',
      },
    ],
    explanationEs:
      'El WN rojo tiene 1 unidad + 1 depth marker, por lo que puede alcanzar hasta 2 unidades (§6.31). La prioridad es primero los hexes con fuego intenso (§6.31 Prioridad 1): hex-a (unidad-A ▲) y hex-b (unidad-B ●) ambos tienen fuego intenso. Como hay exactamente 2 unidades en hexes de fuego intenso y el límite es 2, ambas son alcanzadas. La unidad-C en el hex de fuego sostenido (hex-c) no es alcanzada porque el límite ya fue alcanzado. Nota: aunque la fire card muestra target symbol ▲, las unidades con otros símbolos en hexes de alta intensidad también pueden ser alcanzadas según la German Fire Chart.',
  },
];

/**
 * Module 4 review quiz — 3 items covering fire resolution (§6.3).
 *
 * Questions test understanding of the complete resolution procedure:
 * - Eligibility conditions
 * - Chart lookup inputs (procedure, NOT reproduced values)
 * - Hit limits and disruption distinction
 */
export const MODULE_4_QUIZ: QuizItem[] = [
  // ---- Quiz 4-1: Condición de elegibilidad para disparar (§6.3) ----
  {
    id: 'quiz-4-1',
    moduleId: 'module-4',
    type: 'multiple-choice',
    questionEs:
      'La fire card muestra la posición MORADA con símbolo doble. El WN morado tiene una unidad revelada en un hex y un depth marker en el otro hex del mismo WN de dos hexes. ¿Dispara el WN morado?',
    choices: [
      {
        id: 'a',
        labelEs: 'Sí, porque en un WN de dos hexes basta con que al menos una unidad tenga depth marker para activar el símbolo doble.',
        isCorrect: true,
      },
      {
        id: 'b',
        labelEs: 'No, porque el depth marker y la unidad deben estar en el mismo hex.',
        isCorrect: false,
      },
      {
        id: 'c',
        labelEs: 'Solo dispara el hex que tiene la unidad, no el que tiene el depth marker.',
        isCorrect: false,
      },
      {
        id: 'd',
        labelEs: 'No, porque la unidad está revelada y los WN revelados no pueden disparar.',
        isCorrect: false,
      },
    ],
    correctAnswer: 'a',
    ruleRefs: [
      { section: '6.3', note: 'WN de dos hexes: al menos una unidad con depth marker activa el símbolo doble' },
    ],
    explanationEs:
      'Según §6.3, en un WN de dos hexes, al menos una unidad de cualquiera de los dos hexes de la posición debe tener un depth marker para que el símbolo doble active su fuego. No es necesario que la unidad y el depth marker estén en el mismo hex; la posición cuenta como una única unidad a este efecto. Por tanto, el WN morado sí dispara.',
  },

  // ---- Quiz 4-2: Entradas para la German Fire Chart (§6.3 procedimiento) ----
  {
    id: 'quiz-4-2',
    moduleId: 'module-4',
    type: 'multiple-choice',
    questionEs:
      'Para consultar la German Fire Chart y resolver el impacto sobre una unidad de EE.UU., ¿qué dos factores determinan la fila y la columna de la tabla?',
    choices: [
      {
        id: 'a',
        labelEs: 'La fuerza de ataque de la unidad de EE.UU. (fila) y el color de la posición (columna).',
        isCorrect: false,
      },
      {
        id: 'b',
        labelEs: 'El tipo de fire dot en el hex (fila: intenso, sostenido o esporádico) y el tipo de posición que dispara (columna: WN/refuerzo revelado vs. refuerzo no revelado).',
        isCorrect: true,
      },
      {
        id: 'c',
        labelEs: 'El target symbol de la unidad de EE.UU. (fila) y el calibre de artillería alemana (columna).',
        isCorrect: false,
      },
      {
        id: 'd',
        labelEs: 'El turno de juego (fila) y la intensidad del fire dot (columna).',
        isCorrect: false,
      },
    ],
    correctAnswer: 'b',
    ruleRefs: [
      { section: '6.3', note: 'Fila = tipo de fire dot; columna = tipo de posición alemana' },
    ],
    explanationEs:
      'Según §6.3, para consultar la German Fire Chart: la fila se determina por el tipo de fire dot proyectado en el hex (intenso, sostenido o esporádico), y la columna por el tipo de posición alemana que dispara (WN o refuerzo revelado, o refuerzo no revelado). El resultado del recuadro determina si las unidades de EE.UU. pierden escalones y/o reciben disrupción según su target symbol y tipo (blindada o no).',
  },

  // ---- Quiz 4-3: Distinción pérdida de escalón vs disrupción ----
  {
    id: 'quiz-4-3',
    moduleId: 'module-4',
    type: 'multiple-choice',
    questionEs:
      'Una unidad de EE.UU. con 2 escalones está disrupta. En esta misma Fase de Fuego Alemán, otra posición alemana la alcanza con un resultado de "pérdida de escalón". ¿Qué ocurre?',
    choices: [
      {
        id: 'a',
        labelEs: 'La unidad pierde un escalón adicional (queda con 1 escalón) y sigue disrupta.',
        isCorrect: true,
      },
      {
        id: 'b',
        labelEs: 'La unidad no puede perder más escalones porque ya está disrupta.',
        isCorrect: false,
      },
      {
        id: 'c',
        labelEs: 'La unidad es eliminada directamente porque la disrupción la hace más vulnerable.',
        isCorrect: false,
      },
      {
        id: 'd',
        labelEs: 'El resultado de disrupción y el de pérdida de escalón se cancelan mutuamente.',
        isCorrect: false,
      },
    ],
    correctAnswer: 'a',
    ruleRefs: [
      { section: '6.33', note: 'Disrupción y pérdida de escalón son independientes; una unidad ya disrupta no recibe más disrupción pero sí puede perder escalones' },
      { section: '6.34', note: 'Límite: máximo 1 escalón por unidad por fase de fuego' },
    ],
    explanationEs:
      'Según §6.33, una unidad ya disrupta que recibe otro resultado de disrupción no se ve más afectada por ese resultado de disrupción. Sin embargo, la disrupción y la pérdida de escalón son efectos independientes (§6.33): una unidad puede ser disrupta por una posición y perder un escalón por otra en la misma Fase de Fuego. La unidad con 2 escalones pierde uno (queda con 1 escalón) y sigue teniendo el marcador de disrupción. Límite (§6.34): no puede perder más de un escalón en la misma fase de fuego.',
  },
];
