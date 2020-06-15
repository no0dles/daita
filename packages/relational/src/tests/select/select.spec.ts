import { min } from '../../sql/function/min';
import { field } from '../../sql/function/field';
import { table } from '../../sql/function/table';
import { expectedSql } from '../formatter.test';
import { User } from '../schema/user';
import { all, count, equal } from '../../sql/function';

describe('select', () => {
  it('should select 1', () => {
    expectedSql({
      select: 1,
    }, 'SELECT $1', [1]);
  });
  it('should select 1', () => {
    expectedSql({
      select: min(User, 'loginCount'),
    }, 'SELECT min("auth"."user"."loginCount")', []);
  });

  it('should select id from User', () => {
    expectedSql({
      select: field(User, 'id'),
      from: table(User),
    }, 'SELECT "auth"."user"."id" FROM "auth"."user"');
  });

  it('should select limit', () => {
    expectedSql({
      select: field(User, 'id'),
      from: table(User),
      limit: 10
    }, 'SELECT "auth"."user"."id" FROM "auth"."user" LIMIT $1', [10]);
  });

  it('should select offset', () => {
    expectedSql({
      select: field(User, 'id'),
      from: table(User),
      offset: 10
    }, 'SELECT "auth"."user"."id" FROM "auth"."user" OFFSET $1', [10]);
  });

  it('should select count distinct', () => {
    expectedSql({
      select: count(field(User, 'id'), true),
      from: table(User),
      offset: 10
    }, 'SELECT count(DISTINCT "auth"."user"."id") FROM "auth"."user" OFFSET $1', [10]);
  });

  // it('should not allow object', () => {
  //   expect(() => expectedSql({
  //     select: all(),
  //     from: table(User),
  //     // @ts-expect-error
  //     where: equal(field(User, 'id'), { foo: 'bar'})
  //   }, 'SELECT * FROM "auth"."user" WHERE "auth"."user"."id" = $1')).toThrow(Error);
  // })

  it('should select limit and offset', () => {
    expectedSql({
      select: field(User, 'id'),
      from: table(User),
      offset: 15,
      limit: 10,
    }, 'SELECT "auth"."user"."id" FROM "auth"."user" LIMIT $1 OFFSET $2', [10, 15]);
  });
})
