import { concat, field, RelationalAdapter, table } from '@daita/relational';
import { seedMowntainData } from '../../../../testing';
import { Person } from '../../../../models/person';
import { RelationalOrmAdapter } from '@daita/orm';

describe('relational/sql/function/string/concat', () => {
  let ctx: RelationalOrmAdapter & RelationalAdapter<any>;

  beforeAll(async () => {
    ctx = await seedMowntainData();
  });

  afterAll(async () => ctx.close());

  it('should concat fields', async () => {
    const result = await ctx.selectFirst({
      select: {
        name: concat(field(Person, 'firstName'), field(Person, 'lastName')),
      },
      from: table(Person),
    });
    expect(result).toEqual({ name: 'EdwardWhymper' });
  });

  it('should concat values and fields', async () => {
    const result = await ctx.selectFirst({
      select: {
        name: concat('Foo ', field(Person, 'lastName')),
      },
      from: table(Person),
    });
    expect(result).toEqual({ name: 'Foo Whymper' });
  });
});
