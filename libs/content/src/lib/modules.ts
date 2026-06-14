import type { CourseModule } from 'content-schema';
import { MODULE_1_LESSONS } from './module-1/lessons';
import { MODULE_1_DRILLS, MODULE_1_QUIZ } from './module-1/drills';
import { MODULE_2_LESSONS } from './module-2/lessons';
import { MODULE_2_DRILLS, MODULE_2_QUIZ } from './module-2/drills';
import { MODULE_3_LESSONS } from './module-3/lessons';
import { MODULE_3_DRILLS, MODULE_3_QUIZ } from './module-3/drills';
import { MODULE_4_LESSONS } from './module-4/lessons';
import { MODULE_4_DRILLS, MODULE_4_QUIZ } from './module-4/drills';

/**
 * Module 1 — "El Juego y Sus Piezas" (The Game and Its Pieces)
 *
 * Covers §1 (Introduction), §2 (Game Components), §3 (Setup).
 * Fully playable: 3 lessons + 3 drills + 5 quiz items.
 */
const MODULE_1: CourseModule = {
  id: 'module-1',
  order: 1,
  titleEs: 'El Juego y Sus Piezas',
  descriptionEs:
    'Aprende los componentes del juego: el mapa, las fichas de EE.UU. y alemanas, las cartas y cómo preparar la partida.',
  lessons: MODULE_1_LESSONS,
  drills: MODULE_1_DRILLS,
  reviewQuiz: MODULE_1_QUIZ,
  requiredPriorModuleId: undefined,
};

/**
 * Module 2 — Stub (v2: content authored in modules-content-v2)
 *
 * Covers §4 (Sequence of Play) and §5 (US Amphibious Operations).
 */
const MODULE_2: CourseModule = {
  id: 'module-2',
  order: 2,
  titleEs: 'Secuencia de Turno y Desembarco',
  descriptionEs:
    'Aprende la secuencia de juego y cómo funcionan las operaciones anfibias de EE.UU. en la playa.',
  lessons: MODULE_2_LESSONS,
  drills: MODULE_2_DRILLS,
  reviewQuiz: MODULE_2_QUIZ,
};

/**
 * Module 3 — Stub (v2: content authored in modules-content-v2)
 *
 * Covers §6 (German Fire) basic mechanics as a full module.
 */
const MODULE_3: CourseModule = {
  id: 'module-3',
  order: 3,
  titleEs: 'Fuego Alemán: Fundamentos',
  descriptionEs:
    'Domina el sistema de fuego alemán: campos de fuego, resolución de impactos y disruption.',
  lessons: MODULE_3_LESSONS,
  drills: MODULE_3_DRILLS,
  reviewQuiz: MODULE_3_QUIZ,
};

/**
 * Module 4 — Fire Resolution worked example (§6.3)
 *
 * Contains 1 lesson + 1 worked example + 1 interactive drill.
 * Free navigation: no prerequisite required.
 */
const MODULE_4: CourseModule = {
  id: 'module-4',
  order: 4,
  titleEs: 'Resolución de Fuego',
  descriptionEs:
    'Practica la resolución completa del fuego alemán con un escenario interactivo de la regla §6.3.',
  lessons: MODULE_4_LESSONS,
  drills: MODULE_4_DRILLS,
  reviewQuiz: MODULE_4_QUIZ,
};

/**
 * Module 5 — Stub (v2: content authored in modules-content-v2)
 *
 * Covers §7 (US Actions) and §8 (US Combat Actions).
 */
const MODULE_5: CourseModule = {
  id: 'module-5',
  order: 5,
  titleEs: 'Acciones de EE.UU.',
  descriptionEs:
    'Aprende todas las acciones disponibles para tus unidades: movimiento, ataque, barrage y acciones especiales.',
  lessons: [],
  drills: [],
  reviewQuiz: [],
};

/**
 * Module 6 — Stub (v2: content authored in modules-content-v2)
 *
 * Covers §9 (German Reinforcements) and §10 (Engineer Operations).
 */
const MODULE_6: CourseModule = {
  id: 'module-6',
  order: 6,
  titleEs: 'Refuerzos Alemanes y Operaciones de Ingenieros',
  descriptionEs:
    'Aprende cómo llegan los refuerzos alemanes y cómo tus ingenieros limpian los obstáculos de playa.',
  lessons: [],
  drills: [],
  reviewQuiz: [],
};

/**
 * Module 7 — Stub (v2: content authored in modules-content-v2)
 *
 * Covers §11 (Heroes, HQs, Generals), §12 (Control and Communication),
 * §13 (Victory and Loss).
 */
const MODULE_7: CourseModule = {
  id: 'module-7',
  order: 7,
  titleEs: 'Líderes, Control y Victoria',
  descriptionEs:
    'Conoce el papel de los Héroes, Cuarteles Generales y Generales, y cómo se determina la victoria.',
  lessons: [],
  drills: [],
  reviewQuiz: [],
};

/**
 * Module 8 — Stub (v2: content authored in modules-content-v2)
 *
 * Covers §14–§20 (Extended Game rules) and §22–§23 (Optional variants).
 */
const MODULE_8: CourseModule = {
  id: 'module-8',
  order: 8,
  titleEs: 'El Juego Extendido y Variantes',
  descriptionEs:
    'Domina las reglas del juego extendido: acciones alemanas, variantes opcionales e historia avanzada.',
  lessons: [],
  drills: [],
  reviewQuiz: [],
};

/**
 * All 8 course modules in order.
 * Free navigation: all modules are always accessible.
 */
export const ALL_MODULES: CourseModule[] = [
  MODULE_1,
  MODULE_2,
  MODULE_3,
  MODULE_4,
  MODULE_5,
  MODULE_6,
  MODULE_7,
  MODULE_8,
];
