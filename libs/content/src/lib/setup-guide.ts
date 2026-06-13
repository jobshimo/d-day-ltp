import type { CounterLessonConfig } from 'content-schema';

// ---------------------------------------------------------------------------
// Content model — Setup Guide
// ---------------------------------------------------------------------------

/**
 * A single procedural step in the game setup sequence.
 * Types are kept in this content lib (not in content-schema) to avoid
 * coupling setup-guide data to the shared API schema.
 */
export interface SetupStep {
  /** Stable unique id, e.g. "wn-depth-markers". */
  id: string;
  /** Short title in neutral professional Spanish. */
  titleEs: string;
  /** Procedural body text in neutral professional Spanish. */
  bodyEs: string;
  /** Rules section reference, e.g. "§3". */
  ruleRef?: string;
  /** Shorter label for the checklist (play mode). Falls back to titleEs when absent. */
  checklistLabelEs?: string;
  /** Optional counter to render inline in learn mode (mirrors CounterLessonConfig). */
  pieceExample?: CounterLessonConfig;
  /** Foreign key to the parent SetupStepGroup.id. */
  groupId: string;
}

/** A named group of related setup steps. */
export interface SetupStepGroup {
  /** Stable unique id, e.g. "german-wn". */
  id: string;
  /** Group heading in neutral professional Spanish. */
  titleEs: string;
  /** Ordered list of steps belonging to this group. */
  steps: SetupStep[];
}

// ---------------------------------------------------------------------------
// Step data — grounded in rules-text.txt §3 (lines 594–633)
// Counts are cited from §3 for D-Day / The First Waves scenarios.
// Where exact placement varies by scenario, the step body refers the player
// to the scenario setup card rather than transcribing per-scenario positions.
// ---------------------------------------------------------------------------

const GROUP_MAP: SetupStepGroup = {
  id: 'mapa',
  titleEs: 'Preparación del mapa',
  steps: [
    {
      id: 'map-orient',
      groupId: 'mapa',
      titleEs: 'Orienta el tablero y elige el escenario',
      bodyEs:
        'Despliega el tablero en la mesa con el mar hacia el sur. Elige el escenario que vas a jugar ' +
        '(D-Day at Omaha Beach, The First Waves o Easy Fox) y ten a mano su tarjeta de preparación, ' +
        'ya que varios pasos posteriores dependen de la disposición específica de ese escenario.',
      ruleRef: '§3',
      checklistLabelEs: 'Tablero orientado; escenario elegido',
    },
  ],
};

const GROUP_WN: SetupStepGroup = {
  id: 'german-wn',
  titleEs: 'Widerstandsnests alemanes',
  steps: [
    {
      id: 'wn-depth-markers',
      groupId: 'german-wn',
      titleEs: 'Coloca los marcadores de profundidad WN',
      bodyEs:
        'Mezcla boca abajo los 18 marcadores de profundidad WN. ' +
        'Coloca un marcador boca abajo en cada una de las nueve posiciones WN designadas ' +
        '(consulta la tarjeta de tu escenario para las posiciones exactas). ' +
        'Deja el resto boca abajo en la caja de profundidad WN.',
      ruleRef: '§3',
      checklistLabelEs: 'Marcadores de profundidad WN colocados',
      pieceExample: {
        unit: {
          kind: 'german',
          id: 'wn-depth-example',
          type: 'WN',
          isRevealed: false,
          strength: 0,
          weaponRequirements: [],
          hasDepthMarker: true,
          depthMarkerType: 'WN',
          isDisrupted: false,
          hexId: '60',
        },
        side: 'front',
        size: 80,
        annotated: false,
      },
    },
    {
      id: 'wn-units',
      groupId: 'german-wn',
      titleEs: 'Coloca las unidades WN',
      bodyEs:
        'Mezcla boca abajo las 18 unidades WN. Colócalas en el mapa según el tipo: ' +
        'las 2 unidades marcadas "88" van en sus posiciones designadas; ' +
        'las 6 unidades con símbolo de artillería van en sus posiciones; ' +
        'la unidad cohete va en su posición. ' +
        'Las 9 unidades restantes van en las posiciones WN restantes. ' +
        'Apila cada unidad encima del marcador de profundidad si lo hay. ' +
        'Consulta §3 y la tarjeta de tu escenario para las posiciones exactas.',
      ruleRef: '§3',
      checklistLabelEs: 'Unidades WN colocadas',
      pieceExample: {
        unit: {
          kind: 'german',
          id: 'wn-artillery-88-example',
          type: 'WN',
          isRevealed: true,
          strength: 4,
          weaponRequirements: ['AR'],
          artilleryCaliber: 88,
          hasDepthMarker: false,
          isDisrupted: false,
          hexId: '61',
          germanUnitSymbol: 'artillery-88',
        },
        side: 'front',
        size: 80,
        annotated: false,
      },
    },
    {
      id: 'german-artillery',
      groupId: 'german-wn',
      titleEs: 'Coloca la artillería alemana',
      bodyEs:
        'Coloca las 4 unidades de artillería alemana en sus casillas fijas dentro de ' +
        'las cajas de artillería alemana impresas en el tablero.',
      ruleRef: '§3',
      checklistLabelEs: 'Artillería alemana colocada',
      pieceExample: {
        unit: {
          kind: 'german',
          id: 'german-arty-example',
          type: 'WN',
          isRevealed: true,
          strength: 3,
          weaponRequirements: ['AR'],
          hasDepthMarker: false,
          isDisrupted: false,
          hexId: 'arty-box-1',
          germanUnitSymbol: 'artillery',
        },
        side: 'front',
        size: 80,
        annotated: false,
      },
    },
  ],
};

