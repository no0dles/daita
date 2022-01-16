import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { Defer, parseJwtPayload } from '@daita/common';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private identityToken: {
    sub: string;
    iss: string;
    email: string;
    emailVerified: boolean;
    exp: number;
    iat: number;
    roles: string[];
  } | null = null;
  private accessToken: { sub: string; iss: string; exp: number; iat: number; roles: string[] } | null = null;
  private refreshToken: string | null = null;
  private refreshDefer: Promise<boolean> | null = null;

  constructor(private http: HttpClient, private router: Router) {
    this.load();
  }

  get isAuthorized(): boolean {
    return !!this.identityToken;
  }

  async getAccessToken() {
    if (!this.hasAccessToken) {
      throw new Error('unauthorized');
    }

    const expired = this.isAccessTokenExpired();
    if (expired) {
      const success = await this.refresh();
      if (!success) {
        throw new Error('unauthorized');
      }
    }

    return localStorage.getItem('access_token');
  }

  get hasAccessToken() {
    return !!this.accessToken;
  }

  private isAccessTokenExpired() {
    if (!this.accessToken) {
      return true;
    }
    const now = new Date().getTime() / 1000;
    return this.accessToken.exp - now < 60;
  }

  private load() {
    const accessToken = localStorage.getItem('access_token');
    const idToken = localStorage.getItem('id_token');
    const refreshToken = localStorage.getItem('refresh_token');

    if (accessToken && idToken && refreshToken) {
      this.accessToken = parseJwtPayload(accessToken);
      this.identityToken = parseJwtPayload(idToken);
      this.refreshToken = refreshToken;

      const expired = this.isAccessTokenExpired();
      if (expired) {
        this.refresh();
      }
    }
  }

  private save(response: { access_token: string; id_token: string; refresh_token: string }) {
    this.accessToken = parseJwtPayload(response.access_token);
    this.identityToken = parseJwtPayload(response.id_token);
    this.refreshToken = response.refresh_token;

    localStorage.setItem('access_token', response.access_token);
    localStorage.setItem('id_token', response.id_token);
    localStorage.setItem('refresh_token', response.refresh_token);
  }

  private async refresh() {
    if (this.refreshDefer) {
      return this.refreshDefer;
    }

    try {
      this.refreshDefer = new Promise<boolean>((resolve, reject) => {
        resolve(
          (async () => {
            try {
              const response = await this.http
                .post<{ refresh_token: string; access_token: string }>(
                  `${environment.apiUrl}/${this.accessToken!.iss}/refresh`,
                  {
                    refreshToken: this.refreshToken,
                  },
                )
                .toPromise();
              localStorage.setItem('access_token', response.access_token);
              localStorage.setItem('refresh_token', response.refresh_token);
              this.accessToken = parseJwtPayload(response.access_token);

              return true;
            } catch (e) {
              if (e instanceof HttpErrorResponse && e.error && e.error.message === 'invalid token') {
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                localStorage.removeItem('id_token');
                this.accessToken = null;
                this.identityToken = null;
                this.refreshToken = null;
                await this.router.navigate(['/login']);
              }
              return false;
            }
          })(),
        );
      });
    } finally {
      this.refreshDefer = null;
    }
  }

  async login(options: { userPoolId: string; username: string; password: string }) {
    const response = await this.http
      .post<{
        refresh_token: string;
        access_token: string;
        id_token: string;
        expires_in: number;
        token_type: string;
      }>(`${environment.apiUrl}/${options.userPoolId}/login`, {
        username: options.username,
        password: options.password,
      })
      .toPromise();

    this.save(response);
  }

  async register(options: { userPoolId: string; username: string; password: string; email: string; phone?: string }) {
    await this.http
      .post(`${environment.apiUrl}/${options.userPoolId}/register`, {
        username: options.username,
        password: options.password,
        email: options.email,
        phone: options.phone,
      })
      .toPromise();
    await this.login({
      userPoolId: options.userPoolId,
      username: options.username,
      password: options.password,
    });
  }

  async resend() {
    if (!this.identityToken) {
      throw new Error(`requires authorization`);
    }
    await this.http.post(`${environment.apiUrl}/${this.identityToken.iss}/resend`, {}).toPromise();
  }
}
