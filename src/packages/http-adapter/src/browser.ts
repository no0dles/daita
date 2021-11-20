import { HttpAdapterOptions } from './adapter-implementation';
import { BrowserAuth, TokenIssuer } from '@daita/http-client-common';
import { BrowserHttp } from '@daita/http-client-common';
import { RelationalMigrationAdapterImplementation } from '@daita/orm';
import { RelationalMigrationAdapter } from '@daita/orm';
import { HttpAdapter } from './http-adapter';
import { Resolvable } from '@daita/common';
import { Http } from '@daita/http-client-common';

export function createTokenIssuer(baseUrl: string, storage?: Storage): TokenIssuer {
  return new BrowserAuth(new BrowserHttp(baseUrl, null), storage ?? localStorage);
}

export class HttpBrowserAdapterImplementation
  implements RelationalMigrationAdapterImplementation<any, HttpAdapterOptions> {
  getRelationalAdapter(options: HttpAdapterOptions): RelationalMigrationAdapter<any> {
    const http = new BrowserHttp(options.baseUrl, options.auth);
    return new HttpAdapter(new Resolvable<Http>(http));
  }
}

export const adapter = new HttpBrowserAdapterImplementation();
