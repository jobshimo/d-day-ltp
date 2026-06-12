import type { DrillScenario } from 'content-schema';

/**
 * Module 4 — Interactive fire-resolution drill (REQ-M4-03).
 *
 * ONE interactive-select drill exercising:
 * - §6.3: target symbol match and fire resolution
 * - §6.31: hit limits and priority order (intense before steady)
 * - §6.2: fire dot intensity determines priority
 *
 * Scenario: WN at a red position with 1 unit + 1 depth marker (hit limit = 2).
 * Fire card shows: red single symbol, target symbol ▲.
 * Board: 3 US units in the WN's field of fire at different intensities.
 * Correct answer: the TWO units that should be hit, in priority order.
 *
 * The correctAnswer is "unit-a,unit-b" (comma-separated, sorted by hex/unit ID).
 * The evaluator in domain-drill handles comma-separated IDs for interactive-select.
 */
export const MODULE_4_DRILLS: DrillScenario[] = [
  {
    id: 'drill-4-1',
    moduleId: 'module-4',
    type: 'interactive-select',
    questionEs:
      'El WN rojo (posición A) tiene 1 unidad y 1 depth marker (límite: 2 impactos). La fire card muestra rojo (símbolo simple) con target symbol ▲. Selecciona las DOS unidades de EE.UU. que reciben impacto según las reglas de prioridad.',
    boardSnippet: {
      hexes: [
        // German position (WN)
        {
          hexId: 'hex-wn-red',
          terrain: 'bluff',
          sector: 'east',
          isBeachBox: false,
          isGermanPosition: true,
          germanPositionColor: 'red',
          isVPPosition: false,
          fireDots: [],
        },
        // hex with INTENSE fire dot — highest priority
        {
          hexId: 'hex-a',
          terrain: 'beach',
          sector: 'east',
          isBeachBox: false,
          isGermanPosition: false,
          isVPPosition: false,
          fireDots: [{ positionId: 'hex-wn-red', intensity: 'intense' }],
        },
        // hex with INTENSE fire dot — also highest priority
        {
          hexId: 'hex-b',
          terrain: 'beach',
          sector: 'east',
          isBeachBox: false,
          isGermanPosition: false,
          isVPPosition: false,
          fireDots: [{ positionId: 'hex-wn-red', intensity: 'intense' }],
        },
        // hex with STEADY fire dot — lower priority
        {
          hexId: 'hex-c',
          terrain: 'pavilion',
          sector: 'east',
          isBeachBox: false,
          isGermanPosition: false,
          isVPPosition: false,
          fireDots: [{ positionId: 'hex-wn-red', intensity: 'steady' }],
        },
      ],
      units: [
        // Unit A — in hex-a (intense), target symbol ▲ (matches fire card)
        {
          kind: 'us',
          id: 'unit-a',
          type: 'infantry',
          steps: 3,
          targetSymbol: 'triangle',
          weapons: ['BZ'],
          attackStrength: 3,
          isDisrupted: false,
          hexId: 'hex-a',
        },
        // Unit B — in hex-b (intense), target symbol ● (does not match fire card, but still eligible)
        {
          kind: 'us',
          id: 'unit-b',
          type: 'infantry',
          steps: 3,
          targetSymbol: 'circle',
          weapons: ['BZ'],
          attackStrength: 3,
          isDisrupted: false,
          hexId: 'hex-b',
        },
        // Unit C — in hex-c (steady), target symbol ▲ (matches fire card)
        {
          kind: 'us',
          id: 'unit-c',
          type: 'infantry',
          steps: 2,
          targetSymbol: 'triangle',
          weapons: ['BZ'],
          attackStrength: 2,
          isDisrupted: false,
          hexId: 'hex-c',
        },
      ],
    },
    fireCard: {
      entries: [
        {
          color: 'red',
          symbol: 'single',
          hasArmorBonus: false,
          hasStar: false,
        },
      ],
      targetSymbol: 'triangle',
    },
    // Correct: unit-a (intense hex, priority 1) and unit-b (also intense hex, priority 1).
    // unit-c is in a steady hex (priority 2) but the hit limit is 2 and both intense
    // hexes each have 1 unit, so both intense-hex units are hit first.
    // Hit limit = 2 (1 unit + 1 depth marker per §6.31).
    correctAnswer: 'unit-a,unit-b',
    ruleRefs: [
      {
        section: '6.3',
        note: 'Resolución de fuego alemán: target symbol y condiciones de impacto',
      },
      {
        section: '6.31',
        note: 'Límite de 2 impactos (1 unidad + 1 depth marker); prioridad: intenso > sostenido',
      },
    ],
    explanationEs:
      'El WN rojo tiene 1 unidad + 1 depth marker, por lo que puede alcanzar hasta 2 unidades (§6.31). La prioridad es primero los hexes con fuego intenso (§6.31 Prioridad 1): hex-a (unidad-A ▲) y hex-b (unidad-B ●) ambos tienen fuego intenso. Como hay exactamente 2 unidades en hexes de fuego intenso y el límite es 2, ambas son alcanzadas. La unidad-C en el hex de fuego sostenido (hex-c) no es alcanzada porque el límite ya fue alcanzado. Nota: aunque la fire card muestra target symbol ▲, las unidades con otros símbolos en hexes de alta intensidad también pueden ser alcanzadas según la German Fire Chart.',
  },
];
