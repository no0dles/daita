import { diagram } from './diagram';
import { setupEnv } from '@daita/testing';

describe('cli/commands/diagram', () => {
  it(
    `should create diagram`,
    setupEnv(
      'create-diagram',
      async (ctx) => {
        await ctx.linkNodeModules();
        await diagram({ cwd: ctx.cwd });
        await ctx.exists('docs', /^schema\.svg$/);
      },
      { schema: 'auth-schema' },
    ),
  );
});
