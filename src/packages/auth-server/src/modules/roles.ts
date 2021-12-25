import { field, SqlClient } from '@daita/relational';
import { table } from '@daita/relational';
import { join } from '@daita/relational';
import { equal } from '@daita/relational';
import { and } from '@daita/relational';
import { Role, UserRole } from '@daita/auth';

export function getRoles(client: SqlClient, userPoolId: string, username: string) {
  return client.select({
    select: field(Role, 'name'),
    from: table(Role),
    join: [join(UserRole, equal(field(UserRole, 'roleName'), field(Role, 'name')))],
    where: and(equal(field(UserRole, 'userUsername'), username), equal(field(Role, 'userPoolId'), userPoolId)),
  });
}
