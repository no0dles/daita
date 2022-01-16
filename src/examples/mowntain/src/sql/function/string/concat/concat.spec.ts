import { concat, field, table } from '@daita/relational';
import { cleanupTestContext, getMowntainTestContext, seedMowntainData } from '../../../../testing';
import { Person } from '../../../../models/person';

describe('relational/sql/function/string/concat', () => {
  const ctx = getMowntainTestContext();

  beforeAll(async () => {
    await seedMowntainData(ctx);
  });

  afterAll(async () => cleanupTestContext(ctx));

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
