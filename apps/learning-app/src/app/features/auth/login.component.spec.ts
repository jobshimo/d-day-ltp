import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { LoginComponent } from './login.component';
import { SessionStore } from 'application-session-store';
import { AUTH_PORT } from 'application-session-store';
import type { AuthPort } from 'application-session-store';

function makeAuthPort(): AuthPort {
  return {
    register: vi.fn(),
    login: vi.fn().mockResolvedValue({ token: 'tok', email: 'user@example.com' }),
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

describe('LoginComponent', () => {
  let fixture: ComponentFixture<LoginComponent>;
  let component: LoginComponent;
  let el: HTMLElement;
  let originalSessionStorage: Storage;
  let originalLocation: Location;

  beforeEach(async () => {
    // Isolate sessionStorage
    originalSessionStorage = window.sessionStorage;
    Object.defineProperty(window, 'sessionStorage', {
      value: makeFakeStorage(),
      writable: true,
      configurable: true,
    });

    // Prevent actual navigation
    originalLocation = window.location;
    Object.defineProperty(window, 'location', {
      value: { href: '/' },
      writable: true,
      configurable: true,
    });

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        provideRouter([{ path: 'register', component: LoginComponent }]),
        SessionStore,
        { provide: AUTH_PORT, useValue: makeAuthPort() },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
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
    expect(el.textContent).toContain('Iniciar sesión');
  });

  it('renders the email field with Spanish label', () => {
    expect(el.textContent).toContain('Correo electrónico');
    expect(el.querySelector('#login-email')).not.toBeNull();
  });

  it('renders the password field with Spanish label', () => {
    expect(el.textContent).toContain('Contraseña');
    expect(el.querySelector('#login-password')).not.toBeNull();
  });

  it('renders a link to the register page', () => {
    expect(el.textContent).toContain('Crear cuenta');
  });

  it('shows email error message when email is invalid and form is submitted', async () => {
    component.email = 'not-an-email';
    component.password = 'validpassword';
    await component.submit();
    fixture.detectChanges();

    expect(el.querySelector('#login-email-error')).not.toBeNull();
  });

  it('shows password error when password is less than 8 characters', async () => {
    component.email = 'user@example.com';
    component.password = 'short';
    await component.submit();
    fixture.detectChanges();

    expect(el.querySelector('#login-password-error')).not.toBeNull();
  });

  it('shows server error on failed login', async () => {
    const store = TestBed.inject(SessionStore);
    vi.spyOn(store, 'login').mockRejectedValueOnce(new Error('401 Unauthorized'));

    component.email = 'user@example.com';
    component.password = 'validpassword';
    await component.submit();
    fixture.detectChanges();

    expect(el.textContent).toContain('Correo electrónico o contraseña incorrectos.');
  });

  it('calls SessionStore.login with correct credentials on valid submit', async () => {
    const store = TestBed.inject(SessionStore);
    const loginSpy = vi.spyOn(store, 'login').mockResolvedValue();

    component.email = 'user@example.com';
    component.password = 'validpassword';
    await component.submit();

    expect(loginSpy).toHaveBeenCalledWith('user@example.com', 'validpassword');
  });
});
