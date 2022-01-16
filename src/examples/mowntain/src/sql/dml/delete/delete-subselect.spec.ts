import { alias, equal, field, subSelect, table } from '@daita/relational';
import { AscentPerson } from '../../../models/ascent-person';
import { cleanupTestContext, getMowntainTestContext, seedMowntainData } from '../../../testing';
import { Person } from '../../../models/person';

describe('delete/subselect', () => {
  const ctx = getMowntainTestContext();

  beforeAll(async () => {
    await seedMowntainData(ctx);
  });

  afterAll(async () => cleanupTestContext(ctx));

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
