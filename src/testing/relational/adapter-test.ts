import { RelationalTransactionAdapter } from '../../packages/relational/adapter/relational-transaction-adapter';
import { adapter as postgresAdapter } from '../../packages/pg-adapter';
import { adapter as sqliteAdapter } from '../../packages/sqlite-adapter';
import { adapter as httpAdapter } from '../../packages/http-adapter';
import { getFreeTestPort, getPostgresDb, PostgresDb } from '../postgres-test';
import { createHttpServerApp } from '../../packages/http-server/app';
import { RelationalTransactionClient } from '../../packages/relational/client/relational-transaction-client';
import { Defer } from '../../packages/common/utils/defer';
import { Server } from 'http';
import fs from 'fs/promises';
import path from 'path';
import { allow } from '../../packages/relational/permission/function/allow';
import { anonymous } from '../../packages/relational/permission/function/anonymous';
import { anything } from '../../packages/relational/permission/function/anything';
import { randomString } from '../../packages/common/utils/random-string';
import { RelationalDataAdapter } from '../../packages/relational/adapter/relational-data-adapter';
import { Client } from '../../packages/relational/client/client';
import { TransactionClient } from '../../packages/relational/client/transaction-client';
import { RelationalClient } from '../../packages/relational/client/relational-client';
import { isKind } from '../../packages/common/utils/is-kind';

class SqliteMemoryTestContext implements DataAdapterTestContext, ClientTestContext {
  client: TransactionClient<any>;

  constructor(public adapter: RelationalTransactionAdapter<any>) {
    this.client = new RelationalTransactionClient(adapter);
  }

  async close(): Promise<void> {
    await this.adapter.close();
    await this.client.close();
  }
}

class SqliteMemoryTestFactory
  implements DataAdapterTestFactory, ClientTestFactory, TransactionAdapterTestFactory, TransactionClientTestFactory {
  async adapterContext(): Promise<TransactionAdapterTestContext> {
    return new SqliteMemoryTestContext(sqliteAdapter.getRelationalAdapter({ memory: true }));
  }

  async clientContext(): Promise<TransactionClientTestContext> {
    return new SqliteMemoryTestContext(sqliteAdapter.getRelationalAdapter({ memory: true }));
  }

  toString() {
    return 'sqlite-memory';
  }
}

class SqliteFileTestContext implements DataAdapterTestContext, ClientTestContext {
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

class SqliteFileTestFactory
  implements DataAdapterTestFactory, ClientTestFactory, TransactionAdapterTestFactory, TransactionClientTestFactory {
  name = 'sqlite-adapter-file';

  async getContext(): Promise<TransactionClientTestContext> {
    const fileName = `./dist/tmp/${randomString()}.db`;
    const dirName = path.dirname(fileName);
    try {
      await fs.access(dirName);
    } catch (e) {
      await fs.mkdir(dirName);
    }
    return new SqliteFileTestContext(fileName, sqliteAdapter.getRelationalAdapter({ file: `sqlite://${fileName}` }));
  }

  toString() {
    return 'sqlite-file';
  }

  clientContext(): Promise<TransactionClientTestContext> {
    return this.getContext();
  }

  adapterContext(): Promise<TransactionAdapterTestContext> {
    return this.getContext();
  }
}

class HttpTestContext implements DataAdapterTestContext, ClientTestContext {
  adapter: RelationalTransactionAdapter<any>;
  client: TransactionClient<any>;

  constructor(
    private baseContext: ClientTestContext | DataAdapterTestContext,
    private port: number,
    private server: Server,
  ) {
    this.adapter = httpAdapter.getRelationalAdapter({
      baseUrl: `http://localhost:${this.port}`,
      authProvider: null,
    });
    this.client = new RelationalTransactionClient(this.adapter);
  }

