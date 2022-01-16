import { field, RelationalAdapter, subtract, table } from '@daita/relational';
import { Mountain } from '../../../../models/mountain';
import { cleanupTestContext, getMowntainTestContext, seedMowntainData } from '../../../../testing';

describe('relational/sql/operands/subtract', () => {
  const ctx = getMowntainTestContext();

  beforeAll(async () => {
    await seedMowntainData(ctx);
  });

  afterAll(async () => {
    await cleanupTestContext(ctx);
  });

  it('should subtract value', async () => {
    const result = await ctx.selectFirst({
      select: subtract(field(Mountain, 'prominence'), 1037.501),
      from: table(Mountain),
    });
    expect(result).toEqual(5);
  });
});
