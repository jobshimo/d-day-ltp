import type { Lesson } from 'content-schema';

/**
 * Module 4 — Proof-of-concept content
 *
 * REQ-M4-04: 1 introductory lesson covering §6.1–§6.3.
 * All prose is in neutral professional Spanish.
 */
export const MODULE_4_LESSONS: Lesson[] = [
  {
    id: 'lesson-4-1',
    moduleId: 'module-4',
    order: 1,
    titleEs: 'Fuego alemán: cómo las posiciones hostigan al desembarco',
    blocks: [
      {
        type: 'prose',
        content:
          'El fuego alemán es la principal amenaza durante los primeros turnos de la partida. Mientras tus tropas avanzan desde el mar hacia los bluffs, las posiciones alemanas (Widerstandsnest y refuerzos) hostigaron sin cesar. Comprender cómo funciona este sistema es esencial para minimizar las bajas y avanzar.',
        ruleRefs: [{ section: '6', note: 'Sección completa de fuego alemán' }],
      },
      {
        type: 'rule-callout',
        content:
          '§6.1 — Cada "fire card" indica tres colores de posiciones alemanas que pueden disparar ese turno. Para cada color aparece un símbolo (simple o doble) y el "target symbol" de las unidades de EE.UU. que tienen mayor probabilidad de ser alcanzadas.',
        ruleRefs: [{ section: '6.1', note: 'Lectura de la fire card' }],
      },
      {
        type: 'prose',
        content:
          'Un símbolo simple en la carta significa que la posición de ese color dispara si tiene cualquier unidad alemana (con o sin marcador de profundidad). Un símbolo doble significa que la posición solo dispara si su unidad tiene un depth marker bajo ella. Este detalle es crucial: una posición con símbolo doble que perdió su marcador de profundidad NO dispara ese turno.',
        ruleRefs: [
          { section: '6.1', note: 'Símbolo simple vs. doble' },
          { section: '6.3', note: 'Condiciones de disparo' },
        ],
      },
      {
        type: 'rule-callout',
        content:
          '§6.2 — El "field of fire" (campo de fuego) de cada posición alemana está determinado por los "fire dots" (puntos de fuego) impresos en el mapa alrededor de esa posición. Hay tres intensidades: intense (intenso), steady (sostenido) y sporadic (esporádico). Una unidad de EE.UU. en un hex con fire dots es susceptible al fuego de esa posición.',
        ruleRefs: [{ section: '6.2', note: 'Campo de fuego y fire dots' }],
      },
      {
        type: 'prose',
        content:
          'Para resolver el fuego alemán: para cada posición que dispara, revisa cada hex de su campo de fuego que contenga unidades de EE.UU. Consulta la Tabla de Fuego Alemán (German Fire Chart) usando: la intensidad del fire dot, el tipo de posición (WN revelado, refuerzo revelado, o no revelado) y el tipo de unidad (blindada o no blindada). El resultado puede ser pérdida de escalón, desorganización, o ninguno.',
        ruleRefs: [{ section: '6.3', note: 'Procedimiento de resolución de fuego' }],
      },
      {
        type: 'rule-callout',
        content:
          '§6.31 — Límite de impactos: en un solo disparo, una posición puede alcanzar tantas unidades de EE.UU. como unidades alemanas y marcadores de profundidad tenga. Un WN con 1 unidad + 1 depth marker puede alcanzar hasta 2 unidades. Si hay más unidades elegibles que el límite, se priorizan: primero las de hexes con fuego intenso, luego sostenido, luego esporádico.',
        ruleRefs: [{ section: '6.31', note: 'Hit limits y prioridad de impactos' }],
      },
      {
        type: 'prose',
        content:
          'El "target symbol" en la fire card aumenta la probabilidad de impacto, pero no la determina en exclusiva. Cualquier unidad en un hex con fire dot puede ser alcanzada; el símbolo de objetivo simplemente ajusta las probabilidades según la German Fire Chart. Esta mecánica refleja que el fuego alemán era indiscriminado pero más letal contra ciertos tipos de formaciones.',
        ruleRefs: [
          { section: '6.3', note: 'Target symbol y susceptibilidad al fuego' },
          { section: '6.35', note: 'Concentrated target (5+ escalones)' },
        ],
      },
    ],
    workedExample: {
      titleEs: 'Ejemplo de resolución: WN con fuego intenso y steady sobre dos compañías',
      scenarioDescription:
        'Es el turno 3. La fire card para el sector este muestra el color rojo con símbolo simple y target symbol ▲. La posición roja (WN62) tiene 1 unidad + 1 depth marker. En su campo de fuego hay: hex 0813 con fuego intenso (2 unidades de EE.UU., incluyendo una ▲) y hex 0913 con fuego sostenido (1 unidad ●).',
      ruleRefs: [
        { section: '6.1', note: 'Lectura de la fire card' },
        { section: '6.31', note: 'Hit limit = 2 (1 unidad + 1 depth marker)' },
        { section: '6.3', note: 'Resolución de fuego: prioridad intenso > sostenido' },
      ],
      steps: [
        {
          order: 1,
          descriptionEs:
            'Verificar si WN62 dispara: la fire card muestra rojo con símbolo simple. WN62 tiene unidad (sin importar depth marker para símbolo simple). Sí dispara.',
        },
        {
          order: 2,
          descriptionEs:
            'Determinar el límite de impactos: WN62 tiene 1 unidad + 1 depth marker = máximo 2 impactos esta fase.',
        },
        {
          order: 3,
          descriptionEs:
            'Aplicar prioridad de impactos: Primero los hexes con fuego intenso (hex 0813). Hay 2 unidades; el target symbol ▲ aparece en la fire card. Consultar la German Fire Chart para fuego intenso / WN. El resultado es impacto — la unidad ▲ en 0813 sufre el resultado.',
        },
        {
          order: 4,
          descriptionEs:
            'WN62 usó 1 de sus 2 posibles impactos. Pasa al hex 0813 otra unidad (el segundo impacto) si hay otra ▲; de lo contrario al hex 0913 con fuego sostenido. La unidad ● en 0913 se verifica con la German Fire Chart para fuego sostenido.',
        },
        {
          order: 5,
          descriptionEs:
            'Una unidad puede perder un escalón o desorganizarse, pero nunca más de un escalón en toda la Fase de Fuego Alemán (§6.34). Aplica los resultados a las fichas afectadas.',
        },
      ],
    },
  },
];
