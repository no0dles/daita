import { RelationalAdapter, sum, table } from '@daita/relational';
import { Mountain } from '../../../../models/mountain';
import { cleanupTestContext, getMowntainTestContext, seedMowntainData } from '../../../../testing';
import { RelationalOrmAdapter } from '@daita/orm';

describe('relational/sql/function/aggregation/sum', () => {
  let ctx: RelationalOrmAdapter & RelationalAdapter<any>;

  beforeAll(async () => {
    ctx = await seedMowntainData();
  });

  afterAll(async () => ctx.close());

  it('should get sum', async () => {
    const result = await ctx.selectFirst({
      select: sum(Mountain, 'prominence'),
      from: table(Mountain),
    });
    expect(result).toEqual(1737.501);
  });
});
