import { field } from '../sql/keyword/field/field';
import { table } from '../sql/keyword/table/table';
import { allow } from './function/allow';
import { requestContext } from './function/request-context';
import { authorized } from './function/authorized';
import { anything } from './function/anything';
import { equal } from '../sql/operands/comparison/equal/equal';
import { RuleContext } from './description/rule-context';
import { expectMatchingRule, expectUnmatchingRule } from './validate';

describe('permission', () => {
  class User {
    id!: string;
    username!: string;
    password!: string;
  }

  describe('only select with where username = anything()', () => {
    const rules = [
      allow(authorized(), {
        select: anything(),
        from: table(User),
        where: equal(field(User, 'username'), anything()),
      }),
    ];
    const ctx: RuleContext = { isAuthorized: true };

    it('should not allow without where condition', () => {
      expectUnmatchingRule(
        {
          select: field(User, 'username'),
          from: table(User),
        },
        rules,
        ctx,
      );
    });

    it('should not allow with different where condition', () => {
      expectUnmatchingRule(
        {
          select: field(User, 'username'),
          from: table(User),
          where: equal(field(User, 'password'), '123'),
        },
        rules,
        ctx,
      );
    });

    it('should allow with where condition on username', () => {
      expectMatchingRule(
        {
          select: field(User, 'username'),
          from: table(User),
          where: equal(field(User, 'username'), 'foo'),
        },
        rules,
        ctx,
      );
    });
  });

  describe('update only one key', () => {
    const rules = [
      allow(authorized(), {
        update: table(User),
        set: { username: anything() },
        where: equal(field(User, 'username'), anything()),
      }),
    ];
    const ctx: RuleContext = { isAuthorized: true };

    it('should allow to update one key with where', () => {
      expectMatchingRule(
        {
          update: table(User),
          set: {
            username: 'foo',
          },
          where: equal(field(User, 'username'), 'foo'),
        },
        rules,
        ctx,
      );
    });

    it('should not allow to update without where', () => {
      expectUnmatchingRule(
        {
          update: table(User),
          set: {
            username: 'foo',
          },
        },
        rules,
        ctx,
      );
    });

    it('should not allow to update different key', () => {
      expectUnmatchingRule(
        {
          update: table(User),
          set: {
            password: 'foo',
          },
          where: equal(field(User, 'username'), 'foo'),
        },
        rules,
        ctx,
      );
    });
  });

  describe('update request context', () => {
    const rules = [
      allow(authorized(), {
        update: table(User),
        set: { password: anything() },
        where: equal(field(User, 'username'), requestContext().userId),
      }),
    ];
    const ctx: RuleContext = { isAuthorized: true, userId: 'foo' };

    it('should allow update own user', () => {
      expectMatchingRule(
        {
          update: table(User),
          set: {
            password: 'foo',
          },
          where: equal(field(User, 'username'), 'foo'),
        },
        rules,
        ctx,
      );
    });

    it('should not allow update other users', () => {
      expectUnmatchingRule(
        {
          update: table(User),
          set: {
            password: 'abc',
          },
          where: equal(field(User, 'username'), 'bar'),
        },
        rules,
        ctx,
      );
    });
  });

  describe('insert value', () => {
    const rules = [
      allow(authorized(), {
        insert: { username: anything(), id: anything(), password: 'foo' },
        into: table(User),
      }),
    ];
    const ctx: RuleContext = { isAuthorized: true };

    it('should not allow different value', () => {
      expectUnmatchingRule(
        {
          into: table(User),
          insert: {
            id: 'a',
            username: 'foo',
            password: 'foo2',
          },
        },
        rules,
        ctx,
      );
    });

    it('should allow specified value', () => {
      expectMatchingRule(
        {
          into: table(User),
          insert: {
            id: 'a',
            username: 'foo',
            password: 'foo',
          },
        },
        rules,
        ctx,
      );
    });

    it('should not allow multiple insert', () => {
      expectUnmatchingRule(
        {
          into: table(User),
          insert: [
            {
              id: 'a',
              username: 'foo',
              password: 'foo',
            },
          ],
        },
        rules,
        ctx,
      );
    });
  });
});
