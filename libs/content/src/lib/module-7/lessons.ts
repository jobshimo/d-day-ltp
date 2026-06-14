import type { Lesson } from 'content-schema';

/**
 * Module 7 — "Líderes, Control y Victoria"
 *
 * Covers §11 (Heroes, HQs, Generals, rules-text.txt lines 1764–1916),
 * §12 (Control and Communication, lines 1829–1996),
 * §13 (Winning & Losing the First Waves, lines 1925–1965).
 *
 * Note: §12 rules appear split in the text (§12.1 at lines 1829–1842,
 * §12.2 at 1843–1982, §12.3 at 1983–1996); §11.3 appears after §12.1 at line 1873.
 */
export const MODULE_7_LESSONS: Lesson[] = [
  // ------------------------------------------------------------------ Lesson 7-1
  {
    id: 'lesson-7-1',
    moduleId: 'module-7',
    order: 1,
    titleEs: 'Héroes, Cuarteles Generales y Generales',
    blocks: [
      {
        type: 'prose',
        content:
          'Los Héroes, HQ y Generales son líderes: no cuentan para los límites de apilamiento, no poseen escalones y cualquier número puede ocupar el mismo hex. Los Héroes son individuos que sobresalen en el combate; los HQ representan estados mayores de regimientos; los Generales son Cota (29.ª División) y Wyman (1.ª División).',
        ruleRefs: [{ section: '11', note: 'Líderes: no cuentan para apilamiento ni poseen escalones' }],
      },
      {
        type: 'rule-callout',
        content:
          '§11.1 — Héroes:\n' +
          '• Entrada: aparecen por el evento Héroe. Se asignan a una unidad de EE.UU. de tu elección en la división indicada. No pueden transferirse a otra unidad y no pueden estar solos en un hex.\n' +
          '• Acción gratuita: la unidad con el Héroe puede realizar una acción gratuita por turno.\n' +
          '• Comodín de ataque (§8.23): cuando atacan desde un hex adyacente, el Héroe puede sustituir UN requisito de arma (no flanqueo) o aumentar la fuerza de ataque en 1. Este beneficio no es acumulable.\n' +
          '• Sacrificio voluntario (§11.14): si una unidad de un escalón con Héroe debe perder un escalón por fuego alemán, puedes sacrificar al Héroe para salvar la unidad. La ficha del Héroe se gira al lado "Inspirado".\n' +
          '• Inspirado (§11.15): cuando un Héroe es matado (por fuego alemán o sacrificio), su marcador se gira al lado inspirado y permanece con la unidad. La unidad con Inspirado sigue teniendo acción gratuita, pero ya no recibe el beneficio de comodín de ataque.',
        ruleRefs: [
          { section: '11.1', note: 'Héroe: entrada, acción gratuita, comodín de ataque, sacrificio, inspirado' },
          { section: '11.11', note: 'Entrada del Héroe por evento' },
          { section: '11.12', note: 'Acción gratuita del héroe' },
          { section: '11.14', note: 'Sacrificio voluntario del héroe' },
          { section: '11.15', note: 'Estado de Inspirado: acción gratuita pero sin comodín' },
        ],
      },
      {
        type: 'prose',
        content:
          'Headquarters — HQ (§11.2): hay cuatro HQ de infantería, uno por regimiento. Capacidades:\n' +
          '• Puede moverse un hex de forma gratuita durante la Fase de Acción.\n' +
          '• Manda a todas las unidades en su propio hex y en los hexes adyacentes al inicio de la Fase de Acción.\n' +
          '• Las unidades bajo su mando reciben acción gratuita.\n' +
          '• Una unidad que ataca desde un hex adyacente cuando está bajo mando de un HQ se considera que posee una radio.\n' +
          '• Un HQ puede habilitar a los tanques, antitanques, antiaéreos y artillería bajo su mando a realizar fuego a distancia.\n' +
          '• A partir del turno 17, un HQ puede establecer un puesto de mando (Command Post) para aumentar su radio de mando.',
        ruleRefs: [{ section: '11.2', note: 'HQ: movimiento gratuito, mando, radio, habilitar fuego a distancia, CP en T17+' }],
      },
      {
        type: 'rule-callout',
        content:
          '§11.3 — Generales (Cota y Wyman):\n' +
          '• Pueden moverse un hex de forma gratuita durante la Fase de Acción.\n' +
          '• Mandan a todas las unidades en su propio hex y en hexes adyacentes al inicio de la Fase de Acción.\n' +
          '• Las unidades bajo su mando reciben acción gratuita.\n' +
          '• Un General puede habilitar a los tanques, antitanques y antiaéreos bajo su mando a realizar fuego a distancia (NO habilita a la artillería).\n' +
          '§11.31 — Si un General es el único ocupante de una posición alemana cuando una unidad alemana debe colocarse allí, el General es retirado del juego (capturado). Un General en un hex no inhibe en absoluto el fuego ni la comunicación alemana.',
        ruleRefs: [
          { section: '11.3', note: 'Generales: movimiento gratuito, mando, NO artillería' },
          { section: '11.31', note: 'General solo en posición alemana: capturado si llega una unidad alemana' },
        ],
      },
      {
        type: 'prose',
        content:
          'Fuego alemán contra líderes (§11.4): si la fire card incluye el color de una posición alemana CON una estrella (★), esa posición puede alcanzar a un líder en su campo de fuego intenso o sostenido. Efectos:\n' +
          '• Héroe alcanzado: muere; gira su marcador al lado Inspirado.\n' +
          '• HQ alcanzado: queda desorganizado. Retíralo del mapa y colócalo dos turnos después en el track de turnos (vuelve a entrar por desembarco).\n' +
          '• General alcanzado: está ligeramente herido; gira su ficha al reverso. Continúa con sus capacidades normales.\n' +
          '• General ligeramente herido alcanzado de nuevo: muerto; retíralo del juego.',
        ruleRefs: [{ section: '11.4', note: 'Fuego alemán con estrella: puede alcanzar líderes en campo intenso o sostenido' }],
      },
      {
        type: 'rule-callout',
        content:
          '§11.41 — Los líderes solo reciben impactos DESPUÉS de asignar impactos a otras unidades elegibles. Si el número de otras unidades elegibles es mayor o igual al límite de impactos de la posición, el líder no es alcanzado.\n\n' +
          '§11.42 — Los líderes NO quedan disruptos por el fuego alemán, aunque las unidades con las que están apilados sí puedan quedar disruptas.',
        ruleRefs: [
          { section: '11.41', note: 'Líderes: impactados solo cuando el límite de impactos no se alcanza con unidades regulares' },
          { section: '11.42', note: 'Líderes: inmunes a la disrupción por fuego alemán' },
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ Lesson 7-2
  {
    id: 'lesson-7-2',
    moduleId: 'module-7',
    order: 2,
    titleEs: 'Control y comunicación',
    blocks: [
      {
        type: 'prose',
        content:
          'Control de EE.UU. (§12.1): las unidades de EE.UU. controlan el hex que ocupan. Algunos tipos controlan además los hexes adyacentes. Los Generales y Héroes NO controlan hexes.',
        ruleRefs: [{ section: '12.1', note: 'Control de EE.UU.: según el tipo de unidad' }],
      },
      {
        type: 'rule-callout',
        content:
          '§12.1 — Tipos de control:\n' +
          '• Controla SOLO el hex que ocupa: infantería con un escalón, artillería, antitanque, antiaéreo, HQ.\n' +
          '• Controla el hex que ocupa Y todos los hexes adyacentes (incluso si está disrupta): infantería con dos o tres escalones, blindados (de cualquier nivel de escalón).\n' +
          '§12.11 — Una unidad de EE.UU. en un hex de playa, pabellón o draw NO controla hexes adyacentes en el terreno alto. Sin embargo, una unidad en el terreno alto que pueda controlar hexes adyacentes SÍ controla los hexes de playa, pabellón y draw adyacentes.',
        ruleRefs: [
          { section: '12.1', note: 'Control por tipo: un hex vs. hex + adyacentes' },
          { section: '12.11', note: 'Excepción playa→terreno alto: no controla terreno alto; terreno alto→playa: sí controla' },
        ],
      },
      {
        type: 'prose',
        content:
          'Comunicación alemana (§12.2): una posición alemana está en comunicación si puede trazar un camino de hexes de cualquier longitud desde la posición hasta cualquier hex de salida (de la A a la G). El camino NO puede pasar por hexes ocupados o controlados por unidades de EE.UU. Además, no puede pasar por hexes de terreno accidentado (rough), hexes de playa, ni hexes de pabellón adyacentes a la playa.',
        ruleRefs: [{ section: '12.2', note: 'Comunicación alemana: traza de posición a hex de salida; restricciones de terreno y control de EE.UU.' }],
      },
      {
        type: 'rule-callout',
        content:
          '§12.21 — Una unidad alemana en un hex adyacente a una unidad de EE.UU. niega el control de EE.UU. sobre ese hex a efectos de trazar comunicación alemana, incluso para la propia unidad que niega el control.\n\n' +
          '§12.22 — Al trazar comunicación hacia una posición alemana NO ocupada, el propio hex de la posición puede estar en control de EE.UU. y aún así recibir la traza de comunicación si el camino puede llegar hasta ella.\n\n' +
          '§12.23 — Excepción de bocage: una posición de refuerzo ocupada por una unidad alemana puede trazar comunicación a través de UN hex de bocage adyacente a la posición, aunque ese hex esté controlado (pero no ocupado) por EE.UU. Esta capacidad aplica solo a un hex de bocage inmediatamente adyacente a la posición; la comunicación posterior debe trazarse normalmente.',
        ruleRefs: [
          { section: '12.21', note: 'Unidad alemana adyacente a EE.UU.: niega el control para comunicación' },
          { section: '12.22', note: 'Posición vacía: su propio hex puede estar en control EE.UU. y recibir comunicación' },
          { section: '12.23', note: 'Bocage: un hex de bocage controlado (no ocupado) puede atravesarse para comunicación' },
        ],
      },
      {
        type: 'rule-callout',
        content:
          '§12.24 — El estado de comunicación de las posiciones alemanas se establece al INICIO de la Fase de Fuego Alemán y no cambia durante toda la fase. Una posición sin comunicación al inicio de la fase permanece sin comunicación durante toda la fase, incluso si el fuego alemán reduce o elimina unidades de EE.UU. que bloqueaban la comunicación. Durante un ataque de EE.UU., la comunicación alemana se determina en el momento del ataque.',
        ruleRefs: [{ section: '12.24', note: 'Comunicación congelada al inicio de la Fase de Fuego Alemán' }],
      },
      {
        type: 'prose',
        content:
          'Comunicación de EE.UU. (§12.3): un hex está en comunicación de EE.UU. si puedes trazar un camino de hexes de cualquier longitud desde ese hex hasta cualquier hex de playa. El camino no puede pasar por hexes ocupados por o en el campo de fuego de unidades alemanas. El camino tampoco puede trazarse a través de hexes de terreno accidentado (rough) ni a través de hexsides de bluff o cliff.',
        ruleRefs: [{ section: '12.3', note: 'Comunicación EE.UU.: traza a cualquier hex de playa; no pasa por campo de fuego ni rough' }],
      },
    ],
  },

  // ------------------------------------------------------------------ Lesson 7-3
  {
    id: 'lesson-7-3',
    moduleId: 'module-7',
    order: 3,
    titleEs: 'Victoria y derrota',
    blocks: [
      {
        type: 'prose',
        content:
          'Pérdida catastrófica (§13.1): si alguna de las divisiones de EE.UU. sufre una pérdida catastrófica, pierdes la partida inmediatamente. La pérdida catastrófica se define como OCHO unidades de infantería regular de una misma división que hayan sido reducidas a un escalón o eliminadas.',
        ruleRefs: [{ section: '13.1', note: 'Pérdida catastrófica: 8 unidades de infantería regular de una división a 1 escalón o eliminadas' }],
      },
      {
        type: 'rule-callout',
        content:
          '§13.1 — Seguimiento: durante la partida, cada vez que una unidad de infantería regular pierde su segundo escalón (y se reemplaza por la ficha de un escalón), coloca la ficha de fuerza completa en la "Infantry Loss Box" de la división correspondiente. Si el número de fichas en una Loss Box llega a 8, esa división sufre pérdida catastrófica.\n\n' +
          '§13.11 — Las unidades de infantería ranger eliminadas y las unidades no de infantería (blindados, artillería, etc.) NO van a la Loss Box y NO cuentan para la pérdida catastrófica.\n\n' +
          '§13.12 — Algunos eventos permiten recuperar escalones de unidades reducidas en el juego tomando una ficha de la Loss Box. Esto reduce tu cuenta hacia la pérdida catastrófica.',
        ruleRefs: [
          { section: '13.1', note: 'Seguimiento en la Loss Box; 8 fichas = pérdida catastrófica' },
          { section: '13.11', note: 'Rangers y no-infantería: no van a la Loss Box' },
          { section: '13.12', note: 'Eventos de recuperación: reducen la cuenta de pérdidas' },
        ],
      },
      {
        type: 'prose',
        content:
          'Determinar la victoria (§13.2): si ninguna división ha sufrido pérdida catastrófica al final del turno 16, cuenta los Puntos de Victoria (VP) para determinar si has ganado la escenario "The First Waves". Puntos de Victoria:\n' +
          '• 1 VP por cada posición WN que controles. Un WN de dos hexes vale 2 VP (pero solo cuando controlas AMBOS hexes).\n' +
          '• 1 VP por cada posición de refuerzo alemana que controles (incluidas las posiciones sin etiqueta "VP").\n' +
          '• 5 VP por cada draw bajo tu control.\n' +
          'Ganas si tienes 19 o más VP.',
        ruleRefs: [{ section: '13.2', note: 'VP: posiciones WN, posiciones de refuerzo, draws; ganar con 19+ VP al final del turno 16' }],
      },
      {
        type: 'rule-callout',
        content:
          '§13.21 — Control de draws: hay cuatro draws (pequeños valles que comunican con el interior). Controlas un draw si TODOS sus hexes al sur (interior) de la barrera antitanque en la boca del draw están en control de EE.UU.',
        ruleRefs: [{ section: '13.21', note: 'Control del draw: todos los hexes al sur de la barrera antitanque deben estar bajo control de EE.UU.' }],
      },
      {
        type: 'rule-callout',
        content:
          '§13.22 — Un hex se considera en control de EE.UU. a efectos de VP si cumple TODAS estas condiciones:\n' +
          '1. El hex está ocupado o controlado por una unidad de EE.UU.\n' +
          '2. El hex está en comunicación de EE.UU. (§12.3).\n' +
          '3. El hex NO está en el campo de fuego de ninguna unidad alemana, incluyendo las disruptas.\n' +
          'Alternativa: un hex también cuenta si la comunicación de EE.UU. puede trazarse hasta él Y la comunicación alemana no puede trazarse hasta él Y el hex no está en campo de fuego alemán.',
        ruleRefs: [{ section: '13.22', note: 'Control VP: ocupado/controlado + comunicación EE.UU. + fuera de campo de fuego alemán' }],
      },
    ],
  },
];
