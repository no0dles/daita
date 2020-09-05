import { getRuleId } from './rule-id';
import {
  allowRegex,
  authorized,
} from '../../../relational/permission/function';
import { table } from '../../../relational/sql/function';
import { Rule } from '../../../relational/permission/description';

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
