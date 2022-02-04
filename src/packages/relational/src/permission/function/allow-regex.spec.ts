import { allow } from './allow';
import { authorized } from './authorized';
import { allowRegex } from './allow-regex';
import { table } from '../../sql/keyword/table/table';
import { RuleContext } from '../description/rule-context';
import { expectMatchingRule, expectUnmatchingRule } from '../validate';

describe('allow-regex', () => {
  class User {
    id!: string;
    username!: string;
    password!: string;
  }

  const rule = allow(authorized(), {
    update: table(User),
    set: {
      username: allowRegex(/[a-z]+/),
    },
  });
  const ctx: RuleContext = { isAuthorized: true };

  it('should allow when regex matches', () => {
    expectMatchingRule(
      {
        update: table(User),
        set: {
          username: 'abc',
        },
      },
      rule,
      ctx,
    );
  });

  it('should forbid when regex does not matches', () => {
    expectUnmatchingRule(
      {
        update: table(User),
        set: {
          username: '0123',
        },
      },
      rule,
      ctx,
    );
  });
});
