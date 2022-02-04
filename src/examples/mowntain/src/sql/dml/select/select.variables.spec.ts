import { seedMowntainData } from '../../../testing';
import { RelationalOrmAdapter } from '@daita/orm';
import { RelationalAdapter } from '@daita/relational';

describe('sql/dml/select/variables', () => {
  let ctx: RelationalOrmAdapter & RelationalAdapter<any>;

  beforeAll(async () => {
    ctx = await seedMowntainData();
  });

  afterAll(async () => ctx.close());

  it('should select 1', async () => {
    const result = await ctx.selectFirst({ select: 1 });
    expect(result).toEqual(1);
  });
});
