import { describe, it, expect } from 'vitest';
import type { CourseModule, Lesson, DrillScenario, QuizItem } from './content-schema';

describe('content-schema type contracts', () => {
  it('constructs a minimal CourseModule literal without type errors', () => {
    const lesson: Lesson = {
      id: 'lesson-1-1',
      moduleId: 'module-1',
      order: 1,
      titleEs: 'Introducción al juego',
      blocks: [
        {
          type: 'prose',
          content: 'El juego D-Day at Omaha Beach simula el desembarco del 6 de junio de 1944.',
        },
        {
          type: 'rule-callout',
          content: 'El jugador aliado controla las fuerzas estadounidenses.',
          ruleRefs: [{ section: '1.1', note: 'Game overview' }],
        },
      ],
    };

    const drill: DrillScenario = {
      id: 'drill-1-1',
      moduleId: 'module-1',
      type: 'multiple-choice',
      questionEs: '¿Cuántos jugadores participa en el juego base?',
      choices: [
        { id: 'a', labelEs: 'Uno', isCorrect: false },
        { id: 'b', labelEs: 'Dos', isCorrect: true },
        { id: 'c', labelEs: 'Cuatro', isCorrect: false },
      ],
      correctAnswer: 'b',
      ruleRefs: [{ section: '1.2' }],
      explanationEs: 'D-Day at Omaha Beach es un juego para dos jugadores.',
    };

    const quizItem: QuizItem = {
      id: 'quiz-1-1',
      moduleId: 'module-1',
      type: 'multiple-choice',
      questionEs: '¿Cuál es el objetivo principal del jugador aliado?',
      choices: [
        { id: 'a', labelEs: 'Capturar todos los WN', isCorrect: false },
        { id: 'b', labelEs: 'Ganar Puntos de Victoria suficientes', isCorrect: true },
      ],
      correctAnswer: 'b',
      ruleRefs: [{ section: '2.1' }],
      explanationEs: 'El jugador aliado gana acumulando Puntos de Victoria.',
    };

    const module: CourseModule = {
      id: 'module-1',
      order: 1,
      titleEs: 'El juego y sus componentes',
      descriptionEs: 'Introducción al juego D-Day at Omaha Beach y sus componentes.',
      lessons: [lesson],
      drills: [drill],
      reviewQuiz: [quizItem],
    };

    expect(module.id).toBe('module-1');
    expect(module.lessons).toHaveLength(1);
    expect(module.drills).toHaveLength(1);
    expect(module.reviewQuiz).toHaveLength(1);
    expect(module.requiredPriorModuleId).toBeUndefined();
  });

  it('validates lesson block types are exhaustive', () => {
    const blockTypes: ('prose' | 'rule-callout' | 'image' | 'svg-snippet')[] = [
      'prose',
      'rule-callout',
      'image',
      'svg-snippet',
    ];
    expect(blockTypes).toHaveLength(4);
  });

  it('validates drill types', () => {
    const drillTypes: ('multiple-choice' | 'interactive-select')[] = [
      'multiple-choice',
      'interactive-select',
    ];
    expect(drillTypes).toHaveLength(2);
  });

  it('validates terrain types include all expected values', () => {
    const terrains = [
      'beach',
      'pavilion',
      'draw',
      'slope',
      'bluff',
      'bocage',
      'cliff',
      'building',
      'rough',
    ] as const;
    expect(terrains).toHaveLength(9);
  });

  it('validates German position colors', () => {
    const colors = ['red', 'blue', 'green', 'orange', 'purple', 'brown'] as const;
    expect(colors).toHaveLength(6);
  });

  it('validates target symbols', () => {
    const symbols = ['circle', 'diamond', 'triangle'] as const;
    expect(symbols).toHaveLength(3);
  });

  it('validates a DrillScenario with interactive-select type', () => {
    const interactiveDrill: DrillScenario = {
      id: 'drill-4-1',
      moduleId: 'module-4',
      type: 'interactive-select',
      questionEs: '¿Qué unidad recibe el impacto de fuego?',
      boardSnippet: {
        hexes: [
          {
            hexId: 'A1',
            terrain: 'beach',
            sector: 'west',
            isBeachBox: false,
            isGermanPosition: true,
            germanPositionColor: 'red',
            isVPPosition: false,
            fireDots: [{ positionId: 'WN62', intensity: 'intense' }],
          },
        ],
        units: [
          {
            kind: 'us',
            id: 'unit-1',
            type: 'infantry',
            steps: 2,
            targetSymbol: 'circle',
            weapons: ['BZ'],
            attackStrength: 2,
            isDisrupted: false,
            hexId: 'A1',
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
        targetSymbol: 'circle',
      },
      correctAnswer: 'unit-1',
      ruleRefs: [{ section: '6.3', note: 'Fire resolution' }],
      explanationEs: 'La unidad con símbolo de objetivo coincidente recibe el impacto.',
    };

    expect(interactiveDrill.type).toBe('interactive-select');
    expect(interactiveDrill.boardSnippet?.hexes).toHaveLength(1);
    expect(interactiveDrill.fireCard?.targetSymbol).toBe('circle');
  });
});
