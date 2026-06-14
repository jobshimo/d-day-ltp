/**
 * Historia content — D-Day at Omaha Beach campaign analysis.
 *
 * Source: "Their Greatest Day: From Disaster to Victory on Omaha Beach"
 * by John H. Butterfield, game designer (DDOB Campaign Analysis).
 * Published in World at War #5, Apr–May 2009.
 *
 * All Spanish prose is a faithful paraphrase of the Butterfield article.
 * No historical facts, dates, or units have been invented or embellished.
 */

export interface HistoriaBlock {
  /** Content type. For 'image', content is the asset path. */
  type: 'prose' | 'image' | 'pull-quote';
  /** Prose text (Spanish) OR relative asset path (for images). */
  content: string;
  /** Required for image blocks. Descriptive alt text in Spanish. */
  altText?: string;
  /** Optional figure caption in Spanish. */
  caption?: string;
  /** Source attribution for this block. */
  sourceRef?: string;
}

export interface HistoriaSection {
  /** URL-safe section identifier. */
  id: string;
  /** Section heading in Spanish. */
  titleEs: string;
  /** Ordered blocks of content. */
  blocks: HistoriaBlock[];
}

/**
 * HISTORY — 6 sections covering the Omaha Beach assault on 6 June 1944.
 * Grounded in Butterfield's DDOB Campaign Analysis (as extracted in
 * campaign-text.txt). No invention permitted.
 */
