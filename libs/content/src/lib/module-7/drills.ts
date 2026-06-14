import type { DrillScenario, QuizItem } from 'content-schema';

/**
 * Module 7 drills — 2 multiple-choice drills + quiz.
 *
 * Drill 7-1 (multiple-choice): German communication trace (§12.2, bocage exception)
 * Drill 7-2 (multiple-choice): VP control conditions (§13.22)
 *
 * All rules verified against rules-text.txt lines 1764–1965.
 */
export const MODULE_7_DRILLS: DrillScenario[] = [
  // ---- Drill 7-1: German communication trace (§12.2, bocage exception) ----
  {
    id: 'drill-7-1',
    moduleId: 'module-7',
    type: 'multiple-choice',
    questionEs:
      'Una unidad de refuerzo alemán ocupa una posición de refuerzo (hex R-1). El único camino hacia un hex de salida pasa por hex-B1 (bocage, controlado pero NO ocupado por EE.UU.) y luego por hex-B2 (bocage, controlado pero NO ocupado por EE.UU.). No hay ningún otro camino disponible. Según §12.2 y §12.23, ¿está esta posición alemana en comunicación?',
    choices: [
      {
        id: 'a',
        labelEs: 'Sí, porque la excepción de bocage permite trazar comunicación a través de hexes de bocage controlados por EE.UU.',
        isCorrect: false,
      },
      {
        id: 'b',
        labelEs: 'No, porque la excepción de bocage solo permite atravesar UN hex de bocage controlado. El camino requiere pasar por DOS hexes de bocage controlados por EE.UU.',
        isCorrect: true,
      },
      {
        id: 'c',
        labelEs: 'Sí, siempre que los hexes de bocage no estén ocupados por unidades de EE.UU.',
        isCorrect: false,
      },
      {
        id: 'd',
        labelEs: 'No, porque la excepción de bocage solo aplica a unidades WN, no a refuerzos.',
        isCorrect: false,
      },
    ],
    correctAnswer: 'b',
    ruleRefs: [
      { section: '12.23', note: 'Excepción de bocage: solo un hex de bocage controlado (no ocupado); comunicación posterior normal' },
      { section: '12.2', note: 'Comunicación alemana: no puede pasar por hexes controlados por EE.UU. salvo excepción bocage' },
    ],
    explanationEs:
      'Según §12.23, la excepción de bocage permite a una posición de refuerzo ocupada trazar comunicación a través de UN ÚNICO hex de bocage adyacente a la posición que esté controlado (pero no ocupado) por EE.UU. Tras ese primer hex de bocage, la comunicación debe trazarse normalmente. En este escenario, el camino requiere pasar por DOS hexes de bocage controlados (B1 y B2). El primero (B1) puede usarse con la excepción, pero B2 es un segundo hex de bocage controlado y la excepción no cubre ese caso. Por tanto, la posición NO está en comunicación.',
  },

  // ---- Drill 7-2: VP control conditions (§13.22) ----
  {
    id: 'drill-7-2',
    moduleId: 'module-7',
    type: 'multiple-choice',
    questionEs:
      'Al final del turno 16, compruebas si el hex VP-1 (una posición de refuerzo alemana) vale 1 VP. El hex VP-1 está ocupado por una unidad de infantería de EE.UU. (2 escalones), está en comunicación de EE.UU. (puede trazar camino a la playa), y ESTÁ en el campo de fuego de una posición alemana DISRUPTA. ¿Vale VP-1 un punto de victoria?',
    choices: [
      {
        id: 'a',
        labelEs: 'Sí, porque las posiciones disruptas no tienen campo de fuego activo.',
        isCorrect: false,
      },
      {
        id: 'b',
        labelEs: 'No, porque §13.22 exige que el hex NO esté en el campo de fuego de ninguna unidad alemana, incluyendo las disruptas.',
        isCorrect: true,
      },
      {
        id: 'c',
        labelEs: 'Sí, porque el hex está ocupado por una unidad de EE.UU. y en comunicación.',
        isCorrect: false,
      },
      {
        id: 'd',
        labelEs: 'Depende: vale VP solo si la unidad de EE.UU. no está disrupta.',
        isCorrect: false,
      },
    ],
    correctAnswer: 'b',
    ruleRefs: [
      { section: '13.22', note: 'VP: ocupado/controlado + comunicación EE.UU. + NO en campo de fuego alemán, incluyendo unidades disruptas' },
    ],
    explanationEs:
      'Según §13.22, para que un hex valga VP debe cumplir tres condiciones simultáneamente: (1) ocupado o controlado por EE.UU., (2) en comunicación de EE.UU., Y (3) NO en el campo de fuego de ninguna unidad alemana. El §13.22 aclara explícitamente que esto incluye a las unidades alemanas disruptas. Aunque la posición disruptas no dispara durante la Fase de Fuego Alemán, su campo de fuego sigue existiendo a efectos de VP. Por tanto, el hex VP-1 NO vale un punto de victoria este turno.',
  },
];

