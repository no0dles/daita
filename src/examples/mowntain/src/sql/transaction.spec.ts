import { table } from '@daita/relational';
import { field } from '@daita/relational';
import { equal } from '@daita/relational';
import { testContext } from '../testing';
import { Person } from '../models/person';

describe('relational/adapter/relational-transaction-adapter/transaction', () => {
  describe.each(testContext.contexts())('%s', (ctx) => {
    beforeAll(async () => {
      await ctx.setup();
    });

    afterAll(async () => ctx.close());

    it('should update in transaction', async () => {
      const newBirthday = new Date();
      await ctx.transaction(async (trx) => {
        await trx.update({
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
      expect(person).not.toBeUndefined();
      expect(person).not.toBeNull();
      expect(person!.birthday).toBeInstanceOf(Date);
      expect(person!.birthday).toEqual(newBirthday);
    });

    it('should cancel transaction', async () => {
      try {
        await ctx.transaction(async (trx) => {
          await trx.update({
            set: { firstName: 'Foo2' },
            update: table(Person),
            where: equal(field(Person, 'id'), '571cb303-bd0f-40a3-8404-9395471d03e3'),
          });
          throw new Error('abort');
        });
        throw new Error('should not be successful');
      } catch (e) {
        expect(e.message).toEqual('abort');
      }
      const person = await ctx.selectFirst({
        select: { firstName: field(Person, 'firstName') },
        from: table(Person),
        where: equal(field(Person, 'id'), '571cb303-bd0f-40a3-8404-9395471d03e3'),
      });
      expect(person).not.toBeUndefined();
      expect(person).not.toBeNull();
      expect(person!.firstName).toEqual('Edward');
    });
  });
});
