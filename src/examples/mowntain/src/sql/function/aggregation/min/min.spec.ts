import { min, RelationalAdapter, table } from '@daita/relational';
import { Mountain } from '../../../../models/mountain';
import { cleanupTestContext, getMowntainTestContext, seedMowntainData } from '../../../../testing';
import { RelationalOrmAdapter } from '@daita/orm';

describe('relational/sql/function/aggregation/min', () => {
  let ctx: RelationalOrmAdapter & RelationalAdapter<any>;

  beforeAll(async () => {
    ctx = await seedMowntainData();
  });

  afterAll(async () => ctx.close());

  it('should get min', async () => {
    const result = await ctx.selectFirst({
      select: min(Mountain, 'prominence'),
      from: table(Mountain),
    });
    expect(result).toEqual(695);
  });
});
