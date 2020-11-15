import { HttpAdapterImplementation } from './adapter-implementation';
import { HttpTransactionAdapter } from './http-transaction-adapter';
import { NodeHttp } from '../http-client-common/node-http';
import { HttpTestAdapterImplementation } from './test-adapter-implementation';

export { HttpTransactionAdapter } from './http-transaction-adapter';
export { HttpDataAdapter } from './http-data-adapter';

export const adapter = new HttpAdapterImplementation((options) => new NodeHttp(options.baseUrl, options.authProvider));

export const testAdapter = new HttpTestAdapterImplementation(
  (options) => new NodeHttp(options.baseUrl, options.authProvider),
);
