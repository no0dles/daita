import { count, field, greaterThan, RelationalAdapter, table } from '@daita/relational';
import { Mountain } from '../../../../models/mountain';
import { seedMowntainData } from '../../../../testing';
import { RelationalOrmAdapter } from '@daita/orm';

describe('relational/sql/function/aggregation/count', () => {
  let ctx: RelationalOrmAdapter & RelationalAdapter<any>;

  beforeAll(async () => {
    ctx = await seedMowntainData();
  });

  afterAll(async () => ctx.close());

  it('should count', async () => {
    const result = await ctx.selectFirst({
      select: count(),
      from: table(Mountain),
    });
    expect(result).toEqual(2);
  });

  it('should count with filter', async () => {
    const result = await ctx.selectFirst({
      select: count(),
      from: table(Mountain),
      where: greaterThan(field(Mountain, 'prominence'), 10),
    });
    expect(result).toEqual(2);
  });
});
