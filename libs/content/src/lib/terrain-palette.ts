import type { TerrainType, GermanPositionColor } from 'content-schema';

/**
 * Terrain fill colors — sourced from the real Devir "D-Day at Omaha Beach"
 * board TERRAIN KEY.  The palette is muted/desaturated parchment tones;
 * do not substitute with brighter military colours.
 *
 * Mapping notes (TerrainType enum → board terrain key entry):
 *   beach    → Beach / sand        #e6dcc0
 *   pavilion → Pavillion/Draw      #cbccba  (shelf/platform)
 *   draw     → Pavillion/Draw      #cbccba  (valley between bluffs)
 *   slope    → High Ground (slope) #c2c79a  (ascending approach)
 *   bluff    → High Ground (bluff) #c2c79a  (top of bluff line)
 *   bocage   → Bocage              #b3bd8c
 *   cliff    → Rock / cliff grey   #a8a89a  (sheer/scaleable cliff)
 *   building → Stone/building grey #b0a898
 *   rough    → Rough               #cdb98c
 */
export const TERRAIN_COLORS: Record<TerrainType, string> = {
  beach:    '#e6dcc0',
  pavilion: '#cbccba',
  draw:     '#cbccba',
  slope:    '#c2c79a',
  bluff:    '#c2c79a',
  bocage:   '#b3bd8c',
  cliff:    '#a8a89a',
  building: '#b0a898',
  rough:    '#cdb98c',
};

/**
 * Additional named palette constants for terrain types present on the board
 * but not in the TerrainType enum (used for legend/symbology reference).
 */
export const TERRAIN_PALETTE_EXTRA = {
  waterLine:  '#7cc1e4',
  highGround: '#c2c79a',
  woods:      '#6f8f5a',
  shingle:    '#d8d2be',
} as const;

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
