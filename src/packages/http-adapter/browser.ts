import { RelationalAdapterImplementation, RelationalTransactionAdapter } from '../relational/adapter';
import { HttpTransactionAdapter } from './http-transaction-adapter';
import { HttpAdapterOptions } from './adapter-implementation';
import { BrowserHttp } from '../http-client-common/browser-http';

export { HttpTransactionAdapter } from './http-transaction-adapter';
export { HttpDataAdapter } from './http-data-adapter';

export const adapter: RelationalAdapterImplementation<any, HttpAdapterOptions> = {
  getAdapter(options?: HttpAdapterOptions): RelationalTransactionAdapter<any> {
    const http = new BrowserHttp(options?.baseUrl || 'http://localhost:8765', options?.authProvider || null);
    return new HttpTransactionAdapter(http);
  },
};
