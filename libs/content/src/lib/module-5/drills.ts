import type { DrillScenario, QuizItem } from 'content-schema';

/**
 * Module 5 drills — 3 drills + quiz.
 *
 * Drill 5-1 (multiple-choice): attack eligibility (§8.1)
 * Drill 5-2 (interactive-select): infiltration move trigger (§7.32)
 * Drill 5-3 (multiple-choice): barrage restrictions (§8.4)
 *
 * US Attack Table (EXT-03), US Weapons Chart (EXT-04) and US Barrage Table
 * (EXT-05) values NOT reproduced — inline scenario values only.
 * All rules verified against rules-text.txt lines 1093–1576.
 */
export const MODULE_5_DRILLS: DrillScenario[] = [
  // ---- Drill 5-1: Attack eligibility (§8.1) ----
  {
    id: 'drill-5-1',
    moduleId: 'module-5',
    type: 'multiple-choice',
    questionEs:
      'Quieres atacar una posición WN alemana en hex-wn. Tienes las siguientes unidades:\n' +
      '• Infantería A en un hex adyacente al objetivo (rango 1).\n' +
      '• Tanque B en un hex adyacente a la Infantería A y también adyacente al objetivo.\n' +
      '• Artillería C a tres hexes del objetivo, bajo mando de un HQ que también comanda a la Infantería A.\n' +
      '• Tanque D en rango del objetivo, pero sin adyacencia al objetivo, sin adyacencia a ninguna unidad atacante y sin mando de HQ o General.\n' +
      'Según §8.1, ¿qué unidades pueden participar en el ataque?',
    choices: [
      {
        id: 'a',
        labelEs: 'Infantería A, Tanque B y Artillería C; el Tanque D no cumple los requisitos de elegibilidad.',
        isCorrect: true,
      },
      {
        id: 'b',
        labelEs: 'Solo la Infantería A; el resto requiere mando de HQ para participar.',
        isCorrect: false,
      },
      {
        id: 'c',
        labelEs: 'Infantería A, Tanque B, Artillería C y Tanque D; todas las unidades en rango pueden participar.',
        isCorrect: false,
      },
      {
        id: 'd',
        labelEs: 'Infantería A y Tanque B; la artillería nunca puede participar en ataques directos.',
        isCorrect: false,
      },
    ],
    correctAnswer: 'a',
    ruleRefs: [
      { section: '8.1', note: 'Elegibilidad de tanques: adyacente al objetivo, adyacente a infantería atacante, o bajo mando HQ/General' },
      { section: '8.1', note: 'Elegibilidad de artillería: en rango no adyacente, bajo mando de HQ que comanda infantería atacante' },
    ],
    explanationEs:
      'Según §8.1, la Infantería A califica como el atacante base requerido (adyacente al objetivo). El Tanque B califica porque está adyacente al objetivo (y también adyacente a una infantería atacante). La Artillería C califica porque está en rango (no adyacente) y bajo mando de un HQ que también comanda a la Infantería A atacante. El Tanque D NO califica: está en rango pero no está adyacente al objetivo, no está adyacente a una infantería atacante, y ningún atacante ni él mismo está bajo mando de HQ o General.',
  },

  // ---- Drill 5-2: Interactive-select — infiltration move trigger (§7.32) ----
  {
    id: 'drill-5-2',
    moduleId: 'module-5',
    type: 'interactive-select',
    questionEs:
      'La posición WN naranja (hex-wn-orange) está ocupada y NO está disrupta. Tiene fire dots en hex-beach-1 (intenso), hex-beach-2 (intenso) y hex-bluff-3 (sostenido). La Unidad de EE.UU. "unit-us-x" está actualmente en hex-beach-1 (dentro del campo de fuego naranja). ¿Hacia qué hexes representaría un movimiento de INFILTRACIÓN según §7.32? Selecciona todos los hexes de destino que activarían la verificación de infiltración.',
    boardSnippet: {
      hexes: [
        // German WN orange (occupied, not disrupted)
        {
          hexId: 'hex-wn-orange',
          terrain: 'bluff',
          sector: 'east',
          isBeachBox: false,
          isGermanPosition: true,
          germanPositionColor: 'orange',
          isVPPosition: false,
          fireDots: [],
        },
        // hex-beach-1: orange intense fire dot (US unit is here)
        {
          hexId: 'hex-beach-1',
          terrain: 'beach',
          sector: 'east',
          isBeachBox: false,
          isGermanPosition: false,
          isVPPosition: false,
          fireDots: [{ positionId: 'hex-wn-orange', intensity: 'intense' }],
        },
        // hex-beach-2: orange intense fire dot (valid infiltration destination)
        {
          hexId: 'hex-beach-2',
          terrain: 'beach',
          sector: 'east',
          isBeachBox: false,
          isGermanPosition: false,
          isVPPosition: false,
          fireDots: [{ positionId: 'hex-wn-orange', intensity: 'intense' }],
        },
        // hex-bluff-3: orange steady fire dot (valid infiltration destination)
        {
          hexId: 'hex-bluff-3',
          terrain: 'bluff',
          sector: 'east',
          isBeachBox: false,
          isGermanPosition: false,
          isVPPosition: false,
          fireDots: [{ positionId: 'hex-wn-orange', intensity: 'steady' }],
        },
        // hex-clear-4: no fire dots from orange (normal move, not infiltration)
        {
          hexId: 'hex-clear-4',
          terrain: 'beach',
          sector: 'east',
          isBeachBox: false,
          isGermanPosition: false,
          isVPPosition: false,
          fireDots: [],
        },
      ],
      units: [
        // German unit in WN orange (not disrupted)
        {
          kind: 'german',
          id: 'german-orange',
          type: 'WN',
          isRevealed: false,
          strength: 3,
          weaponRequirements: [],
          hasDepthMarker: false,
          isDisrupted: false,
          hexId: 'hex-wn-orange',
        },
        // US unit in hex-beach-1
        {
          kind: 'us',
          id: 'unit-us-x',
          type: 'infantry',
          steps: 3,
          targetSymbol: 'square',
          weapons: ['BZ', 'BG'],
          attackStrength: 3,
          isDisrupted: false,
          hexId: 'hex-beach-1',
        },
      ],
    },
    // Infiltration: unit moves FROM hex in orange field of fire TO another hex ALSO in orange field of fire.
    // hex-beach-2 and hex-bluff-3 both have orange fire dots → both trigger infiltration check.
    // hex-clear-4 has no orange fire dots → normal move, no infiltration.
    correctAnswer: 'hex-beach-2,hex-bluff-3',
    ruleRefs: [
      { section: '7.32', note: 'Infiltración: origen Y destino deben estar en campo de fuego de la misma posición ocupada no disrupta' },
    ],
    explanationEs:
      'Según §7.32, un movimiento de infiltración ocurre cuando la unidad se mueve DESDE un hex que está adyacente a una posición alemana ocupada y no disrupta y en su campo de fuego, HACIA otro hex que también está adyacente y en el campo de fuego de ESA MISMA posición. La Unidad X está en hex-beach-1 (dentro del campo de fuego naranja). Si se mueve a hex-beach-2 (también en el campo de fuego naranja) → infiltración. Si se mueve a hex-bluff-3 (también en el campo de fuego naranja) → infiltración. Si se mueve a hex-clear-4 (sin fire dots naranjas) → movimiento normal, sin verificación de infiltración.',
  },

  // ---- Drill 5-3: Barrage restrictions (§8.4) ----
  {
    id: 'drill-5-3',
    moduleId: 'module-5',
    type: 'multiple-choice',
    questionEs:
      'Tu unidad de tanque está en hex-tank-1, a tres hexes de la posición WN en hex-wn-target (en rango pero no adyacente). El tanque no ocupa ningún hex en el campo de fuego del WN. No hay ninguna unidad de infantería de EE.UU. en el campo de fuego del WN. ¿Puede el tanque realizar un barrage contra el WN objetivo?',
    choices: [
      {
        id: 'a',
        labelEs: 'Sí, porque el tanque está en rango y no adyacente al objetivo.',
        isCorrect: false,
      },
      {
        id: 'b',
        labelEs: 'No, porque el tanque no ocupa un hex en el campo de fuego del WN y no hay infantería observadora en ese campo.',
        isCorrect: true,
      },
      {
        id: 'c',
        labelEs: 'Sí, siempre que no haya otros tanques también intentando barraguear.',
        isCorrect: false,
      },
      {
        id: 'd',
        labelEs: 'No, porque los tanques nunca pueden barraguear posiciones WN.',
        isCorrect: false,
      },
    ],
    correctAnswer: 'b',
    ruleRefs: [
      { section: '8.4', note: 'Barrage: tanque en rango no adyacente Y (en campo de fuego del objetivo OR infantería observadora en ese campo)' },
    ],
    explanationEs:
      'Según §8.4, un tanque puede barraguear si está en rango y NO adyacente al objetivo, Y se cumple al menos una de estas dos condiciones: (1) el propio tanque ocupa un hex en el campo de fuego del objetivo, o (2) una unidad de infantería no disrupta ocupa un hex en el campo de fuego del objetivo. En este escenario, el tanque no está en el campo de fuego del WN y tampoco hay infantería observadora allí. Por lo tanto, NO puede realizar el barrage aunque esté en rango.',
  },
];

