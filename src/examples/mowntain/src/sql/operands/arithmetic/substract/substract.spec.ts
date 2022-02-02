import { field, RelationalAdapter, subtract, table } from '@daita/relational';
import { Mountain } from '../../../../models/mountain';
import { cleanupTestContext, getMowntainTestContext, seedMowntainData } from '../../../../testing';
import { RelationalOrmAdapter } from '@daita/orm';

describe('relational/sql/operands/subtract', () => {
  let ctx: RelationalOrmAdapter & RelationalAdapter<any>;

  beforeAll(async () => {
    ctx = await seedMowntainData();
  });

  afterAll(async () => ctx.close());

  it('should subtract value', async () => {
    const result = await ctx.selectFirst({
      select: subtract(field(Mountain, 'prominence'), 1037.501),
      from: table(Mountain),
    });
    expect(result).toEqual(5);
  });
});
