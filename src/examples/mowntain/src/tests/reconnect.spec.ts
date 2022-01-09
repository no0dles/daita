import { PostgresTransactionAdapter } from '@daita/pg-adapter';
import { getPostgresDb } from '@daita/testing';
import { ConnectionError } from '@daita/relational';
import { RelationalDataAdapter } from '@daita/relational';
import { Resolvable } from '@daita/common';

describe('pg-adapter/adapter/postgres-adapter/reconnect', () => {
  it('should handle disconnect after initial connection', async () => {
    const db = await getPostgresDb();
    const adapter = new PostgresTransactionAdapter(new Resolvable<string>(db.connectionString));
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
      console.log('recovered');
    } catch (e) {
      console.log(e);
      throw e;
    } finally {
      await adapter.close();
      await db.close();
    }
  }, 25000);

  it('should handle disconnect before initial connection', async () => {
    const db = await getPostgresDb();
    await db.stop();

    const adapter = new PostgresTransactionAdapter(new Resolvable<string>(db.connectionString));
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