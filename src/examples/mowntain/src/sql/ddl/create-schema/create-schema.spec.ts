import { testContext } from '../../../testing';

describe('relational/sql/ddl/create-schema', () => {
  const ctxs = testContext.contexts({
    createSchema: 'test',
  });

  describe.each(ctxs)('%s', (ctx) => {
    beforeAll(async () => {
      await ctx.setup();
    });

    afterAll(async () => ctx.close());

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
});
