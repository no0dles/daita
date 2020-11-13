import { SqliteMemoryContextTestContext, SqliteMemoryTestContext } from './sqlite-memory-test-context';
import { TransactionAdapterTestContext } from './transaction-adapter-test-context';
import { TransactionAdapterTestFactory } from './transaction-adapter-test-factory';
import { DataAdapterTestFactory } from './data-adapter-test-factory';
import { TransactionClientTestContext } from './transaction-client-test-context';
import { ClientTestFactory } from './client-test-factory';
import { TransactionClientTestFactory } from './transaction-client-test-factory';
import { TransactionContextTestFactory } from './transaction-context-test-factory';
import { TransactionContextTestContext } from './transaction-context-test-context';
import { OrmRelationalSchema } from '../../../packages/orm/schema/orm-relational-schema';
import { RuleContext } from '../../../packages/relational/permission/description/rule-context';

export class SqliteMemoryTestFactory
  implements
    DataAdapterTestFactory,
    ClientTestFactory,
    TransactionAdapterTestFactory,
    TransactionClientTestFactory,
    TransactionContextTestFactory {
  async getAdapter(): Promise<TransactionAdapterTestContext> {
    return new SqliteMemoryTestContext();
  }

  async getClient(): Promise<TransactionClientTestContext> {
    return new SqliteMemoryTestContext();
  }

  toString() {
    return 'sqlite-memory';
  }

  async getContext(schema: OrmRelationalSchema, auth?: RuleContext): Promise<TransactionContextTestContext> {
    return new SqliteMemoryContextTestContext(schema, auth);
  }
}
