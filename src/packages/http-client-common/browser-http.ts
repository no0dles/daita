import { encodeFormData, getQueryString, Http, HttpSendResult } from './http';
import { AuthProvider, isTokenAuthProvider } from './auth';
import { failNever } from '../common/utils';

export class BrowserHttp implements Http {
  constructor(protected baseUrl: string, protected authProvider: AuthProvider | null | undefined) {}

  async sendFormData(path: string, data: any): Promise<HttpSendResult> {
    const url = `${this.baseUrl}/${path}`;
    const httpHeader = new Headers({
      'Content-Type': 'application/x-www-form-urlencoded',
    });
    const result = await fetch(url, { method: 'POST', body: encodeFormData(data), headers: httpHeader });
    const timeout = result.headers.get('x-transaction-timeout');
    return {
      data: await result.json(),
      headers: {
        'x-transaction-timeout': timeout ? parseInt(timeout, 0) : undefined,
      },
    };
  }

  async sendJson<T>(url: string, data?: any, query?: { [p: string]: string }): Promise<HttpSendResult> {
    try {
      const qs = getQueryString(query);
      const reqUrl = `${this.baseUrl}/${url}${qs.length > 0 ? '?' + qs : ''}`;

      const httpHeader = new Headers({
        'Content-Type': 'application/json',
      });
      if (this.authProvider) {
        const authProvider = this.authProvider;
        if (isTokenAuthProvider(authProvider)) {
          const token = await authProvider.getToken();
          if (token) {
            httpHeader.append('Authorization', `Bearer ${token}`);
          }
        } else {
          failNever(authProvider, 'unknown auth provider');
        }
      }
      const result = await fetch(reqUrl, { method: 'POST', body: JSON.stringify(data), headers: httpHeader });
      const timeout = result.headers.get('x-transaction-timeout');
      return {
        data: await result.json(),
        headers: {
          'x-transaction-timeout': timeout ? parseInt(timeout, 0) : undefined,
        },
      };
    } catch (e) {
      if (e.response && e.response.status === 500) {
        throw new Error(e.response.data.message);
      }
      throw e;
    }
  }
}
