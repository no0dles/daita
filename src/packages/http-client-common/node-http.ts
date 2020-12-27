import { encodeFormData, getQueryString, getUri, Http, HttpRequestOptions, HttpSendResult } from './http';
import { request as httpsRequest, RequestOptions } from 'https';
import { request as httpRequest } from 'http';
import { parse } from 'url';
import { AuthProvider, TokenIssuer } from './auth-provider';
import { getTokenIssuer } from './shared-http';
import { parseJson } from './json';

export class NodeHttp implements Http {
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
      hostname: parsedUrl.hostname,
      port: parsedUrl.port,
      path: parsedUrl.path,
      method: options.method || 'POST',
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
      if (options.data !== null && options.data !== undefined) {
        req.write(options.data);
      }
      req.end();
    });
  }
}
