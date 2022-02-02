import { ceil, field, RelationalAdapter, table } from '@daita/relational';
import { Mountain } from '../../../../models/mountain';
import { cleanupTestContext, getMowntainTestContext, seedMowntainData } from '../../../../testing';
import { RelationalOrmAdapter } from '@daita/orm';

describe('relational/sql/function/number/least', () => {
  let ctx: RelationalOrmAdapter & RelationalAdapter<any>;

  beforeAll(async () => {
    ctx = await seedMowntainData();
  });

  afterAll(async () => ctx.close());

  it('should get from field and value', async () => {
    const result = await ctx.selectFirst({
      select: ceil(field(Mountain, 'prominence')),
      from: table(Mountain),
    });
    expect(result).toEqual(1043);
  });

  it('should get null if value is null', async () => {
    const result = await ctx.selectFirst({
      select: ceil(field(Mountain, 'ascents')),
      from: table(Mountain),
    });
    expect(result).toEqual(null);
  });
});
