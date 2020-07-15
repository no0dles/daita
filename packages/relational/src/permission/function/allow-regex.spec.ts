import { allow } from './allow';
import { authorized } from './authorized';
import { table, update } from '../../sql/function';
import { RuleContext } from '../description';
import { allowRegex } from './allow-regex';
import { evaluateRule } from '../validate';

describe('allow-regex', () => {
  class User {
    id!: string;
    username!: string;
    password!: string;
  }

  const rule = allow(authorized(), update({
    update: table(User),
    set: {
      username: allowRegex(/[a-z]+/),
    },
  }));
  const ctx: RuleContext = { isAuthorized: true };

  it('should allow when regex matches', () => {
    const result = evaluateRule(update({
      update: table(User),
      set: {
        username: 'abc',
      },
    }), rule, ctx);
    expect(result).toEqual({
      type: 'allow',
    });
  });

  it('should forbid when regex does not matches', () => {
    const result = evaluateRule(update({
      update: table(User),
      set: {
        username: '0123',
      },
    }), rule, ctx);
    expect(result).toEqual({
      type: 'next',
      error: 'set.username does not match regexp',
    });
  });
});
