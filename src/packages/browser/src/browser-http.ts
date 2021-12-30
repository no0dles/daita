import {
  AuthProvider,
  encodeFormData,
  getQueryString,
  getTokenIssuer,
  getUri,
  Http,
  HttpRequestGetOptions,
  HttpRequestPostOptions,
  HttpSendResult,
  TokenIssuer,
} from '@daita/http-interface';
import { parseJson } from '@daita/common';

export class BrowserHttp implements Http {
  private readonly tokenProvider: TokenIssuer;

  constructor(protected baseUrl: string, authProvider: AuthProvider | null | undefined) {
    this.tokenProvider = getTokenIssuer(authProvider);
  }

  get<T>(options: HttpRequestGetOptions): Promise<HttpSendResult<T>> {
    return this.sendRequest('GET', options);
  }

  formData(options: HttpRequestPostOptions): Promise<HttpSendResult> {
    return this.sendRequest('POST', {
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

  json<T>(options: HttpRequestPostOptions): Promise<HttpSendResult> {
    return this.sendRequest('POST', {
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

  private async sendRequest(method: 'POST', options: HttpRequestPostOptions): Promise<HttpSendResult>;
  private async sendRequest(method: 'GET', options: HttpRequestPostOptions): Promise<HttpSendResult>;
  private async sendRequest(method: 'POST' | 'GET', options: HttpRequestPostOptions): Promise<HttpSendResult> {
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
      const result = await fetch(url, { method: method, body: options.data, headers: httpHeader });
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
