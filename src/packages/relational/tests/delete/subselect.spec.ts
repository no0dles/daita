import { expectedSql } from '../formatter.test';
import { table } from '../../sql/function/table';
import { User } from '../schema/user';
import { equal } from '../../sql/function/equal';
import { field } from '../../sql/function/field';
import { subSelect } from '../../sql/function/sub-select';
import { alias } from '../../sql/function/alias';

describe('delete/subselect', () => {
  it('should delete with subselect condition', () => {
    expectedSql({
      delete: table(User),
      where: equal(subSelect({
        select: field(alias(User, 'u'), 'id'),
        from: alias(User, 'u'),
        where: equal(field(alias(User, 'u'), 'createdFromId'), '2')
      }), field(User, 'id'))
    }, 'DELETE FROM "auth"."user" WHERE (SELECT "u"."id" FROM "auth"."user" "u" WHERE "u"."createdFromId" = $1) = "auth"."user"."id"', ['2']);
  });
});
