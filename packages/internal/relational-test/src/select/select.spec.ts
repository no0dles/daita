import {
  SelectSql,
} from '@daita/relational';
import { getClient } from '@daita/relational';
import { testAdapter } from '../adapters';

describe('select', () => {
  describe('should select value', testAdapter(async (adapter) => {
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
