import { dataClients } from '../../../../../../testing/relational/adapters';
import { now } from './now';
import { ClientTestContext } from '../../../../../../testing/relational/adapter/client-test-context';

describe('relational/sql/function/date/now', () => {
  describe.each(dataClients)('%s', (ctxFactory) => {
    let ctx: ClientTestContext;

    beforeAll(async () => {
      ctx = await ctxFactory.getClient();
    });

    afterAll(() => ctx.close());

    it('should get now', async () => {
      const result = await ctx.client.selectFirst({
        select: {
          date: now(),
        },
      });
      expect(result).not.toBeNull();
      expect(result).not.toBeUndefined();
      expect(result.date).toBeInstanceOf(Date);
    });
  });
});
