import { encodeFormData, getQueryString, getUri, Http, HttpRequestOptions, HttpSendResult } from './http';
import { AuthProvider, TokenIssuer } from './auth-provider';
import { getTokenIssuer } from './shared-http';
import { parseJson } from '@daita/common';

export class BrowserHttp implements Http {
  private readonly tokenProvider: TokenIssuer;

  constructor(protected baseUrl: string, authProvider: AuthProvider | null | undefined) {
    this.tokenProvider = getTokenIssuer(authProvider);
  }

  formData(options: HttpRequestOptions): Promise<HttpSendResult> {
    return this.sendRequest({
      method: options.method,
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
      method: options.method,
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
    const url = getUri(this.baseUrl, options.path, qs);
    const httpHeader = new Headers(options.headers);
    if (options.authorized) {
      const token = await this.tokenProvider.getToken();
      if (token) {
        httpHeader.set('Authorization', token);
      }
    }
    try {
      const result = await fetch(url, { method: options.method || 'POST', body: options.data, headers: httpHeader });
      const timeout = result.headers.get('x-transaction-timeout');
      let data = '';

      const contentType = result.headers.get('content-type');
      if (contentType && contentType.indexOf('application/json') !== -1) {
        data = parseJson(await result.text());
      } else {
        data = await result.text();
      }
      return {
        data,
        statusCode: result.status,
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
