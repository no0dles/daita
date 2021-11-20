import { AuthProvider } from '@daita/http-client-common/auth-provider';
import { Http } from '@daita/http-client-common/http';
import { RelationalMigrationAdapterImplementation } from '@daita/orm/adapter/relational-migration-adapter-implementation';
import { RelationalMigrationAdapter } from '@daita/orm/adapter/relational-migration-adapter';
import { HttpAdapter } from './http-adapter';
import { Resolvable } from '@daita/common/utils/resolvable';
import { getHttpFactory } from '@daita/http-client-common/http-factory';

export interface HttpAdapterOptions {
  baseUrl: string;
  auth: AuthProvider;
}

export class HttpAdapterImplementation
  implements
    RelationalMigrationAdapterImplementation<any, HttpAdapterOptions> {
  getRelationalAdapter(options: HttpAdapterOptions): RelationalMigrationAdapter<any> {
    const http = getHttpFactory(options.baseUrl, options.auth);
    return new HttpAdapter(new Resolvable<Http>(http));
  }
}
