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
      padding: 6px 0;
    }

    .breadcrumb__list {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 4px;
      list-style: none;
      margin: 0;
      padding: 0;
      font-family: 'Space Mono', monospace;
      font-size: 11px;
      letter-spacing: .04em;
      text-transform: uppercase;
    }

    .breadcrumb__item {
      display: flex;
      align-items: center;
      gap: 4px;
      color: var(--muted);
    }

    .breadcrumb__item--current {
      color: var(--muted);
    }

    .breadcrumb__link {
      color: var(--sand);
      text-decoration: none;
      transition: color 120ms ease;
    }

    .breadcrumb__link:hover {
      color: var(--accent);
    }

    .breadcrumb__sep {
      color: var(--faint);
      font-size: 11px;
      line-height: 1;
    }
  `],
})
export class BreadcrumbComponent {
  readonly items = input.required<BreadcrumbItem[]>();
}
