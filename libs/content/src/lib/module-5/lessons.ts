import type { Lesson } from 'content-schema';

/**
 * Module 5 — "Acciones de EE.UU."
 *
 * Covers §7 (US Actions, rules-text.txt lines 1093–1262)
 * and §8 (US Combat Actions, lines 1263–1576).
 *
 * US Attack Table (EXT-03) and US Weapons Chart (EXT-04) and
 * US Barrage Table (EXT-05) values NOT reproduced — procedure only.
 * US attack chart image embedded; values not transcribed per design §8.
 */
export const MODULE_5_LESSONS: Lesson[] = [
  // ------------------------------------------------------------------ Lesson 5-1
  {
    id: 'lesson-5-1',
    moduleId: 'module-5',
    order: 1,
    titleEs: 'El sistema de acciones de EE.UU.',
    blocks: [
      {
        type: 'prose',
        content:
          'Durante la Fase de Acción de EE.UU. puedes activar unidades de cada división para realizar acciones: movimiento, escalada, eliminación de disrupción, ataque, barrage y barrage naval. Cada turno tienes una asignación de dos acciones por división.',
        ruleRefs: [{ section: '7', note: 'Dos acciones por división por turno; lista de acciones disponibles' }],
      },
      {
        type: 'rule-callout',
        content:
          '§7 — Acciones disponibles para unidades de EE.UU.:\n' +
          '• Mover un hex (todas las unidades)\n' +
          '• Escalar un Bluff (solo infantería, HQ y Generales)\n' +
          '• Escalar un Cliff (solo infantería)\n' +
          '• Eliminar disrupción (cualquier unidad con marcador de disrupción)\n' +
          '• Atacar (todas las unidades)\n' +
          '• Barrage (solo unidades de tanques)\n' +
          '• Barrage de artillería naval (solo marcador de fuego naval)',
        ruleRefs: [{ section: '7', note: 'Lista completa de acciones disponibles' }],
      },
      {
        type: 'prose',
        content:
          'Acciones gratuitas (§7.1): ciertas unidades realizan acciones sin consumir la asignación de dos. Una unidad solo puede realizar UNA acción por turno, ya sea gratuita o no. Las siguientes situaciones dan derecho a acción gratuita:\n' +
          '• Unidades de infantería ranger (siempre actúan de forma gratuita).\n' +
          '• Unidades con marcador de Héroe o de Inspirado.\n' +
          '• Unidades con marcador de climb, climb cliff o disrupción.\n' +
          '• Cuarteles Generales (HQ) y Generales.\n' +
          '• Una unidad bajo el mando de un HQ o General al inicio de la Fase de Acción.\n' +
          '• Una unidad de infantería en un hex de playa realizando un movimiento de autopreservación (moviéndose hacia un hexside protector más cercano).',
        ruleRefs: [{ section: '7.1', note: 'Acciones gratuitas: seis situaciones que las generan' }],
      },
      {
        type: 'rule-callout',
        content:
          '§7.1 — Movimiento de autopreservación: una unidad de infantería en un hex de playa puede moverse de forma gratuita a un hex de playa adyacente que esté más cerca de un hexside protector. Los hexsides protectores son: shingle, seawall, slope, bluff y scaleable cliff. Los acantilados verticales (sheer cliffs) NO son protectores. Si el hex de destino no es un hex de playa, o está a la misma distancia o más lejos de un hexside protector, el movimiento no califica como autopreservación.',
        ruleRefs: [{ section: '7.1', note: 'Movimiento de autopreservación: condiciones exactas' }],
      },
      {
        type: 'prose',
        content:
          'Secuenciación de acciones (§7.2): puedes realizar las acciones en cualquier orden, mezclando acciones normales y gratuitas. Debes completar todas las acciones de una división antes de comenzar con la otra. Una unidad puede realizar como máximo una acción por turno, incluso si esa acción es gratuita.',
        ruleRefs: [{ section: '7.2', note: 'Orden libre de acciones; completar una división antes de la otra' }],
      },
      {
        type: 'rule-callout',
        content:
          '§7.21 — Acción de apilar (stack): dos unidades en la misma casilla pueden realizar una acción conjunta al coste de una sola acción, SIEMPRE QUE realicen EXACTAMENTE la misma acción (por ejemplo, moverse al mismo hex o atacar la misma posición alemana). Si quieres que realicen acciones distintas o se muevan en direcciones distintas, necesitas dos acciones.\n\n' +
          '§7.22 — Unidades transfronterizas: una unidad que cruce el límite de sector puede contar como parte de cualquiera de las dos divisiones al realizar acciones, gastando la asignación de la división que prefieras.',
        ruleRefs: [
          { section: '7.21', note: 'Stack action: misma acción exacta, coste de una sola' },
          { section: '7.22', note: 'Unidades cruzando límite: pueden usar asignación de cualquier división' },
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ Lesson 5-2
  {
    id: 'lesson-5-2',
    moduleId: 'module-5',
    order: 2,
    titleEs: 'Movimiento e infiltración',
    blocks: [
      {
        type: 'prose',
        content:
          'La acción de movimiento básica (§7.3) permite mover cualquier tipo de unidad un hex en cualquier dirección. La Terrain Effects Chart lista el terreno que restringe o prohíbe el movimiento para ciertos tipos de unidad. En la práctica, los blindados, antiaéreos y artillería quedan atrapados en la playa hasta el turno 16; solo la infantería, los HQ y los Generales tienen libertad de movimiento amplia.',
        ruleRefs: [{ section: '7.3', note: 'Mover un hex: todas las unidades; restricciones del TEC para no-infantería' }],
      },
      {
        type: 'rule-callout',
        content:
          '§7.31 — No puedes mover una unidad de EE.UU. a un hex ocupado por una unidad alemana. Sin embargo, una unidad de EE.UU. puede entrar a una posición alemana VACÍA.',
        ruleRefs: [{ section: '7.31', note: 'No mover a hex con unidad alemana; posición vacía sí es accesible' }],
      },
      {
        type: 'prose',
        content:
          'Movimiento de infiltración (§7.32): si una unidad de EE.UU. se mueve DESDE un hex adyacente a una posición alemana ocupada y no disrupta en cuyo campo de fuego esté, HACIA otro hex que también esté adyacente al mismo campo de fuego de esa misma posición, la unidad intenta infiltrarse. Se realiza un tiro especial de fire card: si muestra el color de la posición alemana Y el target symbol de la unidad que se infiltra, esa unidad pierde un escalón. Si la posición alemana no tiene depth marker, el símbolo del color debe ser simple para activar el fuego.',
        ruleRefs: [{ section: '7.32', note: 'Infiltración: ambos hexes en campo de fuego del mismo WN ocupado no disrupto' }],
      },
      {
        type: 'rule-callout',
        content:
          '§7.32 — Consecuencias de la infiltración:\n' +
          '• Si la unidad pierde un escalón, puedes elegir completar el movimiento o mantenerla en el hex de partida. En cualquier caso, la unidad ha realizado una acción.\n' +
          '• Una unidad que se infiltra a un hex con otra unidad de EE.UU. verifica fuego alemán, pero no se considera "objetivo concentrado" aunque supere los 5 escalones en el hex.\n' +
          '• HQ y Generales no pueden intentar un movimiento de infiltración solos, pero pueden moverse con una unidad regular que sí lo haga.\n' +
          '• Si se infiltra pasando junto a dos posiciones alemanas, se extrae una sola carta. Si el target symbol y el color de alguna de las dos posiciones aparecen, la unidad pierde un escalón. No hay penalización adicional si ambos colores aparecen.',
        ruleRefs: [{ section: '7.32', note: 'Reglas complementarias de infiltración: múltiples posiciones, HQ, hexes ocupados' }],
      },
      {
        type: 'rule-callout',
        content:
          '§7.33 — Una vez que mueves un HQ o General, deja de proporcionar acciones gratuitas a las unidades bajo su mando durante el resto de la Fase de Acción. Planifica la secuencia de activación con cuidado.',
        ruleRefs: [{ section: '7.33', note: 'HQ/General movido: no otorga más acciones gratuitas esa fase' }],
      },
      {
        type: 'prose',
        content:
          'Escalar un Bluff (§7.4): solo infantería (incluida ranger), HQ y Generales pueden cruzar un hexside de bluff. Requiere dos acciones en dos turnos. En el primer turno, mueve la unidad al hex del otro lado y coloca un marcador Climb. En el segundo turno, realiza una acción gratuita para retirar el marcador. Si la unidad comienza la Fase de Acción con el marcador Climb, SOLO puede realizar esa acción gratuita de retirarlo. Si además está disrupta, puede optar por retirar la disrupción.',
        ruleRefs: [{ section: '7.4', note: 'Climb Bluff: dos turnos, marcador en primer turno, acción gratuita en el segundo' }],
      },
      {
        type: 'rule-callout',
        content:
          '§7.41 — HQ y Generales cruzan un bluff en un solo turno. No se les coloca marcador Climb.',
        ruleRefs: [{ section: '7.41', note: 'HQ/Generales: cruzan bluff en un turno, sin marcador' }],
      },
      {
        type: 'prose',
        content:
          'Escalar un Cliff (§7.5): solo infantería (incluida ranger) puede cruzar un hexside de cliff escalable. Requiere tres acciones en tres turnos. Turno 1: acción para colocar el marcador Climb Cliff (la unidad no se mueve). Turno 2: acción gratuita para mover la unidad al hex al otro lado del cliff y voltear el marcador al lado "Climb". Turno 3: acción gratuita para retirar el marcador.',
        ruleRefs: [{ section: '7.5', note: 'Climb Cliff: tres turnos; marcador, cruce gratuito, retirada gratuita' }],
      },
      {
        type: 'prose',
        content:
          'Límites de apilamiento (§7.6): al FINAL de la Fase de Acción, un hex puede contener como máximo dos unidades de EE.UU. Este límite no aplica durante la propia fase ni en otras fases del turno. HQ, Generales y Héroes no cuentan para el límite. Si al final de la fase hay violaciones del apilamiento, debes eliminar unidades hasta cumplir el límite (§7.63). Recuerda también: 5 o más escalones en un hex crean un "objetivo concentrado" para el fuego alemán (§6.35).',
        ruleRefs: [
          { section: '7.6', note: 'Límite de apilamiento: 2 unidades al final de la Fase de Acción' },
          { section: '7.61', note: 'HQ, Generales y Héroes no cuentan para el límite' },
          { section: '7.63', note: 'Violación al final de fase: eliminar hasta cumplir el límite' },
        ],
      },
      {
        type: 'rule-callout',
        content:
          '§7.7 — Unidades de EE.UU. disruptas: una unidad con marcador de disrupción solo puede realizar la acción "gratuita" de retirar ese marcador. No puede realizar ninguna otra acción. Es conveniente esperar al final de la fase para retirar marcadores de disrupción, para no activar accidentalmente otras unidades. Si una unidad queda disrupta DURANTE la Fase de Acción (p.ej., tras un ataque fallido), ese marcador NO puede retirarse en la misma fase. El juego incluye marcadores de disrupción en dos tonos para distinguir los previos a la fase de los generados durante ella.',
        ruleRefs: [{ section: '7.7', note: 'Unidades de EE.UU. disruptas: solo pueden retirar disrupción; dos tonos de marcador' }],
      },
    ],
  },

  // ------------------------------------------------------------------ Lesson 5-3
  {
    id: 'lesson-5-3',
    moduleId: 'module-5',
    order: 3,
    titleEs: 'Ataque a posiciones alemanas',
    blocks: [
      {
        type: 'prose',
        content:
          'Un ataque (§8.1) requiere al menos una unidad de infantería (o ranger) adyacente al hex alemán objetivo. Una vez cumplida esa condición, otras unidades pueden unirse al ataque desde hexes adyacentes o, si tienen capacidad de fuego a distancia, desde hexes no adyacentes dentro de su rango.',
        ruleRefs: [{ section: '8.1', note: 'Requisito de ataque: al menos una infantería adyacente al objetivo' }],
      },
      {
        type: 'rule-callout',
        content:
          '§8.1 — Condiciones de elegibilidad por tipo de unidad:\n' +
          '• Infantería: debe estar en un hex adyacente al objetivo.\n' +
          '• Infantería pesada (rango 2): adyacente o a un hex de distancia.\n' +
          '• Tanques, antitanques, antiaéreos: dentro del rango Y al menos una de las siguientes: adyacente al objetivo, adyacente a una infantería atacante, bajo mando de un HQ o General, o al menos una infantería atacante está bajo mando de HQ o General.\n' +
          '• Artillería: en rango pero NO adyacente al objetivo; bajo mando de un HQ que también comanda al menos una infantería atacante; y si no es blindada, no puede estar en el campo de fuego de ningún WN no disrupto.\n' +
          '• Fuego naval: se puede incluir expending un marcador naval si al menos una infantería atacante tiene radio o está bajo mando de un HQ.',
        ruleRefs: [
          { section: '8.1', note: 'Elegibilidad detallada por tipo de unidad' },
          { section: '8.12', note: 'Restricción de fuego a distancia desde terreno bajo hacia terreno alto' },
        ],
      },
      {
        type: 'prose',
        content:
          'Restricción de fuego a distancia desde terreno bajo (§8.12): una unidad en un hex de playa o de pabellón/draw NO puede hacer fuego a distancia contra una posición alemana en terreno alto, A MENOS QUE esa posición proyecte campo de fuego al menos a un hex de playa (es decir, la posición está en el acantilado con vistas a la playa). Esta restricción aplica tanto a ataques como a barrages. El fuego naval está exento de esta restricción.',
        ruleRefs: [{ section: '8.12', note: 'Restricción de terreno bajo → terreno alto para fuego a distancia' }],
      },
      {
        type: 'rule-callout',
        content:
          '§8.13 — Cada unidad que participa en un ataque debe gastar una acción para participar. Una unidad que no pueda realizar acciones no puede atacar.\n' +
          '§8.14 — Los HQ y Generales no participan directamente en un ataque y no son afectados por sus resultados.\n' +
          '§8.16 — Una posición alemana solo puede ser atacada una vez en cada Fase de Acción de EE.UU.',
        ruleRefs: [
          { section: '8.13', note: 'Cada participante gasta una acción' },
          { section: '8.14', note: 'HQ y Generales no participan ni son afectados' },
          { section: '8.16', note: 'Cada posición: máximo un ataque por Fase de Acción' },
        ],
      },
      {
        type: 'prose',
        content:
          'Armas (§8.2): cada unidad de EE.UU. posee una o más armas según la US Weapons Chart. Cada unidad alemana y cada depth marker lista los requisitos de armas necesarios para ser derrotados de la forma más efectiva. Si los atacantes cumplen los requisitos, el ataque se resuelve con la sección inferior (más favorable) de la US Attack Table; si no los cumplen, se usa la sección superior.',
        ruleRefs: [{ section: '8.2', note: 'Armas: US Weapons Chart lista armas por tipo de unidad' }],
      },
      {
        type: 'rule-callout',
        content:
          '§8.22 — Flanqueo (FL): algunos alemanes requieren FL como condición de arma. Para cumplirlo, las unidades de EE.UU. deben atacar desde al menos DOS hexes adyacentes al objetivo pero NO adyacentes entre sí. Si el unit Y su depth marker requieren FL, se necesitan tres hexes de ataque (que pueden ser adyacentes entre sí).\n\n' +
          '§8.23 — Héroe comodín: un Héroe con la unidad atacante desde un hex adyacente actúa como comodín de arma: puede sustituir UN requisito de arma (no el de flanqueo). Alternativa: el Héroe puede aumentar tu fuerza de ataque en 1. Este beneficio no es acumulable; si participan varios héroes, solo cuenta uno.',
        ruleRefs: [
          { section: '8.22', note: 'Flanqueo: dos hexes no adyacentes entre sí; tres para FL doble' },
          { section: '8.23', note: 'Héroe: comodín de arma (no flanqueo) o +1 de fuerza de ataque' },
        ],
      },
      {
        type: 'prose',
        content:
          'Procedimiento de resolución del ataque (§8.3): primero revela la unidad alemana si aún no está revelada (el depth marker permanece sin revelar por ahora). Compara la fuerza total de tus unidades atacantes con la fuerza total de las unidades y marcadores alemanes revelados en el hex (la fuerza alemana puede estar aumentada por el terreno). Verifica si tienes todos los requisitos de armas. Consulta la US Attack Table — si tienes las armas, usa la sección inferior; si no, la superior. Localiza la fila por comparación numérica de fuerzas y la columna por la situación alemana (unidad sola, con depth marker no revelado, o con depth marker revelado). El resultado puede afectar tanto al defensor como a las unidades atacantes.',
        ruleRefs: [{ section: '8.3', note: 'Procedimiento de resolución del ataque: 5 pasos' }],
      },
      {
        type: 'image',
        content: 'assets/charts/us-attack-results-chart.jpg',
        altText:
          'US Attack Results Chart: tabla de resultados de ataque de EE.UU. con filas por comparación de fuerzas (ataque vs. defensa) y columnas por situación alemana (unidad sola, con depth marker no revelado, con depth marker revelado). Las secciones superior (sin armas) e inferior (con armas) ofrecen resultados distintos. Tabla reproducida de la comunidad (TTS); valores validados contra el reglamento.',
        ruleRefs: [{ section: '8.3', note: 'US Attack Table: fuerza relativa × situación alemana × armas' }],
      },
      {
        type: 'rule-callout',
        content:
          '§8.3 — Nota sobre la tabla: los resultados van desde "Alemán disrupto y atricción opcional" hasta "Alemán derrotado". El resultado puede obligarte a revelar el depth marker y recalcular. La "atricción opcional" permite eliminar el depth marker alemán a cambio de perder un escalón de EE.UU. — es una decisión táctica, no un resultado automático.',
        ruleRefs: [{ section: '8.3', note: 'Tipos de resultado posibles y la regla de atricción opcional' }],
      },
      {
        type: 'prose',
        content:
          'Reglas adicionales de combate:\n' +
          '§8.31 — Un ataque de varias unidades se resuelve como un único ataque. Suma todas las fuerzas. Si se ataca a través de varios hexsides, usa el hexside más desfavorable para el defensor.\n' +
          '§8.32 — En un WN de dos hexes, solo se ataca un hex por vez. Las unidades en el otro hex no ayudan ni son afectadas.\n' +
          '§8.33 — Retirada alemana: una unidad de refuerzo de la 352.ª División que es derrotada puede retirarse en lugar de ser eliminada, si puede trazar comunicación alemana en el momento del ataque. WN, unidades de la 716.ª y unidades sin comunicación NO pueden retirarse.\n' +
          '§8.34 — No existe "avance tras el combate": no muevas tus unidades atacantes al hex alemán vacío.',
        ruleRefs: [
          { section: '8.31', note: 'Ataque múltiple: suma de fuerzas, hexside más desfavorable' },
          { section: '8.33', note: 'Retirada 352.ª con comunicación; WN y 716.ª no pueden retirarse' },
          { section: '8.34', note: 'Sin avance tras el combate' },
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ Lesson 5-4
  {
    id: 'lesson-5-4',
    moduleId: 'module-5',
    order: 4,
    titleEs: 'Barrage y fuego naval',
    blocks: [
      {
        type: 'prose',
        content:
          'Barrage (§8.4): una unidad de tanque puede realizar una acción de barrage contra un hex alemán ocupado, siempre que el tanque esté en rango pero NO adyacente al objetivo y se cumpla al menos una de estas condiciones: el propio tanque ocupa un hex en el campo de fuego del objetivo, o una unidad de infantería no disrupta ocupa un hex en ese campo de fuego (actuando como observador). Si el tanque usa observador, uno de los dos (tanque u observador) debe estar bajo mando de un HQ o General.',
        ruleRefs: [{ section: '8.4', note: 'Barrage: tanque en rango no adyacente; en campo de fuego o con observador' }],
      },
      {
        type: 'rule-callout',
        content:
          '§8.4 — Procedimiento de barrage: extrae una fire card y consulta la US Barrage Table para determinar el efecto sobre la posición alemana. Si la fire card no muestra el color de la posición alemana o el target symbol de la unidad barrajeante, el barrage no tiene ningún efecto.',
        ruleRefs: [{ section: '8.4', note: 'Barrage: fire card + US Barrage Table; sin color ni target symbol = sin efecto' }],
      },
      {
        type: 'image',
        content: 'assets/charts/us-barrage-table.jpg',
        altText:
          'US Barrage Table: tabla de resultados de barrage de EE.UU. que muestra el efecto sobre la posición alemana cuando la fire card coincide con el color de la posición y el target symbol de la unidad barrajeante. Tabla reproducida de la comunidad (TTS); valores validados contra el reglamento.',
        ruleRefs: [{ section: '8.4', note: 'US Barrage Table: referencia visual de resultados de barrage' }],
      },
      {
        type: 'rule-callout',
        content:
          '§8.41 — Reglas específicas del barrage:\n' +
          '• Solo puede barragearlo una unidad. No puedes combinar fuerzas.\n' +
          '• Extrae una fire card distinta para cada barrage. No reutilices la carta de la Fase de Fuego Alemán.\n' +
          '• Un hex alemán puede ser objetivo de más de un barrage en la misma Fase de Acción, pero NO puede ser atacado Y barrajeado en la misma fase.\n' +
          '• Un barrage en un WN de dos hexes solo afecta a las unidades del hex objetivo.\n' +
          '§8.42 — El barrage contra posiciones en terreno alto está sujeto a la restricción de fuego a distancia desde terreno bajo (§8.12). Las unidades de refuerzo no reveladas NO pueden ser objetivo de barrage.',
        ruleRefs: [
          { section: '8.41', note: 'Barrage: una unidad, carta propia, mismo hex no ataque+barrage' },
          { section: '8.42', note: 'Barrage: restricción terreno alto; no a refuerzo no revelado' },
        ],
      },
      {
        type: 'prose',
        content:
          'Marcadores de fuego naval (§8.5): los recibes como resultado de tiradas de cartas de eventos. Puedes gastar uno para incluir fuego naval en un ataque de EE.UU. o para realizar un Barrage de Artillería Naval independiente.',
        ruleRefs: [{ section: '8.5', note: 'Marcadores navales: obtenidos por eventos; dos usos posibles' }],
      },
      {
        type: 'rule-callout',
        content:
          '§8.51 — Fuego naval en ataque: puedes gastar un marcador naval si una unidad de infantería atacante tiene radio o está bajo mando de un HQ. Si se cumple, el fuego naval aporta: la fuerza del marcador (9) se suma a tu fuerza de ataque, y se consideran cumplidos los requisitos de armas de fuego naval, artillería y demoliciones.\n\n' +
          '§8.52 — Barrage de artillería naval: puedes gastar un marcador para barraguear cualquier posición WN (revelada o no) o cualquier posición de refuerzo revelada, siempre que al menos una unidad de infantería no disrupta con radio o bajo mando de un HQ esté en el campo de fuego del objetivo. Efecto: coloca un marcador de disrupción en el objetivo y retira su depth marker si tiene uno. Las unidades alemanas NO son eliminadas por barrage naval. Una posición con unidad no revelada NO puede ser objetivo de barrage naval.\n\n' +
          '§8.53 — El barrage de artillería naval es una acción gratuita y puede realizarse en cualquier momento de la Fase de Acción. Sin embargo, un hex alemán ocupado no puede ser objeto de barrage Y ataque en la misma fase.\n\n' +
          '§8.54 — Puedes usar el marcador en el mismo turno en que lo recibes, o guardarlo para un turno posterior.',
        ruleRefs: [
          { section: '8.51', note: 'Fuego naval en ataque: radio o HQ; +9 fuerza + armas navales/AR/DE' },
          { section: '8.52', note: 'Barrage naval: disrupción + retira depth marker; sin eliminación' },
          { section: '8.53', note: 'Barrage naval: acción gratuita; no con ataque en mismo hex' },
          { section: '8.54', note: 'Marcador naval: se puede guardar para turno posterior' },
        ],
      },
    ],
  },
];
