import { expectedSql } from '../formatter.test';
import { field } from '../../sql/function';
import { User } from '../schema/user';
import { table } from '../../sql/function/table';

describe('select/nested', () => {
  it('should handle nested result', () => {
    expectedSql(
      {
        select: {
          foo: {
            name: field(User, 'name'),
          },
          bar: {
            id: field(User, 'id'),
          },
        },
        from: table(User),
      },
      'SELECT "auth"."user"."name" AS "foo.name", "auth"."user"."id" AS "bar.id" FROM "auth"."user"',
    );
  });
});
