import { expectedSql } from '../../../../../testing/relational/formatter.test';
import { User } from '../../../../../examples/mowntain/models/user';
import { table } from '../../keyword/table/table';
import { field } from '../../keyword/field/field';

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
