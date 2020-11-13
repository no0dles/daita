import { RelationalTransactionAdapter, TransactionClient } from '../../../packages/relational';
import { RelationalTransactionClient } from '../../../packages/relational/client/relational-transaction-client';
import { DataAdapterTestContext } from './data-adapter-test-context';
import { ClientTestContext } from './client-test-context';
import { TransactionContextTestContext } from './transaction-context-test-context';
import { getContext, TransactionContext } from '../../../packages/orm';
import { MigrationTree } from '../../../packages/orm/migration/migration-tree';
import { adapter as sqliteAdapter } from '../../../packages/sqlite-adapter';
import { OrmRelationalSchema } from '../../../packages/orm/schema/orm-relational-schema';
import { RuleContext } from '../../../packages/relational/permission/description/rule-context';

export class SqliteMemoryTestContext implements DataAdapterTestContext, ClientTestContext {
  adapter: RelationalTransactionAdapter<any>;
  client: TransactionClient<any>;

  constructor() {
    this.adapter = sqliteAdapter.getRelationalAdapter({ memory: true });
    this.client = new RelationalTransactionClient(this.adapter);
  }

  async close(): Promise<void> {
    await this.adapter.close();
    await this.client.close();
  }
}

export class SqliteMemoryContextTestContext implements TransactionContextTestContext {
  context: TransactionContext<any>;
  migrationTree: MigrationTree;

  constructor(schema: OrmRelationalSchema, auth?: RuleContext) {
    this.migrationTree = schema.getMigrations();
    this.context = getContext(sqliteAdapter, {
      auth,
      schema,
      memory: true,
    });
  }

  close(): Promise<void> {
    return Promise.resolve(undefined);
  }
}
