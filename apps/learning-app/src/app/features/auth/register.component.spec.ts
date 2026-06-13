import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RegisterComponent } from './register.component';
import { SessionStore } from 'application-session-store';
import { AUTH_PORT } from 'application-session-store';
import type { AuthPort } from 'application-session-store';

function makeAuthPort(): AuthPort {
  return {
    register: vi.fn().mockResolvedValue({ token: 'tok', email: 'new@example.com' }),
    login: vi.fn(),
    me: vi.fn(),
  };
}

function makeFakeStorage(): Storage {
  let store: Record<string, string> = {};
  return {
    get length() { return Object.keys(store).length; },
    key: (i: number) => Object.keys(store)[i] ?? null,
    getItem: (k: string) => store[k] ?? null,
    setItem: (k: string, v: string) => { store[k] = v; },
    removeItem: (k: string) => { delete store[k]; },
    clear: () => { store = {}; },
  } as Storage;
}

describe('RegisterComponent', () => {
  let fixture: ComponentFixture<RegisterComponent>;
  let component: RegisterComponent;
  let el: HTMLElement;
  let originalSessionStorage: Storage;
  let originalLocation: Location;

  beforeEach(async () => {
    originalSessionStorage = window.sessionStorage;
    Object.defineProperty(window, 'sessionStorage', {
      value: makeFakeStorage(),
      writable: true,
      configurable: true,
    });

    originalLocation = window.location;
    Object.defineProperty(window, 'location', {
      value: { href: '/' },
      writable: true,
      configurable: true,
    });

    await TestBed.configureTestingModule({
      imports: [RegisterComponent],
      providers: [
        provideRouter([{ path: 'login', component: RegisterComponent }]),
        SessionStore,
        { provide: AUTH_PORT, useValue: makeAuthPort() },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    el = fixture.nativeElement;
    fixture.detectChanges();
  });

  afterEach(() => {
    Object.defineProperty(window, 'sessionStorage', {
      value: originalSessionStorage,
      writable: true,
      configurable: true,
    });
    Object.defineProperty(window, 'location', {
      value: originalLocation,
      writable: true,
      configurable: true,
    });
    TestBed.resetTestingModule();
  });

  it('renders the form title in Spanish', () => {
    expect(el.textContent).toContain('Crear cuenta');
  });

  it('renders the mandatory password recovery warning', () => {
    // REG-07 / DM-04 — warning must be present and non-dismissable
    const warning = el.querySelector('.auth-warning');
    expect(warning).not.toBeNull();
    expect(warning?.textContent).toContain('No existe recuperación de contraseña');
  });

  it('password recovery warning is not dismissable (no close button)', () => {
    const warning = el.querySelector('.auth-warning');
    // No button or close control inside the warning
    expect(warning?.querySelector('button')).toBeNull();
  });

  it('renders email field with Spanish label', () => {
    expect(el.textContent).toContain('Correo electrónico');
    expect(el.querySelector('#register-email')).not.toBeNull();
  });

  it('renders password field with Spanish label', () => {
    expect(el.textContent).toContain('Contraseña');
    expect(el.querySelector('#register-password')).not.toBeNull();
  });

  it('shows email error message when email is invalid on submit', async () => {
    component.email = 'bad-email';
    component.password = 'validpassword';
    await component.submit();
    fixture.detectChanges();

    expect(el.querySelector('#register-email-error')).not.toBeNull();
  });

  it('shows password error when password is shorter than 8 characters', async () => {
    component.email = 'user@example.com';
    component.password = 'short';
    await component.submit();
    fixture.detectChanges();

    expect(el.querySelector('#register-password-error')).not.toBeNull();
  });

  it('shows 409 conflict error as friendly Spanish message', async () => {
    const store = TestBed.inject(SessionStore);
    vi.spyOn(store, 'register').mockRejectedValueOnce({ status: 409 });

    component.email = 'existing@example.com';
    component.password = 'validpassword';
    await component.submit();
    fixture.detectChanges();

    expect(el.textContent).toContain('ya está registrado');
  });

  it('calls SessionStore.register with correct credentials on valid submit', async () => {
    const store = TestBed.inject(SessionStore);
    const registerSpy = vi.spyOn(store, 'register').mockResolvedValue();

    component.email = 'new@example.com';
    component.password = 'validpassword';
    await component.submit();

    expect(registerSpy).toHaveBeenCalledWith('new@example.com', 'validpassword');
  });
});
