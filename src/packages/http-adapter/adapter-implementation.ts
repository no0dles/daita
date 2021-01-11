import { AuthProvider } from '../http-client-common/auth-provider';
import { Http } from '../http-client-common/http';
import { RelationalMigrationAdapterImplementation } from '../orm/adapter/relational-migration-adapter-implementation';
import { RelationalMigrationAdapter } from '../orm/adapter/relational-migration-adapter';
import { HttpAdapter } from './http-adapter';
import { Resolvable } from '../common/utils/resolvable';
import { getHttpFactory } from '../http-client-common/http-factory';
import { IwentAdapterImplementation } from '../iwent/iwent-adapter-implementation';
import { IwentAdapter } from '../iwent/iwent-adapter';

export interface HttpAdapterOptions {
  baseUrl: string;
  auth: AuthProvider;
}

export class HttpAdapterImplementation
  implements
    RelationalMigrationAdapterImplementation<any, HttpAdapterOptions>,
    IwentAdapterImplementation<HttpAdapterOptions> {
  getRelationalAdapter(options: HttpAdapterOptions): RelationalMigrationAdapter<any> & IwentAdapter {
    const http = getHttpFactory(options.baseUrl, options.auth);
    return new HttpAdapter(new Resolvable<Http>(http));
  }
}
