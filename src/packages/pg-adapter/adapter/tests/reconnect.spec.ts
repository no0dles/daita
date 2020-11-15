import { PostgresAdapter } from '../postgres.adapter';
import { getPostgresDb } from '../../testing/postgres-test-adapter';
import { RelationalDataAdapter } from '../../../relational';
import { ConnectionError } from '../../../relational/error/connection-error';

describe('pg-adapter/adapter/postgres-adapter/reconnect', () => {
  it('should handle disconnect after initial connection', async () => {
    const db = await getPostgresDb();
    const adapter = new PostgresAdapter(db.connectionString, { listenForNotifications: false });
    try {
      await testConnection(adapter);
      await db.stop();
      try {
        await testConnection(adapter);
      } catch (e) {
        expect(e).toBeInstanceOf(ConnectionError);
      }
      await db.start();
      await testConnection(adapter);
    } finally {
      await adapter.close();
      await db.close();
    }
  });

  it('should handle disconnect before initial connection', async () => {
    const db = await getPostgresDb();
    await db.stop();

    const adapter = new PostgresAdapter(db.connectionString, { listenForNotifications: false });
    try {
      try {
        await testConnection(adapter);
      } catch (e) {
        expect(e).toBeInstanceOf(ConnectionError);
      }
      await db.start();
      await testConnection(adapter);
    } finally {
      await adapter.close();
      await db.close();
    }
  });

  async function testConnection(adapter: RelationalDataAdapter) {
    const result = await adapter.exec({ select: 1 });
    expect(result.rowCount).toEqual(1);
  }
});
