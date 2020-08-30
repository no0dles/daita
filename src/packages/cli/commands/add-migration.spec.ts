import { setupEnv } from '../tests/utils.test';

describe('cli migration:add', () => {
  it(
    `should add migration`,
    setupEnv(
      'add-migration',
      async (ctx) => {
        await ctx.run('migration:add init').finished;
        await ctx.exists('src/migrations');
        await ctx.exists('src/migrations', /[0-9]+\-init.ts/);
      },
      { schema: 'auth-schema' },
    ),
  );

  it(
    `should support inline migration`,
    setupEnv(
      'add-inline-migration',
      async (ctx) => {
        const add = ctx.run('migration:add second');
        add.onStdErr((err) => console.log(err));
        add.onStdOut((err) => console.log(err));
        await add.finished;
        await ctx.exists('src/migrations');
        await ctx.exists('src/migrations', /[0-9]+\-second.ts/);
      },
      { schema: 'inline-migration' },
    ),
  );

  it(
    `should add empty migration`,
    setupEnv(
      'add-empty-migration',
      async (ctx) => {
        await ctx.run('migration:add second').finished;
        await ctx.exists('src/migrations');
        await ctx.notExists('src/migrations', /[0-9]+\-second.ts/);
      },
      { schema: 'auth-schema-migrated' },
    ),
  );

  it(
    `should add second migration`,
    setupEnv(
      'add-second-migration',
      async (ctx) => {
        const add = ctx.run('migration:add second');
        add.onStdOut((err) => console.log(err));
        add.onStdErr((err) => console.log(err));
        await add.finished;
        await ctx.exists('src/migrations');
        await ctx.exists('src/migrations', /[0-9]+\-second.ts/);
      },
      { schema: 'auth-schema-partial-migrated' },
    ),
  );
});
