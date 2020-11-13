import { RelationalTransactionAdapter, TransactionClient } from '../../../packages/relational';

export interface TransactionClientTestContext {
  client: TransactionClient<any>;
  adapter: RelationalTransactionAdapter<any>;

  close(): Promise<void>;
}
