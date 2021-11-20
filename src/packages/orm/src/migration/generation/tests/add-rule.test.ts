import { allow } from '@daita/relational';
import { field } from '@daita/relational';
import { authorized } from '@daita/relational';
import { RelationalSchema } from '../../../schema/relational-schema';
import { table } from '@daita/relational';

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
