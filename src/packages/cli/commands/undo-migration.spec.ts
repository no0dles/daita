import { setupEnv } from '../tests/utils.test';

describe('cli migration:undo', () => {
  it(
    `should undo migration`,
    setupEnv(
      'undo-migration',
      async (ctx) => {
        await ctx.run('migration:undo').finished;
        await ctx.exists('src/migrations');
        await ctx.contains('src/migrations', []);
      },
      { schema: 'auth-schema-migrated' },
    ),
  );

  it(
    `should add and undo migration`,
    setupEnv(
      'add-undo-migration',
      async (ctx) => {
        await ctx.run('migration:add init').finished;
        await ctx.run('migration:undo').finished;
        await ctx.exists('src/migrations');
      },
      { schema: 'auth-schema' },
    ),
  );
});
