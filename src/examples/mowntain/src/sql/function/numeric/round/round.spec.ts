import { field, least, table } from '@daita/relational';
import { Mountain } from '../../../../models/mountain';
import { cleanupTestContext, getMowntainTestContext, seedMowntainData } from '../../../../testing';

describe('relational/sql/function/numberic/least', () => {
  const ctx = getMowntainTestContext();

  beforeAll(async () => {
    await seedMowntainData(ctx);
  });

  afterAll(async () => cleanupTestContext(ctx));

  it('should get from field and value', async () => {
    const result = await ctx.selectFirst({
      select: least(field(Mountain, 'prominence'), 20),
      from: table(Mountain),
    });
    expect(result).toEqual(20);
  });

  it('should get null and value', async () => {
    const result = await ctx.selectFirst({
      select: least(field(Mountain, 'ascents'), 20),
      from: table(Mountain),
    });
    expect(result).toEqual(20);
  });

  it('should get value and null', async () => {
    const result = await ctx.selectFirst({
      select: least(20, field(Mountain, 'ascents')),
      from: table(Mountain),
    });
    expect(result).toEqual(20);
  });

  it('should get null and null', async () => {
    const result = await ctx.selectFirst({
      select: least(field(Mountain, 'ascents'), field(Mountain, 'ascents')),
      from: table(Mountain),
    });
    expect(result).toEqual(null);
  });
});
