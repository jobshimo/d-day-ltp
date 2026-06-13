// Progress tracking types — shared between domain-progress and domain-course
export interface DrillResult {
  answeredCorrectly: boolean;
  attempts: number;
  completedAt: string; // ISO date
}

export interface QuizResult {
  score: number; // 0.0 – 1.0
  passed: boolean;
  completedAt: string; // ISO date
}

export interface ModuleProgress {
  moduleId: string;
  lessonsCompleted: string[];
  drillResults: Record<string, DrillResult>;
  quizResult?: QuizResult;
  unlockedAt?: string; // ISO date
}

// Rule reference — maps to a section in rules-text.txt
export interface RuleRef {
  section: string; // e.g. "6.3"
  note?: string; // optional clarification in English
}

// Terminology substitution entry (Devir Spanish vs English rule text)
export interface TermEntry {
  englishTerm: string; // as used in rules-text.txt
  spanishTerm: string; // Devir edition Spanish term
  devir: boolean; // true = confirmed from Devir manual; false = placeholder
}

// Division types for counter color differentiation
export type USDivision = '1st' | '29th';
export type GermanDivision = '352nd' | '716th';
export type GermanUnitSymbol = 'infantry' | 'armor' | 'artillery' | 'artillery-88';

// Counter lesson configuration
export interface CounterLessonConfig {
  unit: USUnitState | GermanUnitState;
  side: 'front' | 'back';
  size?: number;       // px, default 120
  annotated?: boolean; // default true in lesson context
}

// Micro-lesson content block
export interface LessonBlock {
  type: 'prose' | 'rule-callout' | 'image' | 'svg-snippet' | 'counter';
  content: string; // Spanish prose OR asset path
  ruleRefs?: RuleRef[];
  altText?: string; // for image/SVG, in Spanish
  counterConfig?: CounterLessonConfig; // present only when type === 'counter'
}

export interface WorkedExampleStep {
  order: number;
  descriptionEs: string;
  boardState?: BoardSnippet; // optional — only for spatial examples
}

export interface WorkedExample {
  titleEs: string;
  scenarioDescription: string; // Spanish prose
  steps: WorkedExampleStep[];
  ruleRefs: RuleRef[];
}

export interface Lesson {
  id: string;
  moduleId: string;
  order: number;
  titleEs: string; // Spanish title
  blocks: LessonBlock[];
  workedExample?: WorkedExample;
}

// Drill scenario (one question + evaluatable answer)
export interface DrillChoice {
  id: string;
  labelEs: string;
  isCorrect: boolean;
}

export interface DrillScenario {
  id: string;
  moduleId: string;
  type: 'multiple-choice' | 'interactive-select';
  questionEs: string; // Spanish
  boardSnippet?: BoardSnippet;
  fireCard?: FireCardData;
  landingCard?: LandingCardData;
  turn?: number; // game turn context for tide calculations
  choices?: DrillChoice[]; // for multiple-choice
  correctAnswer: string; // machine-verifiable answer key
  ruleRefs: RuleRef[];
  explanationEs: string; // Spanish rule-cited explanation
}

// Quiz item (same core shape as DrillScenario but only multiple-choice)
export interface QuizItem extends Omit<DrillScenario, 'type'> {
  type: 'multiple-choice';
}

// Module definition
export interface CourseModule {
  id: string;
  order: number;
  titleEs: string;
  descriptionEs: string;
  lessons: Lesson[];
  drills: DrillScenario[];
  reviewQuiz: QuizItem[];
  requiredPriorModuleId?: string; // undefined for Module 1
}

// Board snippet for drill rendering
export type TerrainType =
  | 'beach'
  | 'pavilion'
  | 'draw'
  | 'slope'
  | 'bluff'
  | 'bocage'
  | 'cliff'
  | 'building'
  | 'rough';

export type GermanPositionColor = 'red' | 'blue' | 'green' | 'orange' | 'purple' | 'brown';
export type TargetSymbol = 'circle' | 'diamond' | 'triangle';
export type FireDotIntensity = 'intense' | 'steady' | 'sporadic';
export type UnitType =
  | 'infantry'
  | 'ranger'
  | 'tank'
  | 'arty'
  | 'hq'
  | 'general'
  | 'hero'
  | 'engineer';
export type WeaponCode = 'BZ' | 'BG' | 'BR' | 'DE' | 'MO' | 'RD' | 'FL' | 'AR' | 'NV';

export interface HexState {
  hexId: string;
  terrain: TerrainType;
  sector: 'east' | 'west';
  isBeachBox: boolean;
  isGermanPosition: boolean;
  germanPositionColor?: GermanPositionColor;
  isVPPosition: boolean;
  fireDots: { positionId: string; intensity: FireDotIntensity }[];
}

export interface HexHighlight {
  hexId: string;
  style: 'fire-dot' | 'selected' | 'correct' | 'incorrect';
}

export interface USUnitState {
  kind: 'us';
  id: string;
  type: UnitType;
  steps: 1 | 2 | 3 | 4;
  targetSymbol: TargetSymbol;
  weapons: WeaponCode[];
  attackStrength: number;
  isDisrupted: boolean;
  hexId: string | null;
  // Counter rendering fields (optional, back-compat)
  designation?: string;               // e.g. "A/116"
  reducedAttackStrength?: number;     // back-face strength
  arrivalTurn?: number | null;        // null = setup placement
  beachLandingBox?: string | null;    // e.g. "DW1"
  range?: number | 'U' | null;        // 'U' = unlimited; null = adjacent only
  division?: USDivision;              // color tier
  unitFireDots?: FireDotIntensity[];  // per-counter fire-susceptibility dots
}

export interface GermanUnitState {
  kind: 'german';
  id: string;
  type: 'WN' | 'reinforcement';
  isRevealed: boolean;
  strength: number;
  weaponRequirements: WeaponCode[];
  artilleryCaliber?: 88 | 75 | 105;
  hasDepthMarker: boolean;
  depthMarkerType?: 'WN' | 'building' | 'mobile';
  isDisrupted: boolean;
  hexId: string;
  // Counter rendering fields (optional, back-compat)
  germanDivision?: GermanDivision;
  germanUnitSymbol?: GermanUnitSymbol;
}

export interface BoardSnippet {
  hexes: HexState[];
  units: (USUnitState | GermanUnitState)[];
  highlights?: HexHighlight[];
}

// Fire and landing card data
export interface FireCardEntry {
  color: GermanPositionColor;
  symbol: 'single' | 'double';
  hasArmorBonus: boolean;
  hasStar: boolean;
  actionLetter?: string;
}

export interface FireCardData {
  entries: FireCardEntry[];
  targetSymbol: TargetSymbol;
  artilleryValue?: { count: number; calibers: ('75' | '88' | '105')[] };
}

export interface LandingCardData {
  results: Record<TargetSymbol, 'A' | 'B' | 'C' | 'D'>;
  hasMineSymbol: boolean;
}
