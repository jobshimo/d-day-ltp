import type { UnitType, GermanUnitSymbol, TargetSymbol, FireDotIntensity, TerrainType, GermanPositionColor, USDivision } from 'content-schema';
import { TERRAIN_COLORS, GERMAN_POS_COLORS } from './terrain-palette';

// ---------------------------------------------------------------------------
// Content model
// ---------------------------------------------------------------------------

export type SimbologiaRenderAs =
  | { kind: 'unit-symbol'; type: UnitType; germanSymbol?: GermanUnitSymbol; color?: string; symbolStyle?: 'counter' | 'card' }
  | { kind: 'target-symbol'; symbol: TargetSymbol; control: 'adjacent' | 'own' }
  | { kind: 'fire-dots'; dots: FireDotIntensity[] }
  | { kind: 'color-swatch'; color: string; label: string }
  | { kind: 'text-chip'; text: string };

export interface SimbologiaEntry {
  key: string;
  nameEs: string;
  meaningEs: string;
  ruleRef?: string;
  note?: string;
  render: SimbologiaRenderAs;
}

export interface SimbologiaCategory {
  id: string;
  titleEs: string;
  /** Optional category-level note shown below the title in the reference UI. */
  descriptionEs?: string;
  entries: SimbologiaEntry[];
}

// ---------------------------------------------------------------------------
// Category 1: US unit types (UnitType × 8)
// ---------------------------------------------------------------------------

const US_UNIT_ENTRIES: SimbologiaEntry[] = [
  {
    key: 'us-infantry',
    nameEs: 'Infantería',
    meaningEs: 'Unidad de infantería estándar de EE.UU. Símbolo de aspa (X) en caja rectangular.',
    ruleRef: '§2.22',
    render: { kind: 'unit-symbol', type: 'infantry' as UnitType },
  },
  {
    key: 'us-ranger',
    nameEs: 'Ranger',
    meaningEs: 'Unidad de élite. Mismo símbolo de aspa que infantería; capacidades especiales de combate.',
    ruleRef: '§2.22',
    render: { kind: 'unit-symbol', type: 'ranger' as UnitType },
  },
  {
    key: 'us-tank',
    nameEs: 'Tanque (en la ficha: silueta)',
    meaningEs: 'Unidad blindada. En la ficha del tablero: silueta lateral de tanque (casco + torreta + cañón + orugas). Este es el símbolo real de la ficha Devir.',
    ruleRef: '§2.22',
    render: { kind: 'unit-symbol', type: 'tank' as UnitType, symbolStyle: 'counter' },
  },
  {
    key: 'us-tank-card',
    nameEs: 'Tanque (en las cartas: símbolo OTAN)',
    meaningEs: 'En las cartas de unidad: símbolo OTAN de blindado, una elipse horizontal dentro de la caja rectangular. Mismo significado que la silueta; contexto de carta.',
    ruleRef: '§2.22',
    render: { kind: 'unit-symbol', type: 'tank' as UnitType, symbolStyle: 'card' },
  },
  {
    key: 'us-arty',
    nameEs: 'Artillería',
    meaningEs: 'Unidad de artillería de EE.UU. Punto relleno en el centro de la caja.',
    ruleRef: '§2.22',
    render: { kind: 'unit-symbol', type: 'arty' as UnitType },
  },
  {
    key: 'us-hq',
    nameEs: 'Cuartel General (CG)',
    meaningEs: 'Unidad de mando. Mástil con banderín en el borde izquierdo de la caja.',
    ruleRef: '§2.22',
    render: { kind: 'unit-symbol', type: 'hq' as UnitType },
  },
  {
    key: 'us-general',
    nameEs: 'General',
    meaningEs: 'Ficha de general de EE.UU. Estrella de 5 puntas; sin caja rectangular.',
    ruleRef: '§11',
    render: { kind: 'unit-symbol', type: 'general' as UnitType },
  },
  {
    key: 'us-hero',
    nameEs: 'Héroe',
    meaningEs: 'Héroe individual. Círculo con estrella interior; unidad especial de un escalón.',
    ruleRef: '§11',
    render: { kind: 'unit-symbol', type: 'hero' as UnitType },
  },
  {
    key: 'us-engineer',
    nameEs: 'Ingenieros',
    meaningEs: 'Unidad de ingenieros. Corchete abierto con trazo central vertical en la caja.',
    ruleRef: '§10',
    render: { kind: 'unit-symbol', type: 'engineer' as UnitType },
  },
];

