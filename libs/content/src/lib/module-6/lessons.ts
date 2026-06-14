import type { Lesson } from 'content-schema';

/**
 * Module 6 — "Refuerzos Alemanes y Operaciones de Ingenieros"
 *
 * Covers §9 (German Units, Depth & Reinforcements, rules-text.txt lines 1580–1727)
 * and §10 (US Engineer Beach Obstacle Demolition, lines 1728–1763).
 *
 * Terrain Effects Chart embedded as image block in Lesson 6-3 for obstacle/terrain
 * context. Table cell values NOT reproduced (EXT-06 blocker).
 */
export const MODULE_6_LESSONS: Lesson[] = [
  // ------------------------------------------------------------------ Lesson 6-1
  {
    id: 'lesson-6-1',
    moduleId: 'module-6',
    order: 1,
    titleEs: 'Unidades alemanas y marcadores de profundidad',
    blocks: [
      {
        type: 'prose',
        content:
          'Al inicio del juego, solo las unidades WN ocupan el mapa, en posiciones WN. Algunas tienen depth markers debajo; otras no. Durante la partida, unidades adicionales y depth markers entran en juego de diversas formas: a través de eventos, como resultado de ataques de EE.UU. fallidos, o mediante el mecanismo de Tactical Reinforcement de un depth marker revelado.',
        ruleRefs: [{ section: '9', note: 'Estado inicial: solo WN en el mapa; entradas durante la partida' }],
      },
      {
        type: 'prose',
        content:
          'Revelar unidades alemanas (§9.1): inicialmente todas las unidades y depth markers están colocados boca abajo (no revelados). La parte trasera del counter identifica el tipo general. Un unit no revelado aún proyecta campo de fuego y puede disparar. Una unidad se revela como resultado de acciones de EE.UU., generalmente un ataque. Una vez revelada, permanece revelada hasta ser retirada o hasta que un resultado de combate lo indique.',
        ruleRefs: [{ section: '9.1', note: 'Unidades no reveladas: disparan y proyectan campo de fuego; se revelan por ataque de EE.UU.' }],
      },
      {
        type: 'rule-callout',
        content:
          '§9.1 — El depth marker de una unidad revelada permanece sin revelar hasta que la unidad sea sometida a un ataque suficientemente fuerte. El depth marker se revela entonces para añadir fuerza a la defensa. Una vez revelado, permanece revelado hasta ser retirado o hasta que el resultado de combate lo indique de otro modo.',
        ruleRefs: [{ section: '9.1', note: 'Depth marker: permanece sin revelar hasta ataque suficientemente fuerte' }],
      },
      {
        type: 'prose',
        content:
          'Añadir depth markers (§9.2): los depth markers se añaden durante la partida como resultado de eventos y, a veces, de ataques de EE.UU. fallidos. Al colocar un depth marker por evento, elige una unidad alemana sin depth marker, siguiendo estas prioridades:\n' +
          '1. La unidad alemana más cercana (en hexes) a una unidad de EE.UU.\n' +
          '2. En caso de empate: unidad en WN de un hex > WN de dos hexes > posición de refuerzo.\n' +
          '3. Si sigue el empate: posición con el número de ID más bajo; si mismo número, la letra más baja.\n' +
          'La unidad debe estar en comunicación alemana para recibir un depth marker. Las unidades disruptas pueden recibirlo (§9.21).',
        ruleRefs: [
          { section: '9.2', note: 'Añadir depth marker por evento: prioridades de selección' },
          { section: '9.21', note: 'Unidades disruptas pueden recibir depth marker' },
        ],
      },
      {
        type: 'rule-callout',
        content:
          '§9.21 — Tipo de depth marker: al seleccionar una unidad para recibir el marcador, extrae aleatoriamente del pool correspondiente:\n' +
          '• Unidad WN: extrae del pool de depth markers WN.\n' +
          '• Unidad de refuerzo en hex de edificio: extrae del pool de edificio.\n' +
          '• Unidad de refuerzo en cualquier otro tipo de hex: extrae del pool móvil.',
        ruleRefs: [{ section: '9.21', note: 'Pool de depth markers según tipo de posición' }],
      },
      {
        type: 'prose',
        content:
          'Agotamiento de pools (§9.24): a medida que avanza la partida, uno o más pools de depth markers pueden vaciarse:\n' +
          '• Si el pool WN está vacío cuando se necesita un depth marker WN, colócalo en una posición de refuerzo en su lugar.\n' +
          '• Si el pool de edificio está vacío, toma uno del pool móvil en su lugar.\n' +
          '• Si el pool móvil está vacío, los alemanes han agotado sus reservas; no se coloca ningún depth marker.',
        ruleRefs: [{ section: '9.24', note: 'Agotamiento de pools: reglas de sustitución' }],
      },
    ],
  },

  // ------------------------------------------------------------------ Lesson 6-2
  {
    id: 'lesson-6-2',
    moduleId: 'module-6',
    order: 2,
    titleEs: 'Refuerzos alemanes',
    blocks: [
      {
        type: 'prose',
        content:
          'Refuerzos desencadenados por eventos (§9.3): cuando un evento ordena colocar refuerzos alemanes, extrae aleatoriamente del Tactical Reinforcement Pool. Coloca la unidad boca abajo y SIN depth marker en una posición de refuerzo alemana VACÍA que esté en comunicación alemana y en la zona indicada por el evento. Si hay varias posiciones elegibles, selecciona según estas prioridades:\n' +
          '1. Posición adyacente a una unidad de EE.UU. (la de número más bajo si varias).\n' +
          '2. Posición a dos hexes de una unidad de EE.UU. (la de número más bajo si varias).\n' +
          '3. La posición con el número más bajo.',
        ruleRefs: [{ section: '9.3', note: 'Refuerzos por evento: pool táctico, sin depth marker, prioridades de colocación' }],
      },
      {
        type: 'rule-callout',
        content:
          '§9.31 — Si el Tactical Pool está vacío, extrae del Division Reinforcement Pool. Las unidades del Division Pool entran CON un depth marker. Selecciona la posición según las mismas prioridades del §9.3 y extrae un depth marker del pool correspondiente.\n\n' +
          '§9.32 — Las unidades que entran por evento NO pueden colocarse en posiciones de refuerzo alemanas sin número de ID. Las posiciones WN no reciben unidades de refuerzo.\n\n' +
          '§9.33 — La posición debe estar en comunicación alemana para recibir un refuerzo. Una posición no ocupada puede estar adyacente a unidades de EE.UU. y aún así estar en comunicación.',
        ruleRefs: [
          { section: '9.31', note: 'Pool vacío: Division Pool + depth marker' },
          { section: '9.32', note: 'Posiciones sin ID y WN: no reciben refuerzos por evento' },
          { section: '9.33', note: 'Comunicación requerida; posición vacía puede estar adyacente a EE.UU.' },
        ],
      },
      {
        type: 'prose',
        content:
          'Refuerzos tácticos activados por depth marker WN (§9.4): cuando revelas un depth marker WN que dice "Tactical Reinforcement", inmediatamente:\n' +
          '1. Retira el depth marker del juego.\n' +
          '2. Extrae una unidad del Tactical Reinforcement Pool y colócala en la posición de refuerzo no ocupada MÁS CERCANA a la posición WN de la que retiraste el marcador, incluso si esa posición de refuerzo no tiene número de ID.\n' +
          '3. Si hay un empate de distancia, prioriza la posición más cercana a una unidad de EE.UU.; luego la de número más bajo.',
        ruleRefs: [{ section: '9.4', note: 'Tactical Reinforcement depth marker: retira, coloca unidad táctica en posición más cercana' }],
      },
      {
        type: 'rule-callout',
        content:
          '§9.41 — Para este tipo de refuerzo, una posición sin número de ID se considera como si tuviera el número 0. Las restricciones de comunicación del §9.33 aplican igualmente.\n\n' +
          '§9.42 — Este tipo de refuerzo solo puede provenir del Tactical Reinforcement Pool y se coloca SIN depth marker. Si el pool está vacío, el refuerzo no aparece.',
        ruleRefs: [
          { section: '9.41', note: 'ID 0 para posiciones sin número; comunicación requerida' },
          { section: '9.42', note: 'Solo del pool táctico; sin depth marker; pool vacío = sin refuerzo' },
        ],
      },
      {
        type: 'prose',
        content:
          'Kampfgruppe Meyer (§9.5): la caja de KG Meyer contiene unidades históricamente disponibles para Omaha pero desviadas. Solo se liberan al extraer el evento KG Meyer. Cada vez que se extrae, selecciona aleatoriamente 4 unidades y 2 depth markers de KG Meyer. Traslada las unidades al Division Reinforcement Pool y los depth markers a la Mobile Depth Box. Quedan disponibles para entrar en juego mediante los mecanismos normales. Si las 8 unidades de KG Meyer ya han sido liberadas, los eventos KG Meyer subsiguientes se ignoran.',
        ruleRefs: [{ section: '9.5', note: 'KG Meyer: liberado por evento; 4 unidades + 2 depth markers al pool de división' }],
      },
    ],
  },

  // ------------------------------------------------------------------ Lesson 6-3
  {
    id: 'lesson-6-3',
    moduleId: 'module-6',
    order: 3,
    titleEs: 'Demolición de obstáculos de playa',
    blocks: [
      {
        type: 'prose',
        content:
          'Los equipos de demolición de ingenieros desembarcaron con las primeras oleadas para destruir los obstáculos de playa y minas alemanas. No están representados por fichas propias, pero su misión vital sí lo está. La mayoría de los hexes de playa en la línea de marea media tienen símbolos de obstáculos. Hasta que los ingenieros los eliminen, las unidades que desembarquen en esos hexes durante la marea media y alta pueden sufrir pérdidas por explosiones de minas (§5.14).',
        ruleRefs: [{ section: '10', note: 'Ingenieros: misión de limpiar obstáculos; riesgo de minas hasta que se eliminan' }],
      },
      {
        type: 'image',
        content: 'assets/charts/terrain-effects-chart.jpg',
        altText:
          'Terrain Effects Chart: tabla de efectos del terreno que indica las restricciones de movimiento por tipo de terreno y tipo de unidad, incluyendo los hexes de playa con obstáculos. Tabla reproducida de la comunidad (TTS); valores validados contra el reglamento.',
        ruleRefs: [{ section: '10', note: 'Terrain Effects Chart: contexto de obstáculos de playa y restricciones de movimiento' }],
      },
      {
        type: 'rule-callout',
        content:
          '§10.1 — Limpiar obstáculos: durante la Fase de Ingenieros de cada turno a partir del turno 2, puedes limpiar obstáculos en uno o dos hexes de playa por sector. PERO solo en hexes que NO estén en el campo de fuego de ninguna posición alemana no disrupta cuyo color aparezca en la fire card extraída para ese sector en el turno actual.',
        ruleRefs: [{ section: '10.1', note: 'Limpiar obstáculos: a partir del turno 2; restricción por campo de fuego y color de fire card' }],
      },
      {
        type: 'prose',
        content:
          'Ejemplo (§10.1): si los colores de la fire card del sector este son rojo, morado y azul, y ninguna posición WN está eliminada o disrupta, solo puedes limpiar hexes que no estén en el campo de fuego de ninguna posición roja, morada o azul activa. Si el WN de color morado está eliminado o disrupto, sus hexes de campo de fuego quedan disponibles para ser limpiados ese turno.',
        ruleRefs: [{ section: '10.1', note: 'Ejemplo: posición disrupta/eliminada libera sus hexes de campo de fuego para limpieza' }],
      },
      {
        type: 'rule-callout',
        content:
          '§10.11 — Marcadores "Cleared": coloca un marcador Cleared para indicar que los obstáculos de un hex han sido limpiados. Para evitar la acumulación de fichas al limpiar varios hexes seguidos, puedes usar solo dos marcadores: colócalos en los hexes de los extremos de la fila limpia, orientados con sus flechas apuntando el uno hacia el otro. Esto indica que esos dos hexes y todos los que hay entre ellos están limpios.',
        ruleRefs: [{ section: '10.11', note: 'Marcadores Cleared: dos marcadores para filas contiguas' }],
      },
      {
        type: 'rule-callout',
        content:
          '§10.12 — Límites de marea:\n' +
          '• Marea baja (turnos 2–6): hasta dos hexes por sector por turno.\n' +
          '• Marea media (turnos 7–15): solo un hex por sector por turno.\n' +
          '• Marea alta (turnos 16–22): no se pueden limpiar hexes.',
        ruleRefs: [{ section: '10.12', note: 'Límites de limpieza según la marea' }],
      },
    ],
  },
];
