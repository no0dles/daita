import { allow, authorized, field, table } from '@daita/relational';
import { RelationalSchema } from '@daita/orm';

export class User {
  id!: string;
  admin!: boolean;
}

export const userRule = allow(authorized(), {
  select: field(User, 'id'),
  from: table(User),
});
export const userRuleId = 'old_value';

export const schema = new RelationalSchema();
schema.table(User);
schema.rules([userRule]);

schema.migration({
  id: 'first',
  steps: [
    {kind: 'add_table', table: 'User'},
    {kind: 'add_table_field', table: 'User', fieldName: 'id', required: true, type: 'string'},
    {kind: 'add_table_field', table: 'User', fieldName: 'admin', required: true, type: 'boolean'},
    {kind: 'add_table_primary_key', table: 'User', fieldNames: ['id']},
    {kind: 'add_rule', ruleId: userRuleId, rule: userRule },
  ],
})
