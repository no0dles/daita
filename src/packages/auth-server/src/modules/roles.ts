import { field } from '@daita/relational';
import { Role } from '../models/role';
import { table } from '@daita/relational';
import { join } from '@daita/relational';
import { UserRole } from '../models/user-role';
import { equal } from '@daita/relational';
import { and } from '@daita/relational';
import { Client } from '@daita/relational';

export function getRoles(client: Client<any>, userPoolId: string, username: string) {
  return client.select({
    select: field(Role, 'name'),
    from: table(Role),
    join: [join(UserRole, equal(field(UserRole, 'roleName'), field(Role, 'name')))],
    where: and(equal(field(UserRole, 'userUsername'), username), equal(field(Role, 'userPoolId'), userPoolId)),
  });
}
