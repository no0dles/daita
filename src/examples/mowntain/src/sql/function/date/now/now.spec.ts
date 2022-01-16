import { now } from '@daita/relational';
import { cleanupTestContext, getMowntainTestContext, seedMowntainData } from '../../../../testing';

describe('relational/sql/function/date/now', () => {
  const ctx = getMowntainTestContext();

  beforeAll(async () => {
    await seedMowntainData(ctx);
  });

  afterAll(async () => cleanupTestContext(ctx));

  it('should get now', async () => {
    const result = await ctx.selectFirst({
      select: {
        date: now(),
      },
    });
    expect(result).not.toBeNull();
    expect(result).not.toBeUndefined();
    expect(result!.date).toBeInstanceOf(Date);
  });
});
