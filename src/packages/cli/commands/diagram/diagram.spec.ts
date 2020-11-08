import { setupEnv } from '../../../../testing/cli/utils.test';
import { diagram } from './diagram';

describe('cli/commands/diagram', () => {
  it(
    `should create diagram`,
    setupEnv(
      'create-diagram',
      async (ctx) => {
        await diagram({ cwd: ctx.cwd });
        await ctx.exists('docs', /^schema\.svg$/);
      },
      { schema: 'auth-schema' },
    ),
  );
});
