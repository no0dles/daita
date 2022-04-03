import { RelationalSchema } from '@daita/orm';
import { table } from '@daita/relational';

export class User {
  id!: string;
  admin!: boolean;
}

const schema = new RelationalSchema('test');
schema.table(User);
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
  },
  down: (trx) => {
    trx.exec({
      dropTable: table(User),
    });
  },
});

schema.seed(User, [{ id: 'a', admin: true }]);
