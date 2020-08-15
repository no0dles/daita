import {setupEnv} from '../test/utils.test';

describe('cli diagram', () => {
  it(`should create diagram`, setupEnv('create-diagram', async ctx => {
    await ctx.run('diagram').finished;
    await ctx.exists('docs/schema.svg');
  }, {schema: 'auth-schema'}));
});
