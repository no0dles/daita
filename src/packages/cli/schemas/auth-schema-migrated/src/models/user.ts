import { allow, table, anything, authorized, equal, field, requestContext } from '@daita/relational';

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
