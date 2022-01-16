import { AuthProvider, Http } from '@daita/http-interface';
import { Resolvable } from '@daita/common';
import { NodeHttp } from './node-http';
import { HttpAdapter } from '@daita/http-adapter';
import { RelationalOrmAdapter, RelationalOrmAdapterImplementation } from '@daita/orm';
import { RelationalAdapter } from '@daita/relational';

export interface HttpAdapterOptions {
  baseUrl: string;
  auth: AuthProvider | null | undefined;
}

export class HttpBrowserAdapterImplementation implements RelationalOrmAdapterImplementation<any, HttpAdapterOptions> {
  getRelationalAdapter(options: HttpAdapterOptions): RelationalAdapter<any> & RelationalOrmAdapter {
    const http = new NodeHttp(options.baseUrl, options.auth);
    return new HttpAdapter(http);
  }
}

export const adapter = new HttpBrowserAdapterImplementation();
