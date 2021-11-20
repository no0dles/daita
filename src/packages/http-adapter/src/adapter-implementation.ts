import { AuthProvider } from '@daita/http-client-common';
import { Http } from '@daita/http-client-common';
import { RelationalMigrationAdapterImplementation } from '@daita/orm';
import { RelationalMigrationAdapter } from '@daita/orm';
import { HttpAdapter } from './http-adapter';
import { Resolvable } from '@daita/common';
import { getHttpFactory } from '@daita/http-client-common';

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
