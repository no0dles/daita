import { field } from '../../sql/function/field';
import { table } from '../../sql/function/table';
import { join } from '../../sql/function/join';
import { equal } from '../../sql/function/equal';
import { expectedSql } from '../formatter.test';
import { User } from '../schema/user';
import { Role } from '../schema/role';
import { UserRole } from '../schema/user-role';

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
