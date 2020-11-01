import { encodeFormData, getQueryString, Http, HttpRequestOptions, HttpSendResult } from './http';
import { request as httpsRequest, RequestOptions } from 'https';
import { request as httpRequest } from 'http';
import { parse } from 'url';
import { AuthProvider, TokenIssuer } from './auth-provider';
import { getTokenIssuer } from './shared-http';

export class NodeHttp implements Http {
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
      method: 'POST',
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
          const responseData = JSON.parse(data);
          const timeout = res.headers['x-transaction-timeout'] as string;
          resolve({
            data: responseData,
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