  async close(): Promise<void> {
    await this.baseContext.close();
    const defer = new Defer<void>();
    this.server.close((err) => {
      if (err) {
        defer.reject(err);
      } else {
        defer.resolve();
      }
    });
    await defer.promise;
    await this.adapter.close();
    await this.client.close();
  }
}

class HttpTestFactory
  implements DataAdapterTestFactory, ClientTestFactory, TransactionAdapterTestFactory, TransactionClientTestFactory {
  constructor(private baseTestFactory: DataAdapterTestFactory & ClientTestFactory) {}

  async getContext(
    baseContext:
      | ClientTestContext
      | DataAdapterTestContext
      | TransactionClientTestContext
      | TransactionAdapterTestContext,
  ) {
    const port = await getFreeTestPort();
    const app = createHttpServerApp(
      isClientTestContext(baseContext) ? baseContext.client : new RelationalClient(baseContext.adapter),
      {
        authorization: false,
        rules: [allow(anonymous(), anything())],
        cors: true,
        transactionTimeout: 2000,
      },
    );
    const defer = new Defer<void>();
    const server = app.listen(port, () => {
      defer.resolve();
    });
    await defer.promise;
    return new HttpTestContext(baseContext, port, server);
  }

  async adapterContext(): Promise<TransactionAdapterTestContext> {
    return this.getContext(await this.baseTestFactory.adapterContext());
  }

  async clientContext(): Promise<TransactionClientTestContext> {
    return this.getContext(await this.baseTestFactory.clientContext());
  }

  toString() {
    return 'http-' + this.baseTestFactory.toString();
  }
}

class PostgresTestContext implements DataAdapterTestContext, ClientTestContext {
  adapter: RelationalTransactionAdapter;
  client: TransactionClient<any>;

  constructor(private db: PostgresDb) {
    this.adapter = postgresAdapter.getRelationalAdapter({
      connectionString: db.connectionString,
      //createIfNotExists: true,
    });
    this.client = new RelationalTransactionClient(this.adapter);
  }

  async close() {
    await this.adapter?.close();
    await this.db.close();
  }
}

class PostgresTestFactory
  implements DataAdapterTestFactory, ClientTestFactory, TransactionAdapterTestFactory, TransactionClientTestFactory {
  async adapterContext(): Promise<TransactionAdapterTestContext> {
    const db = await getPostgresDb();
    return new PostgresTestContext(db);
  }

  async clientContext(): Promise<TransactionClientTestContext> {
    const db = await getPostgresDb();
    return new PostgresTestContext(db);
  }

  toString() {
    return 'postgres';
  }
}

export interface TransactionAdapterTestContext {
  adapter: RelationalTransactionAdapter<any>;
  close(): Promise<void>;
}

export interface DataAdapterTestContext {
  adapter: RelationalDataAdapter<any>;
  close(): Promise<void>;
}

export interface TransactionAdapterTestFactory {
  adapterContext(): Promise<TransactionAdapterTestContext>;
}

export interface DataAdapterTestFactory {
  adapterContext(): Promise<DataAdapterTestContext>;
}

export interface ClientTestContext {
  client: Client<any>;
  adapter: RelationalDataAdapter<any>;
  close(): Promise<void>;
}
export interface TransactionClientTestContext {
  client: TransactionClient<any>;
  adapter: RelationalTransactionAdapter<any>;
  close(): Promise<void>;
}

export const isClientTestContext = (val: ClientTestContext | DataAdapterTestContext): val is ClientTestContext =>
  isKind(val, ['client', 'adapter']);

export interface ClientTestFactory {
  clientContext(): Promise<ClientTestContext>;
}
export interface TransactionClientTestFactory {
  clientContext(): Promise<TransactionClientTestContext>;
}

const postgresFactory = new PostgresTestFactory();
const sqliteMemoryFactory = new SqliteMemoryTestFactory();
const sqliteFileFactory = new SqliteFileTestFactory();
const httpSqliteFactory = new HttpTestFactory(new SqliteMemoryTestFactory());

export const dataAdapters: DataAdapterTestFactory[] = [
  postgresFactory,
  sqliteMemoryFactory,
  sqliteFileFactory,
  httpSqliteFactory,
];
export const transactionAdapters: TransactionAdapterTestFactory[] = [
  postgresFactory,
  sqliteMemoryFactory,
  sqliteFileFactory,
  httpSqliteFactory,
];
export const dataClients: ClientTestFactory[] = [
  postgresFactory,
  sqliteMemoryFactory,
  sqliteFileFactory,
  httpSqliteFactory,
];
export const transactionClients: TransactionClientTestFactory[] = [
  postgresFactory,
  sqliteMemoryFactory,
  sqliteFileFactory,
  httpSqliteFactory,
];
export const removeTransactionClients: TransactionClientTestFactory[] = [httpSqliteFactory];
