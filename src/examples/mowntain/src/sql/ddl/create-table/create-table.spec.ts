import { CreateTableSql, table } from '@daita/relational';
import { cleanupTestContext, getMowntainTestContext, seedMowntainData } from '../../../testing';

describe('relational/sql/ddl/create-table', () => {
  const ctx = getMowntainTestContext();

  beforeAll(async () => {
    await seedMowntainData(ctx);
  });

  afterAll(async () => cleanupTestContext(ctx));

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
