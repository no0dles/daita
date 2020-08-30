import { allow, authorized } from '../../../../relational/permission/function';
import { field, table } from '../../../../relational/sql/function';
import { RelationalSchema } from '../../../../orm/schema';

export class User {
  id!: string;
  admin!: boolean;
}

const schema = new RelationalSchema();
schema.table(User);
schema.rules([
  allow(authorized(), {
    select: field(User, 'id'),
    from: table(User),
  }),
]);
