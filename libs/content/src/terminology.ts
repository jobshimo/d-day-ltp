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
];
