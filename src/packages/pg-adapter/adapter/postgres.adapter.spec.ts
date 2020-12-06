import { PostgresTransactionAdapter } from './postgres-transaction-adapter';
import { getPostgresDb, PostgresDb } from '../testing/postgres-test-adapter';
import { Pool } from 'pg';
import { Resolvable } from '../../common/utils/resolvable';

describe('pg-adapter/adapter/postgres-adapter', () => {
  let adapter: PostgresTransactionAdapter;
  let db: PostgresDb;

  beforeAll(async () => {
    db = await getPostgresDb();
    adapter = new PostgresTransactionAdapter(
      new Resolvable<Pool>(
        new Pool({
          connectionString: db.connectionString,
          connectionTimeoutMillis: 10000,
          keepAlive: true,
          max: 20,
          idleTimeoutMillis: 10000,
        }),
      ),
      { listenForNotifications: false },
    );
  });

  it('should select 1', async () => {
    const result = await adapter.exec({ select: 1 });
    expect(result.rows).toEqual([{ '?column?': '1' }]);
  });

  afterAll(async () => {
    if (adapter) {
      await adapter.close();
    }
    if (db) {
      await db.close();
    }
  });
});
