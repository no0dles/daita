import { setupEnv } from '../../testing/cli/utils.test';
import { create } from './create';

describe('packages/create', () => {
  it(
    `should create new sqlite project`,
    setupEnv(
      'create-sqlite',
      async (ctx) => {
        await create({
          cwd: ctx.cwd,
          adapter: 'sqlite',
          npmClient: 'none',
          skipInstall: true,
          projectName: 'getting-started',
        });
      },
      { schema: 'empty' },
    ),
  );

  it(
    `should create new pg project`,
    setupEnv(
      'create-pg',
      async (ctx) => {
        await create({
          cwd: ctx.cwd,
          adapter: 'pg',
          npmClient: 'none',
          skipInstall: true,
          projectName: 'getting-started',
        });
      },
      { schema: 'empty' },
    ),
  );
});