// ---------------------------------------------------------------------------
// Category 2: German unit symbols (GermanUnitSymbol × 4)
// ---------------------------------------------------------------------------

const GERMAN_UNIT_ENTRIES: SimbologiaEntry[] = [
  {
    key: 'de-infantry',
    nameEs: 'Infantería alemana',
    meaningEs: 'Unidad de infantería alemana. Aspa (X) en caja rectangular — misma forma que infantería de EE.UU. pero en contrafichas alemanas (ocre/marrón).',
    ruleRef: '§2.1',
    render: { kind: 'unit-symbol', germanSymbol: 'infantry' as GermanUnitSymbol, type: 'infantry' as UnitType, color: '#e8e8e8' },
  },
  {
    key: 'de-armor',
    nameEs: 'Blindado alemán (en la ficha: silueta)',
    meaningEs: 'Unidad blindada alemana. En la ficha del tablero: silueta lateral de tanque (igual que el tanque aliado). Este es el símbolo real de la ficha Devir.',
    ruleRef: '§2.1',
    render: { kind: 'unit-symbol', germanSymbol: 'armor' as GermanUnitSymbol, type: 'infantry' as UnitType, color: '#e8e8e8', symbolStyle: 'counter' },
  },
  {
    key: 'de-armor-card',
    nameEs: 'Blindado alemán (en las cartas: símbolo OTAN)',
    meaningEs: 'En las cartas de unidad alemana: símbolo OTAN de blindado, elipse horizontal dentro de la caja rectangular. Mismo significado que la silueta; contexto de carta.',
    ruleRef: '§2.1',
    render: { kind: 'unit-symbol', germanSymbol: 'armor' as GermanUnitSymbol, type: 'infantry' as UnitType, color: '#e8e8e8', symbolStyle: 'card' },
  },
  {
    key: 'de-artillery',
    nameEs: 'Artillería alemana',
    meaningEs: 'Unidad de artillería alemana. Punto relleno en el centro de la caja.',
    ruleRef: '§2.1',
    render: { kind: 'unit-symbol', germanSymbol: 'artillery' as GermanUnitSymbol, type: 'infantry' as UnitType, color: '#e8e8e8' },
  },
  {
    key: 'de-artillery-88',
    nameEs: 'Cañón 88 alemán',
    meaningEs: 'Artillería alemana de 88 mm. Punto relleno en la caja más la etiqueta «88» debajo. Arma antitanque y antiárea de alta efectividad.',
    ruleRef: '§2.1',
    render: { kind: 'unit-symbol', germanSymbol: 'artillery-88' as GermanUnitSymbol, type: 'infantry' as UnitType, color: '#e8e8e8' },
  },
];

// ---------------------------------------------------------------------------
// Category 3: Target symbols (TargetSymbol × 3 shapes × 2 control variants = 6)
// ---------------------------------------------------------------------------

