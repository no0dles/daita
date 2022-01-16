import { table } from '@daita/relational';
import { cleanupTestContext, getMowntainTestContext, seedMowntainData } from '../../../testing';
import { Person } from '../../../models/person';

describe('relational/sql/ddl/alter-table', () => {
  const ctx = getMowntainTestContext({
    alterTable: table(Person),
    drop: {
      column: 'firstName',
    },
  });

  beforeAll(async () => {
    await seedMowntainData(ctx);
  });

  afterAll(async () => cleanupTestContext(ctx));

  it('should drop column', async () => {
    await ctx.exec({
      alterTable: table(Person),
      drop: {
        column: 'firstName',
      },
    });
  });
});
