import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { describe, it, expect, beforeEach } from 'vitest';
import HistoriaComponent from './historia.component';
import { HISTORY } from 'content';

describe('HistoriaComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoriaComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  it('renders without errors', () => {
    const fixture = TestBed.createComponent(HistoriaComponent);
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('renders a page title heading', () => {
    const fixture = TestBed.createComponent(HistoriaComponent);
    fixture.detectChanges();
    const h1 = fixture.nativeElement.querySelector('.historia__title');
    expect(h1).not.toBeNull();
    expect(h1.textContent.trim()).toBeTruthy();
  });

  it('renders section TOC with 6 navigation buttons', () => {
    const fixture = TestBed.createComponent(HistoriaComponent);
    fixture.detectChanges();
    const tocButtons = fixture.nativeElement.querySelectorAll('.historia__toc-link');
    expect(tocButtons.length).toBe(HISTORY.length);
  });

  it('TOC buttons are <button> elements (not anchors)', () => {
    const fixture = TestBed.createComponent(HistoriaComponent);
    fixture.detectChanges();
    const tocLinks = fixture.nativeElement.querySelectorAll('.historia__toc-link');
    for (const el of Array.from(tocLinks)) {
      expect((el as HTMLElement).tagName).toBe('BUTTON');
    }
  });

  it('renders 6 sections matching HISTORY', () => {
    const fixture = TestBed.createComponent(HistoriaComponent);
    fixture.detectChanges();
    const sections = fixture.nativeElement.querySelectorAll('.historia__section');
    expect(sections.length).toBe(HISTORY.length);
  });

  it('section ids follow the historia-{id} pattern', () => {
    const fixture = TestBed.createComponent(HistoriaComponent);
    fixture.detectChanges();
    const sections = fixture.nativeElement.querySelectorAll('.historia__section');
    for (const section of Array.from(sections)) {
      const id = (section as Element).getAttribute('id');
      expect(id).toMatch(/^historia-/);
    }
  });

  it('renders image blocks as <figure> elements with <img> and <figcaption>', () => {
    const fixture = TestBed.createComponent(HistoriaComponent);
    fixture.detectChanges();
    const figures = fixture.nativeElement.querySelectorAll('.historia__figure');
    expect(figures.length).toBeGreaterThan(0);
    for (const fig of Array.from(figures)) {
      expect((fig as Element).querySelector('img')).not.toBeNull();
      expect((fig as Element).querySelector('figcaption')).not.toBeNull();
    }
  });

  it('all images use loading="eager" attribute', () => {
    const fixture = TestBed.createComponent(HistoriaComponent);
    fixture.detectChanges();
    const imgs = fixture.nativeElement.querySelectorAll('.historia__figure img');
    expect(imgs.length).toBeGreaterThan(0);
    for (const img of Array.from(imgs)) {
      expect((img as Element).getAttribute('loading')).toBe('eager');
    }
  });

  it('renders pull-quote blocks as <blockquote> elements', () => {
    const fixture = TestBed.createComponent(HistoriaComponent);
    fixture.detectChanges();
    const quotes = fixture.nativeElement.querySelectorAll('.historia__pull-quote');
    expect(quotes.length).toBeGreaterThan(0);
    for (const q of Array.from(quotes)) {
      expect((q as HTMLElement).tagName).toBe('BLOCKQUOTE');
    }
  });

  it('TOC nav has aria-label for accessibility', () => {
    const fixture = TestBed.createComponent(HistoriaComponent);
    fixture.detectChanges();
    const nav = fixture.nativeElement.querySelector('.historia__toc');
    expect(nav?.getAttribute('aria-label')).toBeTruthy();
  });

  it('exposes HISTORY sections as component data', () => {
    const fixture = TestBed.createComponent(HistoriaComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance.sections).toBe(HISTORY);
  });
});
