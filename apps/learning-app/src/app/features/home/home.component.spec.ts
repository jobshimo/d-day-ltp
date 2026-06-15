import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import HomeComponent from './home.component';

describe('HomeComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent, RouterTestingModule],
    }).compileComponents();
  });

  it('renders without errors', () => {
    const fixture = TestBed.createComponent(HomeComponent);
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('renders hero section with title', () => {
    const fixture = TestBed.createComponent(HomeComponent);
    fixture.detectChanges();
    const h1 = fixture.nativeElement.querySelector('.hero__title');
    expect(h1).not.toBeNull();
    expect(h1.textContent).toContain('Omaha Beach');
  });

  it('renders hero cover image with alt text', () => {
    const fixture = TestBed.createComponent(HomeComponent);
    fixture.detectChanges();
    const img = fixture.nativeElement.querySelector('.hero__photo img');
    expect(img).not.toBeNull();
    expect(img.getAttribute('alt')).toBeTruthy();
  });

  it('renders 4 hub cards', () => {
    const fixture = TestBed.createComponent(HomeComponent);
    fixture.detectChanges();
    const cards = fixture.nativeElement.querySelectorAll('.hub__card');
    expect(cards.length).toBe(4);
  });

  it('hub card for Curso links to /modules', () => {
    const fixture = TestBed.createComponent(HomeComponent);
    fixture.detectChanges();
    const links = Array.from(fixture.nativeElement.querySelectorAll('.hub__card')) as HTMLAnchorElement[];
    const cursoCard = links.find((el) => el.textContent?.includes('Curso'));
    expect(cursoCard).toBeDefined();
    expect(cursoCard?.getAttribute('href')).toBe('/modules');
  });

  it('hub card for Historia links to /historia', () => {
    const fixture = TestBed.createComponent(HomeComponent);
    fixture.detectChanges();
    const links = Array.from(fixture.nativeElement.querySelectorAll('.hub__card')) as HTMLAnchorElement[];
    const historiaCard = links.find((el) => el.textContent?.includes('Historia'));
    expect(historiaCard).toBeDefined();
    expect(historiaCard?.getAttribute('href')).toBe('/historia');
  });

  it('hub card for Simbología links to /simbologia', () => {
    const fixture = TestBed.createComponent(HomeComponent);
    fixture.detectChanges();
    const links = Array.from(fixture.nativeElement.querySelectorAll('.hub__card')) as HTMLAnchorElement[];
    const simbCard = links.find((el) => el.textContent?.includes('Simbolog'));
    expect(simbCard).toBeDefined();
    expect(simbCard?.getAttribute('href')).toBe('/simbologia');
  });

  it('hub card for Preparación links to /preparacion', () => {
    const fixture = TestBed.createComponent(HomeComponent);
    fixture.detectChanges();
    const links = Array.from(fixture.nativeElement.querySelectorAll('.hub__card')) as HTMLAnchorElement[];
    const prepCard = links.find((el) => el.textContent?.includes('Preparaci'));
    expect(prepCard).toBeDefined();
    expect(prepCard?.getAttribute('href')).toBe('/preparacion');
  });

  it('hub nav has accessible aria-label', () => {
    const fixture = TestBed.createComponent(HomeComponent);
    fixture.detectChanges();
    const nav = fixture.nativeElement.querySelector('.hub');
    expect(nav?.getAttribute('aria-label')).toBeTruthy();
  });

  it('hero has a primary CTA to start the course', () => {
    const fixture = TestBed.createComponent(HomeComponent);
    fixture.detectChanges();
    const cta = fixture.nativeElement.querySelector('.hero__actions a.btn--primary') as HTMLAnchorElement;
    expect(cta).not.toBeNull();
    expect(cta.getAttribute('href')).toBe('/modules/module-1');
  });
});
