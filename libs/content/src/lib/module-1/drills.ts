import type { DrillScenario, QuizItem } from 'content-schema';

/**
 * Module 1 drills — 3 drills exercising component recognition.
 *
 * All drills use multiple-choice (REQ-M1-03).
 * Rule citations verified against rules-text.txt.
 */
export const MODULE_1_DRILLS: DrillScenario[] = [
  // ---- Drill 1: Reading the target symbol ----
  {
    id: 'drill-1-1',
    moduleId: 'module-1',
    type: 'multiple-choice',
    questionEs:
      'Una ficha de infantería de EE.UU. tiene un símbolo de objetivo negro (●). ¿Qué significa esto para el control de hexes?',
    choices: [
      {
        id: 'a',
        labelEs: 'La unidad solo controla el hex que ocupa.',
        isCorrect: false,
      },
      {
        id: 'b',
        labelEs: 'La unidad puede controlar los hexes adyacentes.',
        isCorrect: true,
      },
      {
        id: 'c',
        labelEs: 'La unidad no puede controlar ningún hex.',
        isCorrect: false,
      },
      {
        id: 'd',
        labelEs: 'El símbolo negro indica que la unidad es de blindados.',
        isCorrect: false,
      },
    ],
    correctAnswer: 'b',
    ruleRefs: [
      {
        section: '2.21',
        note: 'Símbolo negro = controla hexes adyacentes; símbolo blanco = solo su propio hex',
      },
    ],
    explanationEs:
      'Según §2.21, un símbolo de objetivo negro (●, ◆ o ▲ negro) indica que la unidad puede controlar los hexes adyacentes. Un símbolo blanco solo controla el hex que ocupa la unidad. Esta distinción es importante para determinar el control de terreno (sección 12.1).',
  },

  // ---- Drill 2: Reading fire card symbols ----
  {
    id: 'drill-1-2',
    moduleId: 'module-1',
    type: 'multiple-choice',
    questionEs:
      'En una "fire card", la posición de color rojo aparece con un símbolo simple (no doble). ¿Qué condición debe cumplirse para que la posición roja dispare?',
    choices: [
      {
        id: 'a',
        labelEs: 'La posición debe estar ocupada por una unidad Y un marcador de profundidad.',
        isCorrect: false,
      },
      {
        id: 'b',
        labelEs:
          'La posición debe estar ocupada por cualquier unidad alemana, con o sin marcador de profundidad.',
        isCorrect: true,
      },
      {
        id: 'c',
        labelEs: 'La posición siempre dispara, esté ocupada o no.',
        isCorrect: false,
      },
      {
        id: 'd',
        labelEs: 'La posición solo dispara si la unidad es de tipo WN.',
        isCorrect: false,
      },
    ],
    correctAnswer: 'b',
    ruleRefs: [
      {
        section: '6.1',
        note: 'Símbolo simple = cualquier unidad; símbolo doble = unidad + depth marker',
      },
      {
        section: '6.3',
        note: 'Condiciones de disparo según tipo de símbolo en la fire card',
      },
    ],
    explanationEs:
      'Según §6.1, un símbolo simple en la "fire card" indica que las posiciones de ese color disparan si están ocupadas por cualquier unidad alemana, con o sin marcador de profundidad. Un símbolo doble (cuadrado doble) significa que la posición solo dispara si tiene tanto una unidad como un marcador de profundidad. Esta distinción determina la eficacia del sistema defensivo alemán en cada turno.',
  },

  // ---- Drill 3: Reading a US counter's steps ----
  {
    id: 'drill-1-3',
    moduleId: 'module-1',
    type: 'multiple-choice',
    questionEs:
      'Una compañía de infantería estándar de EE.UU. comienza la partida con cierto número de escalones (steps). ¿Con cuántos escalones empieza?',
    choices: [
      {
        id: 'a',
        labelEs: '1 escalón',
        isCorrect: false,
      },
      {
        id: 'b',
        labelEs: '2 escalones',
        isCorrect: false,
      },
      {
        id: 'c',
        labelEs: '3 escalones',
        isCorrect: true,
      },
      {
        id: 'd',
        labelEs: '4 escalones',
        isCorrect: false,
      },
    ],
    correctAnswer: 'c',
    ruleRefs: [
      {
        section: '2.21',
        note: 'Las compañías de infantería regular comienzan con 3 escalones; los batallones de artillería con 4; el resto con 1 o 2',
      },
    ],
    explanationEs:
      'Según §2.21, las compañías de infantería regular comienzan con 3 escalones, representados por dos fichas: una con dos caras impresas y una de reemplazo. Los batallones de artillería comienzan con 4 escalones, mientras que la mayoría de las demás formaciones comienzan con solo 1 o 2. Los escalones reflejan la potencia de combate de la unidad; cada pérdida reduce su efectividad.',
  },
];

