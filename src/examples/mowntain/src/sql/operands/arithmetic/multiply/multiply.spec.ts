import { field, multiply, RelationalAdapter, table } from '@daita/relational';
import { Mountain } from '../../../../models/mountain';
import { cleanupTestContext, getMowntainTestContext, seedMowntainData } from '../../../../testing';
import { RelationalOrmAdapter } from '@daita/orm';

describe('relational/sql/operands/multiply', () => {
  let ctx: RelationalOrmAdapter & RelationalAdapter<any>;

  beforeAll(async () => {
    ctx = await seedMowntainData();
  });

  afterAll(async () => ctx.close());

  it('should multiply value and field', async () => {
    const result = await ctx.selectFirst({
      select: multiply(field(Mountain, 'prominence'), 5),
      from: table(Mountain),
    });
    expect(result).toEqual(5212.505);
  });
});
