import {
  SelectSql,
} from '@daita/relational';
import { getClient } from '@daita/relational';
import { testAdapter } from '../adapters';
import { selectFunctionTest } from './functions';
import { RelationalTest } from '../relational-test';
import { orderByTest } from './order-by.test';
import { offsetTest } from './offset.test';
import { limitTest } from './limit.test';
import { havingTest } from './having.test';
import { groupByTest } from './group-by.test';

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
  orderByTest(arg);
  offsetTest(arg);
  limitTest(arg);
  havingTest(arg);
  groupByTest(arg);
}
