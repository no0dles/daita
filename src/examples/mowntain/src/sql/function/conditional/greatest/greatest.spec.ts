import { Mountain } from '../../../../models/mountain';
import { field, greatest, table } from '@daita/relational';
import { cleanupTestContext, getMowntainTestContext, seedMowntainData } from '../../../../testing';

describe('relational/sql/function/number/greatest', () => {
  const ctx = getMowntainTestContext();

  beforeAll(async () => {
    await seedMowntainData(ctx);
  });

  afterAll(async () => cleanupTestContext(ctx));

  it('should get greatest from value and value', async () => {
    const result = await ctx.selectFirst({
      select: greatest(10, 20),
      from: table(Mountain),
    });
    expect(result).toEqual(20);
  });

  it('should get greatest from field and value', async () => {
    const result = await ctx.selectFirst({
      select: greatest(field(Mountain, 'prominence'), 20),
      from: table(Mountain),
    });
    expect(result).toEqual(1042.501);
  });

  it('should get greatest nullable field and value', async () => {
    const result = await ctx.selectFirst({
      select: greatest(field(Mountain, 'ascents'), 20),
      from: table(Mountain),
    });
    expect(result).toEqual(20);
  });

  it('should get greatest value and nullable field', async () => {
    const result = await ctx.selectFirst({
      select: greatest(20, field(Mountain, 'ascents')),
      from: table(Mountain),
    });
    expect(result).toEqual(20);
  });

  it('should get greatest of two nullable fields', async () => {
    const result = await ctx.selectFirst({
      select: greatest(field(Mountain, 'ascents'), field(Mountain, 'ascents')),
      from: table(Mountain),
    });
    expect(result).toEqual(null);
  });
});
