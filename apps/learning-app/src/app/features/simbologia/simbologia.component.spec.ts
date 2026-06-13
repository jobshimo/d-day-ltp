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
});
