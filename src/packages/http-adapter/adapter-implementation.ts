import { RelationalAdapterImplementation, RelationalTransactionAdapter } from '../relational/adapter';
import { PostgresSql } from '../pg-adapter/sql/postgres-sql';
import { AuthProvider } from '../http-client-common/auth';
import { HttpTransactionAdapter } from './http-transaction-adapter';

export interface HttpAdapterOptions {
  baseUrl: string;
  authProvider: AuthProvider | null | undefined;
}

export const httpAdapter: RelationalAdapterImplementation<PostgresSql, HttpAdapterOptions> = {
  getAdapter(options?: HttpAdapterOptions): RelationalTransactionAdapter<any> {
    return new HttpTransactionAdapter(options?.baseUrl || 'http://localhost:8765', options?.authProvider || null);
  },
};
