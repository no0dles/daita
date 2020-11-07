import { PostgresAdapter } from './postgres.adapter';
import { getPostgresDb, PostgresDb } from '../../../testing/postgres-test';

describe('postgres-adapter', () => {
  let adapter: PostgresAdapter;
  let db: PostgresDb;

  beforeAll(async () => {
    db = await getPostgresDb();
    adapter = new PostgresAdapter(db.connectionString, { listenForNotifications: false });
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

  //relationalTest({ factory: pg, connectionString: 'postgres://postgres:postgres@localhost/postgres' });
});
