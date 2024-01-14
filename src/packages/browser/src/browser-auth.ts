import { Http, LoginOptions, TokenIssuer, User } from '@daita/http-interface';
import { createLogger, JwtPayload, parseJwtPayload } from '@daita/common';

const logger = createLogger({ package: 'http' });

export class BrowserAuth implements TokenIssuer {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private idPayload: (User & JwtPayload) | null = null;
  private accessPayload: JwtPayload | null = null;

  constructor(private http: Http, private storage: Storage) {
    this.load();
  }

  get user() {
    return this.idPayload;
  }

  private load() {
    try {
      const accessToken = this.storage.getItem('access_token');
      const idToken = this.storage.getItem('id_token');
      const refreshToken = this.storage.getItem('refresh_token');
      if (accessToken && idToken && refreshToken) {
        this.accessPayload = parseJwtPayload(accessToken);
        this.idPayload = parseJwtPayload(idToken);
        this.refreshToken = refreshToken;
        this.accessToken = accessToken;
      }
    } catch (e: any) {
      logger.error(e.message);
      this.logout();
    }
  }

  async login(options: LoginOptions): Promise<User> {
    const response = await this.http.json<{
      refresh_token: string;
      access_token: string;
      id_token: string;
      expires_in: number;
      token_type: string;
    }>({
      path: `${options.userPoolId}/login`,
      data: { username: options.username, password: options.password },
      authorized: false,
    });

    this.storage.setItem('id_token', response.data.id_token);
    this.updateToken(response.data.access_token, response.data.refresh_token);
    const user = parseJwtPayload<User>(response.data.id_token);
    this.idPayload = user;
    return user;
  }

  private updateToken(accessToken: string, refreshToken: string) {
    this.storage.setItem('access_token', accessToken);
    this.storage.setItem('refresh_token', refreshToken);
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.accessPayload = parseJwtPayload(accessToken);
  }

  logout() {
    this.storage.removeItem('access_token');
    this.storage.removeItem('id_token');
    this.storage.removeItem('refresh_token');
    this.accessToken = null;
    this.accessPayload = null;
    this.refreshToken = null;
    this.idPayload = null;
  }

  private async refresh(issuer: string) {
    const response = await this.http.json<{ refresh_token: string; access_token: string }>({
      path: `/${issuer}/refresh`,
      data: {
        refreshToken: this.refreshToken,
      },
    });

    if (response.statusCode === 400) {
      this.logout();
    } else if (response.statusCode === 200) {
      this.storage.setItem('access_token', response.data.access_token);
      this.storage.setItem('refresh_token', response.data.refresh_token);
      this.updateToken(response.data.access_token, response.data.refresh_token);
    } else {
      logger.error(`unable to refresh, status code ${response.statusCode}`, response);
    }
  }

  async getToken(): Promise<string | null> {
    if (this.idPayload && this.accessPayload) {
      const duration = (this.accessPayload.exp - this.accessPayload.iat) * 0.1;
      const expireAt = Math.floor(new Date().getTime() / 1000) - duration;
      if (this.accessPayload.exp < expireAt) {
        await this.refresh(this.accessPayload.iss);
      }
    }

    if (this.accessToken) {
      return `Bearer ${this.accessToken}`;
    }
    return null;
  }
}
