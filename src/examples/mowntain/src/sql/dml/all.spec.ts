import { cleanupTestContext, getMowntainTestContext, seedMowntainData } from '../../testing';
import { all, table } from '@daita/relational';
import { Person } from '../../models/person';

describe('relational/sql/keyword/all', () => {
  const ctx = getMowntainTestContext();

  beforeAll(async () => {
    await seedMowntainData(ctx);
  });

  afterAll(async () => cleanupTestContext(ctx));

  it('should select all fields', async () => {
    const result = await ctx.selectFirst({
      select: all(),
      from: table(Person),
    });
    expect(result).toEqual({
      active: false,
      birthday: new Date('1990-03-27T00:00:00.000Z'),
      firstName: 'Edward',
      id: '571cb303-bd0f-40a3-8404-9395471d03e3',
      lastName: 'Whymper',
    });
  });

  it('should select all fields from table', async () => {
    const result = await ctx.selectFirst({
      select: all(Person),
      from: table(Person),
    });
    expect(result).toEqual({
      active: false,
      birthday: new Date('1990-03-27T00:00:00.000Z'),
      firstName: 'Edward',
      id: '571cb303-bd0f-40a3-8404-9395471d03e3',
      lastName: 'Whymper',
    });
  });
});
