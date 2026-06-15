import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

/**
 * HomeComponent — landing hub for the D-Day at Omaha Beach learning app.
 *
 * Route: '' (root path).
 * Cinematic cover: full-bleed archival hero, stat strip, 2x2 section hub,
 * and a Historia teaser. Links to the main sections.
 */
@Component({
  standalone: true,
  selector: 'app-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <div class="screen">
      <!-- HERO -->
      <header class="hero" aria-label="Portada del juego">
        <div class="photo hero__photo">
          <img src="photos/jaws.jpg" alt="Tropas de asalto estadounidenses desembarcando en Omaha Beach, 6 de junio de 1944" loading="eager" />
          <span class="photo__cred">U.S. Coast Guard — R. F. Sargent · Dominio público</span>
        </div>
        <div class="hero__grad" aria-hidden="true"></div>
        <div class="hero__grad-side" aria-hidden="true"></div>

        <div class="wrap hero__content">
          <span class="eyebrow">Wargame solitario · Aprende a jugar</span>
          <h1 class="display hero__title">D-Day en<br /><span class="hero__accent">Omaha Beach</span></h1>
          <p class="lede hero__lede">
            Domina las reglas del desembarco más difícil del 6 de junio de 1944. Un curso
            interactivo, módulo a módulo, con ejercicios prácticos y la historia real de la batalla.
          </p>
          <div class="hero__actions">
            <a class="btn btn--primary" routerLink="/modules/module-1">
              Empezar el curso <span class="btn__arrow" aria-hidden="true">→</span>
            </a>
            <a class="btn btn--ghost" routerLink="/historia">Leer la historia</a>
          </div>
          <div class="hero__meta">
            <span class="stamp">H-Hora · 06:30</span>
            <span class="mono hero__coords">49°22′N 0°52′O · Costa de Calvados, Normandía</span>
          </div>
        </div>

        <span class="mono hero__sector" aria-hidden="true">Sector · Omaha</span>
      </header>

      <!-- STAT STRIP -->
      <div class="stats">
        <div class="wrap stats__grid">
          @for (s of stats; track s.label) {
            <div class="stats__cell">
              <div class="display stats__num">{{ s.value }}</div>
              <div class="kicker">{{ s.label }}</div>
            </div>
          }
        </div>
      </div>

      <!-- HUB -->
      <section class="section wrap">
        <div class="sechead">
          <div>
            <div class="sechead__eyebrow"><span class="eyebrow">El manual</span></div>
            <h2 class="sechead__t">Explora la campaña</h2>
          </div>
          <div class="sechead__meta">CUATRO FRENTES<br />UN MISMO OBJETIVO</div>
        </div>

        <nav class="hub" aria-label="Secciones del manual">
          @for (c of hub; track c.id) {
            <a class="card card--hov hub__card" [routerLink]="c.route">
              <div class="display hub__num">{{ c.n }}</div>
              <div class="hub__body">
                <div class="hub__head">
                  <h3 class="serif hub__title">{{ c.title }}</h3>
                  <span class="kicker">{{ c.meta }}</span>
                </div>
                <p class="hub__desc">{{ c.desc }}</p>
                <span class="stencil hub__enter">Entrar <span class="hub__arrow" aria-hidden="true">→</span></span>
              </div>
            </a>
          }
        </nav>
      </section>

      <!-- HISTORIA TEASER -->
      <section class="section--tight teaser-section">
        <div class="wrap">
          <div class="teaser">
            <div class="photo teaser__photo">
              <img src="photos/approaching.jpg" alt="Lanchas de desembarco aproximándose a Omaha Beach" loading="lazy" />
              <span class="photo__cred">U.S. Army Signal Corps · Dominio público</span>
            </div>
            <div class="teaser__grad" aria-hidden="true"></div>
            <div class="teaser__content">
              <span class="eyebrow">Capítulo II · 06:30</span>
              <h2 class="display teaser__quote">«La playa estaría solo ligeramente defendida»</h2>
              <p class="teaser__text">
                Nueve compañías desembarcaron en la primera oleada bajo un fuego que nadie había
                previsto. Lo que salvó el día no fue el plan, sino la iniciativa del soldado. Conoce
                la batalla que el juego reproduce.
              </p>
              <a class="btn btn--ghost" routerLink="/historia">
                Leer el relato completo <span class="btn__arrow" aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    /* ---- HERO ---- */
    .hero {
      position: relative;
      min-height: 88vh;
      display: flex;
      align-items: flex-end;
      overflow: hidden;
    }
    .hero__photo { position: absolute; inset: 0; height: 100%; }
    .hero__grad {
      position: absolute; inset: 0; pointer-events: none;
      background: linear-gradient(180deg, rgba(8,10,11,0.55) 0%, rgba(8,10,11,0.3) 35%, rgba(8,10,11,0.82) 88%, var(--ink) 100%);
    }
    .hero__grad-side {
      position: absolute; inset: 0; pointer-events: none;
      background: linear-gradient(90deg, rgba(8,10,11,0.78) 0%, transparent 60%);
    }
    .hero__content { position: relative; padding-bottom: 74px; padding-top: 120px; }
    .hero__title {
      font-size: clamp(48px, 8vw, 118px);
      line-height: 0.9;
      letter-spacing: -0.03em;
      text-shadow: 0 4px 40px rgba(0,0,0,0.6);
      margin-top: 26px;
    }
    .hero__accent { color: var(--accent); }
    .hero__lede { max-width: 54ch; margin-top: 28px; margin-bottom: 36px; }
    .hero__actions { display: flex; gap: 16px; flex-wrap: wrap; align-items: center; }
    .hero__meta { display: flex; gap: 18px; align-items: center; margin-top: 54px; flex-wrap: wrap; }
    .hero__coords { font-size: 11.5px; color: var(--muted); letter-spacing: 0.12em; }
    .hero__sector {
      position: absolute; right: 22px; top: 42%;
      transform: rotate(90deg); transform-origin: right;
      font-size: 11px; letter-spacing: 0.34em; color: var(--muted);
    }

    /* ---- STAT STRIP ---- */
    .stats { background: var(--char); border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); }
    .stats__grid { display: grid; grid-template-columns: repeat(4, 1fr); }
    .stats__cell { padding: 30px 8px 28px; text-align: center; }
    .stats__cell + .stats__cell { border-left: 1px solid var(--line); }
    .stats__num { font-size: 48px; color: var(--bone); line-height: 1; }
    .stats .kicker { margin-top: 8px; display: block; }

    /* ---- HUB ---- */
    .sechead__eyebrow { margin-bottom: 14px; }
    .hub { display: grid; grid-template-columns: repeat(2, 1fr); gap: 18px; }
    .hub__card {
      padding: 34px 34px 30px;
      display: flex;
      gap: 24px;
      align-items: flex-start;
      border-top: 2px solid var(--accent);
    }
    .hub__num {
      font-size: 46px; color: var(--steel-2); line-height: 0.9;
      -webkit-text-stroke: 1px var(--line-strong);
      flex: none;
    }
    .hub__body { flex: 1; }
    .hub__head { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; }
    .hub__title { font-size: 27px; }
    .hub__desc { color: var(--muted); font-size: 15.5px; margin: 12px 0 0; line-height: 1.6; }
    .hub__enter {
      display: inline-flex; gap: 8px; align-items: center;
      margin-top: 18px; font-size: 12.5px; color: var(--accent); font-weight: 600;
    }
    .hub__arrow { font-family: var(--font-body); }

    /* ---- HISTORIA TEASER ---- */
    .teaser-section { padding-bottom: 90px; }
    .teaser {
      position: relative;
      border-radius: var(--radius);
      overflow: hidden;
      border: 1px solid var(--line);
    }
    .teaser__photo { height: clamp(360px, 52vh, 520px); }
    .teaser__grad {
      position: absolute; inset: 0; pointer-events: none;
      background: linear-gradient(90deg, rgba(8,10,11,0.92) 0%, rgba(8,10,11,0.6) 48%, transparent 100%);
    }
    .teaser__content {
      position: absolute; inset: 0;
      display: flex; flex-direction: column; justify-content: center;
      padding: 0 clamp(28px, 5vw, 72px);
      max-width: 620px;
    }
    .teaser__quote { font-size: clamp(30px, 4vw, 52px); margin: 16px 0; line-height: 1; }
    .teaser__text { color: var(--sand); font-size: 16.5px; line-height: 1.6; margin-bottom: 26px; max-width: 46ch; }

    /* ---- RESPONSIVE ---- */
    @media (max-width: 760px) {
      .hero { min-height: 78vh; }
      .hero__content { padding-top: 90px; padding-bottom: 50px; }
      .stats__grid { grid-template-columns: repeat(2, 1fr); }
      .stats__cell:nth-child(3) { border-left: none; }
      .stats__cell:nth-child(n+3) { border-top: 1px solid var(--line); }
      .hub { grid-template-columns: 1fr; }
      .hero__sector { display: none; }
    }
  `],
})
export default class HomeComponent {
  readonly stats = [
    { value: '8', label: 'Módulos del curso' },
    { value: '352', label: 'Fichas troqueladas' },
    { value: '55', label: 'Cartas de eventos' },
    { value: '0', label: 'Dados' },
  ];

  readonly hub = [
    {
      id: 'curso',
      n: '01',
      title: 'El Curso',
      meta: '8 módulos',
      route: '/modules',
      desc: 'Ocho módulos que te llevan de cero a jugar: componentes, secuencia de turno, fuego alemán, acciones y victoria.',
    },
    {
      id: 'historia',
      n: '02',
      title: 'La Historia',
      meta: '6 capítulos',
      route: '/historia',
      desc: 'El asalto a Omaha hora a hora, según el análisis de campaña del propio diseñador del juego.',
    },
    {
      id: 'simbologia',
      n: '03',
      title: 'Simbología',
      meta: 'Fichas y marcadores',
      route: '/simbologia',
      desc: 'Referencia visual de cada ficha y marcador: unidades, objetivos, fuego, terreno y armas.',
    },
    {
      id: 'preparacion',
      n: '04',
      title: 'Preparación',
      meta: '5 fases',
      route: '/preparacion',
      desc: 'Guía paso a paso para montar el tablero y dejar la partida lista para el Turno 1.',
    },
  ];
}
