import {setupEnv} from './utils';

describe('cli migration:add', () => {
  it(`should add migration`, setupEnv('add-migration', async (ctx) => {
    await ctx.run('migration:add init');
    await ctx.exists('src/migrations');
    await ctx.exists('src/migrations', /[0-9]+\-init.ts/);
  }, {schema: 'auth-schema'}));
});
