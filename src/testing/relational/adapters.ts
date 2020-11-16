import { testAdapter as pgAdapter } from '../../packages/pg-adapter/testing/postgres-test-adapter';
import { testAdapter as sqliteAdapter } from '../../packages/sqlite-adapter';
import { testAdapter as httpAdapter } from '../../packages/http-adapter';
import { TransactionContext } from '../../packages/orm/context/transaction-context';
import { OrmRelationalSchema } from '../../packages/orm/schema/orm-relational-schema';
import { isMigrationTree, MigrationTree } from '../../packages/orm/migration/migration-tree';
import { TransactionClient } from '../../packages/relational/client/transaction-client';
import { getClient } from '../../packages/relational/client/get-client';
import { getContext } from '../../packages/orm/context/get-context';
import { MigrationContext } from '../../packages/orm/context/get-migration-context';

export type TestClientType = 'pg' | 'sqlite';
export type TestContextType = 'pg' | 'sqlite' | 'http-sqlite';

export function testClient(...types: TestClientType[]) {
  const clients: TransactionClient<any>[] = [];

  if (types.some((t) => t === 'pg')) {
    clients.push(getClient(pgAdapter, {}));
  }
  if (types.some((t) => t === 'sqlite')) {
    clients.push(getClient(sqliteAdapter, { type: 'memory' }));
    clients.push(getClient(sqliteAdapter, { type: 'file' }));
  }

  return clients;
}

export function testContext(schema: OrmRelationalSchema, ...types: TestContextType[]): MigrationContext<any>[];
export function testContext(migrationTree: MigrationTree, ...types: TestContextType[]): MigrationContext<any>[];
export function testContext(schemaOrMigrationTree: OrmRelationalSchema | MigrationTree, ...types: TestContextType[]) {
  const contexts: TransactionContext<any>[] = [];
  const migrationTree = isMigrationTree(schemaOrMigrationTree)
    ? schemaOrMigrationTree
    : schemaOrMigrationTree.getMigrations();

  if (types.indexOf('pg') >= 0) {
    contexts.push(getContext(pgAdapter, { migrationTree }));
  }

  if (types.indexOf('sqlite') >= 0) {
    contexts.push(getContext(sqliteAdapter, { migrationTree, type: 'memory' }));
    contexts.push(getContext(sqliteAdapter, { migrationTree, type: 'file' }));
  }

  if (types.indexOf('http-sqlite') >= 0) {
    contexts.push(
      getContext(httpAdapter, { migrationTree, context: getContext(sqliteAdapter, { migrationTree, type: 'memory' }) }),
    );
  }

  return contexts;
}
