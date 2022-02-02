import { AscentPerson } from '../../../models/ascent-person';
import { seedMowntainData } from '../../../testing';
import { RelationalAdapter, table } from '@daita/relational';
import { RelationalOrmAdapter } from '@daita/orm';

describe('relational/sql/ddl/drop-table', () => {
  let ctx: RelationalOrmAdapter & RelationalAdapter<any>;

  beforeAll(async () => {
    ctx = await seedMowntainData();
  });

  afterAll(async () => ctx.close());

  it('should create person table', async () => {
    await ctx.exec({
      dropTable: table(AscentPerson),
    });
  });

  it('should create person table if exists', async () => {
    await ctx.exec({
      dropTable: table(AscentPerson),
      ifExists: true,
    });
  });
});
