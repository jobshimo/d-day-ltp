import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HISTORY } from 'content';
import type { HistoriaSection } from 'content';

/** Per-chapter presentation metadata (numeral, time kicker, archival photo).
 *  Sourced from the design handoff — historically grounded labels and the
 *  five public-domain U.S. federal photographs. Prose & quotes still come
 *  from the HISTORY content lib; this only governs presentation. */
interface ChapterMeta {
  num: string;
  time: string;
  photo?: string;
  alt?: string;
  cred?: string;
  caption?: string;
}

const CHAPTER_META: Record<string, ChapterMeta> = {
  'el-plan': {
    num: 'I',
    time: 'Enero 1944',
    photo: 'photos/approaching.jpg',
    alt: 'Lanchas de desembarco aliadas aproximándose a Omaha Beach',
    cred: 'U.S. Army Signal Corps · Dominio público',
    caption: 'Las primeras oleadas se acercaban a la costa normanda en la madrugada del 6 de junio de 1944.',
  },
  'el-asalto': {
    num: 'II',
    time: '06:30 — H-Hora',
    photo: 'photos/jaws.jpg',
    alt: 'Tropas de asalto estadounidenses desembarcando bajo fuego en Omaha Beach',
    cred: 'U.S. Coast Guard — R. F. Sargent · Dominio público',
    caption: 'Los primeros soldados se enfrentaron a un fuego devastador sin cobertura de blindados ni apoyo aéreo.',
  },
  'las-defensas': {
    num: 'III',
    time: 'Otoño 1943',
  },
  'la-crisis': {
    num: 'IV',
    time: '08:00 — 10:00',
    photo: 'photos/burning.jpg',
    alt: 'Defensas alemanas en llamas sobre Omaha Beach',
    cred: 'DPLA / U.S. Army · Dominio público',
    caption: 'Los cinco barrancos eran las únicas vías de acceso al interior; el humo cubría la playa.',
  },
  'el-avance': {
    num: 'V',
    time: '09:30 — Anochecer',
    photo: 'photos/assault02.jpg',
    alt: 'Tropas de asalto estadounidenses avanzando desde la playa hacia el terreno elevado',
    cred: 'U.S. National Archives · Dominio público',
    caption: 'Al caer la tarde, cuatro regimientos dominaban el terreno elevado a lo largo de toda la playa.',
  },
  'en-el-juego': {
    num: 'VI',
    time: 'El diseño',
    photo: 'photos/assault01.jpg',
    alt: 'Gran grupo de tropas de asalto estadounidenses en Omaha Beach',
    cred: 'U.S. National Archives · Dominio público',
    caption: 'El juego reproduce las unidades históricas y la incertidumbre del desembarco.',
  },
};

const FALLBACK_META: ChapterMeta = { num: '·', time: '' };

/**
 * HistoriaComponent — narrative history of the Omaha Beach assault.
 *
 * Route: /historia (ungated — no canActivate guard).
 * Content comes from HISTORY constant in libs/content, sourced from the
 * Butterfield DDOB Campaign Analysis.
 *
 * Section nav uses scrollIntoView (via DOCUMENT injection) instead of bare
 * href="#..." anchors: with <base href="/"> fragment-only hrefs navigate to
 * the site root rather than scrolling within the current page.
 */
