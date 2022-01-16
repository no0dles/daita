import { ceil, field, table } from '@daita/relational';
import { Mountain } from '../../../../models/mountain';
import { cleanupTestContext, getMowntainTestContext, seedMowntainData } from '../../../../testing';

describe('relational/sql/function/number/least', () => {
  const ctx = getMowntainTestContext();

  beforeAll(async () => {
    await seedMowntainData(ctx);
  });

  afterAll(async () => cleanupTestContext(ctx));

  it('should get from field and value', async () => {
    const result = await ctx.selectFirst({
      select: ceil(field(Mountain, 'prominence')),
      from: table(Mountain),
    });
    expect(result).toEqual(1043);
  });

  it('should get null if value is null', async () => {
    const result = await ctx.selectFirst({
      select: ceil(field(Mountain, 'ascents')),
      from: table(Mountain),
    });
    expect(result).toEqual(null);
  });
});
