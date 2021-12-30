import { AuthProvider, Http } from '@daita/http-interface';
import { Resolvable } from '@daita/common';
import { RelationalMigrationAdapter, RelationalMigrationAdapterImplementation } from '@daita/orm';
import { NodeHttp } from './node-http';
import { HttpMigrationAdapter } from '@daita/http-adapter';

export interface HttpAdapterOptions {
  baseUrl: string;
  auth: AuthProvider | null | undefined;
}

export class HttpBrowserAdapterImplementation
  implements RelationalMigrationAdapterImplementation<any, HttpAdapterOptions>
{
  getRelationalAdapter(options: HttpAdapterOptions): RelationalMigrationAdapter<any> {
    const http = new NodeHttp(options.baseUrl, options.auth);
    return new HttpMigrationAdapter(new Resolvable<Http>(http));
  }
}

export const adapter = new HttpBrowserAdapterImplementation();