@Component({
  standalone: true,
  selector: 'app-historia',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <div class="screen historia">
      <!-- HEADER BAND -->
      <header class="historia__hero">
        <div class="photo historia__hero-photo">
          <img
            src="photos/burning.jpg"
            alt="Defensas alemanas en llamas sobre Omaha Beach el día D"
            loading="eager"
          />
          <span class="photo__cred">DPLA / U.S. Army · Dominio público</span>
        </div>
        <div class="historia__hero-grad" aria-hidden="true"></div>
        <div class="wrap historia__hero-content">
          <span class="eyebrow">El relato de la batalla</span>
          <h1 class="display historia__title">El asalto a<br />Omaha Beach</h1>
          <p class="lede historia__intro">
            El 6 de junio de 1944, las fuerzas estadounidenses asaltaron una franja de arena de
            la costa del Calvados. Esta es la crónica del día D según el análisis de campaña de
            John H. Butterfield, diseñador del juego.
          </p>

          <!-- Section TOC — buttons with scrollIntoView, not bare href anchors -->
          <nav class="historia__toc" aria-label="Ir a sección">
            @for (section of sections; track section.id) {
              <button
                type="button"
                class="tag historia__toc-link"
                (click)="scrollToSection(section.id)">
                <span class="historia__toc-num" aria-hidden="true">{{ meta(section.id).num }}</span>
                {{ section.titleEs }}
              </button>
            }
          </nav>
        </div>
      </header>

      <!-- SECTIONS -->
      <div class="wrap historia__body">
        @for (section of sections; track section.id) {
          <section
            class="historia__section"
            [id]="'historia-' + section.id"
            [attr.aria-labelledby]="'historia-heading-' + section.id">

            <div class="historia__sechead">
              <span class="display historia__num" aria-hidden="true">{{ meta(section.id).num }}</span>
              <div>
                @if (meta(section.id).time) {
                  <div class="kicker historia__time">{{ meta(section.id).time }}</div>
                }
                <h2 class="display historia__section-title" [id]="'historia-heading-' + section.id">
                  {{ section.titleEs }}
                </h2>
              </div>
            </div>

            <div class="historia__grid" [class.historia__grid--solo]="!meta(section.id).photo">
              <div class="historia__col">
                @for (block of section.blocks; track $index) {
                  @switch (block.type) {
                    @case ('pull-quote') {
                      <blockquote class="historia__pull-quote">
                        <p>{{ block.content }}</p>
                        @if (block.sourceRef) {
                          <footer class="historia__pull-quote-source">
                            <cite>{{ block.sourceRef }}</cite>
                          </footer>
                        }
                      </blockquote>
                    }
                    @case ('image') {
                      <!-- inline content images are replaced by the chapter's sticky archival photo -->
                    }
                    @default {
                      <p class="historia__prose">{{ block.content }}</p>
                    }
                  }
                }
              </div>

              @if (meta(section.id).photo) {
                <figure class="historia__figure">
                  <div class="photo historia__figure-photo">
                    <img [src]="meta(section.id).photo" [alt]="meta(section.id).alt ?? ''" loading="lazy" />
                    <div class="photo__grad" aria-hidden="true"></div>
                    <span class="photo__cred">{{ meta(section.id).cred }}</span>
                  </div>
                  <figcaption class="historia__figcaption">↳ {{ meta(section.id).caption }}</figcaption>
                </figure>
              }
            </div>
          </section>
        }

        <div class="historia__cta">
          <span class="eyebrow eyebrow--plain">Continúa</span>
          <h3 class="display historia__cta-title">Lleva la historia al tablero</h3>
          <a class="btn btn--primary" routerLink="/modules/module-1">
            Empezar el curso <span class="btn__arrow" aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* ---- HEADER BAND ---- */
    .historia__hero {
      position: relative;
      overflow: hidden;
      border-bottom: 1px solid var(--line);
    }
    .historia__hero-photo { position: absolute; inset: 0; height: 100%; }
    .historia__hero-grad {
      position: absolute; inset: 0; pointer-events: none;
      background: linear-gradient(180deg, rgba(8,10,11,0.7), rgba(8,10,11,0.86) 70%, var(--ink));
    }
    .historia__hero-content { position: relative; padding: 110px 28px 56px; }
    .historia__title {
      font-size: clamp(40px, 6vw, 84px);
      line-height: 0.92;
      margin: 20px 0 24px;
      letter-spacing: -0.02em;
    }
    .historia__intro { max-width: 64ch; }

    /* ---- TOC ---- */
    .historia__toc { display: flex; flex-wrap: wrap; gap: 9px; margin-top: 34px; }
    .historia__toc-link { background: rgba(0,0,0,0.25); }
    .historia__toc-num { color: var(--accent); margin-right: 7px; }

    /* ---- BODY / SECTIONS ---- */
    .historia__body { padding-top: 20px; }
    .historia__section {
      padding: 66px 0;
      border-bottom: 1px solid var(--line);
      scroll-margin-top: 80px;
    }
    .historia__section:last-of-type { border-bottom: none; }

    .historia__sechead { display: flex; align-items: baseline; gap: 20px; margin-bottom: 8px; }
    .historia__num {
      font-size: 64px;
      color: var(--steel-2);
      line-height: 0.8;
      -webkit-text-stroke: 1px var(--line-strong);
      flex: none;
    }
    .historia__time { color: var(--accent); }
    .historia__section-title { font-size: clamp(28px, 3.4vw, 44px); margin-top: 6px; }

    .historia__grid {
      display: grid;
      grid-template-columns: 1.05fr 0.95fr;
      gap: 40px;
      align-items: start;
      margin-top: 30px;
    }
    .historia__grid--solo { grid-template-columns: 1fr; }

    /* ---- PROSE ---- */
    .historia__prose {
      font-size: 18px;
      line-height: 1.72;
      color: var(--sand);
      max-width: 66ch;
      margin: 0 0 22px;
    }

    /* ---- PULL QUOTES ---- */
    .historia__pull-quote {
      margin: 36px 0;
      padding: 4px 0 4px 30px;
      border-left: 3px solid var(--accent);
    }
    .historia__pull-quote p {
      font-family: var(--font-display);
      font-size: clamp(22px, 2.6vw, 32px);
      font-weight: 700;
      font-style: italic;
      line-height: 1.25;
      color: var(--bone);
    }
    .historia__pull-quote-source { margin-top: 10px; }
    .historia__pull-quote-source cite {
      font-family: var(--font-mono);
      font-size: 11.5px;
      color: var(--muted);
      font-style: normal;
      letter-spacing: 0.06em;
    }

    /* ---- STICKY ARCHIVAL PHOTO ---- */
    .historia__figure { margin: 0; position: sticky; top: 88px; }
    .historia__figure-photo {
      height: min(64vh, 520px);
      border-radius: var(--radius);
      border: 1px solid var(--line);
    }
    .historia__figcaption {
      font-family: var(--font-mono);
      font-size: 11.5px;
      color: var(--muted);
      margin-top: 12px;
      line-height: 1.5;
      padding-left: 2px;
    }

    /* ---- CTA ---- */
    .historia__cta { padding: 56px 0 80px; text-align: center; }
    .historia__cta-title { font-size: 32px; margin: 14px 0 24px; }

    /* ---- RESPONSIVE ---- */
    @media (max-width: 820px) {
      .historia__grid { grid-template-columns: 1fr; gap: 24px; }
      .historia__figure { position: static; }
      .historia__figure-photo { height: clamp(280px, 50vh, 420px); }
      .historia__hero-content { padding: 84px 16px 44px; }
      .historia__num { font-size: 46px; }
    }
  `],
})
export default class HistoriaComponent {
  private readonly document = inject(DOCUMENT);

  /** All 6 history sections from the content lib. */
  readonly sections: HistoriaSection[] = HISTORY;

  /** Presentation metadata (numeral, time kicker, archival photo) for a chapter. */
  meta(sectionId: string): ChapterMeta {
    return CHAPTER_META[sectionId] ?? FALLBACK_META;
  }

  /**
   * Smooth-scroll to a history section. Uses scrollIntoView instead of bare
   * href="#historia-{id}" anchors: with <base href="/"> fragment-only hrefs
   * resolve against the base URL and navigate to the site root.
   */
  scrollToSection(sectionId: string): void {
    this.document
      .getElementById('historia-' + sectionId)
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
