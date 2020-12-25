import { allow, anything, authorized, field, table } from '../../../../../../packages/relational';
import { equal } from '../../../../../../packages/relational/sql/operands/comparison/equal/equal';
import { requestContext } from '../../../../../../packages/relational/permission/function/request-context';

export class User {
  username!: string;
  firstName!: string | null;
  lastName!: string | null;
  password!: string;
  email!: string;
}

export const userRules = [
  allow(authorized(), {
    update: table(User),
    set: {
      password: anything(),
    },
    where: equal(field(User, 'username'), requestContext().userId),
  }),
];
