import { allow } from '../../../relational/permission/function/allow';
import { field } from '../../../relational/sql/keyword/field/field';
import { authorized } from '../../../relational/permission/function/authorized';
import { RelationalSchema } from '../../../orm/schema/relational-schema';
import { getRuleId } from '../../../orm/migration/generation/rule-id';
import { table } from '../../../relational/sql/keyword/table/table';

export class User {
  id!: string;
  admin!: boolean;
}

export const userRule = allow(authorized(), {
  select: field(User, 'id'),
  from: table(User),
});
export const userRuleId = getRuleId(userRule);

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
