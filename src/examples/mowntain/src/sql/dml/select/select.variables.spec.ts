import { cleanupTestContext, getMowntainTestContext, seedMowntainData } from '../../../testing';

describe('sql/dml/select/variables', () => {
  const ctx = getMowntainTestContext();

  beforeAll(async () => {
    await seedMowntainData(ctx);
  });

  afterAll(async () => cleanupTestContext(ctx));

  it('should select 1', async () => {
    const result = await ctx.selectFirst({ select: 1 });
    expect(result).toEqual(1);
  });
});
