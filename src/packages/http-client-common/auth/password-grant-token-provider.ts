import axios from 'axios';
import {TokenAuthProvider} from './token-auth-provider';

export class PasswordGrantTokenProvider implements TokenAuthProvider {
  private refreshToken: string | null = null;
  private accessToken: string | null = null;
  private clearTimeout: number | null = null;
  private refreshTimeout: number | null = null;

  constructor(private tokenUrl: string,
              private clientId: string,
              private username: string,
              private password: string) {
  }

  async getToken(): Promise<string | null> {
    if (this.accessToken) {
      return this.accessToken;
    }

    await this.fetch();

    return this.accessToken;
  }

  close() {
    if (this.clearTimeout) {
      clearTimeout(this.clearTimeout);
    }
    if (this.refreshTimeout) {
      clearTimeout(this.refreshTimeout);
    }
  }

  private encodeForm(data: any) {
    return Object.keys(data)
      .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
      .join('&');
  }

  private async fetch() {
    await this.sendRequest({
      'grant_type': 'password',
      'client_id': this.clientId,
      'username': this.username,
      'password': this.password,
      'scope': 'openid profile email',
    });
  }

  private async refresh() {
    await this.sendRequest({
      grant_type: 'refresh_token',
      client_id: this.clientId,
      refresh_token: this.refreshToken,
    });
  }

  private async sendRequest(formData: any) {
    const res = await axios.post(this.tokenUrl, this.encodeForm(formData), {});
    this.accessToken = res.data.access_token;
    this.refreshToken = res.data.refresh_token;
    this.setTimeouts(res.data.expires_in, res.data.refresh_expires_in);
  }

  private setTimeouts(accessTokenExpiresIn: number, refreshTokenExpiresIn: number) {
    this.close();

    const expiresIn = Math.min(accessTokenExpiresIn, refreshTokenExpiresIn);
    const refreshIn = Math.max(10, expiresIn * 0.1);
    const resetIn = accessTokenExpiresIn - 5 < 0 ? accessTokenExpiresIn : accessTokenExpiresIn - 5;

    this.clearTimeout = setTimeout(() => {
      this.accessToken = null;
      this.refreshToken = null;
      this.clearTimeout = null;
      this.refreshTimeout = null;
    }, resetIn) as any;
    this.refreshTimeout = setTimeout(() => {
      this.refresh();
    }, refreshIn) as any;
  }
}
