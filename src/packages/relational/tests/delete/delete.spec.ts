import { expectedSql } from '../formatter.test';
import { table } from '../../sql/function/table';
import { User } from '../schema/user';
import { equal } from '../../sql/function/equal';
import { field } from '../../sql/function/field';
import { or } from '../../sql/function/or';
import { greaterThan } from '../../sql/function/greater-than';

describe('delete', () => {
  it('should delete without conditions', () => {
    expectedSql({
      delete: table(User),
    }, 'DELETE FROM "auth"."user"');
  });

  it('should delete with equal condition', () => {
    expectedSql({
      delete: table(User),
      where: equal(field(User, 'id'), '1')
    }, 'DELETE FROM "auth"."user" WHERE "auth"."user"."id" = $1', ['1']);
  });

  it('should delete with equal condition', () => {
    expectedSql({
      delete: table(User),
      where: or(
        equal(field(User, 'id'), '1'),
        greaterThan(field(User, 'loginCount'), 1)
      )
    }, 'DELETE FROM "auth"."user" WHERE ("auth"."user"."id" = $1 OR "auth"."user"."loginCount" > $2)', ['1', 1]);
  });
});
