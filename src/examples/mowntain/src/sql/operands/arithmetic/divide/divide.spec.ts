import { divide, field, table } from '@daita/relational';
import { Mountain } from '../../../../models/mountain';
import { cleanupTestContext, getMowntainTestContext, seedMowntainData } from '../../../../testing';

describe('relational/sql/operands/divide', () => {
  const ctx = getMowntainTestContext();

  beforeAll(async () => {
    await seedMowntainData(ctx);
  });

  afterAll(async () => cleanupTestContext(ctx));

  it('should divide value and field', async () => {
    const result = await ctx.selectFirst({
      select: divide(field(Mountain, 'prominence'), 5),
      from: table(Mountain),
    });
    expect(result).toEqual(208.5002);
  });
});
