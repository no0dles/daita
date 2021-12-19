import { RelationalClient } from './relational-client';
import { AuthorizableTransactionClient, TransactionClient } from './transaction-client';
import { RelationalTransactionAdapter } from '../adapter/relational-transaction-adapter';
import { Rule } from '../permission';
import { RelationalAuthorizableTransactionClient } from './relational-authorizable-transaction-client';

export class RelationalTransactionClient extends RelationalClient implements TransactionClient<RelationalClient> {
  constructor(private transactionAdapter: RelationalTransactionAdapter<any>) {
    super(transactionAdapter);
  }

  async transaction<T>(action: (trx: RelationalClient) => Promise<T>, timeout?: number): Promise<T> {
    return this.transactionAdapter.transaction<T>(async (adapter) => {
      return action(new RelationalClient(adapter));
    }, timeout);
  }

  async close() {
    await this.transactionAdapter.close();
  }

  authorizable(rules: { id: string; rule: Rule }[]): AuthorizableTransactionClient<any> {
    return new RelationalAuthorizableTransactionClient(this.transactionAdapter, rules);
  }
}
