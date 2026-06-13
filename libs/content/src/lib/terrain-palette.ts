import type { TerrainType, GermanPositionColor } from 'content-schema';

/**
 * Terrain fill colors — used by board-renderer and symbology reference.
 * Colors follow the military palette established in the board-renderer.
 */
export const TERRAIN_COLORS: Record<TerrainType, string> = {
  beach:    '#c8b97a',
  pavilion: '#7a8b6a',
  draw:     '#5c7a6a',
  slope:    '#8a9070',
  bluff:    '#6b5c45',
  bocage:   '#4a6040',
  cliff:    '#6e6e6e',
  building: '#8a7060',
  rough:    '#7a7060',
};

/**
 * German position outline colors — used by board-renderer and symbology reference.
 * Colors map to the colored WN position markers on the board.
 */
export const GERMAN_POS_COLORS: Record<GermanPositionColor, string> = {
  red:    '#e05f5f',
  blue:   '#5f9fe0',
  green:  '#4caf78',
  orange: '#e0a050',
  purple: '#9b59b6',
  brown:  '#8b6f47',
};
