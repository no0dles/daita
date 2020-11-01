import { expectedSql } from '../formatter.test';
import { User } from '../schema/user';
import { table } from '../../sql/function/table';
import { field } from '../../sql/function/field';

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
