import { alias, equal, field, RelationalAdapter, subSelect, table } from '@daita/relational';
import { AscentPerson } from '../../../models/ascent-person';
import { cleanupTestContext, getMowntainTestContext, seedMowntainData } from '../../../testing';
import { Person } from '../../../models/person';
import { RelationalOrmAdapter } from '@daita/orm';

describe('delete/subselect', () => {
  let ctx: RelationalOrmAdapter & RelationalAdapter<any>;

  beforeAll(async () => {
    ctx = await seedMowntainData();
  });

  afterAll(async () => ctx.close());

  it('should divide value and field', async () => {
    const result = await ctx.delete({
      delete: table(AscentPerson),
      where: equal(
        subSelect({
          select: field(alias(Person, 'u'), 'id'),
          from: alias(Person, 'u'),
          where: equal(field(alias(Person, 'u'), 'firstName'), 'Lucy'),
        }),
        field(AscentPerson, 'personId'),
      ),
    });
    expect(result.deletedRows).toEqual(1);
  });
});
