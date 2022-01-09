import { TimeoutError } from '@daita/common';
import { sleep } from '@daita/common';
import { field } from '@daita/relational';
import { equal } from '@daita/relational';
import { table } from '@daita/relational';
import { Person } from '../models/person';
import { testContext } from '../testing';

describe('relational/adapter/relational-transaction-adapter/timeout', () => {
  describe.each(testContext.contexts())('%s', (ctx) => {
    beforeAll(async () => {
      await ctx.setup();
    });

    afterAll(async () => ctx.close());

    it('should cancel transaction with timeout after changes', async () => {
      try {
        await ctx.transaction(async (trx) => {
          await trx.insert({
            insert: {
              birthday: new Date(),
              id: '571cb303-bd0f-40a3-8404-9395471d03e8',
              lastName: 'Test',
              firstName: 'Test',
              active: true,
            },
            into: table(Person),
          });
          await sleep(2500);
        }, 1000);
        throw new Error('should not be successfull');
      } catch (e) {
        expect(e).toBeInstanceOf(TimeoutError);
        expect(e.message).toEqual('timeout');
      }
      const person = await ctx.selectFirst({
        select: { birthday: field(Person, 'birthday') },
        from: table(Person),
        where: equal(field(Person, 'id'), '571cb303-bd0f-40a3-8404-9395471d03e8'),
      });
      expect(person).toBeNull();
    });
  });
});
