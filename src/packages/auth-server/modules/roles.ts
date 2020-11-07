import { field } from '../../relational/sql/keyword/field/field';
import { Role } from '../models/role';
import { table } from '../../relational/sql/keyword/table/table';
import { join } from '../../relational/sql/dml/select/join/join';
import { UserRole } from '../models/user-role';
import { equal } from '../../relational/sql/operands/comparison/equal/equal';
import { and } from '../../relational/sql/keyword/and/and';
import { TransactionClient } from '../../relational/client/transaction-client';

export function getRoles(client: TransactionClient<any>, userPoolId: string, username: string) {
  return client.select({
    select: field(Role, 'name'),
    from: table(Role),
    join: [join(UserRole, equal(field(UserRole, 'roleName'), field(Role, 'name')))],
    where: and(equal(field(UserRole, 'userUsername'), username), equal(field(Role, 'userPoolId'), userPoolId)),
  });
}
