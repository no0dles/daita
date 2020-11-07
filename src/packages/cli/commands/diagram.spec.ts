import { setupEnv } from '../tests/utils.test';

describe('cli diagram', () => {
  it(
    `should create diagram`,
    setupEnv(
      'create-diagram',
      async (ctx) => {
        const diagram = await ctx.run('diagram');
        diagram.onStdErr((err) => console.log(err));
        diagram.onStdOut((err) => console.log(err));
        await diagram.finished;
        await ctx.exists('docs', /^schema\.svg$/);
      },
      { schema: 'auth-schema' },
    ),
  );
});
