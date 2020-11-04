import { RelationalClient } from './relational-client';
import { MigrationClient, TransactionClient } from './transaction-client';
import { RelationalTransactionAdapter } from '../adapter/relational-transaction-adapter';
import exp from 'constants';
import { MigrationAdapter } from '../../orm/migration/migration-adapter';

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

export class RelationalMigrationClient
  extends RelationalTransactionClient
  implements MigrationClient<RelationalClient> {
  constructor(adapter: RelationalTransactionAdapter<any>, public migrationAdapter: MigrationAdapter<RelationalClient>) {
    super(adapter);
  }
}
