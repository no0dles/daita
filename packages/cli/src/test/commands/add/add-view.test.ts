import { RelationalSchema } from '@daita/orm';
import { equal, field, table } from '@daita/relational';

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
