import { expectedSql } from '../../../../../testing/relational/formatter.test';
import { table } from '../../keyword/table/table';
import { User } from '../../../../../examples/mowntain/models/user';
import { equal } from '../../operands/comparison/equal/equal';
import { field } from '../../keyword/field/field';
import { subSelect } from '../select/subquery/sub-select';
import { alias } from '../../keyword/alias/alias';

describe('delete/subselect', () => {
  it('should delete with subselect condition', () => {
    expectedSql(
      {
        delete: table(User),
        where: equal(
          subSelect({
            select: field(alias(User, 'u'), 'id'),
            from: alias(User, 'u'),
            where: equal(field(alias(User, 'u'), 'createdFromId'), '2'),
          }),
          field(User, 'id'),
        ),
      },
      'DELETE FROM "auth"."user" WHERE (SELECT "u"."id" FROM "auth"."user" "u" WHERE "u"."createdFromId" = $1) = "auth"."user"."id"',
      ['2'],
    );
  });
});
