import { field } from '../../relational/sql/function/field';
import { Role } from '../models/role';
import { table } from '../../relational/sql/function/table';
import { join } from '../../relational/sql/function/join';
import { UserRole } from '../models/user-role';
import { equal } from '../../relational/sql/function/equal';
import { and } from '../../relational/sql/function/and';
import { TransactionClient } from '../../relational/client/transaction-client';

export function getRoles(client: TransactionClient<any>, userPoolId: string, username: string) {
  return client.select({
    select: field(Role, 'name'),
    from: table(Role),
    join: [join(UserRole, equal(field(UserRole, 'roleName'), field(Role, 'name')))],
    where: and(equal(field(UserRole, 'userUsername'), username), equal(field(Role, 'userPoolId'), userPoolId)),
  });
}
