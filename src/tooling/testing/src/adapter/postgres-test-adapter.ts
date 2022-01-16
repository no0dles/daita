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
import { PostgresMigrationAdapter } from '@daita/pg-adapter';

export interface PostgresDb {
  connectionString: string;

  close(): Promise<void>;

  stop(): Promise<void>;

  start(): Promise<void>;
}

export async function getPostgresTestAdapter(): Promise<PostgresMigrationAdapter> {
  const db = await getPostgresDb();
  return new PostgresMigrationAdapter({
    connectionString: db.connectionString,
    listenForNotifications: false,
    cleanup: () => db.close(),
  });
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
