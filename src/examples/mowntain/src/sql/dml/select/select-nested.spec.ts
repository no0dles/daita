import { seedMowntainData } from '../../../testing';
import { field, RelationalAdapter, table } from '@daita/relational';
import { Mountain } from '../../../models/mountain';
import { RelationalOrmAdapter } from '@daita/orm';

describe('docs/example/sql/dml/select', () => {
  let ctx: RelationalOrmAdapter & RelationalAdapter<any>;

  beforeAll(async () => {
    ctx = await seedMowntainData();
  });

  afterAll(async () => ctx.close());

  it('should return nested fields', async () => {
    const result = await ctx.select({
      select: {
        data: {
          prominence: field(Mountain, 'prominence'),
          elevation: field(Mountain, 'elevation'),
        },
        name: field(Mountain, 'name'),
      },
      from: table(Mountain),
      orderBy: field(Mountain, 'prominence'),
    });
    expect(result).toEqual([
      { data: { prominence: 695, elevation: 4158 }, name: 'Jungfrau' },
      {
        data: { prominence: 1042.501, elevation: 4478 },
        name: 'Matterhorn',
      },
    ]);
  });
});
