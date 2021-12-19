import { RelationalTransactionAdapterImplementation } from '@daita/relational';
import { RelationalMigrationAdapterImplementation } from '@daita/orm';
import { RelationalMigrationAdapter } from '@daita/orm';
import { execCommand, getDynamicPort, runContainer } from '@daita/node';
import { sleep } from '@daita/common';
import { Resolvable } from '@daita/common';
import { PostgresMigrationAdapter, PostgresSql } from '@daita/pg-adapter';

export interface PostgresDb {
  connectionString: string;
  close(): Promise<void>;
  stop(): Promise<void>;
  start(): Promise<void>;
}

export interface PostgresTestAdapterOptions {}

class PostgresTestAdapterImplementation
  implements
    RelationalTransactionAdapterImplementation<PostgresSql, PostgresTestAdapterOptions>,
    RelationalMigrationAdapterImplementation<PostgresSql, PostgresTestAdapterOptions>
{
  getRelationalAdapter(
    options: PostgresTestAdapterOptions,
  ): RelationalMigrationAdapter<PostgresSql> & PostgresMigrationAdapter {
    const dbResolvable = new Resolvable(getPostgresDb, (db) => db?.close());
    const poolResolvable = new Resolvable(
      async () => {
        const db = await dbResolvable.get();
        return db.connectionString;
      },
      async () => {
        await dbResolvable.close();
      },
    );
    return new PostgresMigrationAdapter(poolResolvable);
  }
}

export async function getPostgresDb(): Promise<PostgresDb> {
  const container = await runContainer({
    image: 'postgres:12',
    env: ['POSTGRES_PASSWORD=postgres'],
    labels: {
      'ch.daita.source': 'test',
    },
    portBinding: { 5432: 0 },
  });

  const newPort = await getDynamicPort(container, 5432);

  async function awaitForReady() {
    let isReady = await execCommand(container, ['pg_isready']);
    while (isReady.indexOf('accepting connections') === -1) {
      await sleep(500);
      isReady = await execCommand(container, ['pg_isready']);
    }
    //TODO figure out why connect does not work after pg_isready
    await sleep(1000);
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

export const postgresTestAdapter = new PostgresTestAdapterImplementation();
