import { allow } from '@daita/relational';
import { field } from '@daita/relational';
import { authorized } from '@daita/relational';
import { table } from '@daita/relational';
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

export const schema = new RelationalSchema('test');
schema.table(User);
schema.rules([userRule]);

schema.migration({
  id: 'first',
  up: (trx) => {
    trx.exec({
      createTable: table(User),
      columns: [
        {
          name: 'id',
          type: 'VARCHAR',
          primaryKey: true,
          notNull: true,
        },
        {
          name: 'admin',
          type: 'BOOLEAN',
          notNull: true,
        },
      ],
    });
    trx.exec({
      insert: { id: 'a', admin: false },
      into: table(User),
    });
    // { kind: 'add_rule', ruleId: userRuleId, rule: userRule }, // TODO
  },
  down: (trx) => {
    trx.exec({
      dropTable: table(User),
    });
  },
});
