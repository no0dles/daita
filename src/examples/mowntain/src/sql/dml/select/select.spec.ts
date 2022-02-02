import { Mountain } from '../../../models/mountain';
import {
  caseWhen,
  ceil,
  dayOfMonth,
  dayOfWeek,
  dayOfYear,
  field,
  floor,
  greaterThan,
  hour,
  minute,
  month,
  RelationalAdapter,
  round,
  second,
  table,
  year,
} from '@daita/relational';
import { Ascent } from '../../../models/ascent';
import { cleanupTestContext, getMowntainTestContext, seedMowntainData } from '../../../testing';
import { RelationalOrmAdapter } from '@daita/orm';

describe('docs/example/sql/dml/select', () => {
  let ctx: RelationalOrmAdapter & RelationalAdapter<any>;

  beforeAll(async () => {
    ctx = await seedMowntainData();
  });

  afterAll(async () => ctx.close());

  it('should select Mountain.name, Mountain.prominence from Mountain', async () => {
    await ctx.select({
      select: {
        name: field(Mountain, 'name'),
        prominence: field(Mountain, 'prominence'),
      },
      from: table(Mountain),
    });
  });

  it('should floor 1042.501 to 1042', async () => {
    const result = await ctx.selectFirst({
      select: {
        name: field(Mountain, 'name'),
        prominence: floor(field(Mountain, 'prominence')),
      },
      from: table(Mountain),
    });
    expect(result?.prominence).toBe(1042);
  });

  it('should ceil 1042.501 to 1043', async () => {
    const result = await ctx.selectFirst({
      select: {
        name: field(Mountain, 'name'),
        prominence: ceil(field(Mountain, 'prominence')),
      },
      from: table(Mountain),
    });
    expect(result?.prominence).toBe(1043);
  });

  it('should round 1042.501 to 1042.50', async () => {
    const result = await ctx.selectFirst({
      select: {
        name: field(Mountain, 'name'),
        prominence: round(field(Mountain, 'prominence'), 2),
      },
      from: table(Mountain),
    });
    expect(result?.prominence).toBe(1042.5);
  });

  it('should get hour 12', async () => {
    const result = await ctx.selectFirst({
      select: hour(field(Ascent, 'date')),
      from: table(Ascent),
    });
    expect(result).toBe(12);
  });

  it('should get minute 22', async () => {
    const result = await ctx.selectFirst({
      select: minute(field(Ascent, 'date')),
      from: table(Ascent),
    });
    expect(result).toBe(22);
  });

  it('should get second 33', async () => {
    const result = await ctx.selectFirst({
      select: second(field(Ascent, 'date')),
      from: table(Ascent),
    });
    expect(result).toBe(33);
  });

  it('should get year 2021', async () => {
    const result = await ctx.selectFirst({
      select: year(field(Ascent, 'date')),
      from: table(Ascent),
    });
    expect(result).toBe(2021);
  });

  it('should get month 1', async () => {
    const result = await ctx.selectFirst({
      select: month(field(Ascent, 'date')),
      from: table(Ascent),
    });
    expect(result).toBe(1);
  });

  it('should get day of year 2', async () => {
    const result = await ctx.selectFirst({
      select: dayOfYear(field(Ascent, 'date')),
      from: table(Ascent),
    });
    expect(result).toBe(2);
  });

  it('should get day of month 2', async () => {
    const result = await ctx.selectFirst({
      select: dayOfMonth(field(Ascent, 'date')),
      from: table(Ascent),
    });
    expect(result).toBe(2);
  });

  it('should get day of week 6', async () => {
    const result = await ctx.selectFirst({
      select: dayOfWeek(field(Ascent, 'date')),
      from: table(Ascent),
    });
    expect(result).toBe(6);
  });

  it('should case when', async () => {
    const result = await ctx.selectFirst({
      select: {
        height: caseWhen((caseWhen) =>
          caseWhen
            .when(greaterThan(field(Mountain, 'prominence'), 2000), 'greater than 2000')
            .when(greaterThan(field(Mountain, 'prominence'), 1000), 'greater than 1000'),
        ),
        name: field(Mountain, 'name'),
      },
      from: table(Mountain),
    });
    expect(result?.height).toBe('greater than 1000');
  });
});
