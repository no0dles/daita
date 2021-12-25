import { setupEnv } from '@daita/testing';
import { create } from '@daita/create';
import { schemaRoot } from '../testing';

describe('packages/create', () => {
  it(
    `should create new sqlite project`,
    setupEnv(
      schemaRoot,
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
      schemaRoot,
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
