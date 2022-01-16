import { field, multiply, table } from '@daita/relational';
import { Mountain } from '../../../../models/mountain';
import { cleanupTestContext, getMowntainTestContext, seedMowntainData } from '../../../../testing';

describe('relational/sql/operands/multiply', () => {
  const ctx = getMowntainTestContext();

  beforeAll(async () => {
    await seedMowntainData(ctx);
  });

  afterAll(async () => cleanupTestContext(ctx));

  it('should multiply value and field', async () => {
    const result = await ctx.selectFirst({
      select: multiply(field(Mountain, 'prominence'), 5),
      from: table(Mountain),
    });
    expect(result).toEqual(5212.505);
  });
});
