import { RelationalAdapter, table } from '@daita/relational';
import { seedMowntainData } from '../../../testing';
import { Person } from '../../../models/person';
import { RelationalOrmAdapter } from '@daita/orm';

describe('relational/sql/ddl/lock-table', () => {
  let ctx: RelationalOrmAdapter & RelationalAdapter<any>;

  beforeAll(async () => {
    ctx = await seedMowntainData();
  });

  afterAll(async () => ctx.close());

  it('should lock person table', async () => {
    await ctx.transaction(async (trx) => {
      await trx.exec({
        lockTable: table(Person),
      });
    });
  });
});