const TARGET_SYMBOL_ENTRIES: SimbologiaEntry[] = [
  {
    key: 'target-circle-adjacent',
    nameEs: 'Círculo negro',
    meaningEs: 'Control adyacente: la unidad controla su hex Y todos los hexes adyacentes.',
    ruleRef: '§12.1',
    render: { kind: 'target-symbol', symbol: 'circle' as TargetSymbol, control: 'adjacent' },
  },
  {
    key: 'target-circle-own',
    nameEs: 'Círculo blanco',
    meaningEs: 'Control propio: la unidad controla únicamente el hex que ocupa.',
    ruleRef: '§12.1',
    render: { kind: 'target-symbol', symbol: 'circle' as TargetSymbol, control: 'own' },
  },
  {
    key: 'target-diamond-adjacent',
    nameEs: 'Diamante negro',
    meaningEs: 'Control adyacente: la unidad controla su hex Y todos los hexes adyacentes.',
    ruleRef: '§12.1',
    render: { kind: 'target-symbol', symbol: 'diamond' as TargetSymbol, control: 'adjacent' },
  },
  {
    key: 'target-diamond-own',
    nameEs: 'Diamante blanco',
    meaningEs: 'Control propio: la unidad controla únicamente el hex que ocupa.',
    ruleRef: '§12.1',
    render: { kind: 'target-symbol', symbol: 'diamond' as TargetSymbol, control: 'own' },
  },
  {
    key: 'target-triangle-adjacent',
    nameEs: 'Triángulo negro',
    meaningEs: 'Control adyacente: la unidad controla su hex Y todos los hexes adyacentes.',
    ruleRef: '§12.1',
    render: { kind: 'target-symbol', symbol: 'triangle' as TargetSymbol, control: 'adjacent' },
  },
  {
    key: 'target-triangle-own',
    nameEs: 'Triángulo blanco',
    meaningEs: 'Control propio: la unidad controla únicamente el hex que ocupa.',
    ruleRef: '§12.1',
    render: { kind: 'target-symbol', symbol: 'triangle' as TargetSymbol, control: 'own' },
  },
];

// ---------------------------------------------------------------------------
// Category 4: Fire dots (FireDotIntensity × 3)
// ---------------------------------------------------------------------------

const FIRE_DOT_ENTRIES: SimbologiaEntry[] = [
  {
    key: 'fire-intense',
    nameEs: 'Intenso',
    meaningEs: 'Fuego de máxima intensidad. Mayor riesgo de disruption y pérdida de escalones para las unidades en el hex.',
    ruleRef: '§6.2',
    render: { kind: 'fire-dots', dots: ['intense'] },
  },
  {
    key: 'fire-steady',
    nameEs: 'Sostenido',
    meaningEs: 'Fuego moderado. Riesgo intermedio de disruption.',
    ruleRef: '§6.2',
    render: { kind: 'fire-dots', dots: ['steady'] },
  },
  {
    key: 'fire-sporadic',
    nameEs: 'Esporádico',
    meaningEs: 'Fuego ligero. Menor riesgo; la unidad puede avanzar con precaución.',
    ruleRef: '§6.2',
    render: { kind: 'fire-dots', dots: ['sporadic'] },
  },
];

// ---------------------------------------------------------------------------
// Category 5: Weapon codes (WeaponCode × 9)
// ---------------------------------------------------------------------------

const WEAPON_CODE_ENTRIES: SimbologiaEntry[] = [
  {
    key: 'wc-BZ',
    nameEs: 'BZ — Bazuca',
    meaningEs: 'Arma antitanque portátil. Requerida para neutralizar posiciones bunker y vehículos blindados.',
    ruleRef: '§8',
    render: { kind: 'text-chip', text: 'BZ' },
  },
  {
    key: 'wc-BG',
    nameEs: 'BG — Torpedo Bangalore',
    meaningEs: 'Explosivo tubular para brechar alambradas y obstáculos de playa.',
    ruleRef: '§8',
    render: { kind: 'text-chip', text: 'BG' },
  },
  {
    key: 'wc-BR',
    nameEs: 'BR — BAR (Browning Automatic Rifle)',
    meaningEs: 'Rifle automático ligero. Ametralladora de escuadra para apoyo de fuego de infantería.',
    ruleRef: '§8',
    render: { kind: 'text-chip', text: 'BR' },
  },
  {
    key: 'wc-DE',
    nameEs: 'DE — Demoliciones',
    meaningEs: 'Cargas explosivas para destruir fortines, obstáculos y estructuras enemigas.',
    ruleRef: '§8',
    render: { kind: 'text-chip', text: 'DE' },
  },
  {
    key: 'wc-MO',
    nameEs: 'MO — Mortero',
    meaningEs: 'Arma de fuego indirecto. Permite atacar posiciones protegidas sin línea de visión directa.',
    ruleRef: '§8',
    render: { kind: 'text-chip', text: 'MO' },
  },
  {
    key: 'wc-RD',
    nameEs: 'RD — Radio',
    meaningEs: 'Equipo de comunicaciones. Necesario para coordinar fuego naval y apoyos de artillería.',
    ruleRef: '§8',
    render: { kind: 'text-chip', text: 'RD' },
  },
  {
    key: 'wc-FL',
    nameEs: 'FL — Flanqueo',
    meaningEs: 'Táctica de ataque desde dos o más hexes no adyacentes al mismo tiempo (§8.22). No es un arma física.',
    ruleRef: '§8.22',
    render: { kind: 'text-chip', text: 'FL' },
  },
  {
    key: 'wc-AR',
    nameEs: 'AR — Artillería',
    meaningEs: 'Requisito de apoyo de artillería. Lo satisface una unidad de artillería aliada o un tanque a distancia 1–5 (§8.27).',
    ruleRef: '§8.27',
    render: { kind: 'text-chip', text: 'AR' },
  },
  {
    key: 'wc-NV',
    nameEs: 'NV — Fuego Naval',
    meaningEs: 'Requisito de fuego naval. Lo satisface gastando un marcador de fuego naval (§8.25). (a confirmar)',
    ruleRef: '§8.25',
    note: 'NV no aparece explícitamente en el cuadro de armas impreso; su significado se infiere por §8.25 y por eliminación. Requiere validación del diseñador.',
    render: { kind: 'text-chip', text: 'NV' },
  },
];

