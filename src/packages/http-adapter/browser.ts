import { HttpTransactionAdapter } from './http-transaction-adapter';
import { HttpAdapterOptions } from './adapter-implementation';
import { BrowserHttp } from '../http-client-common/browser-http';
import { RelationalTransactionAdapter } from '../relational/adapter/relational-transaction-adapter';
import { RelationalTransactionAdapterImplementation } from '../relational/adapter/relational-adapter-implementation';

export { HttpTransactionAdapter } from './http-transaction-adapter';
export { HttpDataAdapter } from './http-data-adapter';

export const adapter: RelationalTransactionAdapterImplementation<any, HttpAdapterOptions> = {
  getRelationalAdapter(options: HttpAdapterOptions): RelationalTransactionAdapter<any> {
    const http = new BrowserHttp(options.baseUrl, options.authProvider);
    return new HttpTransactionAdapter(http);
  },
};
