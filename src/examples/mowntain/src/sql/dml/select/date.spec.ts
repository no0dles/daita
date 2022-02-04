import { seedMowntainData } from '../../../testing';
import { Ascent } from '../../../models/ascent';
import { field, RelationalAdapter, table } from '@daita/relational';
import { RelationalOrmAdapter } from '@daita/orm';

describe('relational/types/date', () => {
  let ctx: RelationalOrmAdapter & RelationalAdapter<any>;

  beforeAll(async () => {
    ctx = await seedMowntainData();
  });

  afterAll(async () => ctx.close());

  it('should save and retrive date', async () => {
    const result = await ctx.selectFirst({
      select: field(Ascent, 'date'),
      from: table(Ascent),
    });
    expect(result).toEqual(new Date(Date.UTC(2021, 0, 2, 12, 22, 33)));
  });
});
