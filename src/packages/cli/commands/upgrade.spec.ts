import { setupEnv } from '../tests/utils.test';

describe('cli upgrade', () => {
  it(
    `should upgrade to latest`,
    setupEnv(
      'upgrade',
      async (ctx) => {
        await ctx.run('upgrade').finished;
      },
      { schema: 'package-json' },
    ),
  );
});
