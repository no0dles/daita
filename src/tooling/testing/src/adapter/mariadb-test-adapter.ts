import { execCommand, getDynamicPort, removeContainer, runContainer, startContainer, stopContainer } from '@daita/node';
import { sleep } from '@daita/common';

export interface MariaDb {
  connectionString: string;
  close(): Promise<void>;
  stop(): Promise<void>;
  start(): Promise<void>;
}

export async function getMariaDb(): Promise<MariaDb> {
  const container = await runContainer({
    image: 'mariadb:10',
    env: ['MYSQL_ROOT_PASSWORD=mariadb', 'MYSQL_DATABASE=test'],
    labels: {
      'ch.daita.source': 'test',
    },
    portBinding: { 3306: 0 },
  });

  const newPort = await getDynamicPort(container, 3306);
  let stopped = false;

  async function awaitForReady() {
    const cmd = ['mysqladmin', 'ping', '--password=mariadb'];
    let isReady = await execCommand(container.id, cmd);
    while (isReady.indexOf('mysqld is alive') === -1 && !stopped) {
      await sleep(500);
      isReady = await execCommand(container.id, cmd);
    }
    await sleep(200);
  }

  await awaitForReady();

  const db: MariaDb = {
    connectionString: `mariadb://root:mariadb@localhost:${newPort}/test`,
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
