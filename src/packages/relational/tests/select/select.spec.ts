import { min } from '../../sql/function/min';
import { field } from '../../sql/function/field';
import { table } from '../../sql/function/table';
import { expectedSql } from '../formatter.test';
import { User } from '../schema/user';
import { asc } from '../../sql/function/asc';
import { and } from '../../sql/function/and';
import { isIn } from '../../sql/function/in';
import { desc } from '../../sql/function/desc';
import { equal } from '../../sql/function/equal';
import { notEqual } from '../../sql/function/not-equal';
import { count } from '../../sql/function/count';
describe('select', () => {
  it('should select 1', () => {
    expectedSql(
      {
        select: 1,
      },
      'SELECT $1',
      [1],
    );
  });
  it('should select 1', () => {
    expectedSql(
      {
        select: min(User, 'loginCount'),
      },
      'SELECT min("auth"."user"."loginCount")',
      [],
    );
  });

  it('should select id from User', () => {
    expectedSql(
      {
        select: field(User, 'id'),
        from: table(User),
      },
      'SELECT "auth"."user"."id" FROM "auth"."user"',
    );
  });

  it('should select limit', () => {
    expectedSql(
      {
        select: field(User, 'id'),
        from: table(User),
        limit: 10,
      },
      'SELECT "auth"."user"."id" FROM "auth"."user" LIMIT $1',
      [10],
    );
  });

  it('should select offset', () => {
    expectedSql(
      {
        select: field(User, 'id'),
        from: table(User),
        offset: 10,
      },
      'SELECT "auth"."user"."id" FROM "auth"."user" OFFSET $1',
      [10],
    );
  });

  it('should select count distinct', () => {
    expectedSql(
      {
        select: count(field(User, 'id'), true),
        from: table(User),
        offset: 10,
      },
      'SELECT count(DISTINCT "auth"."user"."id") FROM "auth"."user" OFFSET $1',
      [10],
    );
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
    expectedSql(
      {
        select: field(User, 'id'),
        from: table(User),
        offset: 15,
        limit: 10,
      },
      'SELECT "auth"."user"."id" FROM "auth"."user" LIMIT $1 OFFSET $2',
      [10, 15],
    );
  });

  it('should select where with single and condition', () => {
    expectedSql(
      {
        select: field(User, 'id'),
        from: table(User),
        where: and(equal(field(User, 'id'), 'a')),
      },
      'SELECT "auth"."user"."id" FROM "auth"."user" WHERE ("auth"."user"."id" = $1)',
      ['a'],
    );
  });

  it('should select where not equal', () => {
    expectedSql(
      {
        select: field(User, 'id'),
        from: table(User),
        where: notEqual(field(User, 'id'), 'a'),
      },
      'SELECT "auth"."user"."id" FROM "auth"."user" WHERE "auth"."user"."id" != $1',
      ['a'],
    );
  });

  it('should select where with multiple and conditions', () => {
    expectedSql(
      {
        select: field(User, 'id'),
        from: table(User),
        where: and(equal(field(User, 'id'), 'a'), equal(field(User, 'name'), 'a')),
      },
      'SELECT "auth"."user"."id" FROM "auth"."user" WHERE ("auth"."user"."id" = $1 AND "auth"."user"."name" = $1)',
      ['a'],
    );
  });

  it('should select where with in', () => {
    expectedSql(
      {
        select: field(User, 'id'),
        from: table(User),
        where: isIn(field(User, 'id'), ['a', 'b']),
      },
      'SELECT "auth"."user"."id" FROM "auth"."user" WHERE "auth"."user"."id" IN ($1, $2)',
      ['a', 'b'],
    );
  });

  it('should select order by asc', () => {
    expectedSql(
      {
        select: field(User, 'id'),
        from: table(User),
        orderBy: asc(field(User, 'id')),
      },
      'SELECT "auth"."user"."id" FROM "auth"."user" ORDER BY "auth"."user"."id" ASC',
    );
  });

  it('should select order by desc, asc, field', () => {
    expectedSql(
      {
        select: field(User, 'id'),
        from: table(User),
        orderBy: [desc(field(User, 'id')), asc(field(User, 'id')), field(User, 'id')],
      },
      'SELECT "auth"."user"."id" FROM "auth"."user" ORDER BY "auth"."user"."id" DESC, "auth"."user"."id" ASC, "auth"."user"."id"',
    );
  });
});
