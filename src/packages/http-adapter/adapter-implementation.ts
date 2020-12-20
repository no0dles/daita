import { AuthProvider } from '../http-client-common/auth-provider';
import { Http } from '../http-client-common/http';
import { RelationalMigrationAdapterImplementation } from '../orm/adapter/relational-migration-adapter-implementation';
import { RelationalMigrationAdapter } from '../orm/adapter/relational-migration-adapter';
import { HttpMigrationAdapter } from './http-migration-adapter';
import { Resolvable } from '../common/utils/resolvable';

export interface HttpAdapterOptions {
  baseUrl: string;
  authProvider: AuthProvider | null | undefined;
}

export class HttpAdapterImplementation implements RelationalMigrationAdapterImplementation<any, HttpAdapterOptions> {
  constructor(private httpFactory: (options: HttpAdapterOptions) => Http) {}
  getRelationalAdapter(options: HttpAdapterOptions): RelationalMigrationAdapter<any> {
    const http = this.httpFactory(options);
    return new HttpMigrationAdapter(new Resolvable<Http>(http));
  }
}
