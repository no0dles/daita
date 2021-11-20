import { setupEnv } from '@daita/testing/cli/utils.test';
import { addMigration } from './add-migration';

describe('cli/commands/migration:add', () => {
  it(
    `should add migration`,
    setupEnv(
      'add-migration',
      async (ctx) => {
        await addMigration('init', { cwd: ctx.cwd });
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
        await addMigration('second', { cwd: ctx.cwd });
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
        await addMigration('second', { cwd: ctx.cwd });
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
        await addMigration('second', { cwd: ctx.cwd });
        await ctx.exists('src/migrations');
        await ctx.exists('src/migrations', /[0-9]+\-second.ts/);
      },
      { schema: 'auth-schema-partial-migrated' },
    ),
  );
});
