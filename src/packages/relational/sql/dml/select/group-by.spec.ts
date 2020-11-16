import { field } from '../../keyword/field/field';
import { count } from '../../function/aggregation/count/count';
import { table } from '../../keyword/table/table';
import { expectedSql } from '../../../../../testing/relational/formatter.test';
import { User } from '../../../../../docs/example/models/user';
import { greaterThan } from '../../operands/comparison/greater-than/greater-than';

describe('select/group-by', () => {
  it('should select group by disabled and select count', () => {
    expectedSql(
      {
        select: {
          disabled: field(User, 'disabled'),
          count: count(),
        },
        from: table(User),
        groupBy: field(User, 'disabled'),
      },
      'SELECT "auth"."user"."disabled" AS "disabled", count(*) AS "count" FROM "auth"."user" GROUP BY "auth"."user"."disabled"',
    );
  });

  it('should select group by with having', () => {
    expectedSql(
      {
        select: {
          disabled: field(User, 'disabled'),
          count: count(),
        },
        from: table(User),
        groupBy: field(User, 'disabled'),
        having: greaterThan(count(), 1),
      },
      'SELECT "auth"."user"."disabled" AS "disabled", count(*) AS "count" FROM "auth"."user" GROUP BY "auth"."user"."disabled" HAVING count(*) > $1',
      [1],
    );
  });
});
