import { AscentPerson } from '../../../models/ascent-person';
import { cleanupTestContext, getMowntainTestContext, seedMowntainData } from '../../../testing';
import { table } from '@daita/relational';

describe('relational/sql/ddl/drop-table', () => {
  const ctx = getMowntainTestContext();

  beforeAll(async () => {
    await seedMowntainData(ctx);
  });

  afterAll(async () => cleanupTestContext(ctx));

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
