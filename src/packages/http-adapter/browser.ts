import { HttpAdapterOptions } from './adapter-implementation';
import { BrowserAuth, TokenIssuer } from '../http-client-common/auth-provider';
import { BrowserHttp } from '../http-client-common/browser-http';
import { RelationalMigrationAdapterImplementation } from '../orm/adapter/relational-migration-adapter-implementation';
import { RelationalMigrationAdapter } from '../orm/adapter/relational-migration-adapter';
import { HttpMigrationAdapter } from './http-migration-adapter';
import { Resolvable } from '../common/utils/resolvable';
import { Http } from '../http-client-common/http';

export function createTokenIssuer(baseUrl: string, storage?: Storage): TokenIssuer {
  return new BrowserAuth(new BrowserHttp(baseUrl, null), storage ?? localStorage);
}

export class HttpBrowserAdapterImplementation
  implements RelationalMigrationAdapterImplementation<any, HttpAdapterOptions> {
  getRelationalAdapter(options: HttpAdapterOptions): RelationalMigrationAdapter<any> {
    const http = new BrowserHttp(options.baseUrl, options.auth);
    return new HttpMigrationAdapter(new Resolvable<Http>(http));
  }
}

export const adapter = new HttpBrowserAdapterImplementation();
