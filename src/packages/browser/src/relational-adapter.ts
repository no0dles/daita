import { TokenIssuer } from '@daita/http-interface';
import { BrowserHttp } from './browser-http';
import { BrowserAuth } from './browser-auth';
import { HttpAdapter, HttpAdapterOptions } from '@daita/http-adapter';
import { RelationalOrmAdapterImplementation } from '@daita/orm';

export function createTokenIssuer(baseUrl: string, storage?: Storage): TokenIssuer {
  return new BrowserAuth(new BrowserHttp(baseUrl, null), storage ?? localStorage);
}

export class HttpBrowserAdapterImplementation implements RelationalOrmAdapterImplementation<any, HttpAdapterOptions> {
  getRelationalAdapter(options: HttpAdapterOptions): HttpAdapter {
    const http = new BrowserHttp(options.baseUrl, options.auth);
    return new HttpAdapter(http);
  }
}

export const adapter = new HttpBrowserAdapterImplementation();
