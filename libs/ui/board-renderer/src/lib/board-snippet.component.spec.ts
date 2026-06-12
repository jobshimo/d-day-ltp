import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { BoardSnippetComponent } from './board-snippet.component';
import type { BoardSnippet } from 'content-schema';

const MINIMAL_SNIPPET: BoardSnippet = {
  hexes: [
    {
      hexId: 'hex-1',
      terrain: 'beach',
      sector: 'east',
      isBeachBox: false,
      isGermanPosition: false,
      isVPPosition: false,
      fireDots: [],
    },
    {
      hexId: 'hex-2',
      terrain: 'bluff',
      sector: 'east',
      isBeachBox: false,
      isGermanPosition: true,
      germanPositionColor: 'red',
      isVPPosition: false,
      fireDots: [{ positionId: 'hex-2', intensity: 'intense' }],
    },
    {
      hexId: 'hex-3',
      terrain: 'slope',
      sector: 'west',
      isBeachBox: false,
      isGermanPosition: false,
      isVPPosition: false,
      fireDots: [{ positionId: 'hex-2', intensity: 'steady' }],
    },
  ],
  units: [
    {
      kind: 'us',
      id: 'unit-1',
      type: 'infantry',
      steps: 3,
      targetSymbol: 'triangle',
      weapons: ['BZ'],
      attackStrength: 3,
      isDisrupted: false,
      hexId: 'hex-1',
    },
  ],
};

const SNIPPET_WITH_HIGHLIGHTS: BoardSnippet = {
  ...MINIMAL_SNIPPET,
  highlights: [
    { hexId: 'hex-1', style: 'correct' },
    { hexId: 'hex-2', style: 'incorrect' },
  ],
};

/**
 * Host component for template-binding — avoids setInput() limitations in JIT mode.
 */
@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BoardSnippetComponent],
  template: `
    <ddob-board-snippet
      [snippet]="snippet()"
      [interactive]="interactive()"
      [selectedHexIds]="selectedHexIds()"
      (hexSelected)="onHexSelected($event)" />
  `,
})
class HostComponent {
  snippet = signal<BoardSnippet>(MINIMAL_SNIPPET);
  interactive = signal(false);
  selectedHexIds = signal<string[]>([]);
  lastSelectedHexId: string | null = null;

  onHexSelected(id: string): void {
    this.lastSelectedHexId = id;
  }
}

describe('BoardSnippetComponent', () => {
  let hostFixture: ComponentFixture<HostComponent>;
  let host: HostComponent;

  function getEl<T extends Element>(selector: string): T | null {
    return hostFixture.nativeElement.querySelector(selector) as T | null;
  }

  function getAllEls<T extends Element>(selector: string): T[] {
    return Array.from(hostFixture.nativeElement.querySelectorAll(selector)) as T[];
  }

  function getBoardComponent(): BoardSnippetComponent {
    return hostFixture.debugElement.children[0].componentInstance as BoardSnippetComponent;
  }

  function render(
    snippet: BoardSnippet = MINIMAL_SNIPPET,
    interactive = false,
    selectedHexIds: string[] = [],
  ): void {
    host.snippet.set(snippet);
    host.interactive.set(interactive);
    host.selectedHexIds.set(selectedHexIds);
    hostFixture.detectChanges();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    hostFixture = TestBed.createComponent(HostComponent);
    host = hostFixture.componentInstance;
    hostFixture.detectChanges();
  });

  // ---- Rendering ----

  it('renders an SVG element', () => {
    render();
    const svg = getEl<SVGElement>('svg');
    expect(svg).toBeTruthy();
  });

  it('renders one hex polygon per HexState', () => {
    render();
    const polygons = getAllEls('.hex-base');
    expect(polygons.length).toBe(MINIMAL_SNIPPET.hexes.length);
  });

  it('sets role="group" and aria-label on the SVG', () => {
    render();
    const svg = getEl<SVGElement>('svg');
    expect(svg?.getAttribute('role')).toBe('group');
    expect(svg?.getAttribute('aria-label')).toContain('hexágono');
  });

  it('renders fire-dot markers for hexes that have fire dots', () => {
    render();
    const markers = getAllEls('.fire-dot-marker');
    // hex-2 has 1 intense dot; hex-3 has 1 steady dot
    expect(markers.length).toBe(2);
  });

  it('renders a unit counter for the US unit in hex-1', () => {
    render();
    const counters = getAllEls('.unit-counter--us');
    expect(counters.length).toBe(1);
  });

  it('renders highlight overlays when highlights are provided', () => {
    render(SNIPPET_WITH_HIGHLIGHTS);
    const overlays = getAllEls('.hex-overlay');
    expect(overlays.length).toBe(2);
  });

  it('does NOT render hit zones when not interactive', () => {
    render(MINIMAL_SNIPPET, false);
    const hitZones = getAllEls('.hex-hit-zone');
    expect(hitZones.length).toBe(0);
  });

  // ---- Interactive behavior ----

  it('renders hit zones with role="button" when interactive', () => {
    render(MINIMAL_SNIPPET, true);
    const hitZones = getAllEls('.hex-hit-zone[role="button"]');
    expect(hitZones.length).toBe(MINIMAL_SNIPPET.hexes.length);
  });

  it('emits hexSelected when a hex hit zone is clicked', () => {
    render(MINIMAL_SNIPPET, true);
    const firstHitZone = getEl<SVGElement>('[data-hex-id="hex-1"] .hex-hit-zone');
    expect(firstHitZone).toBeTruthy();
    firstHitZone!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    hostFixture.detectChanges();
    expect(host.lastSelectedHexId).toBe('hex-1');
  });

  it('marks aria-pressed=true when hex is in selectedHexIds', () => {
    render(MINIMAL_SNIPPET, true, ['hex-1']);
    const firstHitZone = getEl<SVGElement>('[data-hex-id="hex-1"] .hex-hit-zone');
    expect(firstHitZone?.getAttribute('aria-pressed')).toBe('true');
  });

  // ---- ARIA labels ----

  it('sets aria-label on each interactive hex describing terrain and units', () => {
    render(MINIMAL_SNIPPET, true);
    const firstHitZone = getEl<SVGElement>('[data-hex-id="hex-1"] .hex-hit-zone');
    const label = firstHitZone?.getAttribute('aria-label') ?? '';
    expect(label).toContain('hex-1');
    expect(label).toContain('playa');
    expect(label).toContain('unidad');
  });

  // ---- SVG dimensions ----

  it('sets a non-zero viewBox on the SVG', () => {
    render();
    const svg = getEl<SVGElement>('svg');
    const vb = svg?.getAttribute('viewBox') ?? '';
    const [, , w, h] = vb.split(' ').map(Number);
    expect(w).toBeGreaterThan(0);
    expect(h).toBeGreaterThan(0);
  });

  // ---- Component signal state ----

  it('isHexSelected returns correct value from selectedHexIds', () => {
    render(MINIMAL_SNIPPET, false, ['hex-2']);
    const board = getBoardComponent();
    expect(board.isHexSelected('hex-2')).toBe(true);
    expect(board.isHexSelected('hex-1')).toBe(false);
  });

  it('hexCoords returns layout coords for each hex in the snippet', () => {
    render();
    const board = getBoardComponent();
    expect(board.hexCoords().length).toBe(MINIMAL_SNIPPET.hexes.length);
  });
});
