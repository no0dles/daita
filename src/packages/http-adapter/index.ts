import { RelationalAdapterImplementation, RelationalTransactionAdapter } from '../relational/adapter';
import { HttpAdapterOptions } from './adapter-implementation';
import { HttpTransactionAdapter } from './http-transaction-adapter';
import { NodeHttp } from '../http-client-common/node-http';

export { HttpTransactionAdapter } from './http-transaction-adapter';
export { HttpDataAdapter } from './http-data-adapter';

export const adapter: RelationalAdapterImplementation<any, HttpAdapterOptions> = {
  getAdapter(options?: HttpAdapterOptions): RelationalTransactionAdapter<any> {
    const http = new NodeHttp(options?.baseUrl || 'http://localhost:8765', options?.authProvider || null);
    return new HttpTransactionAdapter(http);
  },
};
