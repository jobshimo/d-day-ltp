import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { describe, it, expect, beforeEach } from 'vitest';
import { SimbologiaComponent } from './simbologia.component';
import { SYMBOLOGY } from 'content';

// ---------------------------------------------------------------------------
// Tests
// Use NO_ERRORS_SCHEMA to skip real rendering of counter SVG components
// in JSDOM and focus on the layout and data-binding assertions.
// ---------------------------------------------------------------------------

describe('SimbologiaComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimbologiaComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  it('renders without errors', () => {
    const fixture = TestBed.createComponent(SimbologiaComponent);
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('exposes all 8 SYMBOLOGY categories as component data', () => {
    const fixture = TestBed.createComponent(SimbologiaComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance.categories).toHaveLength(8);
    expect(fixture.componentInstance.categories).toBe(SYMBOLOGY);
  });

  it('renders all 8 category sections', () => {
    const fixture = TestBed.createComponent(SimbologiaComponent);
    fixture.detectChanges();
    const sections = fixture.nativeElement.querySelectorAll('.simbologia__category');
    expect(sections.length).toBe(8);
  });

  it('renders category headings with the correct titleEs', () => {
    const fixture = TestBed.createComponent(SimbologiaComponent);
    fixture.detectChanges();
    const headings = fixture.nativeElement.querySelectorAll('.simbologia__category-title');
    const texts = Array.from(headings).map((h: any) => h.textContent.trim());
    expect(texts).toContain('Unidades de EE.UU.');
    expect(texts).toContain('Símbolo de objetivo');
    expect(texts).toContain('Códigos de armas (EE.UU.)');
  });

  it('renders entry cards for all entries across all categories', () => {
    const fixture = TestBed.createComponent(SimbologiaComponent);
    fixture.detectChanges();
    const entries = fixture.nativeElement.querySelectorAll('.simbologia__entry');
    const totalEntries = SYMBOLOGY.reduce((sum, cat) => sum + cat.entries.length, 0);
    expect(entries.length).toBe(totalEntries);
  });

  it('renders color swatches for terrain, position, and division entries', () => {
    const fixture = TestBed.createComponent(SimbologiaComponent);
    fixture.detectChanges();
    const swatches = fixture.nativeElement.querySelectorAll('.simbologia__swatch');
    // terrain (9) + german-positions (6) + us-divisions (2) = 17
    expect(swatches.length).toBe(17);
  });

  it('renders text chips for weapon code entries (9 weapon codes)', () => {
    const fixture = TestBed.createComponent(SimbologiaComponent);
    fixture.detectChanges();
    const chips = fixture.nativeElement.querySelectorAll('.simbologia__chip');
    expect(chips.length).toBe(9);
    const chipTexts = Array.from(chips).map((c: any) => c.textContent.trim());
    expect(chipTexts).toContain('NV');
    expect(chipTexts).toContain('BZ');
  });

  it('nav has aria-label for accessibility', () => {
    const fixture = TestBed.createComponent(SimbologiaComponent);
    fixture.detectChanges();
    const nav = fixture.nativeElement.querySelector('.simbologia__toc');
    expect(nav?.getAttribute('aria-label')).toBeTruthy();
  });

  it('category section ids follow the cat-{id} pattern', () => {
    const fixture = TestBed.createComponent(SimbologiaComponent);
    fixture.detectChanges();
    const sections = fixture.nativeElement.querySelectorAll('.simbologia__category');
    for (const section of Array.from(sections)) {
      const id = (section as Element).getAttribute('id');
      expect(id).toMatch(/^cat-/);
    }
  });

  it('unitSymbolBg returns dark ochre for German entries and dark board for US entries', () => {
    const comp = TestBed.createComponent(SimbologiaComponent).componentInstance;
    const usRender = { kind: 'unit-symbol' as const, type: 'infantry' as any };
    const deRender = { kind: 'unit-symbol' as const, type: 'infantry' as any, germanSymbol: 'infantry' as any };
    expect(comp.unitSymbolBg(usRender)).toBe('#2a2c30');
    expect(comp.unitSymbolBg(deRender)).toBe('#3d2e1a');
  });

  // ---- Symbol SVG wrapper size regression (Bug: empty boxes / tiny icons) ----

  it('unit-symbol entries render an <svg> wrapper with width >= 64', () => {
    const fixture = TestBed.createComponent(SimbologiaComponent);
    fixture.detectChanges();
    // Find all svg elements inside unit-symbol cases (they have a background rect + ddob-unit-symbol)
    const svgs: SVGElement[] = Array.from(
      fixture.nativeElement.querySelectorAll('.simbologia__symbol svg')
    );
    // Filter to those that wrap unit-symbol (they have role=img and a ddob-unit-symbol inside)
    const unitSymbolSvgs = svgs.filter((svg) =>
      svg.querySelector('ddob-unit-symbol') !== null
    );
    expect(unitSymbolSvgs.length).toBeGreaterThan(0);
    for (const svg of unitSymbolSvgs) {
      const w = Number(svg.getAttribute('width'));
      expect(w).toBeGreaterThanOrEqual(64);
    }
  });

  it('target-symbol entries render an <svg> wrapper with width >= 64', () => {
    const fixture = TestBed.createComponent(SimbologiaComponent);
    fixture.detectChanges();
    const svgs: SVGElement[] = Array.from(
      fixture.nativeElement.querySelectorAll('.simbologia__symbol svg')
    );
    const targetSymbolSvgs = svgs.filter((svg) =>
      svg.querySelector('ddob-target-symbol') !== null
    );
    expect(targetSymbolSvgs.length).toBeGreaterThan(0);
    for (const svg of targetSymbolSvgs) {
      const w = Number(svg.getAttribute('width'));
      expect(w).toBeGreaterThanOrEqual(64);
    }
  });

  it('fire-dots entries render an <svg> wrapper with width >= 64', () => {
    const fixture = TestBed.createComponent(SimbologiaComponent);
    fixture.detectChanges();
    const svgs: SVGElement[] = Array.from(
      fixture.nativeElement.querySelectorAll('.simbologia__symbol svg')
    );
    const fireDotSvgs = svgs.filter((svg) =>
      svg.querySelector('ddob-fire-dots') !== null
    );
    expect(fireDotSvgs.length).toBeGreaterThan(0);
    for (const svg of fireDotSvgs) {
      const w = Number(svg.getAttribute('width'));
      expect(w).toBeGreaterThanOrEqual(64);
    }
  });

  it('unit-symbol SVG wrappers use a square viewBox (0 0 60 60)', () => {
    const fixture = TestBed.createComponent(SimbologiaComponent);
    fixture.detectChanges();
    const svgs: SVGElement[] = Array.from(
      fixture.nativeElement.querySelectorAll('.simbologia__symbol svg')
    );
    const unitSymbolSvgs = svgs.filter((svg) =>
      svg.querySelector('ddob-unit-symbol') !== null
    );
    for (const svg of unitSymbolSvgs) {
      expect(svg.getAttribute('viewBox')).toBe('0 0 60 60');
    }
  });
});
