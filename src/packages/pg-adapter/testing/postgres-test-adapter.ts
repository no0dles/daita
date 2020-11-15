import { sleep } from '../../common';
import { RelationalTransactionAdapterImplementation } from '../../relational/adapter/relational-adapter-implementation';
import { RelationalMigrationAdapterImplementation } from '../../orm/adapter/relational-migration-adapter-implementation';
import { PostgresSql } from '../sql/postgres-sql';
import { RelationalMigrationAdapter } from '../../orm/adapter/relational-migration-adapter';
import { postgresFormatter } from '../formatters/postgres-formatter';
import { PostgresMigrationAdapter } from '../adapter/postgres-migration-adapter';
import { Pool } from 'pg';
import { getRandomTestPort } from '../../node/random-port';
import { execCommand, runContainer } from '../../node/docker';

export interface PostgresDb {
  connectionString: string;
  close(): Promise<void>;
}

export interface PostgresTestAdapterOptions {
  listenForNotifications?: boolean;
}

class PostgresTestAdapterImplementation
  implements
    RelationalTransactionAdapterImplementation<PostgresSql, PostgresTestAdapterOptions>,
    RelationalMigrationAdapterImplementation<PostgresSql, PostgresTestAdapterOptions> {
  getRelationalAdapter(options: PostgresTestAdapterOptions): RelationalMigrationAdapter<PostgresSql> {
    const prepare = (async () => {
      const db = await getPostgresDb();
      return new Pool({
        connectionString: db.connectionString,
        connectionTimeoutMillis: 10000,
        keepAlive: true,
        max: 20,
        idleTimeoutMillis: 10000,
      });
    })();
    return new PostgresMigrationAdapter(prepare, { listenForNotifications: options.listenForNotifications || false });
  }

  supportsQuery<S>(
    sql: S,
  ): this is RelationalMigrationAdapterImplementation<PostgresSql | S, PostgresTestAdapterOptions> {
    return postgresFormatter.canHandle(sql);
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

  let isReady = await execCommand(container, ['pg_isready']);
  while (isReady.indexOf('accepting connections') === -1) {
    await sleep(500);
    isReady = await execCommand(container, ['pg_isready']);
  }
  //TODO figure out why connect does not work after pg_isready
  await sleep(200);

  const db: PostgresDb = {
    connectionString: `postgres://postgres:postgres@localhost:${newPort}/postgres`,
    close: async () => {
      await container.stop();
      await container.remove();
    },
  };
  return db;
}
