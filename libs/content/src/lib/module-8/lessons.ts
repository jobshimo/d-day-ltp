import type { Lesson } from 'content-schema';

/**
 * Module 8 — "El Juego Extendido y Variantes"
 *
 * Covers §14 (Extended Game Introduction, rules-text.txt lines 2004–2044),
 * §15 (Extended Sequence, lines 2045–2075),
 * §16 (German Actions, lines 2076–2387),
 * §17 (Additions to US Actions, lines 2388–2450),
 * §18 (Command Posts, lines 2451–2501),
 * §19 (Engineer Bases, lines 2502+),
 * §20–§23 (Victory, variants, German armor — concept level).
 *
 * German Action Summary chart (EXT-07) NOT reproduced; each action described
 * from rules text individually. German Armor Movement Map (EXT-08) is a
 * separate printed map; §23.5 treated as concept-level only.
 */
export const MODULE_8_LESSONS: Lesson[] = [
  // ------------------------------------------------------------------ Lesson 8-1
  {
    id: 'lesson-8-1',
    moduleId: 'module-8',
    order: 1,
    titleEs: 'Introducción al juego extendido',
    blocks: [
      {
        type: 'prose',
        content:
          'El juego extendido (§14) se activa a partir del turno 17 si estás jugando la escenario "D-Day at Omaha Beach" o "Beyond the Beach". Las reglas de los §1–§13 siguen en vigor salvo que sean específicamente reemplazadas por las del juego extendido.',
        ruleRefs: [{ section: '14', note: 'Juego extendido: activado en T17; reglas básicas siguen vigentes salvo sustitución explícita' }],
      },
      {
        type: 'rule-callout',
        content:
          '§14 — Cambios principales en el juego extendido:\n' +
          '• Se extraen DOS cartas de evento por turno.\n' +
          '• El límite de impactos alemán se DUPLICA (§14.11): un WN con una sola unidad sin depth marker puede impactar a dos unidades de EE.UU. en lugar de una.\n' +
          '• Ya NO existe límite de pérdida de escalón por fase para las unidades de EE.UU. (§14.12): una unidad puede perder más de un escalón en una Fase de Fuego Alemán si es impactada por varias posiciones. Sin embargo, sigue perdiendo como máximo un escalón por impacto de una sola posición.\n' +
          '• Cada división tiene TRES acciones por turno en lugar de dos.\n' +
          '• La infantería y los blindados de EE.UU. pueden moverse más de un hex en una sola acción de movimiento.\n' +
          '• Puedes eliminar una unidad alemana y su depth marker en un único ataque.',
        ruleRefs: [
          { section: '14', note: 'Cambios en T17+: dos eventos, límite de impactos doble, sin límite de escalón por fase, tres acciones' },
          { section: '14.11', note: 'Límite de impactos alemán duplicado' },
          { section: '14.12', note: 'Sin límite de pérdida de escalón por Fase de Fuego para EE.UU.' },
        ],
      },
      {
        type: 'prose',
        content:
          'El juego extendido modifica la secuencia de juego añadiendo fases nuevas (§15). El esquema completo:\n' +
          'I. Fase de Operaciones Anfibias de EE.UU. (igual que el básico).\n' +
          'II. Primera Fase de Eventos: extrae una carta de evento.\n' +
          'III. Fase de Fuego Alemán: igual que el básico, más la posibilidad de acciones alemanas (§16).\n' +
          'IV. Segunda Fase de Eventos: extrae otra carta de evento.\n' +
          'V. Fase de Ingenieros de EE.UU. y HQ: coloca bases de ingenieros y aumenta su rango operativo (§19); convierte HQ en Command Posts y amplía su rango de mando (§18).\n' +
          'VI. Fase de Acción de EE.UU.: tres acciones por división; situaciones adicionales de acción gratuita (unidades en rango de un CP, unidades moviendo en terreno de playa/pabellón/draw dentro del rango de una base de ingenieros).\n' +
          'VII. Fin de Turno (igual que el básico).',
        ruleRefs: [{ section: '15', note: 'Secuencia extendida: siete fases con variaciones en II, IV, V y VI' }],
      },
      {
        type: 'rule-callout',
        content:
          '§14.2 — Opción avanzada: Implementación anticipada de acciones alemanas. Los jugadores con experiencia pueden implementar las reglas de acciones alemanas (§16) a partir del turno 12 para mayor realismo y dificultad. Esta opción se recomienda solo para jugadores que ya hayan ganado en el juego extendido. Todas las demás reglas del juego extendido siguen comenzando en el turno 17.',
        ruleRefs: [{ section: '14.2', note: 'Opción avanzada: acciones alemanas desde T12; recomendado solo para expertos' }],
      },
    ],
  },

  // ------------------------------------------------------------------ Lesson 8-2
  {
    id: 'lesson-8-2',
    moduleId: 'module-8',
    order: 2,
    titleEs: 'Acciones alemanas en el juego extendido',
    blocks: [
      {
        type: 'prose',
        content:
          'En el juego extendido (§16), las posiciones alemanas pueden realizar ACCIONES además de disparar, según las letras de acción que aparecen junto a los colores de posición en las fire cards. Estas letras (R, A, P, M, F) indican qué hace la posición en lugar de o en vez de disparar, dependiendo de su situación.',
        ruleRefs: [{ section: '16', note: 'Acciones alemanas: letras en la fire card determinan acción en lugar de o además de fuego' }],
      },
      {
        type: 'rule-callout',
        content:
          '§16 — Procedimiento de acciones alemanas: al extraer la fire card, comprueba TODAS las posiciones cuyo color coincide con la carta:\n' +
          '• Todas las posiciones WN y de refuerzo ocupadas.\n' +
          '• Todas las posiciones WN no ocupadas en comunicación alemana.\n' +
          '• Todas las posiciones de refuerzo no ocupadas a dos hexes o menos de una unidad de EE.UU. y en comunicación alemana.\n' +
          'Para cada posición, consulta el Resumen de Acciones Alemanas: cruza el tipo de posición con la letra/símbolo en la fire card para determinar si la posición dispara normalmente, realiza una acción, o no hace nada. Las posiciones con unidades disruptas NO realizan ninguna acción; la disrupción se elimina al final de la fase.',
        ruleRefs: [{ section: '16', note: 'Posiciones que se comprueban; posiciones disruptas no actúan' }],
      },
      {
        type: 'prose',
        content:
          'Las acciones alemanas son:\n' +
          '• R — Re-Occupy (WN no ocupado en comunicación): restaura una unidad WN eliminada sin artillería en la posición. Si no hay unidades disponibles, no ocurre nada. R en posición de refuerzo no ocupada en comunicación y a ≤2 hexes de EE.UU.: coloca refuerzo con depth marker (Reinforce, §16.4) si la posición es VP o tiene US en campo de fuego intenso/sostenido.\n' +
          '• R en posición de refuerzo OCUPADA en comunicación con US en campo de fuego: Re-Supply (§16.2) — si no tiene depth marker, extrae uno y luego dispara.\n' +
          '• R en posición OCUPADA sin US en campo de fuego: Redeploy (§16.3) — mueve la unidad a una posición vacía en el mismo sector que tenga US en campo de fuego y esté en comunicación.\n' +
          '• A — Advance (§16.8): posición de refuerzo ocupada con flecha de avance. La unidad 352.ª revelada con depth marker o cualquier unidad no revelada con depth marker intenta moverse a la posición indicada por la flecha. Si EE.UU. resiste (fuerza ≥7), el avance es repulsado. Si no, la unidad avanza y EE.UU. pierde un escalón.\n' +
          '• A — Ambush (§16.9): posición de refuerzo NO ocupada con US en campo de fuego intenso. Disparo con la columna Ambush de la German Fire Chart.\n' +
          '• P — Patrol (§16.6): posición de refuerzo ocupada. Disrúpte todas las unidades de EE.UU. en campo de fuego intenso y sostenido, o la más cercana si ninguna está en ese campo.\n' +
          '• M — Mortar (§16.5): posición ocupada sin US en campo de fuego. Dispara a unidades de EE.UU. dentro del rango de mortero (refuerzo: 3 hexes; WN: 5 hexes en playa, 2 hexes en terreno alto).\n' +
          '• F (o símbolo de fuego): disparo normal.\n' +
          '• WN ocupado sin US en campo de fuego: Artillery Fire Action (§16.7) si tiene artillería (88 o 75 mm), impactando una unidad de EE.UU. según la lista de prioridades.',
        ruleRefs: [
          { section: '16.1', note: 'Re-Occupy: WN no ocupado restaura unidad WN eliminada sin artillería' },
          { section: '16.2', note: 'Re-Supply: refuerzo ocupado con US en campo de fuego sin depth marker → extrae depth marker y dispara' },
          { section: '16.3', note: 'Redeploy: posición ocupada sin US en campo de fuego → mueve a posición vacía con US en campo' },
          { section: '16.4', note: 'Reinforce: posición vacía en comunicación a ≤2 hexes de EE.UU. → coloca refuerzo con depth marker' },
          { section: '16.5', note: 'Mortar: posición ocupada sin US en campo → fuego de mortero en rango' },
          { section: '16.6', note: 'Patrol: posición de refuerzo ocupada → disrúpte unidades de EE.UU. en campo intenso/sostenido' },
          { section: '16.7', note: 'Artillery Fire Action: WN con artillería 88/75 sin US en campo de fuego → impacta según prioridad' },
          { section: '16.8', note: 'Advance: posición de refuerzo con flecha; comprueba condiciones; avance o fuego' },
          { section: '16.9', note: 'Ambush: posición vacía con US en campo → columna Ambush de la German Fire Chart' },
        ],
      },
      {
        type: 'rule-callout',
        content:
          '§16.8 — Procedimiento de Avance:\n' +
          '1. Determina la ruta de avance según el diagrama correspondiente.\n' +
          '2. Si no hay unidades de EE.UU. en la ruta: el alemán avanza directamente.\n' +
          '3. Si hay unidades de EE.UU. en la ruta: disrupta las unidades que no sean infantería ni tanques, y las de infantería/tanques con el target symbol de la carta.\n' +
          '4. Suma la fuerza de las unidades no disruptas en la ruta; dobla la fuerza en bocage/edificio.\n' +
          '   • Si la fuerza de EE.UU. es 7 o más: avance repulsado; el alemán no se mueve ni dispara.\n' +
          '   • Si la fuerza es menos de 7: el alemán avanza; EE.UU. pierde un escalón (a tu elección) de una unidad en la ruta.',
        ruleRefs: [{ section: '16.82', note: 'Procedimiento de avance: ruta, disrupción, fuerza efectiva; umbral de 7' }],
      },
    ],
  },

  // ------------------------------------------------------------------ Lesson 8-3
  {
    id: 'lesson-8-3',
    moduleId: 'module-8',
    order: 3,
    titleEs: 'Mejoras a las acciones de EE.UU. y bases',
    blocks: [
      {
        type: 'prose',
        content:
          'El juego extendido introduce mejoras significativas a las capacidades de EE.UU. (§17): tres acciones por división, movimiento multi-hex de infantería y tanques, y la posibilidad de que la artillería realice barrages.',
        ruleRefs: [{ section: '17', note: 'Tres acciones, movimiento multi-hex, barrage de artillería' }],
      },
      {
        type: 'rule-callout',
        content:
          '§17.1 — Movimiento de dos hexes para infantería y líderes: la infantería (incluida ranger), los HQ y los Generales pueden moverse dos hexes en una acción de movimiento. La infantería NO puede moverse dos hexes si el segundo hex es un hex de bocage (salvo que entre por carretera o sendero) o está en campo de fuego intenso o sostenido de una posición alemana ocupada y no disrupta.\n\n' +
          '§17.2 — Movimiento de carretera para tanques: los tanques pueden moverse más de un hex si se mueven por carreteras. Desde una carretera secundaria: hasta 2 hexes por carreteras secundarias y principales. Desde una carretera principal: hasta 4 hexes por carreteras principales. El tanque se detiene al entrar en un hex en el campo de fuego intenso de una posición alemana ocupada.\n\n' +
          '§17.3 — Barrage de artillería: la artillería puede realizar barrages (similar al tanque en el juego básico) si está en rango no adyacente al objetivo, bajo mando de un HQ o CP, y el artillero o una infantería observadora está en el campo de fuego del objetivo.',
        ruleRefs: [
          { section: '17.1', note: 'Infantería y líderes: 2 hexes salvo bocage sin carretera o campo de fuego intenso/sostenido' },
          { section: '17.2', note: 'Tanques: movimiento por carretera; carretera secundaria 2 hexes, principal 4 hexes' },
          { section: '17.3', note: 'Artillería: puede barraguear si en rango, bajo mando HQ/CP, y observador en campo de fuego' },
        ],
      },
      {
        type: 'prose',
        content:
          'Puestos de Mando — Command Posts (§18): a partir del turno 17, puedes convertir unidades HQ en CP durante la Fase de Ingenieros y HQ. Un CP no puede moverse, pero su radio de mando aumenta con el tiempo, permitiéndole mandar unidades a hasta cuatro hexes de distancia. Las unidades dentro del radio de mando de un CP reciben los mismos beneficios que las unidades bajo mando de un HQ (acción gratuita, radio, fuego a distancia de blindados y artillería).',
        ruleRefs: [{ section: '18', note: 'CP: conversión desde HQ en T17+; radio de mando creciente; mismos beneficios que HQ' }],
      },
      {
        type: 'rule-callout',
        content:
          '§18.1 — Establecer un CP: un HQ puede convertirse en CP en cualquier hex que no esté en el campo de fuego potencial de ninguna posición alemana (incluidas posiciones vacías en comunicación alemana). La conversión se realiza volteando la ficha al lado de CP y colocando el marcador de rango de mando en el primer espacio del track. Esto NO se considera una acción.\n\n' +
          '§18.3 — Capacidades del CP: manda a todas las unidades de EE.UU. dentro de su rango actual (contando el hex de la unidad mandada, no el del CP). El rango puede contarse a través de hexes en campo de fuego alemán, pero no a través de hexes ocupados por unidades alemanas.\n\n' +
          '§18.32 — Un CP en el campo de fuego de una posición alemana ocupada NO puede mandar unidades; su rango tampoco puede aumentarse mientras esté en esa situación.\n\n' +
          '§18.33 — Un CP puede ser alcanzado por fuego alemán. Si es impactado, revierte inmediatamente a unidad HQ (gira la ficha y retira el marcador del track). El CP no es eliminado.',
        ruleRefs: [
          { section: '18.1', note: 'Establecer CP: hex fuera de campo de fuego potencial alemán; no es acción' },
          { section: '18.3', note: 'Radio del CP: cuenta hexes de la unidad, no del CP; puede contar a través de campo de fuego' },
          { section: '18.32', note: 'CP en campo de fuego: no puede mandar ni aumentar rango' },
          { section: '18.33', note: 'CP impactado: revierte a HQ, no es eliminado' },
        ],
      },
      {
        type: 'prose',
        content:
          'Bases de ingenieros (§19): a partir del turno 17, dispones de cuatro bases de ingenieros (dos por división). Representan ingenieros de combate que facilitan el movimiento de unidades fuera de la playa y por los draws. Una base de ingenieros colocada en un hex de playa aumenta gradualmente su radio operativo. Las unidades que realicen acciones de movimiento en hexes de playa, pabellón o draw dentro del radio operativo de una base actúan de forma gratuita.',
        ruleRefs: [{ section: '19', note: 'Bases de ingenieros: T17+; 4 bases; radio operativo creciente; movimiento gratuito en rango' }],
      },
    ],
  },

  // ------------------------------------------------------------------ Lesson 8-4
  {
    id: 'lesson-8-4',
    moduleId: 'module-8',
    order: 4,
    titleEs: 'Victoria en el juego extendido y variantes',
    blocks: [
      {
        type: 'prose',
        content:
          'Victoria en el juego extendido (§20): la condición de pérdida catastrófica sigue igual que en el juego básico. La victoria se determina en dos comprobaciones: una comprobación a mitad del escenario y una al final. El escenario "Beyond the Beach" (§21) tiene setup y condiciones de victoria distintos, diseñados para simular los combates más allá de la playa de Omaha.',
        ruleRefs: [{ section: '20', note: 'Victoria extendida: pérdida catastrófica igual; dos comprobaciones de victoria' }],
      },
      {
        type: 'rule-callout',
        content:
          '§22 — Variantes opcionales: el juego incluye cuatro variantes que modifican condiciones históricas:\n' +
          '• §22.1 — Bombardeo Aliado Efectivo: reduce algunas capacidades alemanas al inicio.\n' +
          '• §22.2 — Primer Oleaje de Tanques Aterriza Sano: permite a los tanques iniciales llegar con menos riesgos.\n' +
          '• §22.3 — Rangers refuerzan Pointe du Hoc: redistribuye unidades ranger.\n' +
          '• §22.4 — Reacción Alemana Mejorada: aumenta la dificultad de la respuesta alemana.\n' +
          'Estas variantes pueden combinarse entre sí y con el juego básico o extendido según las instrucciones del escenario elegido.',
        ruleRefs: [{ section: '22', note: 'Variantes opcionales: cuatro opciones para modificar condiciones históricas' }],
      },
      {
        type: 'prose',
        content:
          'Variante de Blindados Alemanes (§23): esta variante añade unidades de blindados alemanes que representan los refuerzos de panzer que históricamente podrían haber llegado a Omaha Beach. Los blindados alemanes tienen reglas de setup (§23.1), aparición (§23.2), campo de fuego (§23.3), acciones (§23.4), movimiento (§23.5), y reglas especiales para que EE.UU. los combata (§23.6) y ajustes de VP (§23.7).',
        ruleRefs: [{ section: '23', note: 'Variante de blindados alemanes: setup, aparición, campo de fuego, movimiento, VP' }],
      },
      {
        type: 'rule-callout',
        content:
          '§23.5 — Movimiento de blindados alemanes: los blindados se mueven por rutas predeterminadas impresas en el mapa de movimiento de blindados alemanes (mapa impreso separado). Este mapa no se reproduce en las reglas escritas; es una referencia visual imprescindible para jugar la variante. Las rutas de movimiento están fijadas y las reglas describen las condiciones de entrada, los hexes de inicio y las restricciones de parada.\n' +
          'Nota: este mapa es material físico del juego y no está disponible en estas lecciones. Para jugar la variante §23, necesitas el mapa impreso incluido en la caja del juego.',
        ruleRefs: [{ section: '23.5', note: 'Mapa de movimiento de blindados: mapa impreso separado, no reproducible aquí' }],
      },
    ],
  },
];
