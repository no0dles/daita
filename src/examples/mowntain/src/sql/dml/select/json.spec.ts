import { cleanupTestContext, getMowntainTestContext, seedMowntainData } from '../../../testing';
import { equal, field, RelationalAdapter, table } from '@daita/relational';
import { Mountain } from '../../../models/mountain';
import { RelationalOrmAdapter } from '@daita/orm';

describe('relational/types/sql', () => {
  let ctx: RelationalOrmAdapter & RelationalAdapter<any>;

  beforeAll(async () => {
    ctx = await seedMowntainData();
  });

  afterAll(async () => ctx.close());

  it('should save and retrive json', async () => {
    const result = await ctx.selectFirst({
      select: field(Mountain, 'extra'),
      from: table(Mountain),
      where: equal(field(Mountain, 'id'), 'b04a54c9-6aa8-4e31-8c99-3db03342ea70'),
    });
    expect(result).toEqual({ bool: true, text: 'foo', value: 10, date: new Date(2021, 0, 2) });
  });
});
