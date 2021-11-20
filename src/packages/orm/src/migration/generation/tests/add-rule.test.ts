import { allow } from '@daita/relational/permission/function/allow';
import { field } from '@daita/relational/sql/keyword/field/field';
import { authorized } from '@daita/relational/permission/function/authorized';
import { RelationalSchema } from '../../../schema/relational-schema';
import { table } from '@daita/relational/sql/keyword/table/table';

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
