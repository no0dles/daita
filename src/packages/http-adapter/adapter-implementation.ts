import { AuthProvider } from '../http-client-common/auth-provider';
import { Http } from '../http-client-common/http';
import { RelationalMigrationAdapterImplementation } from '../orm/adapter/relational-migration-adapter-implementation';
import { RelationalMigrationAdapter } from '../orm/adapter/relational-migration-adapter';
import { HttpMigrationAdapter } from './http-migration-adapter';
import { Resolvable } from '../common/utils/resolvable';
import { getHttpFactory } from '../http-client-common/http-factory';

export interface HttpAdapterOptions {
  baseUrl: string;
  auth: AuthProvider;
}

export class HttpAdapterImplementation implements RelationalMigrationAdapterImplementation<any, HttpAdapterOptions> {
  getRelationalAdapter(options: HttpAdapterOptions): RelationalMigrationAdapter<any> {
    const http = getHttpFactory(options.baseUrl, options.auth);
    return new HttpMigrationAdapter(new Resolvable<Http>(http));
  }
}
