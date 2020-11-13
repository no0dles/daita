import { getPostgresDb } from '../../postgres-test';
import { PostgresContextTestContext, PostgresTestContext } from './postgres-test-context';
import { TransactionAdapterTestContext } from './transaction-adapter-test-context';
import { TransactionAdapterTestFactory } from './transaction-adapter-test-factory';
import { DataAdapterTestFactory } from './data-adapter-test-factory';
import { TransactionClientTestContext } from './transaction-client-test-context';
import { ClientTestFactory } from './client-test-factory';
import { TransactionClientTestFactory } from './transaction-client-test-factory';
import { TransactionContextTestFactory } from './transaction-context-test-factory';
import { ContextTestFactory } from './context-test-factory';
import { TransactionContextTestContext } from './transaction-context-test-context';
import { OrmRelationalSchema } from '../../../packages/orm/schema/orm-relational-schema';
import { RuleContext } from '../../../packages/relational/permission/description/rule-context';

export class PostgresTestFactory
  implements
    DataAdapterTestFactory,
    ClientTestFactory,
    TransactionAdapterTestFactory,
    TransactionClientTestFactory,
    TransactionContextTestFactory,
    ContextTestFactory {
  async getAdapter(): Promise<TransactionAdapterTestContext> {
    const db = await getPostgresDb();
    return new PostgresTestContext(db);
  }

  async getClient(): Promise<TransactionClientTestContext> {
    const db = await getPostgresDb();
    return new PostgresTestContext(db);
  }

  toString() {
    return 'postgres';
  }

  async getContext(schema: OrmRelationalSchema, auth?: RuleContext): Promise<TransactionContextTestContext> {
    const db = await getPostgresDb();
    return new PostgresContextTestContext(db, schema, auth);
  }
}
