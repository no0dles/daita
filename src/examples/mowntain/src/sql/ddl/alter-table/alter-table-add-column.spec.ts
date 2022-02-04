import { RelationalAdapter, table } from '@daita/relational';
import { seedMowntainData } from '../../../testing';
import { Person } from '../../../models/person';
import { RelationalOrmAdapter } from '@daita/orm';

describe('relational/sql/ddl/alter-table', () => {
  let ctx: RelationalOrmAdapter & RelationalAdapter<any>;

  beforeAll(async () => {
    ctx = await seedMowntainData();
  });

  afterAll(async () => ctx.close());

  it('should add column', async () => {
    await ctx.exec({
      alterTable: table(Person),
      add: {
        column: 'firstName2',
        type: 'string',
      },
    });
  });
});
