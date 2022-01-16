import { sum, table } from '@daita/relational';
import { Mountain } from '../../../../models/mountain';
import { cleanupTestContext, getMowntainTestContext, seedMowntainData } from '../../../../testing';

describe('relational/sql/function/aggregation/sum', () => {
  const ctx = getMowntainTestContext();

  beforeAll(async () => {
    await seedMowntainData(ctx);
  });

  afterAll(async () => cleanupTestContext(ctx));

  it('should get sum', async () => {
    const result = await ctx.selectFirst({
      select: sum(Mountain, 'prominence'),
      from: table(Mountain),
    });
    expect(result).toEqual(1737.501);
  });
});
