import type { DrillScenario, QuizItem } from 'content-schema';

/**
 * Module 6 drills — 2 multiple-choice drills + quiz.
 *
 * Drill 6-1 (multiple-choice): engineer clearance restriction (§10.1)
 * Drill 6-2 (multiple-choice): WN depth marker Tactical Reinforcement (§9.4)
 *
 * All rules verified against rules-text.txt lines 1580–1763.
 */
export const MODULE_6_DRILLS: DrillScenario[] = [
  // ---- Drill 6-1: Engineer clearance restriction (§10.1) ----
  {
    id: 'drill-6-1',
    moduleId: 'module-6',
    type: 'multiple-choice',
    questionEs:
      'Es el turno 8 (marea media). La fire card del sector este muestra colores: ROJO, AZUL y NARANJA. Las posiciones alemanas en el sector este son:\n' +
      '• WN-Rojo: ocupado, no disrupto, con campo de fuego en hex 0612 y 0613.\n' +
      '• WN-Azul: disrupto, con campo de fuego en hex 0609 y 0610.\n' +
      '• Posición Naranja (refuerzo): ocupada, no disrupta, con campo de fuego en hex 0611.\n' +
      'Según §10.1 y §10.12, ¿cuáles hexes puede limpiar de obstáculos la Fase de Ingenieros este turno? (en marea media solo se limpia 1 hex por sector)',
    choices: [
      {
        id: 'a',
        labelEs: 'Hex 0612 — está en el campo de fuego de WN-Rojo, pero el rojo sí aparece en la fire card.',
        isCorrect: false,
      },
      {
        id: 'b',
        labelEs: 'Cualquier hex con obstáculos que no esté en el campo de fuego de WN-Rojo, la posición Naranja, NI de WN-Azul (aunque esté disrupto, su color naranja sí aparece).',
        isCorrect: false,
      },
      {
        id: 'c',
        labelEs: 'Solo los hexes sin field of fire de WN-Rojo (activo, no disrupto, rojo en carta) y sin field of fire de posición Naranja (activa, no disrupta, naranja en carta). WN-Azul está disrupto, así que sus hexes SÍ son limpiables.',
        isCorrect: true,
      },
      {
        id: 'd',
        labelEs: 'Ningún hex puede limpiarse en marea media.',
        isCorrect: false,
      },
    ],
    correctAnswer: 'c',
    ruleRefs: [
      { section: '10.1', note: 'Solo se limpian hexes no en campo de fuego de posiciones no disruptas cuyo color aparezca en la fire card' },
      { section: '10.12', note: 'Marea media (turnos 7–15): 1 hex por sector' },
    ],
    explanationEs:
      'Según §10.1, no puedes limpiar hexes en el campo de fuego de posiciones alemanas NO DISRUPTAS cuyo color aparezca en la fire card del sector. WN-Rojo está activo (no disrupto) y su color rojo aparece en la carta → sus hexes (0612, 0613) NO se pueden limpiar. La Posición Naranja está activa y su color naranja aparece en la carta → su hex (0611) NO se puede limpiar. WN-Azul está DISRUPTO → aunque su color azul aparece en la carta, al estar disrupto no proyecta campo de fuego activo, por lo que sus hexes (0609, 0610) SÍ se pueden limpiar. En marea media (§10.12), solo se limpia 1 hex por sector.',
  },

  // ---- Drill 6-2: WN depth marker Tactical Reinforcement (§9.4) ----
  {
    id: 'drill-6-2',
    moduleId: 'module-6',
    type: 'multiple-choice',
    questionEs:
      'Durante el ataque de EE.UU. al WN Azul (hex 0805), revelas su depth marker y lees "Tactical Reinforcement". El Tactical Reinforcement Pool no está vacío. Las posiciones de refuerzo no ocupadas más cercanas son:\n' +
      '• Posición A (hex 0706, sin número de ID): a 2 hexes del WN-Azul, en comunicación alemana.\n' +
      '• Posición B (hex 0807, con ID "B4"): a 2 hexes del WN-Azul, en comunicación alemana, adyacente a una unidad de EE.UU.\n' +
      '• Posición C (hex 1005, con ID "C2"): a 3 hexes del WN-Azul, en comunicación alemana.\n' +
      'Según §9.4 y §9.41, ¿en qué posición se coloca el refuerzo táctico?',
    choices: [
      {
        id: 'a',
        labelEs: 'Posición A, porque tiene el "número" más bajo (0, para posiciones sin ID) y está más cerca.',
        isCorrect: false,
      },
      {
        id: 'b',
        labelEs: 'Posición B, porque en caso de empate de distancia tiene prioridad la posición más cercana a una unidad de EE.UU.',
        isCorrect: true,
      },
      {
        id: 'c',
        labelEs: 'Posición C, porque tiene el ID más alto.',
        isCorrect: false,
      },
      {
        id: 'd',
        labelEs: 'Posición A, porque las posiciones sin ID siempre tienen prioridad.',
        isCorrect: false,
      },
    ],
    correctAnswer: 'b',
    ruleRefs: [
      { section: '9.4', note: 'Tactical Reinforcement: posición más cercana al WN; empate → más cercana a una unidad de EE.UU.' },
      { section: '9.41', note: 'Posición sin ID = número 0; restricciones de comunicación del §9.33 aplican' },
    ],
    explanationEs:
      'Según §9.4, el refuerzo se coloca en la posición no ocupada MÁS CERCANA al WN del que se retiró el depth marker. La Posición A y la Posición B están ambas a 2 hexes del WN-Azul. En caso de empate de distancia (§9.4, paso 3), se prioriza la posición MÁS CERCANA a una unidad de EE.UU. La Posición B está adyacente a una unidad de EE.UU. y por tanto está más cerca que la Posición A. El refuerzo va a la Posición B. La Posición C está más lejos (3 hexes) y no entra en consideración.',
  },
];

