import { divide, field, RelationalAdapter, table } from '@daita/relational';
import { Mountain } from '../../../../models/mountain';
import { cleanupTestContext, getMowntainTestContext, seedMowntainData } from '../../../../testing';
import { RelationalOrmAdapter } from '@daita/orm';

describe('relational/sql/operands/divide', () => {
  let ctx: RelationalOrmAdapter & RelationalAdapter<any>;

  beforeAll(async () => {
    ctx = await seedMowntainData();
  });

  afterAll(async () => ctx.close());

  it('should divide value and field', async () => {
    const result = await ctx.selectFirst({
      select: divide(field(Mountain, 'prominence'), 5),
      from: table(Mountain),
    });
    expect(result).toEqual(208.5002);
  });
});
