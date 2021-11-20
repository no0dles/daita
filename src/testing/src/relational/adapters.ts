import { testAdapter as pgAdapter } from '../../packages/pg-adapter/testing/postgres-test-adapter';
import { testAdapter as sqliteAdapter } from '../../packages/sqlite-adapter';
import { testAdapter as httpAdapter } from '../../packages/http-adapter/test-adapter-implementation';
import { testAdapter as mariadbAdapter } from '../../packages/mariadb-adapter';
import { OrmRelationalSchema } from '../../packages/orm/schema/orm-relational-schema';
import { isMigrationTree, MigrationTree } from '../../packages/orm/migration/migration-tree';
import { TransactionClient } from '../../packages/relational/client/transaction-client';
import { getClient } from '../../packages/relational/client/get-client';
import { getContext } from '../../packages/orm/context/get-context';
import { MigrationContext } from '../../packages/orm/context/get-migration-context';
import { HttpTestAdapterOptions } from '../../packages/http-adapter/test-adapter-implementation';

export type TestClientType = 'pg' | 'sqlite' | 'mariadb';
export type TestContextType = 'pg' | 'sqlite' | 'mariadb' | 'http-sqlite';

export function testClient(...types: TestClientType[]) {
  const clients: TransactionClient<any>[] = [];

  if (types.some((t) => t === 'pg')) {
    clients.push(getClient(pgAdapter, {}));
  }
  if (types.some((t) => t === 'mariadb')) {
    clients.push(getClient(mariadbAdapter, {}));
  }
  if (types.some((t) => t === 'sqlite')) {
    clients.push(getClient(sqliteAdapter, { type: 'memory' }));
    clients.push(getClient(sqliteAdapter, { type: 'file' }));
  }

  return clients;
}

export function testContext(
  schema: MigrationTree,
  type: 'http-sqlite',
  options: Partial<HttpTestAdapterOptions>,
): MigrationContext<any>;
export function testContext(schema: OrmRelationalSchema, type: TestContextType): MigrationContext<any>;
export function testContext(migrationTree: MigrationTree, type: TestContextType): MigrationContext<any>;
export function testContext(schema: OrmRelationalSchema, types: TestContextType[]): MigrationContext<any>[];
export function testContext(migrationTree: MigrationTree, types: TestContextType[]): MigrationContext<any>[];
export function testContext(
  schemaOrMigrationTree: OrmRelationalSchema | MigrationTree,
  types: TestContextType[] | TestContextType,
  options?: Partial<HttpTestAdapterOptions>,
): MigrationContext<any> | MigrationContext<any>[] {
  const contexts: MigrationContext<any>[] = [];
  const migrationTree = isMigrationTree(schemaOrMigrationTree)
    ? schemaOrMigrationTree
    : schemaOrMigrationTree.getMigrations();

  function containsType(types: TestContextType[] | TestContextType, expectedType: TestContextType) {
    return (types instanceof Array && types.indexOf(expectedType) >= 0) || types === expectedType;
  }

  if (containsType(types, 'pg')) {
    contexts.push(getContext(pgAdapter, { migrationTree }));
  }

  if (containsType(types, 'sqlite')) {
    contexts.push(getContext(sqliteAdapter, { migrationTree, type: 'memory' }));
    contexts.push(getContext(sqliteAdapter, { migrationTree, type: 'file' }));
  }

  if (containsType(types, 'mariadb')) {
    contexts.push(getContext(mariadbAdapter, { migrationTree }));
  }

  if (containsType(types, 'http-sqlite')) {
    contexts.push(
      getContext(httpAdapter, {
        ...options,
        context: getContext(sqliteAdapter, { migrationTree, type: 'memory' }),
        migrationTree,
      }),
    );
  }

  if (contexts.length === 1) {
    return contexts[0];
  }
  return contexts;
}
