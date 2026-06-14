import type { Lesson } from 'content-schema';

/**
 * Module 2 — "Secuencia de Turno y Desembarco"
 *
 * Covers §4 (Sequence of Play, rules-text.txt lines 634–684)
 * and §5 (US Amphibious Operations, lines 685–823).
 *
 * Landing Table image included per design §3 (image block shape).
 * Chart values NOT reproduced; procedure only (EXT-01 blocker).
 */
export const MODULE_2_LESSONS: Lesson[] = [
  // ------------------------------------------------------------------ Lesson 2-1
  {
    id: 'lesson-2-1',
    moduleId: 'module-2',
    order: 1,
    titleEs: 'La secuencia de turno',
    blocks: [
      {
        type: 'prose',
        content:
          'Cada turno de D-Day at Omaha Beach se divide en seis fases que siempre se ejecutan en el mismo orden. Mueve el marcador de fase a lo largo del track Card/Phase para saber en qué fase estás. A lo largo del turno extraerás varias cartas, cada una con un propósito distinto: colócalas en el recuadro correspondiente del track como referencia.',
        ruleRefs: [{ section: '4', note: 'Secuencia de turno — estructura general' }],
      },
      {
        type: 'rule-callout',
        content:
          '§4 — Las seis fases del turno:\n' +
          'I. Fase de Operaciones Anfibias de EE.UU.\n' +
          'II. Fase de Eventos (omitir en turno 1)\n' +
          'III. Fase de Fuego Alemán\n' +
          'IV. Fase de Ingenieros de EE.UU. (omitir en turno 1)\n' +
          'V. Fase de Acción de EE.UU.\n' +
          'VI. Fin de Turno',
        ruleRefs: [{ section: '4', note: 'Las seis fases en orden' }],
      },
      {
        type: 'prose',
        content:
          'Fase I — Operaciones Anfibias: primero se realizan los chequeos de desembarco para las unidades en las casillas de desembarco (Beach Landing Boxes), luego se mueven esas unidades a la orilla, y finalmente se colocan las nuevas unidades que llegan ese turno en las casillas de desembarco. El detalle completo de esta fase se enseña en las lecciones 2-2 y 2-3.',
        ruleRefs: [{ section: '4', note: 'Fase I: tres pasos en orden' }],
      },
      {
        type: 'prose',
        content:
          'Fase II — Eventos: se extrae una carta de eventos y se aplica el evento del turno actual. Esta fase se omite en el turno 1. Los eventos generan refuerzos alemanes, marcadores navales y otros efectos que varían cada partida.',
        ruleRefs: [{ section: '4', note: 'Fase II: omitir turno 1' }],
      },
      {
        type: 'prose',
        content:
          'Fase III — Fuego Alemán: se extraen dos cartas de fuego (una por sector) y se resuelve el fuego de todas las posiciones alemanas que aparecen en la carta. Las unidades de EE.UU. en el campo de fuego pueden recibir pérdidas de escalón (step loss) o marcadores de disrupción. También se resuelve el fuego de artillería si la carta lo indica.',
        ruleRefs: [
          { section: '4', note: 'Fase III: dos cartas de fuego, una por sector' },
          { section: '6', note: 'Reglas completas de fuego alemán — Módulo 3' },
        ],
      },
      {
        type: 'prose',
        content:
          'Fase IV — Ingenieros: se colocan marcadores de "Cleared" en hexes de playa con obstáculos para mostrar que los ingenieros los han limpiado. Se omite en turno 1. Esta acción reduce el riesgo de explosiones de minas en desembarcos posteriores (§10.1).',
        ruleRefs: [
          { section: '4', note: 'Fase IV: limpiar obstáculos de playa' },
          { section: '10.1', note: 'Reglas de ingenieros — Módulo 6' },
        ],
      },
      {
        type: 'prose',
        content:
          'Fase V — Acción de EE.UU.: cada división puede activar dos unidades o grupos para realizar acciones (movimiento, ataque, barrage). Además, ciertas unidades actúan "de forma gratuita": infantería en movimiento de preservación, rangers, unidades con marcadores de estado especial (héroe, inspirado, climb) o con marcador de disrupción, cuarteles generales (HQ), generales, y unidades bajo su mando.',
        ruleRefs: [{ section: '4', note: 'Fase V: acciones normales y gratuitas' }],
      },
      {
        type: 'rule-callout',
        content:
          '§4 — Fin de Turno (Fase VI): mueve todas las cartas del track al mazo de descarte. Mueve el marcador de fase al inicio del track. Si el track de turnos indica que hay que barajar, mezcla todos los descartes en la baraja. Avanza el marcador de turno un espacio.',
        ruleRefs: [{ section: '4', note: 'Fase VI: fin de turno' }],
      },
      {
        type: 'rule-callout',
        content:
          '§4 — A partir del turno 17, la escala de tiempo cambia de 15 a 30 minutos por turno y se incorporan actividades adicionales a la secuencia (juego extendido). Esto se trata en el Módulo 8.',
        ruleRefs: [{ section: '4', note: 'Turno 17+: secuencia extendida' }],
      },
    ],
  },

  // ------------------------------------------------------------------ Lesson 2-2
  {
    id: 'lesson-2-2',
    moduleId: 'module-2',
    order: 2,
    titleEs: 'Chequeos de desembarco',
    blocks: [
      {
        type: 'prose',
        content:
          'Al inicio de cada Fase de Operaciones Anfibias, realiza un chequeo de desembarco por sector si hay unidades en las Beach Landing Boxes. El chequeo simula las corrientes, oleaje, fallos de equipos, errores de navegación y los obstáculos minados alemanes que amenazaban a cada oleada.',
        ruleRefs: [{ section: '5.1', note: 'Propósito del chequeo de desembarco' }],
      },
      {
        type: 'rule-callout',
        content:
          '§5.1 — Procedimiento: extrae una landing card por sector (comenzando por el este). La carta muestra los tres target symbols (◆, ▲, ●), cada uno con una letra de resultado (A, B, C o D). Para cada unidad en las Beach Landing Boxes, consulta la Landing Table con el turno actual y el tipo de unidad para determinar el resultado.',
        ruleRefs: [{ section: '5.1', note: 'Procedimiento: una carta por sector' }],
      },
      {
        type: 'image',
        content: 'assets/charts/amphibious-landing-table.jpg',
        altText:
          'Tabla de Desembarco Anfibio (Amphibious Landing Table): muestra los resultados A, B, C y D por tipo de unidad (Tanques, Infantería, Rangers, DUKW, etc.) y por tramos de turno (1–3, 4–14, 15+). Tabla reproducida de la comunidad (TTS); valores validados contra el reglamento.',
        ruleRefs: [{ section: '5.1', note: 'Landing Table: cruce turno × tipo unidad × letra de resultado' }],
      },
      {
        type: 'rule-callout',
        content:
          '§5.1 — Nota sobre la tabla: los resultados varían según el tramo de turno (1–3, 4–14, 15+) y el tipo de unidad. Los tanques tienen resultados diferentes a la infantería. La carta indica la letra (A–D) para cada target symbol; la tabla convierte esa letra en el efecto concreto (deriva este, demora, pérdida de escalón, eliminación o sin efecto).',
        ruleRefs: [{ section: '5.1', note: 'Resultados varían por turno y tipo' }],
      },
      {
        type: 'prose',
        content:
          'Los resultados posibles son: deriva al este, deriva al oeste, demora (la unidad pasa al track de turnos dos turnos después), pérdida de escalón, eliminación o "sin efecto". El resultado se aplica inmediatamente a cada unidad según su target symbol.',
        ruleRefs: [{ section: '5.1', note: 'Tipos de resultado: deriva, demora, pérdida, eliminación, sin efecto' }],
      },
      {
        type: 'prose',
        content:
          'Deriva (§5.11): si una unidad deriva, muévela el número de casillas indicado hacia el este (izquierda) o el oeste (derecha) a lo largo de la fila de Beach Landing Boxes. La unidad desembarcará desde la casilla a la que deriva. Si deriva más allá de la casilla más oriental o más occidental del mapa, queda demorada: colócala en el track de turnos dos turnos después del actual.',
        ruleRefs: [{ section: '5.11', note: 'Regla de deriva: movimiento en casillas y demora por límite' }],
      },
      {
        type: 'rule-callout',
        content:
          '§5.11 — Caso especial de marea alta: si una unidad deriva a una casilla de desembarco durante un turno de marea alta que no apunta a un hex de playa de marea alta, queda demorada.',
        ruleRefs: [{ section: '5.11', note: 'Deriva + marea alta = posible demora' }],
      },
      {
        type: 'prose',
        content:
          'Los HQ y Generales no se chequean para resultados de desembarco (§5.12), aunque un HQ puede verse afectado por una explosión de mina submarina. Si un HQ o General está apilado con una unidad que deriva, puede derivar con ella o quedarse en su casilla, a tu elección.',
        ruleRefs: [{ section: '5.12', note: 'HQ y Generales: exentos del chequeo de desembarco' }],
      },
      {
        type: 'prose',
        content:
          'Rangers: una unidad de infantería ranger que recibe resultado "Sin Efecto" en el turno 4 o posterior puede voluntariamente derivar de uno a cuatro hexes al este (§5.13). Esto no aplica a la unidad C/R2 programada para llegar en el turno 2.',
        ruleRefs: [{ section: '5.13', note: 'Opción de deriva voluntaria de rangers' }],
      },
      {
        type: 'prose',
        content:
          'Explosión de minas submarinas (§5.14, turnos 7–22): si la landing card muestra el símbolo de Exploding Mine, aplica primero todos los resultados de desembarco. Luego comprueba si alguna unidad en una casilla de desembarco aterriza en un hex de playa con obstáculos no limpiados. En marea media (turnos 7–15) o alta (16–22), si hay obstáculos sin limpiar en el camino, debes retirar un escalón de una unidad de tu elección.',
        ruleRefs: [{ section: '5.14', note: 'Minas: turno 7–22, obstáculos no limpiados' }],
      },
      {
        type: 'rule-callout',
        content:
          '§5.14 — Excepción para líderes: si el único disponible para sufrir una pérdida de escalón por mina es un HQ, no pierde el escalón; en su lugar queda demorado (colócalo dos turnos después en el track). Un General no es afectado por explosiones de mina.',
        ruleRefs: [{ section: '5.14', note: 'HQ demorado, no pierde escalón; General inmune' }],
      },
      {
        type: 'prose',
        content:
          'A partir del turno 15, la infantería queda exenta de los chequeos de desembarco normales (§5.15). Sin embargo, si esas unidades desembarcan en hexes con obstáculos no limpiados antes del turno 23, aún se realiza el chequeo de minas. Si no se requieren chequeos de desembarco en un sector, no se extrae carta de desembarco para ese sector.',
        ruleRefs: [{ section: '5.15', note: 'Infantería exenta después de turno 14; minas aplican hasta turno 23' }],
      },
    ],
  },

  // ------------------------------------------------------------------ Lesson 2-3
  {
    id: 'lesson-2-3',
    moduleId: 'module-2',
    order: 3,
    titleEs: 'Aterrizar y colocar unidades',
    blocks: [
      {
        type: 'prose',
        content:
          'Tras determinar todos los resultados de desembarco, todas las unidades que siguen en las Beach Landing Boxes aterrizan en Omaha Beach. Mueve cada unidad desde su casilla de desembarco al hex de la línea de marea que corresponde al nivel de marea actual, en la dirección que señala la casilla.',
        ruleRefs: [{ section: '5.2', note: 'Aterrizar unidades: mover de la casilla al hex de waterline' }],
      },
      {
        type: 'rule-callout',
        content:
          '§5.21 — Las tres líneas de marea (waterlines): marea baja (turnos 1–6 y 28–32), marea media (turnos 7–15) y marea alta (turnos 16–22). Las unidades que quedan bajo el agua al final de un turno son eliminadas. Excepción: una unidad con marcador Climb Cliff en un hex de marea baja al final del turno 7 no es eliminada.',
        ruleRefs: [{ section: '5.21', note: 'Waterlines: tres mareas, eliminación si queda bajo el agua' }],
      },
      {
        type: 'prose',
        content:
          'Cruce de límite de sector (§5.22): si una unidad desembarca en un hex fuera de su sector asignado, pasa al mando de la otra división por el resto de la partida. Anota la designación de la unidad o coloca un marcador de "Command Transfer".',
        ruleRefs: [{ section: '5.22', note: 'Cruce de límite: cambio de mando de división' }],
      },
      {
        type: 'prose',
        content:
          'Colocar nuevas llegadas (§5.3): después de que todas las unidades hayan desembarcado, toma las unidades del espacio del turno actual en el track de turnos y colócalas en sus Beach Landing Boxes. Las reglas de colocación son:\n' +
          '• Si la unidad lista una casilla específica (como ER3), colócala en esa casilla.\n' +
          '• Si la unidad lista una playa sin casilla específica (como ER), puedes colocarla en cualquier casilla con esas letras.\n' +
          '• Si la unidad lista un número de división (1.ª o 29.ª), puedes colocarla en cualquier casilla de desembarco con letras en el sector de esa división.',
        ruleRefs: [{ section: '5.3', note: 'Colocar llegadas: por casilla, por playa, o por división' }],
      },
      {
        type: 'rule-callout',
        content:
          '§5.31 — En una casilla de desembarco pueden colocarse una o dos unidades. Los Generales y los HQ no cuentan contra este límite. Un General no puede colocarse solo en una casilla si hay unidades que llegan ese mismo turno con las que podría apilarse.',
        ruleRefs: [{ section: '5.31', note: 'Límite de dos unidades por casilla; HQ/Generales no cuentan' }],
      },
      {
        type: 'rule-callout',
        content:
          '§5.32 — No puedes colocar una unidad en una casilla de desembarco sin letras de ID; esas casillas solo pueden alcanzarse por deriva involuntaria.',
        ruleRefs: [{ section: '5.32', note: 'Casillas sin ID: solo por deriva' }],
      },
      {
        type: 'rule-callout',
        content:
          '§5.33 — Solo las unidades de infantería ranger pueden colocarse en las casillas de desembarco Charlie (CH), aunque otras unidades pueden llegar a ellas involuntariamente por deriva.',
        ruleRefs: [{ section: '5.33', note: 'Casillas Charlie: solo rangers' }],
      },
      {
        type: 'prose',
        content:
          'Demora voluntaria (§5.34): a partir del turno 7, no estás obligado a colocar una unidad en su casilla de desembarco el turno que le corresponde. Puedes demorarla colocándola en cualquier espacio posterior del track de turnos. Reglas adicionales de demora:\n' +
          '• Una unidad demorada (voluntaria o involuntariamente) que llega en el turno 10 o antes debe ir a su casilla asignada.\n' +
          '• Una unidad que llega después del turno 10 puede colocarse en cualquier casilla de desembarco, en cualquier sector.\n' +
          '• No puedes demorar voluntariamente la llegada de una unidad antes del turno 7.',
        ruleRefs: [{ section: '5.34', note: 'Demora voluntaria: desde turno 7; restricciones en turno 10' }],
      },
    ],
  },
];
