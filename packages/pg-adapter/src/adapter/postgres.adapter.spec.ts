import { PostgresAdapter } from './postgres.adapter';

describe('postgres-adapter', () => {
  it('should select 1', async () => {
    const adapter = new PostgresAdapter('postgres://postgres:postgres@localhost/postgres');
    const result = await adapter.exec({ select: 1 });
    expect(result.rows).toEqual([{ '?column?': 1 }]);
  });
});
