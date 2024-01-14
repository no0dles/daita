import { seedMowntainData } from '../../../testing';
import { alias, field, max, RelationalAdapter, subSelect, table } from '@daita/relational';
import { Mountain } from '../../../models/mountain';
import { RelationalOrmAdapter } from '@daita/orm';

describe('relational/sql/dml/select/subquery', () => {
  let ctx: RelationalOrmAdapter & RelationalAdapter<any>;

  beforeAll(async () => {
    ctx = await seedMowntainData();
  });

  afterAll(async () => ctx.close());

  it('should allow max with alias', async () => {
    const mountains = await ctx.select({
      select: {
        prominence: field(Mountain, 'prominence'),
        otherHighestProminence: subSelect({
          select: max(alias(Mountain, 'other'), 'prominence'),
          from: alias(Mountain, 'other'),
        }),
      },
      from: table(Mountain),
      orderBy: field(Mountain, 'prominence'),
    });
    expect(mountains).toEqual([
      {
        otherHighestProminence: 1042.501,
        prominence: 695,
      },
      {
        otherHighestProminence: 1042.501,
        prominence: 1042.501,
      },
    ]);
  });
});
