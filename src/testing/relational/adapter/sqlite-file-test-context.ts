import { RelationalTransactionAdapter, TransactionClient } from '../../../packages/relational';
import { RelationalTransactionClient } from '../../../packages/relational/client/relational-transaction-client';
import fs from 'fs/promises';
import { DataAdapterTestContext } from './data-adapter-test-context';
import { ClientTestContext } from './client-test-context';

export class SqliteFileTestContext implements DataAdapterTestContext, ClientTestContext {
  client: TransactionClient<any>;

  constructor(private fileName: string, public adapter: RelationalTransactionAdapter<any>) {
    this.client = new RelationalTransactionClient(adapter);
  }

  async close(): Promise<void> {
    await this.adapter.close();
    await this.client.close();
    try {
      await fs.unlink(this.fileName);
    } finally {
    }
  }
}