/**
 * Module 5 review quiz — 4 items.
 * Covers §7 (US Actions) y §8 (US Combat Actions).
 */
export const MODULE_5_QUIZ: QuizItem[] = [
  // ---- Quiz 5-1: Acción gratuita de Ranger ----
  {
    id: 'quiz-5-1',
    moduleId: 'module-5',
    type: 'multiple-choice',
    questionEs:
      'Tienes una unidad de infantería ranger en la playa. ¿Cuántas acciones puede realizar por turno y de qué tipo?',
    choices: [
      { id: 'a', labelEs: 'Dos acciones normales, consumiendo dos de la asignación de la división.', isCorrect: false },
      { id: 'b', labelEs: 'Una acción gratuita (no consume la asignación de la división), y una sola acción en total por turno.', isCorrect: true },
      { id: 'c', labelEs: 'Dos acciones gratuitas por su condición de ranger.', isCorrect: false },
      { id: 'd', labelEs: 'Sin acciones; los rangers solo actúan durante el desembarco.', isCorrect: false },
    ],
    correctAnswer: 'b',
    ruleRefs: [{ section: '7.1', note: 'Rangers: siempre actúan de forma gratuita; pero solo una acción por turno en total' }],
    explanationEs:
      'Según §7.1, las unidades de infantería ranger siempre realizan sus acciones de forma gratuita (no consumen la asignación de dos acciones de la división). Sin embargo, §7.2 aclara que una unidad solo puede realizar UNA acción por turno, ya sea gratuita o no. Por lo tanto, un ranger puede realizar una sola acción gratuita por turno.',
  },

  // ---- Quiz 5-2: Condiciones de infiltración ----
  {
    id: 'quiz-5-2',
    moduleId: 'module-5',
    type: 'multiple-choice',
    questionEs:
      'Una unidad de EE.UU. se mueve de hex-A a hex-B. La posición WN roja ocupa el hex-wn-red. El hex-A tiene un fire dot rojo (intenso) de esa posición. El hex-B NO tiene fire dots rojos. La posición roja está ocupada y no está disrupta. ¿Se activa la verificación de infiltración?',
    choices: [
      { id: 'a', labelEs: 'Sí, porque la unidad parte desde un hex en el campo de fuego de una posición alemana ocupada.', isCorrect: false },
      { id: 'b', labelEs: 'No, porque el hex de destino (hex-B) no está en el campo de fuego de la posición roja.', isCorrect: true },
      { id: 'c', labelEs: 'Sí, siempre que la posición alemana no esté disrupta.', isCorrect: false },
      { id: 'd', labelEs: 'No, porque solo la infantería puede ser objetivo de infiltración.', isCorrect: false },
    ],
    correctAnswer: 'b',
    ruleRefs: [{ section: '7.32', note: 'Infiltración: AMBOS hexes (origen y destino) deben estar en el campo de fuego de la misma posición' }],
    explanationEs:
      'Según §7.32, la verificación de infiltración solo se activa si la unidad se mueve DESDE un hex en el campo de fuego de una posición alemana ocupada y no disrupta HACIA otro hex que también esté en el campo de fuego de ESA MISMA posición. Aquí el hex-B no tiene fire dots rojos, por lo que no está en el campo de fuego de la posición roja. No se activa la infiltración.',
  },

  // ---- Quiz 5-3: Requisito de armas y flanqueo ----
  {
    id: 'quiz-5-3',
    moduleId: 'module-5',
    type: 'multiple-choice',
    questionEs:
      'La unidad alemana en el objetivo lista los requisitos: BZ (bazooka) y FL (flanqueo). Tus unidades atacantes tienen bazooka (BZ) pero solo están atacando desde un único hex adyacente. ¿Con qué sección de la US Attack Table resuelves el ataque?',
    choices: [
      { id: 'a', labelEs: 'Sección inferior (Weapons YES), porque tienes el BZ.', isCorrect: false },
      { id: 'b', labelEs: 'Sección superior (Weapons NO), porque no cumples el requisito de flanqueo (FL).', isCorrect: true },
      { id: 'c', labelEs: 'Sección inferior si tienes un Héroe que sustituya el flanqueo.', isCorrect: false },
      { id: 'd', labelEs: 'El ataque no puede realizarse si no se cumplen todos los requisitos de armas.', isCorrect: false },
    ],
    correctAnswer: 'b',
    ruleRefs: [
      { section: '8.2', note: 'Todos los requisitos de armas deben cumplirse para usar la sección inferior' },
      { section: '8.22', note: 'Flanqueo (FL): atacar desde al menos dos hexes no adyacentes entre sí' },
      { section: '8.23', note: 'Héroe no puede sustituir el requisito de flanqueo' },
    ],
    explanationEs:
      'Según §8.2, debes cumplir TODOS los requisitos de armas del defensor para usar la sección inferior (Weapons YES) de la US Attack Table. El requisito de FL (flanqueo) requiere atacar desde al menos dos hexes adyacentes al objetivo pero no adyacentes entre sí (§8.22). Al atacar desde un solo hex no cumples FL. Además, §8.23 aclara que el Héroe no puede sustituir el requisito de flanqueo. Por lo tanto, debes usar la sección superior (Weapons NO).',
  },

  // ---- Quiz 5-4: Barrage naval como acción gratuita ----
  {
    id: 'quiz-5-4',
    moduleId: 'module-5',
    type: 'multiple-choice',
    questionEs:
      'Tienes un marcador de fuego naval y quieres realizar un barrage de artillería naval. ¿Cuál de estas afirmaciones es CORRECTA según §8.52–§8.53?',
    choices: [
      {
        id: 'a',
        labelEs: 'El barrage naval consume una de las dos acciones de la división.',
        isCorrect: false,
      },
      {
        id: 'b',
        labelEs: 'El barrage naval es una acción gratuita, pero el hex objetivo no puede ser atacado Y barrajeado en la misma fase.',
        isCorrect: true,
      },
      {
        id: 'c',
        labelEs: 'El barrage naval elimina la unidad alemana del objetivo.',
        isCorrect: false,
      },
      {
        id: 'd',
        labelEs: 'El barrage naval requiere que una unidad de infantería con radio esté adyacente al objetivo.',
        isCorrect: false,
      },
    ],
    correctAnswer: 'b',
    ruleRefs: [
      { section: '8.52', note: 'Barrage naval: disrupción + retira depth marker; no elimina unidades alemanas' },
      { section: '8.53', note: 'Barrage naval: acción gratuita; un hex no puede ser atacado Y barrajeado en la misma fase' },
    ],
    explanationEs:
      'Según §8.53, el barrage de artillería naval es una acción gratuita (no consume la asignación de acciones de la división). Sin embargo, un mismo hex alemán ocupado no puede ser objeto tanto de un ataque normal como de un barrage naval en la misma Fase de Acción. El efecto del barrage naval (§8.52) es colocar un marcador de disrupción y retirar el depth marker si lo hay; las unidades alemanas NO son eliminadas. El requisito es que al menos una infantería no disrupta con radio o bajo mando de HQ esté en el campo de fuego del objetivo, no necesariamente adyacente.',
  },
];
