import { RelationalTransactionAdapter, TransactionClient } from '../../../packages/relational';
import { PostgresDb } from '../../postgres-test';
import { adapter as postgresAdapter } from '../../../packages/pg-adapter';
import { RelationalTransactionClient } from '../../../packages/relational/client/relational-transaction-client';
import { DataAdapterTestContext } from './data-adapter-test-context';
import { ClientTestContext } from './client-test-context';
import { TransactionContextTestContext } from './transaction-context-test-context';
import { getContext, TransactionContext } from '../../../packages/orm';
import { MigrationTree } from '../../../packages/orm/migration/migration-tree';
import { OrmRelationalSchema } from '../../../packages/orm/schema/orm-relational-schema';
import { RuleContext } from '../../../packages/relational/permission/description/rule-context';

export class PostgresTestContext implements DataAdapterTestContext, ClientTestContext {
  adapter: RelationalTransactionAdapter;
  client: TransactionClient<any>;

  constructor(private db: PostgresDb) {
    this.adapter = postgresAdapter.getRelationalAdapter({
      connectionString: db.connectionString,
    });
    this.client = new RelationalTransactionClient(this.adapter);
  }

  async close() {
    await this.adapter?.close();
    await this.db.close();
  }
}

export class PostgresContextTestContext implements TransactionContextTestContext {
  context: TransactionContext<any>;
  migrationTree: MigrationTree;

  constructor(private db: PostgresDb, schema: OrmRelationalSchema, auth?: RuleContext) {
    this.migrationTree = schema.getMigrations();
    this.context = getContext(postgresAdapter, {
      connectionString: db.connectionString,
      auth,
    });
  }

  async close(): Promise<void> {
    await this.context?.close();
    await this.db.close();
  }
}
