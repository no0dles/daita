import { setupEnv } from '@daita/testing/cli/utils.test';
import { upgrade } from './upgrade';

describe('cli/commands/upgrade', () => {
  it(
    `should upgrade to latest`,
    setupEnv(
      'upgrade',
      async (ctx) => {
        await upgrade({ cwd: ctx.cwd, skipInstall: true });
      },
      { schema: 'package-json' },
    ),
  );
});
