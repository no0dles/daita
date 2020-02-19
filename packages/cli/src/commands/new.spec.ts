import {setupEnv} from '../test/utils';

describe('cli new', () => {
  it(`should create new project without install`, setupEnv('new-example', async (ctx) => {
    await ctx.run('new example --skip-install --database=postgres --license=MIT');
    await ctx.exists('example');
    await ctx.contains('example', [
      'config', 'src', 'test', 'Dockerfile', 'docker-compose.yaml', 'package.json', 'README.md', 'tsconfig.json',
    ]);
  }));
});