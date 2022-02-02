import { avg, RelationalAdapter, table } from '@daita/relational';
import { Mountain } from '../../../../models/mountain';
import { cleanupTestContext, getMowntainTestContext, seedMowntainData } from '../../../../testing';
import { RelationalOrmAdapter } from '@daita/orm';

describe('relational/sql/function/aggregation/avg', () => {
  let ctx: RelationalOrmAdapter & RelationalAdapter<any>;

  beforeAll(async () => {
    ctx = await seedMowntainData();
  });

  afterAll(async () => ctx.close());

  it('should avg date', async () => {
    const result = await ctx.selectFirst({
      select: avg(Mountain, 'prominence'),
      from: table(Mountain),
    });
    expect(result).toEqual(868.7505);
  });
});
