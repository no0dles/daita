import { publishNpmPackages } from './npm';
import { promises as fs } from 'fs';
import path from 'path';
import { getNpmRegistry, NpmRegistry } from './npm-registry';
import { shell } from '@daita/node';
import { setupEnv } from '@daita/testing';

describe('scripts/publish-npm-package', () => {
  let registry: NpmRegistry;

  beforeAll(async () => {
    registry = await getNpmRegistry();
    await publishNpmPackages({ registry: registry.uri, version: '0.0.0-test' });
  }, 60000);

  afterAll(() => registry.stop());

  it(
    'should create empty daita project',
    setupEnv(
      'daita-create',
      async (ctx) => {
        await fs.writeFile(path.join(ctx.cwd, '.npmrc'), `registry=${registry.uri}`);
        await fs.writeFile(path.join(ctx.cwd, 'package.json'), '{"name": "test"}');
        await shell('npm', ['init', '@daita', '-p', 'getting-started', '--adapter', 'pg'], ctx.cwd, {
          env: { npm_config_registry: registry.uri },
        });
        await shell('npm', ['run', 'build'], path.join(ctx.cwd, 'getting-started'));
      },
      { schema: 'empty' },
    ),
  );
});
