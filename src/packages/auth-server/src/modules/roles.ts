import { field } from '@daita/relational/sql/keyword/field/field';
import { Role } from '../models/role';
import { table } from '@daita/relational/sql/keyword/table/table';
import { join } from '@daita/relational/sql/dml/select/join/join';
import { UserRole } from '../models/user-role';
import { equal } from '@daita/relational/sql/operands/comparison/equal/equal';
import { and } from '@daita/relational/sql/keyword/and/and';
import { Client } from '@daita/relational/client/client';

export function getRoles(client: Client<any>, userPoolId: string, username: string) {
  return client.select({
    select: field(Role, 'name'),
    from: table(Role),
    join: [join(UserRole, equal(field(UserRole, 'roleName'), field(Role, 'name')))],
    where: and(equal(field(UserRole, 'userUsername'), username), equal(field(Role, 'userPoolId'), userPoolId)),
  });
}
