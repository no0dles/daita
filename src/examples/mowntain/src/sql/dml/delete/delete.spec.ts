import { equal, field, RelationalAdapter, table } from '@daita/relational';
import { AscentPerson } from '../../../models/ascent-person';
import { seedMowntainData } from '../../../testing';
import { Person } from '../../../models/person';
import { RelationalOrmAdapter } from '@daita/orm';

describe('delete', () => {
  let ctx: RelationalOrmAdapter & RelationalAdapter<any>;

  beforeAll(async () => {
    ctx = await seedMowntainData();
  });

  afterAll(async () => ctx.close());

  it('should delete without conditions', async () => {
    const result = await ctx.delete({
      delete: table(AscentPerson),
    });
    expect(result.deletedRows).toEqual(1);
  });

  it('should delete with equal condition', async () => {
    const result = await ctx.delete({
      delete: table(Person),
      where: equal(field(Person, 'firstName'), 'Lucy'),
    });
    expect(result.deletedRows).toEqual(1);
  });
});
