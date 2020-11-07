import { allow } from './allow';
import { authorized } from './authorized';
import { allowRegex } from './allow-regex';
import { evaluateRule } from '../validate';
import { update } from '../../sql/dml/update/update';
import { table } from '../../sql/keyword/table/table';
import { RuleContext } from '../description/rule-context';

describe('allow-regex', () => {
  class User {
    id!: string;
    username!: string;
    password!: string;
  }

  const rule = allow(
    authorized(),
    update({
      update: table(User),
      set: {
        username: allowRegex(/[a-z]+/),
      },
    }),
  );
  const ctx: RuleContext = { isAuthorized: true };

  it('should allow when regex matches', () => {
    const result = evaluateRule(
      update({
        update: table(User),
        set: {
          username: 'abc',
        },
      }),
      rule,
      ctx,
    );
    expect(result).toEqual({
      type: 'allow',
    });
  });

  it('should forbid when regex does not matches', () => {
    const result = evaluateRule(
      update({
        update: table(User),
        set: {
          username: '0123',
        },
      }),
      rule,
      ctx,
    );
    expect(result).toEqual({
      type: 'next',
      error: 'should match regexp /[a-z]+/',
      path: ['set', 'username'],
      score: 3,
    });
  });
});
