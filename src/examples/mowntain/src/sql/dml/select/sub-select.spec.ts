import { cleanupTestContext, getMowntainTestContext, seedMowntainData } from '../../../testing';
import { alias, field, max, subSelect, table } from '@daita/relational';
import { Mountain } from '../../../models/mountain';

describe('relational/sql/dml/select/subquery', () => {
  const ctx = getMowntainTestContext();

  beforeAll(async () => {
    await seedMowntainData(ctx);
  });

  afterAll(async () => cleanupTestContext(ctx));

  it('should allow max with alias', async () => {
    const mountains = await ctx.select({
      select: {
        prominence: field(Mountain, 'prominence'),
        otherHighestProminence: subSelect({
          select: max(alias(Mountain, 'other'), 'prominence'),
          from: alias(Mountain, 'other'),
        }),
      },
      from: table(Mountain),
      orderBy: field(Mountain, 'prominence'),
    });
    expect(mountains).toEqual([
      {
        otherHighestProminence: 1042.501,
        prominence: 695,
      },
      {
        otherHighestProminence: 1042.501,
        prominence: 1042.501,
      },
    ]);
  });
});
