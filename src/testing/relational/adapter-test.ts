import { RelationalTransactionAdapter } from '../../packages/relational/adapter/relational-transaction-adapter';
import { adapter as postgresAdapter } from '../../packages/pg-adapter';
import { adapter as sqliteAdapter } from '../../packages/sqlite-adapter';
import { adapter as httpAdapter } from '../../packages/http-adapter';
import { getPostgresDb, getRandomTestPort, PostgresDb } from '../postgres-test';
import { createHttpServerApp } from '../../packages/http-server/app';
import { Express } from 'express';
import { RelationalTransactionClient } from '../../packages/relational/client/relational-transaction-client';
import { Defer } from '../../packages/common/utils/defer';
import { Server } from 'http';
import { allow } from '../../packages/relational/permission/function/allow';
import { anonymous } from '../../packages/relational/permission/function/anonymous';
import { anything } from '../../packages/relational/permission/function/anything';

export interface AdapterTest {
  adapter: RelationalTransactionAdapter;
  name: string;
  afterAll(): Promise<void> | void;
  beforeAll(): Promise<void> | void;
}

class SqliteAdapterTest implements AdapterTest {
  adapter!: RelationalTransactionAdapter;
  name = 'sqlite-adapter';

  async afterAll(): Promise<void> {
    await this.adapter.close();
  }

  async beforeAll(): Promise<void> {
    this.adapter = sqliteAdapter.getRelationalAdapter({ memory: true });
  }
}

class HttpAdapterTest implements AdapterTest {
  adapter!: RelationalTransactionAdapter;
  private app!: Express;
  private server!: Server;
  private newPort: number;

  constructor(public name: string, private adapterTest: AdapterTest) {
    this.newPort = getRandomTestPort();
    this.adapter = httpAdapter.getRelationalAdapter({
      baseUrl: `http://localhost:${this.newPort}`,
      authProvider: null,
    });
  }

  async afterAll(): Promise<void> {
    await this.adapterTest.afterAll();
    const defer = new Defer<void>();
    this.server.close((err) => {
      if (err) {
        defer.reject(err);
      } else {
        defer.resolve();
      }
    });
    await defer.promise;
  }

  async beforeAll(): Promise<void> {
    await this.adapterTest.beforeAll();
    this.app = createHttpServerApp(new RelationalTransactionClient(this.adapterTest.adapter), {
      authorization: false,
      rules: [allow(anonymous(), anything())],
      cors: true,
    });
    const defer = new Defer<void>();
    this.server = this.app.listen(this.newPort, () => {
      defer.resolve();
    });
    await defer.promise;
  }
}

class PostgresAdapterTest implements AdapterTest {
  db: PostgresDb;
  public adapter!: RelationalTransactionAdapter;
  name = 'pg-adapter';

  constructor() {
    this.db = getPostgresDb();
  }

  async beforeAll() {
    await this.db.start();
    this.adapter = postgresAdapter.getRelationalAdapter({
      connectionString: this.db.connectionString,
      createIfNotExists: true,
    });
  }

  async afterAll() {
    await this.adapter.close();
    await this.db.close();
  }
}

const adapters: AdapterTest[] = [
  new PostgresAdapterTest(),
  new SqliteAdapterTest(),
  new HttpAdapterTest('http-adapter-sqlite', new SqliteAdapterTest()),
  new HttpAdapterTest('http-adapter-postgres', new PostgresAdapterTest()),
];

export function adapterTest(fn: (adapterFn: () => RelationalTransactionAdapter) => void) {
  return () => {
    for (const adapter of adapters) {
      describe(adapter.name, () => {
        beforeAll(async () => {
          await adapter.beforeAll();
        });

        fn(() => adapter.adapter);

        afterAll(async () => {
          await adapter.afterAll();
        });
      });
    }
  };
}
