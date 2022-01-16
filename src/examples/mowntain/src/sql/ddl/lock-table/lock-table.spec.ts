import { table } from '@daita/relational';
import { cleanupTestContext, getMowntainTestContext, seedMowntainData } from '../../../testing';
import { Person } from '../../../models/person';

describe('relational/sql/ddl/lock-table', () => {
  const ctx = getMowntainTestContext({ lockTable: table(Person) });

  beforeAll(async () => {
    await seedMowntainData(ctx);
  });

  afterAll(async () => cleanupTestContext(ctx));

  it('should lock person table', async () => {
    await ctx.transaction(async (trx) => {
      await trx.exec({
        lockTable: table(Person),
      });
    });
  });
});
