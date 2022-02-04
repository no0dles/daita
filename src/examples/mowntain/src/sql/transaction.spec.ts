import { RelationalAdapter, table } from '@daita/relational';
import { field } from '@daita/relational';
import { equal } from '@daita/relational';
import { seedMowntainData } from '../testing';
import { Person } from '../models/person';
import { RelationalOrmAdapter } from '@daita/orm';
import { isDefined } from '@daita/common';

describe('relational/adapter/relational-transaction-adapter/transaction', () => {
  let ctx: RelationalOrmAdapter & RelationalAdapter<any>;

  beforeAll(async () => {
    ctx = await seedMowntainData();
  });

  afterAll(async () => ctx.close());

  it('should update in transaction', async () => {
    const newBirthday = new Date();
    await ctx.transaction((trx) => {
      trx.update({
        set: { birthday: newBirthday },
        update: table(Person),
        where: equal(field(Person, 'id'), '571cb303-bd0f-40a3-8404-9395471d03e3'),
      });
    });
    const person = await ctx.selectFirst({
      select: { birthday: field(Person, 'birthday') },
      from: table(Person),
      where: equal(field(Person, 'id'), '571cb303-bd0f-40a3-8404-9395471d03e3'),
    });
    isDefined(person);
    expect(person.birthday).toBeInstanceOf(Date);
    expect(person.birthday).toEqual(newBirthday);
  });

  it('should cancel transaction', async () => {
    try {
      await ctx.transaction((trx) => {
        trx.update({
          set: { firstName: 'Foo2' },
          update: table(Person),
          where: equal(field(Person, 'id'), '571cb303-bd0f-40a3-8404-9395471d03e3'),
        });
        throw new Error('abort');
      });
      throw new Error('should not be successful');
    } catch (e: any) {
      expect(e.message).toEqual('abort');
    }
    const person = await ctx.selectFirst({
      select: { firstName: field(Person, 'firstName') },
      from: table(Person),
      where: equal(field(Person, 'id'), '571cb303-bd0f-40a3-8404-9395471d03e3'),
    });
    isDefined(person);
    expect(person.firstName).toEqual('Edward');
  });
});