const GROUP_REINFORCEMENTS: SetupStepGroup = {
  id: 'german-reinforcements',
  titleEs: 'Refuerzos alemanes',
  steps: [
    {
      id: 'reinf-tactical',
      groupId: 'german-reinforcements',
      titleEs: 'Refuerzos tácticos (T)',
      bodyEs:
        'Mezcla boca abajo las 9 unidades de Refuerzo Táctico (marcadas con T) y colócalas ' +
        'en su caja correspondiente del tablero.',
      ruleRef: '§3',
      checklistLabelEs: 'Refuerzos tácticos (T) en su caja',
    },
    {
      id: 'reinf-divisional',
      groupId: 'german-reinforcements',
      titleEs: 'Refuerzos divisionarios (D)',
      bodyEs:
        'Mezcla boca abajo las 11 unidades de Refuerzo Divisionario (marcadas con D) y colócalas ' +
        'en su caja correspondiente del tablero.',
      ruleRef: '§3',
      checklistLabelEs: 'Refuerzos divisionarios (D) en su caja',
    },
    {
      id: 'reinf-kampfgruppe',
      groupId: 'german-reinforcements',
      titleEs: 'Kampfgruppe Meyer (M) y marcadores móviles',
      bodyEs:
        'Mezcla boca abajo las 8 unidades Kampfgruppe Meyer (M) junto con sus 4 marcadores de ' +
        'profundidad móviles y colócalos juntos en la caja Kampfgruppe Meyer del tablero. ' +
        'Coloca también los 20 marcadores de profundidad móviles restantes en la caja de ' +
        'marcadores móviles, y los 8 marcadores de profundidad de edificios en su caja.',
      ruleRef: '§3',
      checklistLabelEs: 'Kampfgruppe Meyer + marcadores móviles y de edificios en sus cajas',
    },
  ],
};

const GROUP_TRACKS: SetupStepGroup = {
  id: 'marcadores-mazo',
  titleEs: 'Marcadores y mazo de eventos',
  steps: [
    {
      id: 'turn-phase-markers',
      groupId: 'marcadores-mazo',
      titleEs: 'Coloca los marcadores de turno y de fase',
      bodyEs:
        'Coloca el marcador de Turno en el espacio del Turno 1 de la Pista de Tiempo. ' +
        'Coloca el marcador de Fase en el primer espacio de la Pista de Cartas/Fase.',
      ruleRef: '§3',
      checklistLabelEs: 'Marcador de turno en T1; marcador de fase en posición 1',
    },
    {
      id: 'event-deck',
      groupId: 'marcadores-mazo',
      titleEs: 'Baraja y coloca el mazo de eventos',
      bodyEs:
        'Baraja el mazo de cartas de eventos y colócalo boca abajo junto al tablero, ' +
        'dejando espacio al lado para la pila de descartes.',
      ruleRef: '§3',
      checklistLabelEs: 'Mazo de eventos barajado y colocado',
    },
  ],
};

const GROUP_US: SetupStepGroup = {
  id: 'us-deployment',
  titleEs: 'Despliegue de EE.UU.',
  steps: [
    {
      id: 'us-setup',
      groupId: 'us-deployment',
      titleEs: 'Coloca las unidades de EE.UU.',
      bodyEs:
        'Coloca las 8 unidades de tanques de EE.UU. (sin turno de entrada indicado) en las ' +
        'Beach Landing Boxes que figuran en sus fichas. ' +
        'Coloca el resto de unidades de EE.UU. —excepto las de reemplazo— en los espacios de la ' +
        'Pista de Turnos según el turno de entrada que figura en cada ficha. ' +
        'Si juegas The First Waves, las unidades con turno de entrada en el Turno 16 o posterior ' +
        'no son necesarias para esa partida.',
      ruleRef: '§3',
      checklistLabelEs: 'Tanques en Beach Landing Boxes; resto en Pista de Turnos',
      pieceExample: {
        unit: {
          kind: 'us',
          id: 'us-tank-example',
          type: 'tank',
          steps: 2,
          targetSymbol: 'circle',
          weapons: ['BZ'],
          attackStrength: 4,
          reducedAttackStrength: 2,
          isDisrupted: false,
          hexId: null,
          division: '1st',
          arrivalTurn: null,
          beachLandingBox: 'DW1',
        },
        side: 'front',
        size: 80,
        annotated: false,
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// Exported constant
// ---------------------------------------------------------------------------

/**
 * SETUP_GUIDE — ordered array of step groups for the /preparacion page.
 * Grounded in rules-text.txt §3 (lines 594–633).
 * Step counts and positions reference the D-Day / The First Waves scenarios;
 * where values differ per scenario, steps defer to the scenario setup card.
 */
export const SETUP_GUIDE: SetupStepGroup[] = [
  GROUP_MAP,
  GROUP_WN,
  GROUP_REINFORCEMENTS,
  GROUP_TRACKS,
  GROUP_US,
];
