import { execCommand, getDynamicPort, runContainer } from '@daita/node';
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
  async function awaitForReady() {
    const cmd = ['mysqladmin', 'ping', '--password=mariadb'];
    let isReady = await execCommand(container, cmd);
    while (isReady.indexOf('mysqld is alive') === -1) {
      await sleep(500);
      isReady = await execCommand(container, cmd);
    }
    await sleep(200);
  }

  await awaitForReady();

  const db: MariaDb = {
    connectionString: `mariadb://root:mariadb@localhost:${newPort}/test`,
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
