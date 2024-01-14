import { CreateTableSql, RelationalAdapter, table } from '@daita/relational';
import { seedMowntainData } from '../../../testing';
import { RelationalOrmAdapter } from '@daita/orm';

describe('relational/sql/ddl/create-table', () => {
  let ctx: RelationalOrmAdapter & RelationalAdapter<any>;

  beforeAll(async () => {
    ctx = await seedMowntainData();
  });

  afterAll(async () => ctx.close());

  it('should create person table', async () => {
    await ctx.exec({
      createTable: table('foo'),
      columns: [
        {
          name: 'id',
          notNull: false,
          primaryKey: true,
          type: 'number',
        },
      ],
    } as CreateTableSql);
  });
});
