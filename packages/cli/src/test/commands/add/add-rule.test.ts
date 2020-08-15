import { RelationalSchema } from '@daita/orm';
import { allow, authorized, equal, field, table } from '@daita/relational';

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
  })
]);
