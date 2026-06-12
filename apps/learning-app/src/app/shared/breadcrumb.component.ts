import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

export interface BreadcrumbItem {
  label: string;
  route?: string[];
}

@Component({
  standalone: true,
  selector: 'app-breadcrumb',
  imports: [RouterLink],
  template: `
    <nav class="breadcrumb" aria-label="Navegación estructural">
      <ol class="breadcrumb__list">
        @for (item of items(); track item.label; let last = $last) {
          <li class="breadcrumb__item" [class.breadcrumb__item--current]="last">
            @if (item.route && !last) {
              <a [routerLink]="item.route" class="breadcrumb__link">{{ item.label }}</a>
            } @else {
              <span [attr.aria-current]="last ? 'page' : null">{{ item.label }}</span>
            }
            @if (!last) {
              <span class="breadcrumb__sep" aria-hidden="true">›</span>
            }
          </li>
        }
      </ol>
    </nav>
  `,
  styles: [`
    .breadcrumb {
      padding: var(--space-3) 0;
    }

    .breadcrumb__list {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: var(--space-1);
      list-style: none;
      margin: 0;
      padding: 0;
      font-size: var(--font-size-sm);
    }

    .breadcrumb__item {
      display: flex;
      align-items: center;
      gap: var(--space-1);
      color: var(--color-text-secondary);
    }

    .breadcrumb__item--current {
      color: var(--color-text-primary);
      font-weight: var(--font-weight-medium);
    }

    .breadcrumb__link {
      color: var(--color-accent);
      text-decoration: none;
      transition: color var(--transition-fast);
    }

    .breadcrumb__link:hover {
      color: #d4b060;
      text-decoration: underline;
    }

    .breadcrumb__sep {
      color: var(--color-border);
      font-size: var(--font-size-xs);
    }
  `],
})
export class BreadcrumbComponent {
  readonly items = input.required<BreadcrumbItem[]>();
}
