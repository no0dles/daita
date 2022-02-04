import { max, RelationalAdapter, table } from '@daita/relational';
import { Mountain } from '../../../../models/mountain';
import { seedMowntainData } from '../../../../testing';
import { RelationalOrmAdapter } from '@daita/orm';

describe('relational/sql/function/aggregation/max', () => {
  let ctx: RelationalOrmAdapter & RelationalAdapter<any>;

  beforeAll(async () => {
    ctx = await seedMowntainData();
  });

  afterAll(async () => ctx.close());

  it('should get max', async () => {
    const result = await ctx.selectFirst({
      select: max(Mountain, 'prominence'),
      from: table(Mountain),
    });
    expect(result).toEqual(1042.501);
  });
});
