import { equal, field, table } from '@daita/relational';
import { AscentPerson } from '../../../models/ascent-person';
import { cleanupTestContext, getMowntainTestContext, seedMowntainData } from '../../../testing';
import { Person } from '../../../models/person';

describe('delete', () => {
  const ctx = getMowntainTestContext();

  beforeAll(async () => {
    await seedMowntainData(ctx);
  });

  afterAll(async () => cleanupTestContext(ctx));

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
