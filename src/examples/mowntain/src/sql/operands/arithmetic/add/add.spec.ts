import { add, field, table } from '@daita/relational';
import { Mountain } from '../../../../models/mountain';
import { cleanupTestContext, getMowntainTestContext, seedMowntainData } from '../../../../testing';

describe('relational/sql/operands/add', () => {
  const ctx = getMowntainTestContext();

  beforeAll(async () => {
    await seedMowntainData(ctx);
  });

  afterAll(async () => cleanupTestContext(ctx));

  it('should add field and value', async () => {
    const result = await ctx.selectFirst({
      select: add(field(Mountain, 'prominence'), 10),
      from: table(Mountain),
    });
    expect(result).toEqual(1052.501);
  });

  it('should add value and value', async () => {
    const result = await ctx.selectFirst({
      select: add(10, 10),
      from: table(Mountain),
    });
    expect(result).toEqual(20);
  });

  it('should add nullable field and value', async () => {
    const result = await ctx.selectFirst({
      select: add(field(Mountain, 'ascents'), 10),
      from: table(Mountain),
    });
    expect(result).toEqual(null);
  });

  it('should add null value and value', async () => {
    const result = await ctx.selectFirst({
      select: add(null, 10),
      from: table(Mountain),
    });
    expect(result).toEqual(null);
  });
});
