import {
  RelationalTransactionAdapter,
  SelectSql,
} from '@daita/relational';
import { getClient } from '@daita/relational/dist/client/get-client';

export function relationalSelectTest(factory: () => Promise<RelationalTransactionAdapter>) {
  describe('select', () => {
    it('should select value', async () => {
      const sql: SelectSql<any> = {
        select: {
          value: 'test'
        }
      };
      const adapter = await factory();
      const client = getClient(adapter);
      const result = await client.selectFirst(sql);
      expect(result).toEqual({value: 'test'});
    })
  });
}
