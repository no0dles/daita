import { getRandomTestPort } from '../../node/random-port';
import { execCommand, runContainer } from '../../node/docker';
import { sleep } from '../../common/utils/sleep';
import { RelationalMigrationAdapterImplementation } from '../../orm/adapter/relational-migration-adapter-implementation';
import { MariadbSql } from '../sql/mariadb-sql';
import { adapter } from '..';
import { RelationalMigrationAdapter } from '../../orm/adapter/relational-migration-adapter';
import { MariadbRelationalMigrationAdapter } from '../adapter/mariadb-relational-adapter';
import { createPool } from 'mariadb';
import { Resolvable } from '../../common/utils/resolvable';

export interface MariaDb {
  connectionString: string;
  close(): Promise<void>;
  stop(): Promise<void>;
  start(): Promise<void>;
}

export async function getMariaDb(): Promise<MariaDb> {
  const newPort = getRandomTestPort();

  const container = await runContainer({
    image: 'mariadb:10',
    env: ['MYSQL_ROOT_PASSWORD=mariadb', 'MYSQL_DATABASE=test'],
    labels: {
      'ch.daita.source': 'test',
    },
    portBinding: { 3306: newPort },
  });

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

class MariadbTestAdapterImplementation implements RelationalMigrationAdapterImplementation<MariadbSql, {}> {
  getRelationalAdapter(options: {}): RelationalMigrationAdapter<MariadbSql> {
    const dbResolvable = new Resolvable<MariaDb>(getMariaDb, (db) => {
      db?.close();
    });
    return new MariadbRelationalMigrationAdapter(
      new Resolvable(
        async () => {
          const db = await dbResolvable.get();
          return createPool(db.connectionString);
        },
        async (pool) => {
          await pool?.end();
          await dbResolvable.close();
        },
      ),
    );
  }

  supportsQuery<S>(sql: S): this is RelationalMigrationAdapterImplementation<MariadbSql | S, {}> {
    return adapter.supportsQuery(sql);
  }
}

export const testAdapter = new MariadbTestAdapterImplementation();
