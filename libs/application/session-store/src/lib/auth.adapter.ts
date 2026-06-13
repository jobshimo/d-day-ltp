import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import type { AuthPort, AuthResult, AuthUser } from './auth.port';

/** HTTP response shapes from the backend */
interface RegisterResponse {
  token: string;
  user: { id: string; email: string; createdAt: string };
}

interface LoginResponse {
  token: string;
  user: { id: string; email: string; createdAt: string };
}

interface MeResponse {
  id: string;
  email: string;
  createdAt: string;
}

/**
 * AuthAdapter — HTTP implementation of AuthPort.
 *
 * Uses relative URLs so the same-origin Railway deployment works without
 * any proxy config changes. No sessionStorage access here — the store
 * owns session lifecycle.
 */
@Injectable()
export class AuthAdapter implements AuthPort {
  constructor(private readonly http: HttpClient) {}

  async register(email: string, password: string): Promise<AuthResult> {
    const res = await firstValueFrom(
      this.http.post<RegisterResponse>('/api/auth/register', { email, password }),
    );
    return { token: res.token, email: res.user.email };
  }

  async login(email: string, password: string): Promise<AuthResult> {
    const res = await firstValueFrom(
      this.http.post<LoginResponse>('/api/auth/login', { email, password }),
    );
    return { token: res.token, email: res.user.email };
  }

  async me(): Promise<AuthUser> {
    const res = await firstValueFrom(this.http.get<MeResponse>('/api/auth/me'));
    return { email: res.email };
  }
}
