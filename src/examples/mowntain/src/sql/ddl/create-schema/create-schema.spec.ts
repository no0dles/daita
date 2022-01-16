import { cleanupTestContext, getMowntainTestContext, seedMowntainData } from '../../../testing';

describe('relational/sql/ddl/create-schema', () => {
  const ctx = getMowntainTestContext({
    createSchema: 'test',
  });

  beforeAll(async () => {
    await seedMowntainData(ctx);
  });

  afterAll(async () => cleanupTestContext(ctx));

  it('should create schema', async () => {
    await ctx.exec({
      createSchema: 'auth',
    });
  });

  it('should create schema if not exists', async () => {
    await ctx.exec({
      createSchema: 'auth',
      ifNotExists: true,
    });
  });
});
