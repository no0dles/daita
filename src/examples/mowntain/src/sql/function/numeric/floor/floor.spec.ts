import { field, floor, table } from '@daita/relational';
import { Mountain } from '../../../../models/mountain';
import { cleanupTestContext, getMowntainTestContext, seedMowntainData } from '../../../../testing';

describe('relational/sql/function/number/floor', () => {
  const ctx = getMowntainTestContext();

  beforeAll(async () => {
    await seedMowntainData(ctx);
  });

  afterAll(async () => cleanupTestContext(ctx));

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
