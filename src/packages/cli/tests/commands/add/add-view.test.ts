import { equal, field, table } from '../../../../relational/sql/function';
import { RelationalSchema } from '../../../../orm/schema';

export class User {
  id!: string;
  admin!: boolean;
}

export class AdminUser {
  id!: string;
}

const schema = new RelationalSchema();
schema.table(User);
schema.view(AdminUser, {
  select: { id: field(User, 'id') },
  from: table(User),
  where: equal(field(User, 'admin'), true),
});
