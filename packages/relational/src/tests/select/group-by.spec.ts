import { field } from '../../sql/function/field';
import { count } from '../../sql/function/count';
import { table } from '../../sql/function/table';
import { expectedSql } from '../formatter.test';
import { User } from '../schema/user';
import { greaterThan } from '../../sql/function';

describe('select/group-by', () => {
  it('should select group by disabled and select count', () => {
    expectedSql({
      select: {
        disabled: field(User, 'disabled'),
        count: count(),
      },
      from: table(User),
      groupBy: field(User, 'disabled'),
    }, 'SELECT "auth"."user"."disabled" AS "disabled", count(*) AS "count" FROM "auth"."user" GROUP BY "auth"."user"."disabled"');
  });

  it('should select group by with having', () => {
    expectedSql({
      select: {
        disabled: field(User, 'disabled'),
        count: count(),
      },
      from: table(User),
      groupBy: field(User, 'disabled'),
      having: greaterThan(count(), 1),
    }, 'SELECT "auth"."user"."disabled" AS "disabled", count(*) AS "count" FROM "auth"."user" GROUP BY "auth"."user"."disabled" HAVING BY count(*) > $1', [1]);
  });
});
