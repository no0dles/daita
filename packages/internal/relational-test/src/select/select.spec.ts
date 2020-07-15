import {
  SelectSql,
} from '@daita/relational';
import { getClient } from '@daita/relational';
import { testAdapter } from '../adapters';
import { selectFunctionTest } from './functions';
import { RelationalTest } from '../relational-test';

export function selectTest(arg: RelationalTest) {
  describe('select', () => {
    describe('should select value', testAdapter(arg, async (adapter) => {
      const sql: SelectSql<any> = {
        select: {
          value: 'test',
        },
      };
      const client = getClient(adapter);
      const result = await client.selectFirst(sql);
      expect(result).toEqual({ value: 'test' });
    }));
  });

  selectFunctionTest(arg);
}
