import { RelationalTransactionAdapterImplementation } from '../../relational/adapter/relational-adapter-implementation';
import { RelationalMigrationAdapterImplementation } from '../../orm/adapter/relational-migration-adapter-implementation';
import { PostgresSql } from '../sql/postgres-sql';
import { RelationalMigrationAdapter } from '../../orm/adapter/relational-migration-adapter';
import { PostgresMigrationAdapter } from '../adapter/postgres-migration-adapter';
import { Pool } from 'pg';
import { getRandomTestPort } from '../../node/random-port';
import { execCommand, runContainer } from '../../node/docker';
import { sleep } from '../../common/utils/sleep';
import { adapter } from '..';
import { Resolvable } from '../../common/utils/resolvable';

export interface PostgresDb {
  connectionString: string;
  close(): Promise<void>;
  stop(): Promise<void>;
  start(): Promise<void>;
}

export interface PostgresTestAdapterOptions {
  listenForNotifications?: boolean;
}

class PostgresTestAdapterImplementation
  implements
    RelationalTransactionAdapterImplementation<PostgresSql, PostgresTestAdapterOptions>,
    RelationalMigrationAdapterImplementation<PostgresSql, PostgresTestAdapterOptions> {
  getRelationalAdapter(
    options: PostgresTestAdapterOptions,
  ): RelationalMigrationAdapter<PostgresSql> & PostgresMigrationAdapter {
    const dbResolvable = new Resolvable(getPostgresDb, (db) => db?.close());
    const poolResolvable = new Resolvable(
      async () => {
        const db = await dbResolvable.get();
        return new Pool({
          connectionString: db.connectionString,
          connectionTimeoutMillis: 10000,
          keepAlive: true,
          max: 20,
          idleTimeoutMillis: 10000,
        });
      },
      async (pool) => {
        pool?.end();
        await dbResolvable.close();
      },
    );
    return new PostgresMigrationAdapter(poolResolvable, {
      listenForNotifications: options.listenForNotifications || false,
    });
  }

  supportsQuery<S>(
    sql: S,
  ): this is RelationalMigrationAdapterImplementation<PostgresSql | S, PostgresTestAdapterOptions> {
    return adapter.supportsQuery(sql);
  }
}

export const testAdapter = new PostgresTestAdapterImplementation();

export async function getPostgresDb(): Promise<PostgresDb> {
  const newPort = getRandomTestPort();

  const container = await runContainer({
    image: 'postgres:12',
    env: ['POSTGRES_PASSWORD=postgres'],
    labels: {
      'ch.daita.source': 'test',
    },
    portBinding: { 5432: newPort },
  });

  async function awaitForReady() {
    let isReady = await execCommand(container, ['pg_isready']);
    while (isReady.indexOf('accepting connections') === -1) {
      await sleep(500);
      isReady = await execCommand(container, ['pg_isready']);
    }
    //TODO figure out why connect does not work after pg_isready
    await sleep(200);
  }

  await awaitForReady();

  const db: PostgresDb = {
    connectionString: `postgres://postgres:postgres@localhost:${newPort}/postgres`,
    close: async () => {
      await container.stop();
      await container.remove();
    },
    stop: async () => {
      await container.stop();
    },
    start: async () => {
      await container.start();
      await awaitForReady();
    },
  };
  return db;
}