// ---------------------------------------------------------------------------
// Category 6: Terrain types (TerrainType × 9)
// Colors sourced from the real Devir board TERRAIN KEY.
// Hexside/edge features (Sea Wall, Slope, Bluff, Scaleable Cliff, Sheer Cliff,
// Anti-Tank Ditch, Hedge, Wall) and road types (Primary Road, Secondary Road,
// Trail, Mined Road) are marked on hex edges, not as hex fills; they are
// noted here for reference.
// ---------------------------------------------------------------------------

const TERRAIN_ENTRIES: SimbologiaEntry[] = (
  [
    ['beach',    'Playa (Beach)',               '§7.3', 'Zona de desembarco. Los aliados deben cruzarla al llegar. Terreno abierto: máxima exposición al fuego alemán. Color arena claro del tablero real (#e6dcc0).'],
    ['pavilion', 'Pabellón / Plataforma',       '§7.3', 'Plataforma de suelo firme sobre la playa (Pavillion). Cobertura ligera para unidades en movimiento. Color gris-arena del tablero real (#cbccba).'],
    ['draw',     'Hondonada (Draw)',             '§7.5', 'Valle entre los barrancos que permite el acceso al interior. Cada hondonada vale 5 PV para quien la controle al final de la partida. Mismo color que pabellón en la clave de terreno (#cbccba).'],
    ['slope',    'Pendiente / Terreno elevado',  '§7.4', 'Ladera que asciende hacia los barrancos (High Ground). Ralentiza el avance aliado. Las posiciones alemanas aquí tienen ventaja de elevación. Color oliva apagado del tablero real (#c2c79a).'],
    ['bluff',    'Barranco (Bluff)',             '§7.4', 'Cresta elevada sobre la playa. El hexlado de barranco bloquea el movimiento a menos que se escale (acción especial §7.4). Color oliva apagado idéntico al High Ground en el tablero (#c2c79a).'],
    ['bocage',   'Bocaje (Bocage)',              '§7.5', 'Setos y terraplenes normandos. Duplica la fortaleza de defensa alemana; restringe el movimiento de blindados. Color verde apagado del tablero real (#b3bd8c).'],
    ['cliff',    'Acantilado (Cliff)',           '§7.4', 'Escalable con 2 turnos de acción, o corte vertical (infranqueable según tipo). La Pointe du Hoc es el ejemplo histórico. Color roca gris del tablero (#a8a89a). (a confirmar exactitud del tipo escalable vs. corte)'],
    ['building', 'Edificio (Building)',          '§7.5', 'Construcción con cobertura sólida. Duplica tanto la fuerza alemana como la profundidad del marcador de profundidad. Color piedra gris del tablero (#b0a898).'],
    ['rough',    'Terreno accidentado (Rough)',  '§7.5', 'Terreno irregular. Bloquea la comunicación alemana. Solo infantería puede entrar; vehículos y blindados no pueden. Color marrón-arena del tablero real (#cdb98c).'],
  ] as [TerrainType, string, string, string][]
).map(([terrain, nameEs, ruleRef, meaningEs]) => ({
  key: `terrain-${terrain}`,
  nameEs,
  meaningEs,
  ruleRef,
  render: {
    kind: 'color-swatch' as const,
    color: TERRAIN_COLORS[terrain],
    label: nameEs,
  },
}));

