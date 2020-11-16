import { PostgresAdapter } from '../postgres.adapter';
import { getPostgresDb } from '../../testing/postgres-test-adapter';
import { sleep } from '../../../common/utils/sleep';
import { Defer } from '../../../common/utils/defer';

describe('pg-adapter/adapter/postgres-adapter/notify', () => {
  it('should listen on notify connection', async () => {
    const db = await getPostgresDb();
    const adapter = new PostgresAdapter(db.connectionString, { listenForNotifications: true });
    try {
      const listenerDefer = new Defer<void>();
      await adapter.addNotificationListener('test1', (msg) => {
        listenerDefer.resolve();
      });
      await sleep(1000);
      await adapter.exec({
        notify: 'test1',
      });
      await listenerDefer.promise;
    } finally {
      await adapter.close();
      await db.close();
    }
  });

  it('should reconnect notify connection', async () => {
    const db = await getPostgresDb();
    const adapter = new PostgresAdapter(db.connectionString, { listenForNotifications: true });
    try {
      const listenerDefer = new Defer<void>();
      await adapter.addNotificationListener('test2', (msg) => {
        listenerDefer.resolve();
      });
      await db.stop();
      await db.start();
      await sleep(2000);
      await adapter.exec({
        notify: 'test2',
      });
      await listenerDefer.promise;
    } finally {
      await adapter.close();
      await db.close();
    }
  });
});
