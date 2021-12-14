import { TimeoutError } from '@daita/relational';
import { sleep } from '@daita/common';
import { field } from '@daita/relational';
import { equal } from '@daita/relational';
import { table } from '@daita/relational';
import { Person } from '../models/person';
import { testContext } from '../testing';

describe('relational/adapter/relational-transaction-adapter/timeout', () => {
  const ctxs = testContext.contexts();

  describe.each(ctxs)('%s', (ctx) => {
    beforeAll(async () => {
      await ctx.setup();
    });

    afterAll(async () => ctx.close());

    it('should cancel transaction with timeout after changes', async () => {
      try {
        await ctx.transaction(async (trx) => {
          await trx.update({
            set: { birthday: new Date() },
            update: table(Person),
            where: equal(field(Person, 'id'), 'a'),
          });
          await sleep(2500);
        });
        throw new Error('should not be successfull');
      } catch (e) {
        expect(e).toBeInstanceOf(TimeoutError);
        expect(e.message).toEqual('timeout');
      }
      const person = await ctx.selectFirst({
        select: { birthday: field(Person, 'birthday') },
        from: table(Person),
      });
      expect(person).not.toBeUndefined();
      expect(person).not.toBeNull();
      expect(person!.birthday).toBeNull();
    });
  });
});
