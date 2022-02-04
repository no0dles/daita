import { now, RelationalAdapter } from '@daita/relational';
import { seedMowntainData } from '../../../../testing';
import { RelationalOrmAdapter } from '@daita/orm';
import { isDefined } from '@daita/common';

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
    isDefined(result);
    expect(result.date).toBeInstanceOf(Date);
  });
});
