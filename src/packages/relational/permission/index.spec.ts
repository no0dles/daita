import {
  allow,
  anything,
  authorized,
  matchesRules,
  requestContext,
  RuleContext,
} from './index';
import { equal, insert, select, update } from '../sql/function';
import { field } from '../sql/function/field';
import { table } from '../sql/function/table';

describe('permission', () => {
  class User {
    id!: string;
    username!: string;
    password!: string;
  }

  describe('only select with where username = anything()', () => {
    const rules = [
      allow(
        authorized(),
        select({
          select: anything(),
          from: table(User),
          where: equal(field(User, 'username'), anything()),
        }),
      ),
    ];
    const ctx: RuleContext = { isAuthorized: true };

    it('should not allow without where condition', () => {
      const isAllowed = matchesRules(
        select({
          select: field(User, 'username'),
          from: table(User),
        }),
        rules,
        ctx,
      );
      expect(isAllowed).toBeFalsy();
    });

    it('should not allow with different where condition', () => {
      const isAllowed = matchesRules(
        select({
          select: field(User, 'username'),
          from: table(User),
          where: equal(field(User, 'password'), '123'),
        }),
        rules,
        ctx,
      );
      expect(isAllowed).toBeFalsy();
    });

    it('should allow with where condition on username', () => {
      const isAllowed = matchesRules(
        select({
          select: field(User, 'username'),
          from: table(User),
          where: equal(field(User, 'username'), 'foo'),
        }),
        rules,
        ctx,
      );
      expect(isAllowed).toBeTruthy();
    });
  });

  describe('update only one key', () => {
    const rules = [
      allow(
        authorized(),
        update({
          update: table(User),
          set: { username: anything() },
          where: equal(field(User, 'username'), anything()),
        }),
      ),
    ];
    const ctx: RuleContext = { isAuthorized: true };

    it('should allow to update one key with where', () => {
      const isAllowed = matchesRules(
        update({
          update: table(User),
          set: {
            username: 'foo',
          },
          where: equal(field(User, 'username'), 'foo'),
        }),
        rules,
        ctx,
      );
      expect(isAllowed).toBeTruthy();
    });

    it('should not allow to update without where', () => {
      const isAllowed = matchesRules(
        update({
          update: table(User),
          set: {
            username: 'foo',
          },
        }),
        rules,
        ctx,
      );
      expect(isAllowed).toBeFalsy();
    });

    it('should not allow to update different key', () => {
      const isAllowed = matchesRules(
        update({
          update: table(User),
          set: {
            password: 'foo',
          },
          where: equal(field(User, 'username'), 'foo'),
        }),
        rules,
        ctx,
      );
      expect(isAllowed).toBeFalsy();
    });
  });

  describe('update request context', () => {
    const rules = [
      allow(
        authorized(),
        update({
          update: table(User),
          set: { password: anything() },
          where: equal(field(User, 'username'), requestContext().userId),
        }),
      ),
    ];
    const ctx: RuleContext = { isAuthorized: true, userId: 'foo' };

    it('should allow update own user', () => {
      const isAllowed = matchesRules(
        update({
          update: table(User),
          set: {
            password: 'foo',
          },
          where: equal(field(User, 'username'), 'foo'),
        }),
        rules,
        ctx,
      );
      expect(isAllowed).toBeTruthy();
    });

    it('should not allow update other users', () => {
      const isAllowed = matchesRules(
        update({
          update: table(User),
          set: {
            password: 'abc',
          },
          where: equal(field(User, 'username'), 'bar'),
        }),
        rules,
        ctx,
      );
      expect(isAllowed).toBeFalsy();
    });
  });

  describe('insert value', () => {
    const rules = [
      allow(
        authorized(),
        insert({
          insert: { username: anything(), id: anything(), password: 'foo' },
          into: table(User),
        }),
      ),
    ];
    const ctx: RuleContext = { isAuthorized: true };

    it('should not allow different value', () => {
      const isAllowed = matchesRules(
        insert({
          into: table(User),
          insert: {
            id: 'a',
            username: 'foo',
            password: 'foo2',
          },
        }),
        rules,
        ctx,
      );
      expect(isAllowed).toBeFalsy();
    });

    it('should allow specified value', () => {
      const isAllowed = matchesRules(
        insert({
          into: table(User),
          insert: {
            id: 'a',
            username: 'foo',
            password: 'foo',
          },
        }),
        rules,
        ctx,
      );
      expect(isAllowed).toBeTruthy();
    });

    it('should not allow multiple insert', () => {
      const isAllowed = matchesRules(
        insert({
          into: table(User),
          insert: [
            {
              id: 'a',
              username: 'foo',
              password: 'foo',
            },
          ],
        }),
        rules,
        ctx,
      );
      expect(isAllowed).toBeFalsy();
    });
  });
});
