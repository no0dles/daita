import { field, floor, RelationalAdapter, table } from '@daita/relational';
import { Mountain } from '../../../../models/mountain';
import { seedMowntainData } from '../../../../testing';
import { RelationalOrmAdapter } from '@daita/orm';

describe('relational/sql/function/number/floor', () => {
  let ctx: RelationalOrmAdapter & RelationalAdapter<any>;

  beforeAll(async () => {
    ctx = await seedMowntainData();
  });

  afterAll(async () => ctx.close());

  it('should get from field and value', async () => {
    const result = await ctx.selectFirst({
      select: floor(field(Mountain, 'prominence')),
      from: table(Mountain),
    });
    expect(result).toEqual(1042);
  });

  it('should get null and value', async () => {
    const result = await ctx.selectFirst({
      select: floor(field(Mountain, 'ascents')),
      from: table(Mountain),
    });
    expect(result).toEqual(null);
  });
});
