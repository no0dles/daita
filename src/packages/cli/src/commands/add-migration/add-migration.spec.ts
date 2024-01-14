import { addMigration } from './add-migration';
import { setupEnv } from '@daita/testing';
import { schemaRoot } from '../../testing';

describe('cli/commands/migration:add', () => {
  it(
    `should add migration`,
    setupEnv(
      schemaRoot,
      'add-migration',
      async (ctx) => {
        await ctx.linkNodeModules();
        await addMigration('init', { cwd: ctx.cwd });
        await ctx.exists('src/migrations');
        await ctx.exists('src/migrations', /[0-9\-]+-init.ts/);
      },
      { schema: 'auth-schema' },
    ),
  );

  it(
    `should support inline migration`,
    setupEnv(
      schemaRoot,
      'add-inline-migration',
      async (ctx) => {
        await ctx.linkNodeModules();
        await addMigration('second', { cwd: ctx.cwd });
        await ctx.exists('src/migrations');
        await ctx.exists('src/migrations', /[0-9\-]+-second\.ts/);
      },
      { schema: 'inline-migration' },
    ),
  );

  it(
    `should add empty migration`,
    setupEnv(
      schemaRoot,
      'add-empty-migration',
      async (ctx) => {
        await ctx.linkNodeModules();
        await addMigration('second', { cwd: ctx.cwd });
        await ctx.exists('src/migrations');
        await ctx.notExists('src/migrations', /(-|[0-9])+-second\.ts/);
      },
      { schema: 'auth-schema-migrated' },
    ),
  );

  it(
    `should add second migration`,
    setupEnv(
      schemaRoot,
      'add-second-migration',
      async (ctx) => {
        await ctx.linkNodeModules();
        await addMigration('second', { cwd: ctx.cwd });
        await ctx.exists('src/migrations');
        await ctx.exists('src/migrations', /[0-9\-]+-second\.ts/);
      },
      { schema: 'auth-schema-partial-migrated' },
    ),
  );
});
