import { max, table } from '@daita/relational';
import { Mountain } from '../../../../models/mountain';
import { cleanupTestContext, getMowntainTestContext, seedMowntainData } from '../../../../testing';

describe('relational/sql/function/aggregation/max', () => {
  const ctx = getMowntainTestContext();

  beforeAll(async () => {
    await seedMowntainData(ctx);
  });

  afterAll(async () => cleanupTestContext(ctx));

  it('should get max', async () => {
    const result = await ctx.selectFirst({
      select: max(Mountain, 'prominence'),
      from: table(Mountain),
    });
    expect(result).toEqual(1042.501);
  });
});
