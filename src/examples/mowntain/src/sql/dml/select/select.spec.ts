import { Mountain } from '../../../models/mountain';
import { field, table } from '@daita/relational';
import { schema } from '../../../schema';
import { getContext } from '@daita/orm';
import { adapter as sqliteAdapter } from '@daita/sqlite-adapter';

describe('docs/example/sql/dml/select', () => {
  const ctx = getContext(sqliteAdapter, { schema, memory: true });

  beforeAll(async () => ctx.migrate());
  afterAll(async () => ctx.close());

  it('should select Mountain.name, Mountain.prominence from Mountain', async () => {
    await ctx.select({
      select: {
        name: field(Mountain, 'name'),
        prominence: field(Mountain, 'prominence'),
      },
      from: table(Mountain),
    });
  });
});
