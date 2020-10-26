import { encodeFormData, getQueryString, Http, HttpSendResult } from './http';
import { AuthProvider, isTokenAuthProvider } from './auth';
import { request as httpsRequest, RequestOptions } from 'https';
import { request as httpRequest } from 'http';
import { parse } from 'url';
import { failNever } from '../common/utils';

export class NodeHttp implements Http {
  constructor(protected baseUrl: string, protected authProvider: AuthProvider | null | undefined) {}

  sendFormData(path: string, data: any): Promise<HttpSendResult> {
    const url = `${this.baseUrl}/${path}`;
    return this.sendRequest(
      url,
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      },
      encodeFormData(data),
    );
  }

  private sendRequest(reqUrl: string, options: RequestOptions, data: any) {
    const parsedUrl = parse(reqUrl);
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
      req.write(data);
      req.end();
    });
  }

  async sendJson<T>(path: string, data?: any, query?: { [p: string]: string }): Promise<HttpSendResult> {
    const qs = getQueryString(query);
    const url = `${this.baseUrl}/${path}${qs.length > 0 ? '?' + qs : ''}`;

    const httpHeader: { [key: string]: string } = { 'Content-Type': 'application/json' };
    if (this.authProvider) {
      const authProvider = this.authProvider;
      if (isTokenAuthProvider(authProvider)) {
        const token = await authProvider.getToken();
        if (token) {
          httpHeader['Authorization'] = `Bearer ${token}`;
        }
      } else {
        failNever(authProvider, 'unknown auth provider');
      }
    }

    return this.sendRequest(
      url,
      {
        headers: httpHeader,
      },
      JSON.stringify(data),
    );
  }
}