/**
 * Module 7 review quiz — 4 items.
 * Covers §11 (Leaders), §12 (Control & Communication), §13 (Victory).
 */
export const MODULE_7_QUIZ: QuizItem[] = [
  // ---- Quiz 7-1: Héroe vs. Inspirado ----
  {
    id: 'quiz-7-1',
    moduleId: 'module-7',
    type: 'multiple-choice',
    questionEs:
      'Tu unidad de infantería tiene un marcador de Héroe. Durante la Fase de Fuego Alemán, una posición con estrella impacta a tu Héroe. ¿Qué ocurre?',
    choices: [
      { id: 'a', labelEs: 'La unidad de infantería pierde un escalón y el Héroe desaparece del juego.', isCorrect: false },
      { id: 'b', labelEs: 'El Héroe muere: se gira el marcador al lado "Inspirado". La unidad mantiene la acción gratuita pero pierde el comodín de ataque.', isCorrect: true },
      { id: 'c', labelEs: 'El Héroe absorbe el impacto y permanece activo, pero la unidad queda disrupta.', isCorrect: false },
      { id: 'd', labelEs: 'El marcador "Inspirado" es eliminado del juego si el Héroe ya estaba inspirado.', isCorrect: false },
    ],
    correctAnswer: 'b',
    ruleRefs: [
      { section: '11.4', note: 'Fuego alemán con estrella: Héroe muere → gira al lado Inspirado' },
      { section: '11.15', note: 'Inspirado: mantiene acción gratuita pero sin comodín de ataque' },
    ],
    explanationEs:
      'Según §11.4, cuando el fuego alemán con estrella alcanza a un Héroe, el Héroe es matado: se gira su marcador al lado "Inspirado". Según §11.15, la unidad con Inspirado sigue teniendo acción gratuita en cada Fase de Acción, pero ya no recibe el beneficio del comodín de ataque (§8.23). La unidad de infantería en sí no pierde escalones por esto.',
  },

  // ---- Quiz 7-2: Pérdida catastrófica ----
  {
    id: 'quiz-7-2',
    moduleId: 'module-7',
    type: 'multiple-choice',
    questionEs:
      'La 29.ª División tiene 7 fichas de infantería regular en la Infantry Loss Box. Una unidad de infantería ranger de la 29.ª División es eliminada. ¿Se produce pérdida catastrófica?',
    choices: [
      { id: 'a', labelEs: 'Sí, porque la división ya tiene 7 pérdidas y cualquier eliminación adicional activa la pérdida catastrófica.', isCorrect: false },
      { id: 'b', labelEs: 'No, porque los rangers eliminados no van a la Infantry Loss Box y no cuentan para la pérdida catastrófica.', isCorrect: true },
      { id: 'c', labelEs: 'Sí, si la unidad ranger era de fuerza completa al ser eliminada.', isCorrect: false },
      { id: 'd', labelEs: 'Depende: los rangers cuentan solo si fueron el primer escalón en ser eliminado.', isCorrect: false },
    ],
    correctAnswer: 'b',
    ruleRefs: [{ section: '13.11', note: 'Rangers eliminados y no-infantería: no van a la Loss Box, no cuentan para pérdida catastrófica' }],
    explanationEs:
      'Según §13.11, las unidades de infantería ranger eliminadas NO se colocan en la Infantry Loss Box y NO cuentan para la pérdida catastrófica. Solo las unidades de infantería regular (no ranger) que son reducidas al segundo escalón (o eliminadas directamente) se colocan en la Loss Box. La 29.ª División permanece en 7 fichas; no hay pérdida catastrófica.',
  },

  // ---- Quiz 7-3: Condición de control de VP ----
  {
    id: 'quiz-7-3',
    moduleId: 'module-7',
    type: 'multiple-choice',
    questionEs:
      '¿Cuáles son las condiciones que debe cumplir un hex para contar como VP al final del turno 16?',
    choices: [
      {
        id: 'a',
        labelEs: 'Que esté ocupado por una unidad de EE.UU., en comunicación de EE.UU. y fuera del campo de fuego alemán (incluyendo disruptos).',
        isCorrect: true,
      },
      {
        id: 'b',
        labelEs: 'Que esté ocupado por una unidad de EE.UU. y en comunicación de EE.UU., independientemente del campo de fuego alemán.',
        isCorrect: false,
      },
      {
        id: 'c',
        labelEs: 'Que no esté en comunicación alemana y esté en comunicación de EE.UU.',
        isCorrect: false,
      },
      {
        id: 'd',
        labelEs: 'Que esté controlado por una unidad de infantería de EE.UU. de fuerza completa.',
        isCorrect: false,
      },
    ],
    correctAnswer: 'a',
    ruleRefs: [{ section: '13.22', note: 'Control VP: ocupado/controlado + comunicación EE.UU. + NO en campo de fuego alemán (disruptos incluidos)' }],
    explanationEs:
      'Según §13.22, un hex cuenta para VP si: (1) está ocupado o controlado por una unidad de EE.UU. (basta con control, no requiere ocupación directa), (2) está en comunicación de EE.UU. (puede trazarse camino a la playa sin pasar por campo de fuego alemán ni rough), Y (3) no está en el campo de fuego de ninguna unidad alemana, incluyendo a las unidades disruptas. Hay una condición alternativa para hexes detrás de líneas seguras (§13.22 segunda parte).',
  },

  // ---- Quiz 7-4: Restricción de control playa → terreno alto ----
  {
    id: 'quiz-7-4',
    moduleId: 'module-7',
    type: 'multiple-choice',
    questionEs:
      'Una unidad de infantería de EE.UU. con dos escalones ocupa un hex de playa. ¿Controla también los hexes de terreno alto adyacentes a ese hex de playa?',
    choices: [
      { id: 'a', labelEs: 'Sí, porque la infantería de dos escalones controla el hex propio y todos los adyacentes.', isCorrect: false },
      { id: 'b', labelEs: 'No, porque §12.11 dice que las unidades en hex de playa no controlan hexes adyacentes en el terreno alto.', isCorrect: true },
      { id: 'c', labelEs: 'Sí, pero solo los hexes directamente al norte (inland).', isCorrect: false },
      { id: 'd', labelEs: 'Depende del número de escalones: solo si tiene tres escalones controla el terreno alto adyacente.', isCorrect: false },
    ],
    correctAnswer: 'b',
    ruleRefs: [
      { section: '12.1', note: 'Infantería 2–3 escalones: controla hex propio y adyacentes' },
      { section: '12.11', note: 'Excepción: en playa/pabellón/draw, NO controla hexes adyacentes en terreno alto' },
    ],
    explanationEs:
      'Aunque la infantería con dos escalones generalmente controla su propio hex y los adyacentes (§12.1), la regla §12.11 establece una excepción importante: una unidad en un hex de playa, pabellón o draw NO controla los hexes adyacentes en el terreno alto. Esta asimetría refleja la dificultad de proyectar fuerza desde la playa hacia el terreno elevado. Sin embargo, la regla inversa no aplica: una unidad en terreno alto que pueda controlar hexes adyacentes SÍ controla los hexes de playa, pabellón y draw adyacentes.',
  },
];
