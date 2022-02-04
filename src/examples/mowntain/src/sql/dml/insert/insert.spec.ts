import { field, RelationalAdapter, table } from '@daita/relational';
import { Mountain } from '../../../models/mountain';
import { seedMowntainData } from '../../../testing';
import { Person } from '../../../models/person';
import { RelationalOrmAdapter } from '@daita/orm';

describe('insert', () => {
  let ctx: RelationalOrmAdapter & RelationalAdapter<any>;

  beforeAll(async () => {
    ctx = await seedMowntainData();
  });

  afterAll(async () => ctx.close());

  it('should insert from object', async () => {
    const result = await ctx.insert({
      into: table(Person),
      insert: {
        id: '7ddfc342-ead6-4b38-8d43-67293d165189',
        active: true,
        birthday: new Date(),
        firstName: 'Foo',
        lastName: 'Bar',
      },
    });
    expect(result.insertedRows).toEqual(1);
  });

  it('should insert from array', async () => {
    const result = await ctx.insert({
      into: table(Person),
      insert: [
        {
          id: '3f1ad889-533d-4fe5-8ab3-792d973c7e81',
          active: true,
          birthday: new Date(),
          firstName: 'Foo2',
          lastName: 'Bar2',
        },
      ],
    });
    expect(result.insertedRows).toEqual(1);
  });

  it('should insert from array', async () => {
    const result = await ctx.insert({
      into: table(Person),
      insert: {
        select: {
          id: field(Mountain, 'id'),
          firstName: 'Mr',
          lastName: field(Mountain, 'name'),
          active: true,
          birthday: new Date(),
        },
        from: table(Mountain),
      },
    });
    expect(result.insertedRows).toEqual(2);
  });
});
