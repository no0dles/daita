import { RelationalTransactionAdapter } from '../../../packages/relational';

export interface TransactionAdapterTestContext {
  adapter: RelationalTransactionAdapter<any>;

  close(): Promise<void>;
}