export const HISTORY: HistoriaSection[] = [
  {
    id: 'el-plan',
    titleEs: 'El plan aliado',
    blocks: [
      {
        type: 'image',
        content: 'assets/images/omaha03.jpg',
        altText: 'Embarcaciones de desembarco aliadas aproximándose a la playa de Omaha Beach',
        caption: 'Las primeras oleadas de desembarco se acercaban a la costa normanda en la madrugada del 6 de junio de 1944.',
        sourceRef: 'Análisis de campaña DDOB (Butterfield)',
      },
      {
        type: 'prose',
        content:
          'En enero de 1944, el general Eisenhower asumió el mando supremo aliado y amplió el plan COSSAC de tres a cinco playas en la costa de Normandía, abarcando más de 80 kilómetros de litoral. A cada playa se le asignó un nombre en clave: Utah, Omaha, Gold, Juno y Sword. De las cinco, Omaha resultaría ser la más sangrienta y la más difícil de conquistar.',
        sourceRef: 'Análisis de campaña DDOB (Butterfield)',
      },
      {
        type: 'prose',
        content:
          'El asalto a Omaha fue encomendado al V Cuerpo de Ejército estadounidense bajo el mando del general Leonard Gerow, encuadrado en el Primer Ejército del general Omar Bradley. El plan contemplaba que unidades de la 1.ª División de Infantería y de la 29.ª División de Infantería realizaran el ataque del día D. El 116.º Regimiento de la 29.ª desembarcaría en la mitad occidental de la playa, y el 16.º Regimiento de la 1.ª haría lo propio en la mitad oriental. El plan preveía neutralizar las defensas de playa en dos horas y dejar expeditas las salidas en tres.',
        sourceRef: 'Análisis de campaña DDOB (Butterfield)',
      },
      {
        type: 'pull-quote',
        content:
          'Omaha Beach también representó un fallo estrepitoso de planificación. El plan, elaborado con todo detalle, estaba mal adaptado a la realidad.',
        sourceRef: 'Análisis de campaña DDOB (Butterfield)',
      },
      {
        type: 'prose',
        content:
          'Los planificadores aliados sabían que los defensores alemanes contaban con enormes ventajas de terreno en Omaha. Para contrarrestarlas desarrollaron dos planes coordinados: el Plan de Fuego Conjunto —que combinaba fuego aéreo, naval y terrestre— y el Plan de Asalto, elaborado a nivel de cuerpo y división. El defecto clave residía en que el Plan de Asalto se concibió asumiendo que el Plan de Fuego Conjunto alcanzaría su objetivo. Esa suposición se revelaría catastrófica.',
        sourceRef: 'Análisis de campaña DDOB (Butterfield)',
      },
    ],
  },
  {
    id: 'el-asalto',
    titleEs: 'El asalto a la playa',
    blocks: [
      {
        type: 'image',
        content: 'assets/images/omaha06.jpg',
        altText: 'Soldados estadounidenses avanzando bajo el fuego alemán en la playa de Omaha',
        caption: 'Los primeros soldados en desembarcar se enfrentaron a un fuego devastador sin la cobertura de blindados ni apoyo aéreo.',
        sourceRef: 'Análisis de campaña DDOB (Butterfield)',
      },
      {
        type: 'prose',
        content:
          'A las 6:25 horas, los tanques DD (de doble propulsión) del 741.º Batallón fueron lanzados al mar a pesar del temporal reinante. De los 32 tanques lanzados, 27 se hundieron. En cambio, los comandantes del 743.º Batallón, al ver hundirse los primeros vehículos, optaron por llevar sus tanques directamente a la playa en las lanchas de desembarco: 30 de 32 llegaron a tierra, con 15 minutos de retraso pero en el lugar correcto.',
        sourceRef: 'Análisis de campaña DDOB (Butterfield)',
      },
      {
        type: 'prose',
        content:
          'A las 6:30 horas, nueve compañías de infantería desembarcaron en la primera oleada a bordo de 50 lanchas. Las fuertes corrientes cruzadas hacia el este, la oscuridad y el humo de los incendios causados por el bombardeo naval desviaron a la mayoría de las embarcaciones de sus objetivos asignados. Las que desembarcaron justo frente a las posiciones alemanas sufrieron las bajas más graves; las que encontraron huecos entre los puntos fuertes llegaron casi indemnes.',
        sourceRef: 'Análisis de campaña DDOB (Butterfield)',
      },
      {
        type: 'pull-quote',
        content:
          'Lo que detuvo a los soldados estadounidenses en la berma de guijarros no fue tanto la lluvia de balas como la situación completamente inesperada. Les habían dicho que la playa estaría solo ligeramente defendida.',
        sourceRef: 'Análisis de campaña DDOB (Butterfield)',
      },
      {
        type: 'prose',
        content:
          'La Octava Fuerza Aérea no lanzó una sola bomba sobre Omaha Beach esa mañana: la nube baja obligó a los bombarderos a usar radar, y temiendo impactar a sus propias tropas, retrasaron la apertura de las compuertas de bombas unos segundos, con lo que la lluvia de bombas cayó sobre las granjas del interior. El bombardeo naval, por su parte, fue demasiado breve y con demasiado pocos barcos para neutralizar las posiciones alemanas.',
        sourceRef: 'Análisis de campaña DDOB (Butterfield)',
      },
    ],
  },
  {
    id: 'las-defensas',
    titleEs: 'Las defensas alemanas',
    blocks: [
      {
        type: 'prose',
        content:
          'A finales de 1943, bajo el mando del mariscal de campo Erwin Rommel, las dos divisiones del Grupo de Ejércitos B intensificaron las mejoras en las defensas de la costa norte de Francia. Rommel creía que la invasión debía ser derrotada en la playa misma, y abogó por colocar reservas en zonas operativas cercanas a los probables puntos de desembarco para poder contraatacar en cuestión de horas. Su convicción: "El enemigo es más débil justo después de desembarcar. Ese es el momento de golpearlo."',
        sourceRef: 'Análisis de campaña DDOB (Butterfield)',
      },
      {
        type: 'prose',
        content:
          'La estrategia alemana para el día D resultó ser un compromiso entre el plan de Rommel y el del mariscal von Rundstedt, que prefería una reserva blindada centralizada. Las divisiones acorazadas quedaron más lejos de las playas de lo que Rommel deseaba, pero él logró que infantería de calidad avanzara hasta la costa. Eso explica la presencia de la 352.ª División de Infantería alemana en Omaha Beach: la inteligencia aliada la había situado a 15 kilómetros de la playa semanas antes del desembarco, pero no supo que dos de sus batallones habían sido desplazados hasta la propia playa.',
        sourceRef: 'Análisis de campaña DDOB (Butterfield)',
      },
      {
        type: 'prose',
        content:
          'En Omaha, las defensas adoptaron tres formas complementarias: obstáculos minados en la zona intermareal para destruir las lanchas de desembarco, obstáculos anticarro y campos de minas en la parte alta de la playa para impedir el avance tierra adentro, y fortines de hormigón en los acantilados y alturas que cubrían con fuego cruzado y rasante cada centímetro de la playa. El día D, la 716.ª y la 352.ª Divisiones alemanas estaban distribuidas a lo largo de un frente de 70 kilómetros, defendiendo los Widerstandsnester —puntos de resistencia— que flanqueaban los barrancos de acceso al interior.',
        sourceRef: 'Análisis de campaña DDOB (Butterfield)',
      },
      {
        type: 'pull-quote',
        content:
          'Si el enemigo logra meter un pie, pondrá todos los antitanques y blindados que pueda en la cabeza de playa y nos dejará golpearnos contra ella. — Rommel',
        sourceRef: 'Análisis de campaña DDOB (Butterfield)',
      },
    ],
  },
  {
    id: 'la-crisis',
    titleEs: 'La crisis del mediodía',
    blocks: [
      {
        type: 'image',
        content: 'assets/images/d-day-omaha-gamers-hq-100G6ucc5r92qoHj.jpg',
        altText: 'Mapa del campo de batalla de Omaha Beach con los barrancos y posiciones alemanas marcadas',
        caption: 'Los cinco barrancos (D-1 Vierville, D-3 Les Moulins, E-1 St. Laurent, E-3 Colleville, F-1 Cabourg) eran las únicas vías de acceso al interior.',
        sourceRef: 'Análisis de campaña DDOB (Butterfield)',
      },
      {
        type: 'prose',
        content:
          'Entre las 8:00 y las 10:00 horas, el general Bradley a bordo del USS Augusta vivió la mayor agonía de la jornada. La información que le llegaba era fragmentaria y pintaba un cuadro sombrío. Bradley llegó a considerar la evacuación de la cabeza de playa, pero no tenía plan de retirada, ni medios suficientes para ejecutarla. Mantener la presión en Omaha era imperativo: sin esta playa, un hueco de 40 kilómetros separaría Utah de Gold, haciendo inviable la cabeza de playa aliada en Normandía.',
        sourceRef: 'Análisis de campaña DDOB (Butterfield)',
      },
      {
        type: 'prose',
        content:
          'Fue la iniciativa individual de oficiales subalternos, suboficiales y soldados la que cambió el curso de la batalla. El general de brigada Norman "Dutch" Cota, segundo al mando de la 29.ª División, desembarcó en Dog White y recorrió la berma bajo el fuego para reorganizar a los hombres paralizados. Empujando grupos sobre el muro de piedra y hacia los acantilados, Cota llegó a la cima entre Vierville y Les Moulins a las 8:30. A las 10:00, Vierville estaba en manos estadounidenses.',
        sourceRef: 'Análisis de campaña DDOB (Butterfield)',
      },
      {
        type: 'pull-quote',
        content:
          '¡Salid de la maldita playa! ¡Si os quedáis estáis muertos o a punto de morir! — coronel George Taylor, 16.º Regimiento de Infantería',
        sourceRef: 'Análisis de campaña DDOB (Butterfield)',
      },
      {
        type: 'prose',
        content:
          'El teniente John Spalding y su pelotón de E/16.º desembarcaron en la costura entre los barrancos de Colleville y St. Laurent. Haciendo estallar una brecha en la alambrada con torpedos Bangalore, el grupo cruzó el terreno despejado hasta la base del acantilado y comenzó el ascenso. A las 8:00 estaban en la cima, siendo los primeros infantes de línea en alcanzar el terreno elevado. A las 9:30 habían neutralizado el WN 64 sin una sola baja.',
        sourceRef: 'Análisis de campaña DDOB (Butterfield)',
      },
    ],
  },
  {
    id: 'el-avance',
    titleEs: 'El avance al interior',
    blocks: [
      {
        type: 'prose',
        content:
          'A las 9:30 horas, varios grupos de soldados estadounidenses se encontraban ya en el terreno elevado en todos los sectores. Desde el este, la compañía L del 16.º Regimiento había escalado los acantilados y neutralizado el WN 60 atacándolo por la retaguardia. En el centro, Spalding y Dawson avanzaban hacia Colleville. En el oeste, los Rangers y supervivientes del 116.º sostenían el barranco de Vierville.',
        sourceRef: 'Análisis de campaña DDOB (Butterfield)',
      },
      {
        type: 'prose',
        content:
          'Entre las 10:00 y el mediodía desembarcaron dos regimientos de refuerzo: el 18.º de la 1.ª División y el 115.º de la 29.ª. El 18.º Batallón abrió el barranco de St. Laurent al tráfico rodado a las 15:00; a las 17:00, el primer vehículo aliado salió de la playa por el barranco de Vierville. La marina también jugó un papel decisivo: los destructores se acercaron tanto a la costa que casi tocaron fondo, proporcionando fuego de artillería directa equivalente al de un tanque para eliminar posiciones alemanas clave.',
        sourceRef: 'Análisis de campaña DDOB (Butterfield)',
      },
      {
        type: 'prose',
        content:
          'Al caer la tarde, cuatro regimientos de infantería estadounidenses dominaban el terreno elevado a lo largo de toda Omaha Beach. Cualquier posibilidad que tuvieran los alemanes de ganar en Omaha se perdió antes del mediodía del 6 de junio. Las únicas unidades capaces de responder —las reservas de la 352.ª División— fueron mal dirigidas y comprometidas de manera fragmentaria. Las formaciones blindadas que podrían haber aplastado a la infantería en las primeras horas estaban demasiado lejos, gracias a los errores estratégicos del mando alemán.',
        sourceRef: 'Análisis de campaña DDOB (Butterfield)',
      },
      {
        type: 'pull-quote',
        content:
          'Una vez establecida en tierra, la maquinaria de guerra aliada no podía ser detenida. Los alemanes pudieron retrasar el avance aliado en ocasiones, pero la derrota de la Wehrmacht en el oeste se hizo inevitable desde el momento en que los aliados aseguraron el terreno elevado.',
        sourceRef: 'Análisis de campaña DDOB (Butterfield)',
      },
    ],
  },
  {
    id: 'en-el-juego',
    titleEs: 'La batalla en el juego',
    blocks: [
      {
        type: 'image',
        content: 'assets/images/omaha11.jpg',
        altText: 'Ficha de juego de D-Day en Omaha Beach mostrando una unidad de infantería estadounidense',
        caption: 'Las fichas del juego reproducen las unidades históricas con simbología OTAN estándar.',
        sourceRef: 'Análisis de campaña DDOB (Butterfield)',
      },
      {
        type: 'prose',
        content:
          'D-Day en Omaha Beach captura la esencia del caos del desembarco a través de un sistema de cartas de fuego en lugar de dados convencionales. Las Widerstandsnester (WN) alemanas se representan con marcadores de profundidad que reflejan su capacidad de resistencia; eliminarlas requiere presión sostenida, igual que ocurrió históricamente. La mecánica de fuego de supresión reproduce el efecto real del bombardeo naval y del fuego de flanqueo que desorientó a los defensores.',
        sourceRef: 'Análisis de campaña DDOB (Butterfield)',
      },
      {
        type: 'prose',
        content:
          'Las cartas de desembarco simulan la dispersión de las lanchas de desembarco: el jugador aliado no controla dónde desembarcan sus unidades con exactitud, igual que los comandantes reales no pudieron compensar las corrientes y la oscuridad. La victoria aliada depende de encontrar los huecos entre las posiciones alemanas, tal como lo descubrieron los soldados supervivientes de la primera oleada.',
        sourceRef: 'Análisis de campaña DDOB (Butterfield)',
      },
      {
        type: 'pull-quote',
        content:
          'El diseño de Butterfield logra que el jugador aliado experimente la misma tensión que sufrió Bradley: la información es incompleta, los refuerzos llegan tarde y la victoria depende de la iniciativa individual.',
        sourceRef: 'Análisis de campaña DDOB (Butterfield)',
      },
      {
        type: 'prose',
        content:
          'El juego también modela la distinción entre los dos campos de batalla: la playa y los acantilados son mundos separados. Las unidades en la playa no pueden ver ni apoyar a las que están en el terreno elevado, y viceversa. Esta limitación de visibilidad reproduce fielmente la realidad descrita por Butterfield: el talud de los acantilados creaba dos espacios de combate completamente incomunicados que los comandantes aliados debían gestionar por separado.',
        sourceRef: 'Análisis de campaña DDOB (Butterfield)',
      },
    ],
  },
];
