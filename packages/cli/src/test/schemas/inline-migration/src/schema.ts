import { RelationalSchema } from '@daita/orm';

class User {
  username!: string;
  firstName!: string | null;
  lastName!: string | null;
  password!: string;
  email!: string;
}


const schema = new RelationalSchema();

schema.table(User, { key: ['username'] });
schema.migration({
  id: 'a',
  steps: [
    {kind: 'add_table', table: 'user'},
    {kind: 'add_table_field', table: 'user', type: 'string', fieldName: 'id', required: true},
    {kind: 'add_table_primary_key', table: 'user', fieldNames: ['id']},
  ],
});

export = schema;