/**
 * Module 1 review quiz — 5 items.
 *
 * Covers §1 (introducción), §2.1 (mapa), §2.21 (fichas de EE.UU.),
 * §2.3 (cartas) y §3 (preparación).
 */
export const MODULE_1_QUIZ: QuizItem[] = [
  // ---- Quiz 1: Juego solitario ----
  {
    id: 'quiz-1-1',
    moduleId: 'module-1',
    type: 'multiple-choice',
    questionEs: '¿Qué fuerzas controla el jugador en D-Day at Omaha Beach?',
    choices: [
      { id: 'a', labelEs: 'Las fuerzas alemanas', isCorrect: false },
      { id: 'b', labelEs: 'Las fuerzas de EE.UU.', isCorrect: true },
      { id: 'c', labelEs: 'Ambas fuerzas simultáneamente', isCorrect: false },
      { id: 'd', labelEs: 'Ninguna; el sistema controla todo', isCorrect: false },
    ],
    correctAnswer: 'b',
    ruleRefs: [{ section: '1', note: 'El jugador controla las fuerzas de EE.UU.' }],
    explanationEs:
      'Según §1, el jugador controla las fuerzas de EE.UU. que asaltan la playa. El sistema de juego controla las fuerzas alemanas de forma automática a través de las cartas de fuego.',
  },

  // ---- Quiz 2: Propósito de las cartas ----
  {
    id: 'quiz-1-2',
    moduleId: 'module-1',
    type: 'multiple-choice',
    questionEs:
      '¿Cuántas secciones distintas tiene cada carta de la baraja y para qué sirve cada una?',
    choices: [
      {
        id: 'a',
        labelEs: 'Dos secciones: fuego alemán y eventos.',
        isCorrect: false,
      },
      {
        id: 'b',
        labelEs:
          'Tres secciones: resultados de desembarco, evento del turno y fuego alemán.',
        isCorrect: true,
      },
      {
        id: 'c',
        labelEs: 'Una sección: las cartas solo determinan el fuego alemán.',
        isCorrect: false,
      },
      {
        id: 'd',
        labelEs: 'Cuatro secciones: desembarco, evento, fuego y refuerzo.',
        isCorrect: false,
      },
    ],
    correctAnswer: 'b',
    ruleRefs: [{ section: '2.3', note: 'Tres secciones por carta' }],
    explanationEs:
      'Según §2.3, cada carta tiene tres secciones: resultados de desembarco (para chequeos de landing), evento del turno y sección de fuego alemán. En cada fase solo se usa una de las tres secciones.',
  },

  // ---- Quiz 3: Fire dots y campo de fuego ----
  {
    id: 'quiz-1-3',
    moduleId: 'module-1',
    type: 'multiple-choice',
    questionEs: '¿Qué son los "fire dots" (puntos de fuego) en el mapa?',
    choices: [
      {
        id: 'a',
        labelEs:
          'Marcadores colocados por el jugador para indicar unidades bajo fuego.',
        isCorrect: false,
      },
      {
        id: 'b',
        labelEs:
          'Símbolos impresos en el mapa que indican el "field of fire" de cada posición alemana.',
        isCorrect: true,
      },
      {
        id: 'c',
        labelEs: 'Indicadores del nivel de marea en la playa.',
        isCorrect: false,
      },
      {
        id: 'd',
        labelEs: 'El daño acumulado por una unidad de EE.UU.',
        isCorrect: false,
      },
    ],
    correctAnswer: 'b',
    ruleRefs: [
      {
        section: '2.1',
        note: 'Fire dots impresos en el mapa, del color de la posición alemana',
      },
      { section: '6.2', note: 'Campo de fuego definido por los fire dots' },
    ],
    explanationEs:
      'Según §2.1 y §6.2, los "fire dots" son símbolos impresos en el mapa del mismo color que la posición alemana de la que provienen. Todos los puntos de fuego de una posición conforman su "field of fire" (campo de fuego). Hay tres intensidades: intense (intenso), steady (sostenido) y sporadic (esporádico).',
  },

  // ---- Quiz 4: Depth marker ----
  {
    id: 'quiz-1-4',
    moduleId: 'module-1',
    type: 'multiple-choice',
    questionEs:
      'Un "depth marker" (marcador de profundidad) se coloca bajo una unidad alemana WN. ¿Qué representa?',
    choices: [
      {
        id: 'a',
        labelEs: 'Que la unidad ha sido dañada y tiene menos fuerza.',
        isCorrect: false,
      },
      {
        id: 'b',
        labelEs:
          'Que la formación está a plena potencia y completamente desplegada, añadiendo fuerza y atributos adicionales.',
        isCorrect: true,
      },
      {
        id: 'c',
        labelEs: 'Un marcador de control de hex para el sector correspondiente.',
        isCorrect: false,
      },
      {
        id: 'd',
        labelEs: 'El turno en que llegará la unidad al campo de batalla.',
        isCorrect: false,
      },
    ],
    correctAnswer: 'b',
    ruleRefs: [
      {
        section: '2.24',
        note: 'Depth marker = unidad a plena potencia y completamente desplegada',
      },
    ],
    explanationEs:
      'Según §2.24, una unidad con su "depth marker" representa una formación a plena fuerza y completamente desplegada. Cuando el marcador es revelado, su fuerza y atributos se añaden a la unidad. Sin marcador, la unidad está desgastada o no en posición óptima. Esto importa para la fire card: algunas posiciones solo disparan si tienen marcador de profundidad (símbolo doble).',
  },

  // ---- Quiz 5: Preparación aleatoria alemana ----
  {
    id: 'quiz-1-5',
    moduleId: 'module-1',
    type: 'multiple-choice',
    questionEs:
      '¿Por qué las fichas alemanas se distribuyen aleatoriamente durante la preparación?',
    choices: [
      {
        id: 'a',
        labelEs: 'Para simular error histórico de los diseñadores del juego.',
        isCorrect: false,
      },
      {
        id: 'b',
        labelEs:
          'Para crear situaciones variables y mantener la incertidumbre táctica en cada partida.',
        isCorrect: true,
      },
      {
        id: 'c',
        labelEs:
          'Porque el reglamento no permite colocar unidades en posiciones fijas.',
        isCorrect: false,
      },
      {
        id: 'd',
        labelEs:
          'Para que el jugador pueda elegir qué WN son más fuertes al principio.',
        isCorrect: false,
      },
    ],
    correctAnswer: 'b',
    ruleRefs: [
      {
        section: '3',
        note: 'Distribución aleatoria para variabilidad y tensión táctica',
      },
    ],
    explanationEs:
      'Según §3, la distribución aleatoria de unidades alemanas y marcadores de profundidad asegura que cada partida sea diferente. Esta mecánica simula la incertidumbre real del campo de batalla: las fuerzas aliadas no sabían exactamente dónde estaban los WN más fuertes ni cuáles tenían artillería pesada. Esta incertidumbre es central al diseño del juego.',
  },
];
