import { seedMowntainData } from '../../../testing';
import { RelationalOrmAdapter } from '@daita/orm';
import { equal, field, RelationalAdapter, table } from '@daita/relational';
import { Canton } from '../../../models/canton';

describe('insert on conflict', () => {
  let ctx: RelationalOrmAdapter & RelationalAdapter<any>;

  beforeAll(async () => {
    ctx = await seedMowntainData();
  });

  afterAll(async () => ctx.close());

  it('should insert nothing on conflict', async () => {
    const result = await ctx.insert({
      into: table(Canton),
      insert: {
        name: 'Bern',
        shortname: 'BE',
      },
      onConflict: {
        do: 'nothing',
        forField: 'shortname',
      },
    });
    expect(result.insertedRows).toEqual(0);
  });

  it('should insert update on conflict', async () => {
    const result = await ctx.insert({
      into: table(Canton),
      insert: {
        name: 'Bern',
        shortname: 'BE',
      },
      onConflict: {
        do: {
          set: {
            name: 'Bern 2',
          },
        },
        forField: 'shortname',
      },
    });
    expect(result.insertedRows).toEqual(1);
  });

  it('should insert update on conflict where nothing', async () => {
    const result = await ctx.insert({
      into: table(Canton),
      insert: {
        name: 'Bern',
        shortname: 'BE',
      },
      onConflict: {
        do: {
          set: {
            name: 'Bern 2',
          },
          where: equal(field(Canton, 'shortname'), 'ZH'),
        },
        forField: 'shortname',
      },
    });
    expect(result.insertedRows).toEqual(0);
  });
});
