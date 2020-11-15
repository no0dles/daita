import { now } from './now';
import { testClient } from '../../../../../../testing/relational/adapters';

describe('relational/sql/function/date/now', () => {
  const clients = testClient('pg', 'sqlite');

  describe.each(clients)('%s', (client) => {
    afterAll(() => client.close());

    it('should get now', async () => {
      const result = await client.selectFirst({
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
