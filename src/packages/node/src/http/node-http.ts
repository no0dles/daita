import { request as httpsRequest, RequestOptions } from 'https';
import { request as httpRequest } from 'http';
import { parse } from 'url';
import { parseJson } from '@daita/common';
import {
  AuthProvider,
  encodeFormData,
  getQueryString,
  getTokenIssuer,
  getUri,
  Http,
  HttpRequestPostOptions,
  HttpRequestGetOptions,
  HttpSendResult,
  TokenIssuer,
} from '@daita/http-interface';

export class NodeHttp implements Http {
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

  private async sendRequest(method: 'GET', options: HttpRequestGetOptions): Promise<HttpSendResult>;
  private async sendRequest(method: 'POST', options: HttpRequestPostOptions): Promise<HttpSendResult>;
  private async sendRequest(method: 'GET' | 'POST', options: HttpRequestPostOptions): Promise<HttpSendResult> {
    const qs = getQueryString(options.query);
    const url = getUri(this.baseUrl, options.path, qs);

    const headers = options.headers || {};
    if (options.authorized) {
      const authHeader = await this.tokenProvider.getToken();
      if (authHeader) {
        headers['Authorization'] = authHeader;
      }
    }

    const parsedUrl = parse(url);
    const reqOptions: RequestOptions = {
      ...options,
      headers,
      hostname: parsedUrl.hostname,
      port: parsedUrl.port,
      path: parsedUrl.path,
      method: method,
    };
    const requestMethod = this.baseUrl.startsWith('https:') ? httpsRequest : httpRequest;

    return new Promise<HttpSendResult>((resolve, reject) => {
      const req = requestMethod(reqOptions, (res) => {
        let data = '';

        res.setEncoding('utf8');
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          let responseData = data;
          if (data && res.headers['content-type']?.toString().indexOf('application/json') !== -1) {
            responseData = parseJson(data);
          }
          const timeout = res.headers['x-transaction-timeout'] as string;
          resolve({
            data: responseData,
            statusCode: res.statusCode || 0,
            headers: {
              'x-transaction-timeout': timeout ? parseInt(timeout, 0) : undefined,
            },
          });
        });
      }).on('error', (err) => {
        reject(err);
      });
      if (method === 'POST') {
        if (options.data !== null && options.data !== undefined) {
          req.write(options.data);
        }
      }
      req.end();
    });
  }
}
