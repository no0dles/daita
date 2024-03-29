import { RelationalSchema } from '@daita/orm';

export class User {
  id!: string;
  admin!: boolean;
}

const schema = new RelationalSchema('test');
schema.table(User);
schema.seed(User, [
  { id: 'a', admin: false },
  { id: 'b', admin: true },
]);
