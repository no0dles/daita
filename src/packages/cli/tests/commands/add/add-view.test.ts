import { field } from '../../../../relational/sql/function/field';
import { RelationalSchema } from '../../../../orm/schema/relational-schema';
import { table } from '../../../../relational/sql/function/table';
import { equal } from '../../../../relational/sql/function/equal';

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
