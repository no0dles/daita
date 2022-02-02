import { now, RelationalAdapter } from '@daita/relational';
import { cleanupTestContext, getMowntainTestContext, seedMowntainData } from '../../../../testing';
import { RelationalOrmAdapter } from '@daita/orm';

describe('relational/sql/function/date/now', () => {
  let ctx: RelationalOrmAdapter & RelationalAdapter<any>;

  beforeAll(async () => {
    ctx = await seedMowntainData();
  });

  afterAll(async () => ctx.close());

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
