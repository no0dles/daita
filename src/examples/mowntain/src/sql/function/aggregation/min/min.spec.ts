import { min, table } from '@daita/relational';
import { Mountain } from '../../../../models/mountain';
import { cleanupTestContext, getMowntainTestContext, seedMowntainData } from '../../../../testing';

describe('relational/sql/function/aggregation/min', () => {
  const ctx = getMowntainTestContext();

  beforeAll(async () => {
    await seedMowntainData(ctx);
  });

  afterAll(async () => cleanupTestContext(ctx));

  it('should get min', async () => {
    const result = await ctx.selectFirst({
      select: min(Mountain, 'prominence'),
      from: table(Mountain),
    });
    expect(result).toEqual(695);
  });
});
