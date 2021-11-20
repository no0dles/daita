import { field } from '@daita/relational';
import { RelationalSchema } from '../../../schema/relational-schema';
import { table } from '@daita/relational';
import { equal } from '@daita/relational';

export class User {
  id!: string;
  admin!: boolean;
}

export class AdminUser {
  id!: string;
}

const schema = new RelationalSchema('test');
schema.table(User);
schema.view(AdminUser, {
  select: { id: field(User, 'id') },
  from: table(User),
  where: equal(field(User, 'admin'), true),
});
