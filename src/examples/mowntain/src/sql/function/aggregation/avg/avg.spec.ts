import { avg, table } from '@daita/relational';
import { Mountain } from '../../../../models/mountain';
import { cleanupTestContext, getMowntainTestContext, seedMowntainData } from '../../../../testing';

describe('relational/sql/function/aggregation/avg', () => {
  const ctx = getMowntainTestContext();

  beforeAll(async () => {
    await seedMowntainData(ctx);
  });

  afterAll(async () => cleanupTestContext(ctx));

  it('should avg date', async () => {
    const result = await ctx.selectFirst({
      select: avg(Mountain, 'prominence'),
      from: table(Mountain),
    });
    expect(result).toEqual(868.7505);
  });
});
