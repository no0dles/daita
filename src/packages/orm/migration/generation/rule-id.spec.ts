import { getRuleId } from './rule-id';
import { authorized } from '../../../relational/permission/function/authorized';
import { allowRegex } from '../../../relational/permission/function/allow-regex';
import { Rule } from '../../../relational/permission/description/rule';
import { table } from '../../../relational/sql/keyword/table/table';

describe('orm/rule-id', () => {
  it('should have different id', () => {
    class Test {
      name!: string;
    }

    const firstRule: Rule = {
      auth: authorized(),
      type: 'allow',
      sql: {
        insert: {
          name: allowRegex(/^[a-zA-Z0-9-_]{3,20}/),
        },
        into: table(Test),
      },
    };
    const secondRule: Rule = {
      auth: authorized(),
      type: 'allow',
      sql: {
        insert: {
          name: allowRegex(/^[a-zA-Z0-9\-_]{3,20}/),
        },
        into: table(Test),
      },
    };
    expect(getRuleId(firstRule)).not.toBe(getRuleId(secondRule));
  });
});
