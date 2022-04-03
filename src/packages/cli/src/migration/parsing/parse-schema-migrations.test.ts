import { RelationalSchema } from '@daita/orm';
import { table } from '@daita/relational';

const schema = new RelationalSchema('test');

schema.migration({
  id: 'Test',
  up: (trx) => {
    trx.exec({
      createTable: table('User'),
      columns: [],
    });
    trx.exec({
      insert: {},
      into: table('User'),
    });
  },
  down: (trx) => {
    trx.exec({
      dropTable: table('User'),
    });
  },
});
