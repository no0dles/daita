import {setupEnv} from '../test/utils';

describe('cli diagram', () => {
  it(`should create diagram`, setupEnv('auth-diagram', async ctx => {
    await ctx.run('diagram');
    await ctx.exists('docs/schema.svg');
  }, {schema: 'auth-schema'}));
});