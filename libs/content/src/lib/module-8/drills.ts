import type { DrillScenario, QuizItem } from 'content-schema';

/**
 * Module 8 drills — 2 multiple-choice drills + quiz.
 *
 * Drill 8-1 (multiple-choice): German action letter interpretation (§16)
 * Drill 8-2 (multiple-choice): extended game action count + free actions (§14, §15)
 *
 * German Action Summary chart (EXT-07) NOT reproduced; actions described
 * from rules text individually.
 * All rules verified against rules-text.txt lines 2004–2501.
 */
export const MODULE_8_DRILLS: DrillScenario[] = [
  // ---- Drill 8-1: German action letter interpretation (§16) ----
  {
    id: 'drill-8-1',
    moduleId: 'module-8',
    type: 'multiple-choice',
    questionEs:
      'La fire card del turno 19 muestra el color Rojo con la letra "A". Hay una posición de refuerzo roja OCUPADA por una unidad de la 352.ª División (revelada, con depth marker) con una flecha de avance. NO hay unidades de EE.UU. en su campo de fuego. La posición de destino de la flecha no está ocupada por ninguna unidad alemana. Según §16.8, ¿qué ocurre?',
    choices: [
      {
        id: 'a',
        labelEs: 'La posición dispara normalmente porque tiene US en el campo de fuego.',
        isCorrect: false,
      },
      {
        id: 'b',
        labelEs: 'La posición no hace nada porque no hay US en su campo de fuego.',
        isCorrect: false,
      },
      {
        id: 'c',
        labelEs: 'La unidad intenta avanzar: verifica la ruta de avance, disrúpte unidades de EE.UU. en ella y comprueba si la fuerza no disrupta es menor de 7 para avanzar con éxito.',
        isCorrect: true,
      },
      {
        id: 'd',
        labelEs: 'La unidad retrocede al pool de refuerzos porque no puede atacar sin US en su campo de fuego.',
        isCorrect: false,
      },
    ],
    correctAnswer: 'c',
    ruleRefs: [
      { section: '16.81', note: 'Condiciones de intento de avance: sin US en campo de fuego → siempre intenta avanzar' },
      { section: '16.82', note: 'Procedimiento de avance: ruta, disrupción, umbral de 7 para resistir' },
    ],
    explanationEs:
      'Según §16.81, una unidad que cumple los requisitos de avance INTENTA avanzar si no hay unidades de EE.UU. en su campo de fuego (condición del primer punto de §16.81). La unidad 352.ª revelada con depth marker califica. Al no haber EE.UU. en su campo de fuego, la condición de intento se cumple automáticamente. Se sigue el procedimiento de §16.82: determinar la ruta de avance, disrúptar unidades con el target symbol de la carta, sumar la fuerza no disrupta, y comparar con el umbral de 7. Si hay unidades en la ruta, puede que el avance sea repulsado. Si la ruta está vacía, el alemán avanza directamente.',
  },

  // ---- Drill 8-2: Extended game action count + free actions (§14, §15) ----
  {
    id: 'drill-8-2',
    moduleId: 'module-8',
    type: 'multiple-choice',
    questionEs:
      'Es el turno 18 del juego extendido. Tienes estas unidades en la 1.ª División:\n' +
      '• Infantería A: unidad regular, sin marcadores especiales.\n' +
      '• Infantería B: tiene un marcador de Héroe.\n' +
      '• Infantería C: está dentro del radio de mando de un CP (Command Post) establecido.\n' +
      '• Infantería D: es una unidad ranger.\n' +
      '¿Cuántas acciones de la asignación de la división consume realizar una acción con cada una de estas cuatro unidades?',
    choices: [
      {
        id: 'a',
        labelEs: 'A=1, B=1, C=1, D=1 — todas consumen una acción de la asignación de la división.',
        isCorrect: false,
      },
      {
        id: 'b',
        labelEs: 'A=1, B=0 (acción gratuita por Héroe), C=0 (acción gratuita por CP), D=0 (acción gratuita por ranger). Total: 1 acción de asignación.',
        isCorrect: true,
      },
      {
        id: 'c',
        labelEs: 'A=1, B=0, C=1, D=0 — los CP no confieren acción gratuita en el juego extendido.',
        isCorrect: false,
      },
      {
        id: 'd',
        labelEs: 'Ninguna consume acciones; en el juego extendido todas las unidades actúan de forma gratuita.',
        isCorrect: false,
      },
    ],
    correctAnswer: 'b',
    ruleRefs: [
      { section: '7.1', note: 'Acciones gratuitas: rangers siempre, unidades con Héroe, unidades en mando de HQ o General' },
      { section: '18.3', note: 'CP: unidades en su radio de mando reciben los mismos beneficios que las bajo mando de HQ, incluyendo acción gratuita' },
      { section: '15', note: 'Juego extendido: tres acciones por división; reglas de acción gratuita se mantienen y amplían' },
    ],
    explanationEs:
      'En el juego extendido cada división tiene tres acciones de asignación por turno (§15). Pero las acciones gratuitas siguen igual que en el básico. La Infantería B tiene un Héroe → acción gratuita (§7.1). La Infantería C está en el radio del CP → acción gratuita, porque §18.3 aclara que las unidades en el radio de mando de un CP reciben los mismos beneficios que las unidades bajo mando de un HQ, incluyendo la acción gratuita. La Infantería D es ranger → acción gratuita (§7.1). Solo la Infantería A es una unidad regular sin ninguna fuente de acción gratuita, por lo que consume 1 de las 3 acciones de asignación de la división.',
  },
];

