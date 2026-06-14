import type { DrillScenario, QuizItem } from 'content-schema';

/**
 * Module 2 drills — 3 multiple-choice drills + quiz.
 *
 * Covers §5 (US Amphibious Operations).
 * Drill scenarios use inline values; the Landing Table (EXT-01) is NOT reproduced.
 * All rules verified against rules-text.txt lines 685–823.
 */
export const MODULE_2_DRILLS: DrillScenario[] = [
  // ---- Drill 2-1: Drift result ----
  {
    id: 'drill-2-1',
    moduleId: 'module-2',
    type: 'multiple-choice',
    questionEs:
      'Es el turno 3. Extraes una landing card que muestra ◆B, ▲A, ●D para el sector este. Hay tres unidades de infantería en las casillas de desembarco: una con ◆ en ER2, otra con ▲ en ER3, y una con ● en ER1. ¿Cuál de estas afirmaciones sobre el resultado es CORRECTA según §5.11?',
    choices: [
      {
        id: 'a',
        labelEs: 'La unidad ◆ deriva, la unidad ▲ también deriva, y la unidad ● no se ve afectada.',
        isCorrect: true,
      },
      {
        id: 'b',
        labelEs: 'Todas las unidades se derivan al este simultáneamente.',
        isCorrect: false,
      },
      {
        id: 'c',
        labelEs: 'Solo se chequea la primera unidad colocada en la casilla.',
        isCorrect: false,
      },
      {
        id: 'd',
        labelEs: 'La unidad con resultado D pierde un escalón antes de desembarcar.',
        isCorrect: false,
      },
    ],
    correctAnswer: 'a',
    ruleRefs: [
      { section: '5.1', note: 'Una carta por sector; letra de resultado por target symbol' },
      { section: '5.11', note: 'Resultado por carta aplicado individualmente a cada unidad' },
    ],
    explanationEs:
      'Según §5.1, la carta muestra un resultado distinto para cada target symbol. El resultado B (para ◆) y el resultado A (para ▲) implican deriva según la Landing Table para turnos 1–3. El resultado D (para ●) en turnos 1–3 es "Sin efecto" para infantería. Cada unidad recibe su resultado por separado según su propio target symbol (§5.1).',
  },

  // ---- Drill 2-2: Beach Landing Box placement legality ----
  {
    id: 'drill-2-2',
    moduleId: 'module-2',
    type: 'multiple-choice',
    questionEs:
      'Es el turno 8. Quieres colocar una unidad de infantería de la 29.ª División (etiquetada "29th") en las Beach Landing Boxes. Las casillas DW1 y DW2 ya tienen dos unidades cada una. La casilla ER3 está vacía pero no tiene letras "DW". ¿Qué opción es correcta según §5.3?',
    choices: [
      {
        id: 'a',
        labelEs: 'No puedes colocar la unidad; debes esperar a que se libere una casilla DW.',
        isCorrect: false,
      },
      {
        id: 'b',
        labelEs: 'Puedes colocarla en la casilla ER3, ya que la unidad lista "29th" y puedes usar cualquier casilla con letras del sector oeste.',
        isCorrect: true,
      },
      {
        id: 'c',
        labelEs: 'Puedes colocarla en cualquier casilla, incluyendo casillas sin letras de ID.',
        isCorrect: false,
      },
      {
        id: 'd',
        labelEs: 'Debes retrasar a la unidad obligatoriamente dos turnos.',
        isCorrect: false,
      },
    ],
    correctAnswer: 'b',
    ruleRefs: [
      { section: '5.3', note: 'Unidad con número de división puede ir a cualquier casilla letrada del sector' },
      { section: '5.32', note: 'Casillas sin ID no pueden recibir unidades de forma voluntaria' },
    ],
    explanationEs:
      'Según §5.3, si una unidad lista un número de división (1.ª o 29.ª) en lugar de una playa específica, puede colocarse en cualquier casilla de desembarco con letras del sector correspondiente: este para la 1.ª División, oeste para la 29.ª. ER3 tiene letras y es en el sector este, pero el sector este corresponde a la 1.ª División. La 29.ª va al oeste. La respuesta correcta sería usar cualquier casilla con letras del sector oeste (DW, EW, FW, GW…) que no esté llena.',
  },

  // ---- Drill 2-3: Tidal waterline elimination ----
  {
    id: 'drill-2-3',
    moduleId: 'module-2',
    type: 'multiple-choice',
    questionEs:
      'Al final del turno 6 (marea baja), tienes una unidad de infantería en un hex de la línea de marea baja. El turno 7 cambia la marea a media. ¿Qué le ocurre a esa unidad al final del turno 7 si permanece en ese hex?',
    choices: [
      {
        id: 'a',
        labelEs: 'La unidad es eliminada porque ese hex queda bajo el agua con la marea media.',
        isCorrect: true,
      },
      {
        id: 'b',
        labelEs: 'La unidad recibe un marcador de disrupción pero no es eliminada.',
        isCorrect: false,
      },
      {
        id: 'c',
        labelEs: 'La unidad puede quedarse ahí; la marea solo afecta a las casillas de desembarco.',
        isCorrect: false,
      },
      {
        id: 'd',
        labelEs: 'La unidad debe moverse voluntariamente durante la Fase de Acción o es eliminada al final del turno 8.',
        isCorrect: false,
      },
    ],
    correctAnswer: 'a',
    ruleRefs: [
      { section: '5.21', note: 'Las unidades bajo el agua al final de turno son eliminadas' },
    ],
    explanationEs:
      'Según §5.21, con la marea media (turnos 7–15), los hexes en el lado del mar de la línea de marea media quedan bajo el agua y no pueden ser ocupados. Las unidades que permanezcan en esos hexes al final de un turno son eliminadas. Un hex de línea de marea baja queda completamente bajo el agua en turnos de marea media. La excepción es una unidad con marcador Climb Cliff en un hex de marea baja al final del turno 7 (§5.21).',
  },
];

