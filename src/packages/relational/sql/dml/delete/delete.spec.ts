import { expectedSql } from '../../../../../testing/relational/formatter.test';
import { table } from '../../keyword/table/table';
import { User } from '../../../../../docs/example/models/user';
import { equal } from '../../operands/comparison/equal/equal';
import { field } from '../../keyword/field/field';
import { or } from '../../keyword/or/or';
import { greaterThan } from '../../operands/comparison/greater-than/greater-than';

describe('delete', () => {
  it('should delete without conditions', () => {
    expectedSql(
      {
        delete: table(User),
      },
      'DELETE FROM "auth"."user"',
    );
  });

  it('should delete with equal condition', () => {
    expectedSql(
      {
        delete: table(User),
        where: equal(field(User, 'id'), '1'),
      },
      'DELETE FROM "auth"."user" WHERE "auth"."user"."id" = $1',
      ['1'],
    );
  });

  it('should delete with equal condition', () => {
    expectedSql(
      {
        delete: table(User),
        where: or(equal(field(User, 'id'), '1'), greaterThan(field(User, 'loginCount'), 1)),
      },
      'DELETE FROM "auth"."user" WHERE ("auth"."user"."id" = $1 OR "auth"."user"."loginCount" > $2)',
      ['1', 1],
    );
  });
});
