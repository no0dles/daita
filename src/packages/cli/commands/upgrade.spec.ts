import { setupEnv } from '../../../testing/cli/utils.test';

describe('cli upgrade', () => {
  it(
    `should upgrade to latest`,
    setupEnv(
      'upgrade',
      async (ctx) => {
        const upgrade = await ctx.run('upgrade --skip-install');
        upgrade.onStdErr((err) => console.log(err));
        upgrade.onStdOut((err) => console.log(err));
        await upgrade.finished;
      },
      { schema: 'package-json' },
    ),
  );
});