/**
 * Module 8 review quiz — 4 items.
 * Covers §14–§23 (Extended Game and Variants).
 */
export const MODULE_8_QUIZ: QuizItem[] = [
  // ---- Quiz 8-1: Cambios al límite de impactos en el juego extendido ----
  {
    id: 'quiz-8-1',
    moduleId: 'module-8',
    type: 'multiple-choice',
    questionEs:
      'En el juego extendido (§14.11), ¿cómo cambia el límite de impactos alemán en comparación con el juego básico?',
    choices: [
      { id: 'a', labelEs: 'El límite de impactos se reduce a la mitad para reflejar el agotamiento alemán.', isCorrect: false },
      { id: 'b', labelEs: 'El límite de impactos se duplica: una posición puede impactar al doble de unidades de EE.UU.', isCorrect: true },
      { id: 'c', labelEs: 'El límite de impactos no cambia, pero los resultados de la chart son más severos.', isCorrect: false },
      { id: 'd', labelEs: 'El límite de impactos ahora incluye a los líderes de EE.UU. automáticamente.', isCorrect: false },
    ],
    correctAnswer: 'b',
    ruleRefs: [{ section: '14.11', note: 'Límite de impactos alemán duplicado en el juego extendido' }],
    explanationEs:
      'Según §14.11, en el juego extendido los límites de §6.31 se DUPLICAN. Una posición ocupada por una sola unidad sin depth marker (que normalmente puede impactar a 1 unidad de EE.UU.) pasa a poder impactar a 2. Una posición con una unidad y un depth marker (normalmente 2 impactos) pasa a poder impactar a 4. Esto refleja el cambio de escala temporal de 15 a 30 minutos por turno, lo que permite mayor intensidad de fuego.',
  },

  // ---- Quiz 8-2: Significado de la letra de acción alemana "P" ----
  {
    id: 'quiz-8-2',
    moduleId: 'module-8',
    type: 'multiple-choice',
    questionEs:
      'La fire card del juego extendido muestra la letra "P" junto al color de una posición de refuerzo ocupada. ¿Qué acción realiza esa posición según §16.6?',
    choices: [
      { id: 'a', labelEs: 'La posición dispara normalmente usando la German Fire Chart.', isCorrect: false },
      { id: 'b', labelEs: 'La posición realiza una Patrulla: disrupta a todas las unidades de EE.UU. en su campo de fuego intenso y sostenido.', isCorrect: true },
      { id: 'c', labelEs: 'La posición intenta avanzar a la posición de refuerzo más cercana.', isCorrect: false },
      { id: 'd', labelEs: 'La posición se retira al pool de División.', isCorrect: false },
    ],
    correctAnswer: 'b',
    ruleRefs: [{ section: '16.6', note: 'Patrol (P): disrupta a todas las US en campo de fuego intenso y sostenido; o a la más cercana si ninguna en esos campos' }],
    explanationEs:
      'Según §16.6, la acción "P" (Patrol) corresponde a una posición de refuerzo OCUPADA que realiza una patrulla y ataques de hostigamiento. En lugar de disparar, coloca marcadores de disrupción en TODAS las unidades de EE.UU. en hexes con fire dots de intenso y sostenido (no esporádico) de esa posición. Si no hay unidades de EE.UU. en esos campos, disrupta a la unidad más cercana dentro de 3 hexes de la posición.',
  },

  // ---- Quiz 8-3: Diferencia CP vs HQ ----
  {
    id: 'quiz-8-3',
    moduleId: 'module-8',
    type: 'multiple-choice',
    questionEs:
      '¿Cuál es la diferencia principal entre un HQ regular y un Command Post (CP) según §18?',
    choices: [
      {
        id: 'a',
        labelEs: 'Un CP puede moverse libremente; un HQ tiene restricciones de movimiento.',
        isCorrect: false,
      },
      {
        id: 'b',
        labelEs: 'Un CP no puede moverse, pero su radio de mando puede aumentar hasta 4 hexes con el tiempo; un HQ manda solo 1 hex (propio + adyacentes).',
        isCorrect: true,
      },
      {
        id: 'c',
        labelEs: 'Un CP elimina unidades alemanas; un HQ solo las disrupta.',
        isCorrect: false,
      },
      {
        id: 'd',
        labelEs: 'Un CP solo está disponible en el escenario Beyond the Beach.',
        isCorrect: false,
      },
    ],
    correctAnswer: 'b',
    ruleRefs: [
      { section: '18', note: 'CP: no puede moverse; radio de mando crece hasta 4 hexes' },
      { section: '11.2', note: 'HQ: manda hex propio + adyacentes (rango 1); puede moverse' },
    ],
    explanationEs:
      'Según §18, un CP se establece convirtiendo un HQ y ya no puede moverse. A cambio, su radio de mando puede aumentarse progresivamente a lo largo de los turnos hasta alcanzar 4 hexes, lo que le permite mandar unidades mucho más lejos que un HQ normal. Un HQ regular manda su propio hex y los adyacentes (rango 1 efectivo), pero puede moverse. El CP sacrifica la movilidad por el alcance de mando extendido, siendo especialmente valioso cuando la acción se desarrolla lejos de la playa.',
  },

  // ---- Quiz 8-4: Variante de blindados alemanes ----
  {
    id: 'quiz-8-4',
    moduleId: 'module-8',
    type: 'multiple-choice',
    questionEs:
      'La variante de blindados alemanes (§23) requiere un elemento adicional que NO está incluido en las reglas escritas. ¿Cuál es?',
    choices: [
      { id: 'a', labelEs: 'Un dado especial de seis caras para determinar la aparición de blindados.', isCorrect: false },
      { id: 'b', labelEs: 'El mapa de movimiento de blindados alemanes (§23.5), un mapa impreso separado incluido en la caja del juego.', isCorrect: true },
      { id: 'c', labelEs: 'Una baraja de cartas adicional exclusiva para la variante.', isCorrect: false },
      { id: 'd', labelEs: 'Un segundo set de fichas de WN para representar los blindados.', isCorrect: false },
    ],
    correctAnswer: 'b',
    ruleRefs: [{ section: '23.5', note: 'Mapa de movimiento de blindados alemanes: mapa impreso separado; rutas predeterminadas en el mapa' }],
    explanationEs:
      'Según §23.5, el movimiento de los blindados alemanes se realiza siguiendo rutas predeterminadas impresas en el mapa de movimiento de blindados alemanes, que es un mapa impreso separado incluido en la caja física del juego. Las reglas escritas describen las condiciones de entrada y restricciones, pero las rutas específicas solo están en ese mapa. Sin ese mapa, no es posible jugar la variante §23.',
  },
];
