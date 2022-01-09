import { RelationalTransactionAdapterImplementation } from '@daita/relational';
import { RelationalMigrationAdapterImplementation } from '@daita/orm';
import { RelationalMigrationAdapter } from '@daita/orm';
import {
  execCommand,
  getDynamicPort,
  getFreeTestPort,
  removeContainer,
  runContainer,
  startContainer,
  stopContainer,
} from '@daita/node';
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
  const freePort = await getFreeTestPort();
  const container = await runContainer({
    image: 'postgres:12',
    env: ['POSTGRES_PASSWORD=postgres'],
    labels: {
      'ch.daita.source': 'test',
    },
    portBinding: { 5432: freePort },
  });

  //const newPort = await getDynamicPort(container, 5432);
  let stopped = false;

  async function awaitForReady() {
    let isReady = await execCommand(container.id, ['pg_isready']);
    while (isReady.indexOf('accepting connections') === -1 && !stopped) {
      await sleep(500);
      isReady = await execCommand(container.id, ['pg_isready']);
    }
    //TODO figure out why connect does not work after pg_isready
    await sleep(1000);
  }

  await awaitForReady();

  const db: PostgresDb = {
    connectionString: `postgres://postgres:postgres@localhost:${freePort}/postgres`,
    close: async () => {
      stopped = true;
      await removeContainer(container.id, { force: true });
    },
    stop: async () => {
      stopped = true;
      await stopContainer(container.id, {});
    },
    start: async () => {
      stopped = false;
      await startContainer(container.id);
      await awaitForReady();
    },
  };
  return db;
}

export const postgresTestAdapter = new PostgresTestAdapterImplementation();
