import {
  Component,
  OnInit,
  inject,
  ChangeDetectionStrategy,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { CourseStore } from 'application-course-store';
import { ModuleCardComponent } from './module-card.component';

@Component({
  standalone: true,
  selector: 'app-course-map',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, ModuleCardComponent],
  providers: [CourseStore],
  template: `
    <div class="course-map">
      <header class="course-map__header">
        <h1 class="course-map__title">D-Day en Omaha Beach</h1>
        <p class="course-map__subtitle">Aprende las reglas del juego</p>
      </header>

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
        <ol class="module-grid" aria-label="Lista de módulos del curso">
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
    .course-map {
      max-width: var(--max-content-width);
      margin: 0 auto;
      padding: var(--space-8) var(--space-4);
    }

    .course-map__header {
      text-align: center;
      margin-bottom: var(--space-10);
    }

    .course-map__title {
      font-size: var(--font-size-3xl);
      font-weight: var(--font-weight-bold);
      color: var(--color-text-primary);
      letter-spacing: -0.02em;
      margin-bottom: var(--space-2);
    }

    .course-map__subtitle {
      font-size: var(--font-size-lg);
      color: var(--color-text-secondary);
    }

    .course-map__loading {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      justify-content: center;
      padding: var(--space-12);
      color: var(--color-text-secondary);
    }

    .course-map__error {
      padding: var(--space-4);
      background: var(--color-error-bg);
      border: 1px solid var(--color-error);
      border-radius: var(--radius-md);
      color: var(--color-error);
    }

    .loading-spinner {
      width: 20px;
      height: 20px;
      border: 2px solid var(--color-border);
      border-top-color: var(--color-accent);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .module-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: var(--space-4);
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
