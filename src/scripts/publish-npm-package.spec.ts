import { publishNpmPackages } from './npm';
import { getNpmRegistry, NpmRegistry } from '../testing/npm-registry';
import { shell } from './shell';
import fs from 'fs/promises';
import path from 'path';
import { setupEnv } from '../testing/cli/utils.test';

describe.skip('scripts/publish-npm-package', () => {
  let registry: NpmRegistry;

  beforeAll(async () => {
    registry = await getNpmRegistry();
    await publishNpmPackages({ registry: registry.uri, version: '0.0.0-test' });
    //registry = { uri: 'http://localhost:63861', stop: async () => {} };
  }, 60000);

  //afterAll(() => registry.stop());

  it(
    'should create empty daita project',
    setupEnv(
      'daita-create',
      async (ctx) => {
        await fs.writeFile(path.join(ctx.cwd, '.npmrc'), `@daita:registry=${registry.uri}`);
        await shell('npm', ['install', '@daita/create', '@daita/common'], ctx.cwd, {
          env: { npm_config_registry: registry.uri },
        });
        // await shell('npm', ['init', '@daita', '-p', 'getting-started', '--adapter', 'pg', '--skip-install'], ctx.cwd, {
        //   env: { npm_config_registry: registry.uri },
        // });
        //await fs.writeFile(path.join(ctx.cwd, 'getting-started/.npmrc'), `@daita:registry=${registry.uri}`);
      },
      { schema: 'empty' },
    ),
  );
});
