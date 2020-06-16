import { PostgresAdapter } from './postgres.adapter';

describe('postgres-adapter', () => {
  let adapter: PostgresAdapter;
  beforeAll(() => {
    adapter = new PostgresAdapter('postgres://postgres:postgres@localhost/postgres');
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
});
