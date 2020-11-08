import { ClientTestContext, dataClients } from '../../../../../../testing/relational/adapter-test';
import { now } from './now';

describe('relational/sql/function/date/now', () => {
  describe.each(dataClients)('%s', (ctxFactory) => {
    let ctx: ClientTestContext;

    beforeAll(async () => {
      ctx = await ctxFactory.clientContext();
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