// ---------------------------------------------------------------------------
// Category 7: German position colors (GermanPositionColor × 6)
// ---------------------------------------------------------------------------

const GERMAN_POS_ENTRIES: SimbologiaEntry[] = (
  [
    ['red',    'Rojo'],
    ['blue',   'Azul'],
    ['green',  'Verde'],
    ['orange', 'Naranja'],
    ['purple', 'Violeta'],
    ['brown',  'Marrón'],
  ] as [GermanPositionColor, string][]
).map(([color, nameEs]) => ({
  key: `german-pos-${color}`,
  nameEs: `Posición alemana — ${nameEs}`,
  meaningEs: `Las cartas de fuego activan las posiciones de este color cada turno. Cada WN y refuerzo alemán tiene asignado un color de posición que determina cuándo y cómo dispara.`,
  ruleRef: '§2.1',
  render: {
    kind: 'color-swatch' as const,
    color: GERMAN_POS_COLORS[color],
    label: nameEs,
  },
}));

// ---------------------------------------------------------------------------
// Category 8: US divisions (USDivision × 2)
// ---------------------------------------------------------------------------

const US_DIVISION_ENTRIES: SimbologiaEntry[] = (
  [
    ['1st',  '1.ª División de Infantería',  '#2f4a28', 'Verde oliva oscuro. Sector Este de Omaha. La «Big Red One».'],
    ['29th', '29.ª División de Infantería', '#4f7a40', 'Verde oliva claro. Sector Oeste de Omaha. Desembarcó con la 1.ª División.'],
  ] as [USDivision, string, string, string][]
).map(([division, nameEs, color, meaningEs]) => ({
  key: `division-${division}`,
  nameEs,
  meaningEs,
  ruleRef: '§2.22',
  render: {
    kind: 'color-swatch' as const,
    color,
    label: nameEs,
  },
}));

// ---------------------------------------------------------------------------
// Complete SYMBOLOGY export
// ---------------------------------------------------------------------------

export const SYMBOLOGY: SimbologiaCategory[] = [
  {
    id: 'us-units',
    titleEs: 'Unidades de EE.UU.',
    entries: US_UNIT_ENTRIES,
  },
  {
    id: 'german-units',
    titleEs: 'Unidades alemanas',
    entries: GERMAN_UNIT_ENTRIES,
  },
  {
    id: 'target-symbols',
    titleEs: 'Símbolo de objetivo',
    entries: TARGET_SYMBOL_ENTRIES,
  },
  {
    id: 'fire-dots',
    titleEs: 'Puntos de fuego (intensidad)',
    entries: FIRE_DOT_ENTRIES,
  },
  {
    id: 'weapon-codes',
    titleEs: 'Códigos de armas (EE.UU.)',
    entries: WEAPON_CODE_ENTRIES,
  },
  {
    id: 'terrain',
    titleEs: 'Terreno',
    descriptionEs: 'Colores tomados directamente de la «Leyenda de terreno (TERRAIN KEY)» del tablero Devir. Paleta apagada en tonos pergamino; no usar sustitutos más saturados. Las características de hexlado (Sea Wall, Slope, Bluff, Scaleable Cliff, Sheer Cliff, Anti-Tank Ditch, Hedge, Wall) y los tipos de camino (Primary Road, Secondary Road, Trail, Mined Road) se marcan sobre los bordes del hex, no como relleno.',
    entries: TERRAIN_ENTRIES,
  },
  {
    id: 'german-positions',
    titleEs: 'Colores de posición alemana',
    entries: GERMAN_POS_ENTRIES,
  },
  {
    id: 'us-divisions',
    titleEs: 'División EE.UU.',
    entries: US_DIVISION_ENTRIES,
  },
];
