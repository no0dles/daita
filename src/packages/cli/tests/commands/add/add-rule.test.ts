import { allow } from '../../../../relational/permission/function/allow';
import { field } from '../../../../relational/sql/function/field';
import { authorized } from '../../../../relational/permission/function/authorized';
import { RelationalSchema } from '../../../../orm/schema/relational-schema';
import { table } from '../../../../relational/sql/function/table';

export class User {
  id!: string;
  admin!: boolean;
}

const schema = new RelationalSchema('test');
schema.table(User);
schema.rules([
  allow(authorized(), {
    select: field(User, 'id'),
    from: table(User),
  }),
]);
