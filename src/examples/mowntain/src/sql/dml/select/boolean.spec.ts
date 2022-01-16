import { cleanupTestContext, getMowntainTestContext, seedMowntainData } from '../../../testing';
import { equal, field, table } from '@daita/relational';
import { Person } from '../../../models/person';

describe('relational/types/boolean', () => {
  const ctx = getMowntainTestContext();

  beforeAll(async () => {
    await seedMowntainData(ctx);
  });

  afterAll(async () => cleanupTestContext(ctx));

  it('should save and retrive boolean false value', async () => {
    const result = await ctx.selectFirst({
      select: field(Person, 'active'),
      from: table(Person),
      where: equal(field(Person, 'id'), '571cb303-bd0f-40a3-8404-9395471d03e3'),
    });
    expect(result).toEqual(false);
  });

  it('should save and retrive boolean true value', async () => {
    const result = await ctx.selectFirst({
      select: field(Person, 'active'),
      from: table(Person),
      where: equal(field(Person, 'id'), 'dafd9228-b626-4557-abc0-068855201a31'),
    });
    expect(result).toEqual(true);
  });
});
