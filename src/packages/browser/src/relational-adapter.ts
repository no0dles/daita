import { Resolvable } from '@daita/common';
import { Http, TokenIssuer } from '@daita/http-interface';
import { RelationalMigrationAdapter, RelationalMigrationAdapterImplementation } from '@daita/orm';
import { BrowserHttp } from './browser-http';
import { BrowserAuth } from './browser-auth';
import { HttpMigrationAdapter } from '@daita/http-adapter';
import { HttpAdapterOptions } from '@daita/http-adapter';

export function createTokenIssuer(baseUrl: string, storage?: Storage): TokenIssuer {
  return new BrowserAuth(new BrowserHttp(baseUrl, null), storage ?? localStorage);
}

export class HttpBrowserAdapterImplementation
  implements RelationalMigrationAdapterImplementation<any, HttpAdapterOptions>
{
  getRelationalAdapter(options: HttpAdapterOptions): RelationalMigrationAdapter<any> {
    const http = new BrowserHttp(options.baseUrl, options.auth);
    return new HttpMigrationAdapter(new Resolvable<Http>(http));
  }
}

export const adapter = new HttpBrowserAdapterImplementation();
