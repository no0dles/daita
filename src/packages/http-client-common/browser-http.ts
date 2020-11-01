import { encodeFormData, getQueryString, Http, HttpRequestOptions, HttpSendResult } from './http';
import { AuthProvider, TokenIssuer } from './auth-provider';
import { getTokenIssuer } from './shared-http';

export class BrowserHttp implements Http {
  private readonly tokenProvider: TokenIssuer;

  constructor(protected baseUrl: string, authProvider: AuthProvider | null | undefined) {
    this.tokenProvider = getTokenIssuer(authProvider, this);
  }

  formData(options: HttpRequestOptions): Promise<HttpSendResult> {
    return this.sendRequest({
      authorized: options.authorized,
      data: encodeFormData(options.data),
      headers: {
        ...(options.headers || {}),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      path: options.path,
      query: options.query,
    });
  }

  json<T>(options: HttpRequestOptions): Promise<HttpSendResult> {
    return this.sendRequest({
      path: options.path,
      headers: {
        ...(options.headers || {}),
        'Content-Type': 'application/json',
      },
      data: JSON.stringify(options.data),
      query: options.query,
      authorized: options.authorized,
    });
  }

  private async sendRequest(options: HttpRequestOptions) {
    const qs = getQueryString(options.query);
    const url = `${this.baseUrl}/${options.path}${qs.length > 0 ? '?' + qs : ''}`;
    const httpHeader = new Headers(options.headers);
    if (options.authorized) {
      const token = await this.tokenProvider.getToken();
      if (token) {
        httpHeader.set('Authorization', token);
      }
    }
    try {
      const result = await fetch(url, { method: 'POST', body: options.data, headers: httpHeader });
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
