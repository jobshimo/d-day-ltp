import type { TermEntry } from 'content-schema';

/**
 * Centralized terminology substitution table.
 *
 * Each entry maps an official English game term (as used in rules-text.txt)
 * to its Spanish equivalent for the Devir Spanish edition.
 *
 * devir: false = placeholder pending confirmation from the physical Devir manual.
 * devir: true  = confirmed from the Devir Spanish edition rulebook.
 *
 * ALL entries are currently flagged devir: false until the Devir manual is scanned.
 * This is the single substitution point: update `spanishTerm` and flip `devir`
 * to `true` once confirmed.
 */
export const TERMINOLOGY: TermEntry[] = [
  {
    englishTerm: 'WN',
    spanishTerm: 'Nido de Resistencia',
    devir: false,
  },
  {
    englishTerm: 'Fire card',
    spanishTerm: 'Carta de fuego',
    devir: false,
  },
  {
    englishTerm: 'Landing card',
    spanishTerm: 'Carta de desembarco',
    devir: false,
  },
  {
    englishTerm: 'Disruption',
    spanishTerm: 'Desorganización',
    devir: false,
  },
  {
    englishTerm: 'Field of fire',
    spanishTerm: 'Campo de fuego',
    devir: false,
  },
  {
    englishTerm: 'Depth marker',
    spanishTerm: 'Marcador de profundidad',
    devir: false,
  },
  {
    englishTerm: 'Target symbol',
    spanishTerm: 'Símbolo de objetivo',
    devir: false,
  },
  {
    englishTerm: 'Step loss',
    spanishTerm: 'Pérdida de escalón',
    devir: false,
  },
  {
    englishTerm: 'Beach landing box',
    spanishTerm: 'Casilla de desembarco',
    devir: false,
  },
  // Additional terms used in Module 1 and Module 4 content
  {
    englishTerm: 'Widerstandsnest',
    spanishTerm: 'Nido de Resistencia',
    devir: false,
  },
  {
    englishTerm: 'Fire dot',
    spanishTerm: 'Punto de fuego',
    devir: false,
  },
  {
    englishTerm: 'Intense fire',
    spanishTerm: 'Fuego intenso',
    devir: false,
  },
  {
    englishTerm: 'Steady fire',
    spanishTerm: 'Fuego sostenido',
    devir: false,
  },
  {
    englishTerm: 'Sporadic fire',
    spanishTerm: 'Fuego esporádico',
    devir: false,
  },
  {
    englishTerm: 'Step',
    spanishTerm: 'Escalón',
    devir: false,
  },
  {
    englishTerm: 'Attack strength',
    spanishTerm: 'Fuerza de ataque',
    devir: false,
  },
  {
    englishTerm: 'Turn track',
    spanishTerm: 'Registro de turnos',
    devir: false,
  },
  // Terms needed by M2–M8 prose (modules-content-v2)
  {
    englishTerm: 'Amphibious landing',
    spanishTerm: 'Desembarco anfibio',
    devir: false,
  },
  {
    englishTerm: 'Drift',
    spanishTerm: 'Deriva',
    devir: false,
  },
  {
    englishTerm: 'Tidal waterline',
    spanishTerm: 'Línea de marea',
    devir: false,
  },
  {
    englishTerm: 'Mine explosion',
    spanishTerm: 'Explosión de mina',
    devir: false,
  },
  {
    englishTerm: 'Phase marker',
    spanishTerm: 'Marcador de fase',
    devir: false,
  },
  {
    englishTerm: 'Hit limit',
    spanishTerm: 'Límite de impactos',
    devir: false,
  },
  {
    englishTerm: 'Armor bonus',
    spanishTerm: 'Bonificación de blindaje',
    devir: false,
  },
  {
    englishTerm: 'Field of fire card',
    spanishTerm: 'Ficha de fuego',
    devir: false,
  },
  {
    englishTerm: 'Reinforcement',
    spanishTerm: 'Refuerzo',
    devir: false,
  },
  {
    englishTerm: 'Engineer',
    spanishTerm: 'Ingeniero',
    devir: false,
  },
  {
    englishTerm: 'Obstacle',
    spanishTerm: 'Obstáculo',
    devir: false,
  },
  {
    englishTerm: 'Infiltration move',
    spanishTerm: 'Movimiento de infiltración',
    devir: false,
  },
  {
    englishTerm: 'Barrage',
    spanishTerm: 'Fuego de barrera',
    devir: false,
  },
  {
    englishTerm: 'Naval fire',
    spanishTerm: 'Fuego naval',
    devir: false,
  },
  {
    englishTerm: 'Hero',
    spanishTerm: 'Héroe',
    devir: false,
  },
  {
    englishTerm: 'HQ',
    spanishTerm: 'Cuartel General',
    devir: false,
  },
  {
    englishTerm: 'General',
    spanishTerm: 'General',
    devir: false,
  },
  {
    englishTerm: 'Victory point',
    spanishTerm: 'Punto de victoria',
    devir: false,
  },
  {
    englishTerm: 'Command post',
    spanishTerm: 'Puesto de mando',
    devir: false,
  },
  {
    englishTerm: 'Extended game',
    spanishTerm: 'Juego extendido',
    devir: false,
  },
  {
    englishTerm: 'Depth pool',
    spanishTerm: 'Reserva de profundidad',
    devir: false,
  },
];