/**
 * Module 6 review quiz — 4 items.
 * Covers §9 (German Units & Reinforcements) y §10 (Engineer Operations).
 */
export const MODULE_6_QUIZ: QuizItem[] = [
  // ---- Quiz 6-1: Revelar depth marker ----
  {
    id: 'quiz-6-1',
    moduleId: 'module-6',
    type: 'multiple-choice',
    questionEs:
      'Atacas una posición alemana con una unidad WN revelada y un depth marker no revelado. El resultado del ataque indica "Reveal the depth marker; compare again and consult the column to the right." ¿Qué haces a continuación?',
    choices: [
      { id: 'a', labelEs: 'Retiras el depth marker del juego y continúas con el ataque como si no existiera.', isCorrect: false },
      {
        id: 'b',
        labelEs: 'Volteas el depth marker boca arriba, recalculas la comparación de fuerzas y los requisitos de armas con el depth marker revelado, y consultas de nuevo la Attack Table en la columna "unit + revealed depth marker".',
        isCorrect: true,
      },
      { id: 'c', labelEs: 'Detienes el ataque; no puedes atacar una posición con depth marker.', isCorrect: false },
      { id: 'd', labelEs: 'Aplicas el resultado "German defeated" automáticamente porque revelas el depth marker.', isCorrect: false },
    ],
    correctAnswer: 'b',
    ruleRefs: [{ section: '9.1', note: 'Depth marker revelado por ataque suficientemente fuerte; recalcular con el marcador revelado' }, { section: '8.3', note: 'Procedimiento de resolución: revelar depth marker y reconsultar la tabla' }],
    explanationEs:
      'Según §8.3 (paso 4 del procedimiento de resolución), cuando el resultado de la Attack Table dice "Reveal the depth marker", volteas el marcador para revelar su valor de fuerza adicional y requisitos de armas. Recalculas la comparación de fuerzas (ahora la fuerza alemana aumenta con el depth marker) y los requisitos de armas (pueden añadirse nuevos). Luego consultas la Attack Table de nuevo, ahora usando la columna "unit + revealed depth marker".',
  },

  // ---- Quiz 6-2: Prioridades de pool de depth markers ----
  {
    id: 'quiz-6-2',
    moduleId: 'module-6',
    type: 'multiple-choice',
    questionEs:
      'Un evento ordena colocar un depth marker en una unidad de refuerzo alemán que ocupa un hex de terreno abierto (no es un edificio). El pool de profundidad móvil está vacío, pero el pool de edificio tiene marcadores disponibles. ¿Qué haces según §9.24?',
    choices: [
      { id: 'a', labelEs: 'Tomas un marcador del pool de edificio, porque el pool móvil está vacío.', isCorrect: false },
      { id: 'b', labelEs: 'No se coloca ningún depth marker; los alemanes se han quedado sin reservas.', isCorrect: true },
      { id: 'c', labelEs: 'Tomas del pool WN porque es el más numeroso.', isCorrect: false },
      { id: 'd', labelEs: 'Coloca el marcador sin extraer del pool; todos los depth markers son idénticos.', isCorrect: false },
    ],
    correctAnswer: 'b',
    ruleRefs: [{ section: '9.24', note: 'Si el pool móvil está vacío cuando se necesita uno móvil, los alemanes se han quedado sin reservas — no se coloca ningún depth marker' }],
    explanationEs:
      'Según §9.24, la cadena de sustitución es: pool WN vacío → usar posición de refuerzo; pool de edificio vacío → usar pool móvil; pool móvil vacío → no se coloca ningún depth marker. Aquí se necesita un depth marker MÓVIL (refuerzo en terreno abierto). El pool móvil está vacío y no hay sustituto disponible en esta dirección de la cadena. El pool de edificio solo se usa como sustituto cuando el pool de edificio (no el móvil) es el que se necesita originalmente.',
  },

  // ---- Quiz 6-3: Restricción de ingenieros por fire card ----
  {
    id: 'quiz-6-3',
    moduleId: 'module-6',
    type: 'multiple-choice',
    questionEs:
      'Es el turno 5 (marea baja). La fire card del sector oeste muestra colores: GRIS, VERDE y MARRÓN. La posición gris está eliminada. La posición verde está no disrupta. La posición marrón está disrupta. ¿Cuántos hexes de playa puedes limpiar en el sector oeste este turno y bajo qué restricción?',
    choices: [
      {
        id: 'a',
        labelEs: 'Dos hexes, evitando solo los hexes en el campo de fuego de la posición verde (no disrupta, verde en carta).',
        isCorrect: true,
      },
      {
        id: 'b',
        labelEs: 'Dos hexes, evitando los campos de fuego de gris, verde y marrón.',
        isCorrect: false,
      },
      {
        id: 'c',
        labelEs: 'Un solo hex, porque siempre se aplica el límite de marea media.',
        isCorrect: false,
      },
      {
        id: 'd',
        labelEs: 'Ningún hex, porque hay posiciones activas en el sector.',
        isCorrect: false,
      },
    ],
    correctAnswer: 'a',
    ruleRefs: [
      { section: '10.1', note: 'Solo posiciones no disruptas cuyo color aparece en la fire card restringen la limpieza' },
      { section: '10.12', note: 'Marea baja (turnos 2–6): hasta dos hexes por sector' },
    ],
    explanationEs:
      'Según §10.1, la restricción aplica a hexes en el campo de fuego de posiciones NO DISRUPTAS cuyo color aparezca en la fire card. La posición gris está ELIMINADA → sin efecto. La posición marrón está DISRUPTA → sin efecto. Solo la posición verde está activa (no disrupta) y su color aparece en la carta → sus hexes de campo de fuego no pueden limpiarse. Todos los demás hexes de obstáculos en el sector oeste sí pueden limpiarse. En marea baja (§10.12), el límite es dos hexes por sector.',
  },

  // ---- Quiz 6-4: KG Meyer ----
  {
    id: 'quiz-6-4',
    moduleId: 'module-6',
    type: 'multiple-choice',
    questionEs:
      '¿Qué ocurre cuando se extrae el evento "Kampfgruppe Meyer" por segunda vez en la misma partida?',
    choices: [
      { id: 'a', labelEs: 'Se liberan otras 4 unidades y 2 depth markers de KG Meyer al Division Pool.', isCorrect: false },
      { id: 'b', labelEs: 'Depende: si quedan unidades en la caja de KG Meyer, se liberan; si ya se liberaron las 8, el evento se ignora.', isCorrect: true },
      { id: 'c', labelEs: 'El evento se ignora automáticamente en la segunda extracción.', isCorrect: false },
      { id: 'd', labelEs: 'Las unidades de KG Meyer ya liberadas vuelven a la caja y pueden liberarse de nuevo.', isCorrect: false },
    ],
    correctAnswer: 'b',
    ruleRefs: [{ section: '9.5', note: 'KG Meyer: cada extracción libera 4 unidades + 2 depth markers; si las 8 ya fueron liberadas, el evento se ignora' }],
    explanationEs:
      'Según §9.5, cada vez que se extrae el evento KG Meyer se seleccionan aleatoriamente 4 unidades y 2 depth markers de la caja KG Meyer y se transfieren al Division Reinforcement Pool y Mobile Depth Box. La caja tiene 8 unidades en total. Si en la segunda extracción todavía quedan unidades en la caja, se liberan hasta 4 más. Solo cuando TODAS las 8 unidades de KG Meyer han sido liberadas, los eventos KG Meyer subsiguientes se ignoran.',
  },
];
