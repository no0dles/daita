import { field } from '../../../keyword/field/field';
import { table } from '../../../keyword/table/table';
import { join } from './join';
import { equal } from '../../../operands/comparison/equal/equal';
import { expectedSql } from '../../../../../../testing/relational/formatter.test';
import { User } from '../../../../../../examples/mowntain/models/user';
import { Role } from '../../../../../../examples/mowntain/models/role';
import { UserRole } from '../../../../../../examples/mowntain/models/user-role';

describe('select/join', () => {
  it('should join User, UserRole and Role', () => {
    expectedSql(
      {
        select: {
          userId: field(User, 'id'),
          roleName: field(Role, 'name'),
        },
        from: table(User),
        join: [
          join(UserRole, equal(field(UserRole, 'userId'), field(User, 'id'))),
          join(Role, equal(field(UserRole, 'roleId'), field(Role, 'id'))),
        ],
      },
      'SELECT "auth"."user"."id" AS "userId", "Role"."name" AS "roleName" FROM "auth"."user" JOIN "UserRole" ON "UserRole"."userId" = "auth"."user"."id" JOIN "Role" ON "UserRole"."roleId" = "Role"."id"',
    );
  });
});