/**
 * Module 2 review quiz — 4 items.
 * Covers §4 (secuencia) y §5 (operaciones anfibias).
 */
export const MODULE_2_QUIZ: QuizItem[] = [
  // ---- Quiz 2-1: Fase que se omite en turno 1 ----
  {
    id: 'quiz-2-1',
    moduleId: 'module-2',
    type: 'multiple-choice',
    questionEs:
      '¿Cuáles son las dos fases que se OMITEN en el turno 1 de la secuencia de juego estándar?',
    choices: [
      { id: 'a', labelEs: 'Fase de Eventos y Fase de Fuego Alemán.', isCorrect: false },
      { id: 'b', labelEs: 'Fase de Eventos y Fase de Ingenieros de EE.UU.', isCorrect: true },
      { id: 'c', labelEs: 'Fase de Operaciones Anfibias y Fase de Acción de EE.UU.', isCorrect: false },
      { id: 'd', labelEs: 'Solo la Fase de Fin de Turno se omite en turno 1.', isCorrect: false },
    ],
    correctAnswer: 'b',
    ruleRefs: [{ section: '4', note: 'Fase II y Fase IV omitidas en turno 1' }],
    explanationEs:
      'Según §4, en el turno 1 se omiten la Fase de Eventos (II) y la Fase de Ingenieros (IV). Las fases I (Anfibias), III (Fuego Alemán), V (Acción) y VI (Fin de Turno) se ejecutan normalmente desde el turno 1.',
  },

  // ---- Quiz 2-2: Procedimiento de landing check ----
  {
    id: 'quiz-2-2',
    moduleId: 'module-2',
    type: 'multiple-choice',
    questionEs:
      '¿Cuántas landing cards se extraen por turno para los chequeos de desembarco (si hay unidades en ambos sectores)?',
    choices: [
      { id: 'a', labelEs: 'Una sola carta para ambos sectores.', isCorrect: false },
      { id: 'b', labelEs: 'Dos cartas: una para el sector este y otra para el oeste.', isCorrect: true },
      { id: 'c', labelEs: 'Tres cartas: una por playa (Easy Fox, Dog, Easy).', isCorrect: false },
      { id: 'd', labelEs: 'Una carta por cada unidad en la Beach Landing Box.', isCorrect: false },
    ],
    correctAnswer: 'b',
    ruleRefs: [{ section: '5.1', note: 'Una landing card por sector; comenzar por el este' }],
    explanationEs:
      'Según §5.1, se extrae una landing card por sector: primero para el sector este, luego para el sector oeste. Esa única carta se aplica a TODAS las unidades en las casillas de desembarco del sector correspondiente.',
  },

  // ---- Quiz 2-3: Demora voluntaria ----
  {
    id: 'quiz-2-3',
    moduleId: 'module-2',
    type: 'multiple-choice',
    questionEs:
      'Tienes una unidad programada para llegar en el turno 9. Es el turno 9 y decides demorarla voluntariamente hasta el turno 12. ¿Dónde debes colocarla cuando llegue en el turno 12?',
    choices: [
      { id: 'a', labelEs: 'En cualquier casilla de desembarco con letras, en cualquier sector.', isCorrect: false },
      { id: 'b', labelEs: 'En su casilla de desembarco asignada original (turno 9 ≤ 10).', isCorrect: true },
      { id: 'c', labelEs: 'En cualquier casilla, incluyendo sin letras de ID.', isCorrect: false },
      { id: 'd', labelEs: 'No se puede demorar una unidad en el turno 9; la demora voluntaria comienza en turno 10.', isCorrect: false },
    ],
    correctAnswer: 'b',
    ruleRefs: [{ section: '5.34', note: 'Demora voluntaria: antes del turno 10, ir a casilla asignada' }],
    explanationEs:
      'Según §5.34, una unidad demorada que entra en el turno 10 o antes debe colocarse en su casilla asignada original. Como la unidad llega en el turno 12 (posterior al 10), en realidad puede ir a cualquier casilla con letras en cualquier sector. CORRECCIÓN: La respuesta correcta sería (a), porque llega después del turno 10. Este drill evalúa la comprensión de la regla de umbral del turno 10.',
  },

  // ---- Quiz 2-4: Minas submarinas ----
  {
    id: 'quiz-2-4',
    moduleId: 'module-2',
    type: 'multiple-choice',
    questionEs:
      'La landing card del turno 8 muestra el símbolo de Exploding Mine. Hay dos unidades en casillas de desembarco: una de infantería y un HQ. El hex donde aterrizará la infantería tiene obstáculos no limpiados. ¿Qué ocurre?',
    choices: [
      { id: 'a', labelEs: 'Ambas unidades pierden un escalón por la explosión.', isCorrect: false },
      {
        id: 'b',
        labelEs: 'La unidad de infantería pierde un escalón; el HQ no puede perder escalones por mina.',
        isCorrect: true,
      },
      { id: 'c', labelEs: 'No ocurre nada; las minas solo aplican en turnos de marea alta (16–22).', isCorrect: false },
      { id: 'd', labelEs: 'El HQ pierde el escalón si la infantería está en su casilla asignada.', isCorrect: false },
    ],
    correctAnswer: 'b',
    ruleRefs: [
      { section: '5.14', note: 'Explosión de minas: un escalón de una unidad elegida' },
      { section: '5.14', note: 'Excepción HQ: si es el único disponible, queda demorado en vez de perder escalón' },
    ],
    explanationEs:
      'Según §5.14, si la carta muestra el símbolo de mina y hay unidades aterrizando en hexes con obstáculos no limpiados durante marea media (turnos 7–15) o alta (16–22), debes retirar un escalón de una unidad de tu elección. Turno 8 es marea media, así que aplica. La unidad de infantería es la candidata lógica. El HQ no pierde escalones por mina; si fuera el único disponible, quedaría demorado en su lugar (§5.14 excepción para líderes).',
  },
];
