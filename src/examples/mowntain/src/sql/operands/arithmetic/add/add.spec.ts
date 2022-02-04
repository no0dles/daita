import { add, field, RelationalAdapter, table } from '@daita/relational';
import { Mountain } from '../../../../models/mountain';
import { seedMowntainData } from '../../../../testing';
import { RelationalOrmAdapter } from '@daita/orm';

describe('relational/sql/operands/add', () => {
  let ctx: RelationalOrmAdapter & RelationalAdapter<any>;

  beforeAll(async () => {
    ctx = await seedMowntainData();
  });

  afterAll(async () => ctx.close());

  it('should add field and value', async () => {
    const result = await ctx.selectFirst({
      select: add(field(Mountain, 'prominence'), 10),
      from: table(Mountain),
    });
    expect(result).toEqual(1052.501);
  });

  it('should add value and value', async () => {
    const result = await ctx.selectFirst({
      select: add(10, 10),
      from: table(Mountain),
    });
    expect(result).toEqual(20);
  });

  it('should add nullable field and value', async () => {
    const result = await ctx.selectFirst({
      select: add(field(Mountain, 'ascents'), 10),
      from: table(Mountain),
    });
    expect(result).toEqual(null);
  });

  it('should add null value and value', async () => {
    const result = await ctx.selectFirst({
      select: add(null, 10),
      from: table(Mountain),
    });
    expect(result).toEqual(null);
  });
});
