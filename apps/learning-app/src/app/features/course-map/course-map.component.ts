import {
  Component,
  OnInit,
  inject,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CourseStore } from 'application-course-store';
import { ModuleCardComponent } from './module-card.component';

@Component({
  standalone: true,
  selector: 'app-course-map',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ModuleCardComponent],
  providers: [CourseStore],
  template: `
    <div class="screen wrap section">
      <div class="sechead">
        <div>
          <div class="course-map__eyebrow"><span class="eyebrow">El curso</span></div>
          <h1 class="sechead__t">Ocho módulos hacia la victoria</h1>
        </div>
        <div class="sechead__meta">DE CERO A JUGAR<br />EDICIÓN DEVIR</div>
      </div>

      <p class="lede course-map__lede">
        Cada módulo combina lecciones, ejercicios guiados y un examen de repaso. Empieza por el
        primero: aprende a leer el tablero, las fichas y las cartas antes de poner un pie en la arena.
      </p>

      @if (store.loading()) {
        <div class="course-map__loading" role="status" aria-live="polite">
          <span class="loading-spinner" aria-hidden="true"></span>
          <span>Cargando módulos…</span>
        </div>
      } @else if (store.error()) {
        <div class="course-map__error" role="alert">
          <strong>Error al cargar:</strong> {{ store.error() }}
        </div>
      } @else {
        <ol class="module-list" aria-label="Lista de módulos del curso">
          @for (mod of store.modules(); track mod.moduleId) {
            <li>
              <app-module-card [mod]="mod" />
            </li>
          }
        </ol>
      }
    </div>
  `,
  styles: [`
    .course-map__eyebrow { margin-bottom: 14px; }

    .course-map__lede {
      max-width: 60ch;
      margin-top: -18px;
      margin-bottom: 42px;
    }

    .course-map__loading {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      justify-content: center;
      padding: var(--space-12);
      color: var(--sand);
      font-family: var(--font-stencil);
      text-transform: uppercase;
      letter-spacing: 0.1em;
      font-size: 13px;
    }

    .course-map__error {
      padding: var(--space-4) var(--space-5);
      background: var(--blood-soft);
      border: 1px solid var(--blood);
      border-radius: var(--radius);
      color: var(--bone);
    }

    .loading-spinner {
      width: 20px;
      height: 20px;
      border: 2px solid var(--line-strong);
      border-top-color: var(--accent);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .module-list {
      display: grid;
      gap: 14px;
      list-style: none;
      padding: 0;
      margin: 0;
    }
  `],
})
export class CourseMapComponent implements OnInit {
  readonly store = inject(CourseStore);

  ngOnInit(): void {
    this.store.loadModules();
  }
}
