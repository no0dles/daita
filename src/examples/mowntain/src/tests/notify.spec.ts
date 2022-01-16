import { getPostgresDb } from '@daita/testing';
import { sleep } from '@daita/common';
import { adapter, PostgresMigrationAdapter } from '@daita/pg-adapter';

describe('pg-adapter/adapter/postgres-adapter/notify', () => {
  it('should listen on notify connection', async () => {
    const db = await getPostgresDb();
    const postgresAdapter = adapter.getRelationalAdapter({
      listenForNotifications: true,
      connectionString: db.connectionString,
    }) as PostgresMigrationAdapter;
    try {
      await new Promise<void>((resolve) => {
        resolve(
          (async () => {
            await postgresAdapter.addNotificationListener('test1', (msg) => {
              resolve();
            });
            await sleep(1000);
            await postgresAdapter.exec({
              notify: 'test1',
            });
          })(),
        );
      });
    } finally {
      await postgresAdapter.close();
      await db.close();
    }
  });

  it('should reconnect notify connection', async () => {
    const db = await getPostgresDb();
    const postgresAdapter = adapter.getRelationalAdapter({
      listenForNotifications: true,
      connectionString: db.connectionString,
    }) as PostgresMigrationAdapter;

    try {
      await new Promise<void>((resolve) => {
        resolve(
          (async () => {
            await postgresAdapter.addNotificationListener('test2', (msg) => {
              resolve();
            });
            await db.stop();
            await sleep(4000);
            await db.start();
            await postgresAdapter.exec({
              notify: 'test2',
            });
          })(),
        );
      });
    } finally {
      await postgresAdapter.close();
      await db.close();
    }
  }, 25000);
});
