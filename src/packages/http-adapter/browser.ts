import { HttpTransactionAdapter } from './http-transaction-adapter';
import { HttpAdapterImplementation } from './adapter-implementation';
import { BrowserHttp } from '../http-client-common/browser-http';

export { HttpTransactionAdapter } from './http-transaction-adapter';
export { HttpDataAdapter } from './http-data-adapter';

export const adapter = new HttpAdapterImplementation(
  (options) => new BrowserHttp(options.baseUrl, options.authProvider),
);

// export const testAdapter = new HttpTestAdapterImplementation(
//   (options) => new BrowserHttp(options.baseUrl, options.authProvider),
// );
