import { allow } from '@daita/relational/permission/function/allow';
import { field } from '@daita/relational/sql/keyword/field/field';
import { authorized } from '@daita/relational/permission/function/authorized';
import { RelationalSchema } from '../../../schema/relational-schema';
import { table } from '@daita/relational/sql/keyword/table/table';

export class User {
  id!: string;
  admin!: boolean;
}

export const userRule = allow(authorized(), {
  select: field(User, 'id'),
  from: table(User),
});
export const userRuleId = 'old_value';

export const schema = new RelationalSchema('test');
schema.table(User);
schema.rules([userRule]);

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
    { kind: 'add_rule', ruleId: userRuleId, rule: userRule },
  ],
});
