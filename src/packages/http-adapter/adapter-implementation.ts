import { AuthProvider } from '../http-client-common/auth-provider';
import { RelationalTransactionAdapterImplementation } from '../relational/adapter/relational-adapter-implementation';
import { RelationalTransactionAdapter } from '../relational';
import { Http } from '../http-client-common';
import { HttpTransactionAdapter } from './http-transaction-adapter';

export interface HttpAdapterOptions {
  baseUrl: string;
  authProvider: AuthProvider | null | undefined;
}

export class HttpAdapterImplementation implements RelationalTransactionAdapterImplementation<any, HttpAdapterOptions> {
  constructor(private httpFactory: (options: HttpAdapterOptions) => Http) {}
  getRelationalAdapter(options: HttpAdapterOptions): RelationalTransactionAdapter<any> {
    const http = this.httpFactory(options);
    return new HttpTransactionAdapter(http, Promise.resolve(), () => {});
  }

  supportsQuery<S>(sql: S): this is RelationalTransactionAdapterImplementation<any | S, HttpAdapterOptions> {
    return false;
  }
}
