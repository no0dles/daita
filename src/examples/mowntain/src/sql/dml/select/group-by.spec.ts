import { seedMowntainData } from '../../../testing';
import { Mountain } from '../../../models/mountain';
import { count, equal, field, greaterThan, join, RelationalAdapter, table } from '@daita/relational';
import { Canton } from '../../../models/canton';
import { RelationalOrmAdapter } from '@daita/orm';

describe('docs/example/sql/dml/select', () => {
  let ctx: RelationalOrmAdapter & RelationalAdapter<any>;

  beforeAll(async () => {
    ctx = await seedMowntainData();
  });

  afterAll(async () => ctx.close());

  it('should select group by disabled and select count', async () => {
    const result = await ctx.select({
      select: {
        name: field(Canton, 'name'),
        count: count(),
      },
      from: table(Canton),
      join: [join(Mountain, equal(field(Mountain, 'cantonShortname'), field(Canton, 'shortname')))],
      groupBy: field(Canton, 'name'),
      orderBy: [count(), field(Canton, 'name')],
    });

    expect(result).toEqual([
      {
        count: 1,
        name: 'Bern',
      },
      {
        count: 1,
        name: 'Valais',
      },
    ]);
  });

  it('should select group by with having', async () => {
    const result = await ctx.select({
      select: {
        name: field(Canton, 'name'),
        count: count(),
      },
      from: table(Canton),
      join: [join(Mountain, equal(field(Mountain, 'cantonShortname'), field(Canton, 'shortname')))],
      groupBy: field(Canton, 'name'),
      having: greaterThan(count(), 1),
      orderBy: [count(), field(Canton, 'name')],
    });
    expect(result).toEqual([]);
  });
});
