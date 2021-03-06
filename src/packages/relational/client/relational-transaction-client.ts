import { RelationalClient } from './relational-client';
import { TransactionClient } from './transaction-client';
import { RelationalTransactionAdapter } from '../adapter/relational-transaction-adapter';

export class RelationalTransactionClient extends RelationalClient implements TransactionClient<RelationalClient> {
  constructor(private transactionAdapter: RelationalTransactionAdapter<any>) {
    super(transactionAdapter);
  }

  async transaction<T>(action: (trx: RelationalClient) => Promise<T>): Promise<T> {
    return this.transactionAdapter.transaction<T>(async (adapter) => {
      return action(new RelationalClient(adapter));
    });
  }

  async close() {
    await this.transactionAdapter.close();
  }
}
