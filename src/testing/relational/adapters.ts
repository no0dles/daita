import { SqliteMemoryTestFactory } from './adapter/sqlite-memory-test-factory';
import { PostgresTestFactory } from './adapter/postgres-test-factory';
import { HttpTestFactory } from './adapter/http-test-factory';
import { TransactionAdapterTestFactory } from './adapter/transaction-adapter-test-factory';
import { DataAdapterTestFactory } from './adapter/data-adapter-test-factory';
import { ClientTestFactory } from './adapter/client-test-factory';
import { TransactionClientTestFactory } from './adapter/transaction-client-test-factory';
import { SqliteFileTestFactory } from './adapter/sqlite-file-test-factory';
import { ContextTestFactory } from './adapter/context-test-factory';
import { TransactionContextTestFactory } from './adapter/transaction-context-test-factory';

const postgresFactory = new PostgresTestFactory();
const sqliteMemoryFactory = new SqliteMemoryTestFactory();
const sqliteFileFactory = new SqliteFileTestFactory();
const httpSqliteFactory = new HttpTestFactory(new SqliteMemoryTestFactory());

export const dataAdapters: DataAdapterTestFactory[] = [postgresFactory, sqliteMemoryFactory, sqliteFileFactory];
export const transactionAdapters: TransactionAdapterTestFactory[] = [
  postgresFactory,
  sqliteMemoryFactory,
  sqliteFileFactory,
];
export const dataClients: ClientTestFactory[] = [postgresFactory, sqliteMemoryFactory, sqliteFileFactory];
export const transactionClients: TransactionClientTestFactory[] = [
  postgresFactory,
  sqliteMemoryFactory,
  sqliteFileFactory,
];
export const contexts: ContextTestFactory[] = [httpSqliteFactory];
export const transactionContexts: TransactionContextTestFactory[] = [httpSqliteFactory];
export const remoteTransactionContexts: TransactionContextTestFactory[] = [httpSqliteFactory];
