import { setupEnv } from './utils.test';
import { addMigration } from '../commands/add-migration';
import { undoMigration } from '../commands/undo-migration';

describe('parse', () => {
  it(`should add migration`, setupEnv('parse-migration', async (ctx) => {
    await addMigration('init', {cwd: ctx.cwd});
  }, { schema: 'auth-schema' }));
  it(`should add and undo migration`, setupEnv('parse2-migration', async (ctx) => {
    await addMigration('init', {cwd: ctx.cwd});
    await undoMigration({cwd: ctx.cwd});
  }, { schema: 'auth-schema' }));
});
