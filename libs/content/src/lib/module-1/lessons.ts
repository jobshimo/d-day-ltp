import type { Lesson } from 'content-schema';

/**
 * Module 1 — Lessons 1 through 3
 *
 * Content based on rules-text.txt sections 1 (Introduction), 2 (Game Components),
 * and 3 (Setting Up for Play).
 *
 * All prose is in neutral professional Spanish.
 * Rule terms from the English rulebook are kept in their original form,
 * routed through the terminology table when a Devir translation is confirmed.
 * Rule section references are included as rule-callout blocks.
 */

export const MODULE_1_LESSONS: Lesson[] = [
  // ------------------------------------------------------------------ Lesson 1
  {
    id: 'lesson-1-1',
    moduleId: 'module-1',
    order: 1,
    titleEs: 'Introducción: El desembarco en Omaha',
    blocks: [
      {
        type: 'prose',
        content:
          'D-Day at Omaha Beach es un juego solitario que simula las doce horas más cruciales del 6 de junio de 1944: el asalto anfibio de las fuerzas estadounidenses a las playas normandas en lo que pasaría a la historia como Omaha Beach. De las cinco playas asaltadas por los Aliados ese día, Omaha fue la más sangrienta y la más difícil de conquistar. Durante varias horas, el destino de la invasión permaneció en la balanza.',
        ruleRefs: [{ section: '1', note: 'Introducción al juego' }],
      },
      {
        type: 'prose',
        content:
          'En este juego, tú controlas las fuerzas estadounidenses que intentan establecer una cabeza de playa, mientras el sistema de juego dirige las fuerzas alemanas que se oponen a tu avance. No hay dados: las cartas determinan los resultados, lo que genera situaciones distintas en cada partida.',
        ruleRefs: [{ section: '1', note: 'Mecánica central: sin dados, cartas como aleatoriedad' }],
      },
      {
        type: 'rule-callout',
        content:
          'El juego es solitario: tú diriges las tropas de EE.UU. y el sistema de juego controla a los alemanes. También existe una variante para dos jugadores donde cada uno dirige una división.',
        ruleRefs: [{ section: '1' }],
      },
      {
        type: 'prose',
        content:
          'Históricamente, el plan de invasión aliado fracasó en gran medida: el apoyo de aviación y artillería naval fue insuficiente, los blindados anfibios se hundieron antes de llegar a la orilla. Sin embargo, el valor e iniciativa del soldado estadounidense logró establecer una cabeza de playa viable, a un coste terrible en vidas. El juego captura esta tensión: tus recursos son limitados, las bajas son costosas y las fuerzas alemanas responden de forma impredecible pero coherente.',
      },
      {
        type: 'rule-callout',
        content:
          '§1 — Escala de tiempo: cada turno (turnos 1–16) representa 15 minutos. A partir del turno 17, cada turno equivale a 30 minutos.',
        ruleRefs: [{ section: '1', note: 'Escala de turnos' }],
      },
    ],
  },

  // ------------------------------------------------------------------ Lesson 2
  {
    id: 'lesson-1-2',
    moduleId: 'module-1',
    order: 2,
    titleEs: 'Componentes del juego: el mapa, las fichas y las cartas',
    blocks: [
      {
        type: 'prose',
        content:
          'El juego incluye: un tablero montado de 22″ × 34″, 352 fichas troqueladas, una baraja de 55 cartas de eventos, tres cartas de referencia y un reglamento. No se usan dados en ningún momento.',
        ruleRefs: [{ section: '2', note: 'Lista de componentes' }],
      },
      {
        type: 'rule-callout',
        content:
          '§2.1 — El mapa representa los nueve kilómetros de la costa de Calvados donde ocurrió la batalla. Incluye la playa de marea, el "pavilion" (superficie dura justo encima de la playa), bluffs (acantilados), cuatro "draws" (valles que penetran los bluffs) y el terreno interior.',
        ruleRefs: [{ section: '2.1', note: 'Geografía del mapa' }],
      },
      {
        type: 'svg-snippet',
        content: 'assets/svg/map-terrain.svg',
        altText: 'Diagrama de terrenos del mapa: playa, pavilion, bluff, draw y bocage',
        ruleRefs: [{ section: '2.1' }],
      },
      {
        type: 'prose',
        content:
          'Las posiciones alemanas son fundamentales: cada hex con una posición contiene un Widerstandsnest (WN) o una posición de refuerzo, identificados por uno de seis colores. Ese color determina cuándo y cómo dispara cada posición durante la fase de fuego alemán. Los hexes que rodean a cada posición contienen "fire dots" (puntos de fuego) del mismo color, que conforman el "field of fire" (campo de fuego) de esa posición.',
        ruleRefs: [
          { section: '2.1', note: 'Posiciones alemanas y colores' },
          { section: '6.2', note: 'Campo de fuego definido en regla 6.2' },
        ],
      },
      {
        type: 'rule-callout',
        content:
          '§2.1 — Las casillas de desembarco (Beach Landing Boxes) son una fila de cajas frente a la playa donde se colocan las unidades de EE.UU. que están a punto de desembarcar. Cada caja apunta hacia un hex de playa específico.',
        ruleRefs: [{ section: '2.1', note: 'Beach Landing Boxes' }],
      },
      {
        type: 'prose',
        content:
          'Las fichas de EE.UU. representan compañías e batallones específicos. Cada ficha muestra: designación militar, tipo de unidad, número de escalones (steps), fuerza de ataque, armas, "target symbol" (símbolo de objetivo: círculo ●, diamante ◆ o triángulo ▲) y turno y casilla de llegada.',
        ruleRefs: [{ section: '2.21', note: 'Anatomía de las fichas de EE.UU.' }],
      },
      {
        type: 'counter',
        content: 'Anatomía de una ficha de infantería de EE.UU.',
        altText: 'Ficha de infantería A/116, 29.ª División: fuerza de ataque, escalones, símbolo de objetivo y armas',
        ruleRefs: [{ section: '2.21' }],
        counterConfig: {
          unit: {
            kind: 'us',
            id: 'A-116',
            type: 'infantry',
            steps: 3,
            targetSymbol: 'circle',
            weapons: ['BZ'],
            attackStrength: 3,
            reducedAttackStrength: 2,
            isDisrupted: false,
            hexId: null,
            designation: 'A/116',
            division: '29th',
            arrivalTurn: 3,
            beachLandingBox: 'DW1',
            unitFireDots: ['steady', 'sporadic'],
          },
          side: 'front',
          // size=720: annotated viewBox is "-95 -15 252 95" (width=252), wide enough
          // for the Spanish labels. scale = 720/252 ≈ 2.86 → counter body ≈171px,
          // label text ≈23px; height auto-follows the viewBox aspect.
          size: 720,
          annotated: true,
        },
      },
      {
        type: 'rule-callout',
        content:
          '§2.21 — El "target symbol" (símbolo de objetivo) es el selector que determina qué unidades de EE.UU. son alcanzadas por el fuego alemán o por eventos. Un símbolo negro significa que la unidad puede controlar hexes adyacentes; un símbolo blanco solo controla el hex que ocupa.',
        ruleRefs: [{ section: '2.21', note: 'Target symbol y control' }],
      },
      {
        type: 'prose',
        content:
          'Las fichas alemanas tienen dos caras: la cara no revelada (boca abajo) y la cara revelada. Los WN (Widerstandsnest) comienzan no revelados; solo se revelan cuando las fuerzas de EE.UU. los atacan. Un WN puede tener un "depth marker" (marcador de profundidad) bajo su ficha, que representa mayor fortaleza y despliegue completo.',
        ruleRefs: [
          { section: '2.22', note: 'Fichas alemanas' },
          { section: '2.24', note: 'Depth markers' },
        ],
      },
      {
        type: 'prose',
        content:
          'La baraja de 55 cartas es el corazón del sistema. Cada carta tiene tres secciones independientes: resultados de desembarco, evento del turno y sección de fuego alemán. En cada fase solo se usa una de las tres secciones.',
        ruleRefs: [{ section: '2.3', note: 'Las cartas y sus tres secciones' }],
      },
      {
        type: 'svg-snippet',
        content: 'assets/svg/card-anatomy.svg',
        altText: 'Anatomía de una carta: sección de desembarco, evento y fuego alemán con colores y símbolo de objetivo',
        ruleRefs: [{ section: '2.3' }],
      },
      {
        type: 'rule-callout',
        content:
          '§2.3 — "Fire card" es la carta usada durante la Fase de Fuego Alemán. "Landing card" es la carta usada para los chequeos de desembarco. Ambas vienen de la misma baraja, pero se usan para propósitos distintos.',
        ruleRefs: [{ section: '2.3', note: 'Fire card y Landing card' }],
      },
    ],
  },

  // ------------------------------------------------------------------ Lesson 3
  {
    id: 'lesson-1-3',
    moduleId: 'module-1',
    order: 3,
    titleEs: 'Preparación de la partida',
    blocks: [
      {
        type: 'prose',
        content:
          'La preparación de la partida sigue un orden preciso. Primero se configuran los alemanes; luego se colocan las unidades de EE.UU. en el registro de turnos. La aleatorización inicial de los alemanes garantiza que cada partida sea diferente: jamás sabes con exactitud qué WN es más fuerte hasta que lo atacas.',
        ruleRefs: [{ section: '3', note: 'Secuencia de preparación' }],
      },
      {
        type: 'rule-callout',
        content:
          '§3 — Los escenarios disponibles son: Easy Fox (introductorio, solo mitad este del mapa), The First Waves (los cuatro primeros turnos de la invasión, ~3 horas de juego), D-Day at Omaha Beach (las 12 horas completas, 6–8 horas) y Beyond the Beach (turnos 17–32 solamente).',
        ruleRefs: [{ section: '3', note: 'Escenarios disponibles' }],
      },
      {
        type: 'prose',
        content:
          'Para la preparación alemana: se mezclan los 18 marcadores de profundidad WN boca abajo y se colocan en nueve posiciones WN específicas (WN 60, 61, 62N, 65N, 66N, 68N, 70, 72N, 73). Luego se mezclan los 18 WN boca abajo y se distribuyen en el mapa: 2 con símbolo de 88 en WN 61 y 72S, 6 con artillería en posiciones designadas, 1 cohete en WN 69 y los restantes en las demás posiciones. Este proceso asegura que jamás sepas de antemano la fuerza de cada posición.',
        ruleRefs: [{ section: '3', note: 'Configuración aleatoria de WN' }],
      },
      {
        type: 'rule-callout',
        content:
          '§3 — Para las unidades de EE.UU.: cada ficha tiene impreso su turno de entrada y su casilla de desembarco. Se colocan en el espacio correspondiente del "Turn Track". Los 8 blindados sin turno de entrada se colocan directamente en sus casillas.',
        ruleRefs: [{ section: '3', note: 'Colocación inicial de unidades de EE.UU.' }],
      },
      {
        type: 'prose',
        content:
          'La preparación termina con el marcador de turno en la posición 1 del registro, el marcador de fase al inicio del track de fases, y la baraja de cartas bien barajada boca abajo. Ahora estás listo para jugar el Turno 1.',
      },
      {
        type: 'rule-callout',
        content:
          '§3 — Recuerda: mezcla por separado cada tipo de unidad alemana (Tácticas, División, Kampfgruppe Meyer) y los marcadores de profundidad (WN, building, mobile). Todos van boca abajo en sus cajas correspondientes. Esta separación importa: los tipos se usan en momentos distintos del juego.',
        ruleRefs: [{ section: '3', note: 'Unidades alemanas de refuerzo por tipo' }],
      },
      {
        type: 'counter',
        content: 'Ficha de infantería A/116, 29.ª División — practica la lectura antes de empezar a jugar.',
        altText: 'Ficha de infantería A/116, 29.ª División: fuerza 3, escalones 3, símbolo de objetivo círculo, llega turno 3 en DW1',
        ruleRefs: [{ section: '2.21', note: 'Lectura de fichas de EE.UU.' }],
        counterConfig: {
          unit: {
            kind: 'us',
            id: 'A-116',
            type: 'infantry',
            steps: 3,
            targetSymbol: 'circle',
            weapons: ['BZ'],
            attackStrength: 3,
            reducedAttackStrength: 2,
            isDisrupted: false,
            hexId: null,
            designation: 'A/116',
            division: '29th',
            arrivalTurn: 3,
            beachLandingBox: 'DW1',
            unitFireDots: ['steady', 'sporadic'],
          },
          side: 'front',
          // size=200: non-annotated viewBox is "0 0 60 60".
          // scale = 200/60 = 3.33 → counter glyph = 200px, text at 9px → 30px.
          size: 200,
          annotated: false,
        },
      },
    ],
    workedExample: {
      titleEs: 'Ejemplo: Identificar una ficha de infantería de EE.UU.',
      scenarioDescription:
        'Antes de empezar a jugar, necesitas saber leer las fichas de EE.UU. para entender qué puede hacer cada unidad en el campo de batalla. Veamos una ficha de infantería típica.',
      ruleRefs: [{ section: '2.21', note: 'Lectura de fichas de EE.UU.' }],
      steps: [
        {
          order: 1,
          descriptionEs:
            'Observa los números en la ficha. La fuerza de ataque es el número más grande del frente; una compañía de infantería típica comienza con fuerza 3. El reverso muestra la fuerza reducida (generalmente 2).',
        },
        {
          order: 2,
          descriptionEs:
            'Localiza el "target symbol" (símbolo de objetivo): ●, ◆ o ▲. Este símbolo determina qué unidades son alcanzadas cuando el fuego alemán apunta a un símbolo específico en la "fire card".',
        },
        {
          order: 3,
          descriptionEs:
            'Identifica los escalones (steps): una compañía de infantería estándar empieza con 3 escalones (indicados por el número en la esquina o por tener dos fichas: una completa y una de reemplazo). Cada impacto en combate puede costar un escalón.',
        },
        {
          order: 4,
          descriptionEs:
            'Lee la casilla de desembarco y el turno de llegada. Por ejemplo, "DW1, Turno 3" significa que esta compañía llega en el turno 3 y debe colocarse en la casilla "Dog White 1" ese turno.',
        },
      ],
    },
  },
];
