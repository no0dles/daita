import { undoMigration } from './undo-migration';
import { addMigration } from '../add-migration/add-migration';
import { setupEnv } from '@daita/testing';
import { schemaRoot } from '../../testing';

describe('cli/commands/migration-undo', () => {
  it(
    `should undo migration`,
    setupEnv(
      schemaRoot,
      'undo-migration',
      async (ctx) => {
        await ctx.linkNodeModules();
        await undoMigration({ cwd: ctx.cwd });
        await ctx.exists('src/migrations');
        await ctx.contains('src/migrations', ['202016152817-init.ts']);
      },
      { schema: 'auth-schema-migrated' },
    ),
  );

  it(
    `should add and undo migration`,
    setupEnv(
      schemaRoot,
      'add-undo-migration',
      async (ctx) => {
        await ctx.linkNodeModules();
        await addMigration('init', { cwd: ctx.cwd });
        await undoMigration({ cwd: ctx.cwd });
        await ctx.exists('src/migrations');
      },
      { schema: 'auth-schema' },
    ),
  );
});
