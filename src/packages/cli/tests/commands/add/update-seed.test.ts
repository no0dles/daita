import { RelationalSchema } from '../../../../orm/schema';

export class User {
  id!: string;
  admin!: boolean;
}

const schema = new RelationalSchema();
schema.table(User);
schema.migration({
  id: 'first',
  steps: [
    { kind: 'add_table', table: 'User' },
    {
      kind: 'add_table_field',
      table: 'User',
      fieldName: 'id',
      required: true,
      type: 'string',
    },
    {
      kind: 'add_table_field',
      table: 'User',
      fieldName: 'admin',
      required: true,
      type: 'boolean',
    },
    { kind: 'add_table_primary_key', table: 'User', fieldNames: ['id'] },
    {
      kind: 'insert_seed',
      table: 'User',
      keys: { id: 'a' },
      seed: { admin: false },
    },
  ],
});
schema.seed(User, [{ id: 'a', admin: true }]);
