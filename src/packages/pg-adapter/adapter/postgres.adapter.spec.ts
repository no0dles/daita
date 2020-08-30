import { PostgresAdapter } from './postgres.adapter';
import * as pg from '../index';

describe('postgres-adapter', () => {
  let adapter: PostgresAdapter;
  beforeAll(() => {
    adapter = new PostgresAdapter(
      'postgres://postgres:postgres@localhost/postgres',
    );
  });

  it('should select 1', async () => {
    const result = await adapter.exec({ select: 1 });
    expect(result.rows).toEqual([{ '?column?': '1' }]);
  });

  afterAll(() => {
    if (adapter) {
      adapter.close();
    }
  });

  //relationalTest({ factory: pg, connectionString: 'postgres://postgres:postgres@localhost/postgres' });
});
