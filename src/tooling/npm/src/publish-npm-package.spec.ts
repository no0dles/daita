import { buildNpmPackages, publishNpmPackages } from './npm';
import { promises as fs } from 'fs';
import { join } from 'path';
import { getNpmRegistry, NpmRegistry } from './npm-registry';
import { shell } from '@daita/node';
import { setupEnv } from '@daita/testing';

describe('scripts/publish-npm-package', () => {
  let registry: NpmRegistry;

  beforeAll(async () => {
    registry = await getNpmRegistry();
    await buildNpmPackages();
    await publishNpmPackages({ registry: registry.uri, version: '0.0.0-test' });
  }, 60000);

  afterAll(() => registry.stop());

  it(
    'should create empty daita project',
    setupEnv(
      join(__dirname, ' ../schemas'),
      'daita-create',
      async (ctx) => {
        await fs.writeFile(join(ctx.cwd, '.npmrc'), `registry=${registry.uri}`);
        await fs.writeFile(join(ctx.cwd, 'package.json'), '{"name": "test"}');
        await shell('npm', ['install', '@daita/create'], ctx.cwd);
        await shell('npm', ['init', '@daita', '--', '-p', 'getting-started', '--adapter', 'pg'], ctx.cwd, {
          env: { npm_config_registry: registry.uri },
        });
        await shell('npm', ['run', 'build'], join(ctx.cwd, 'getting-started'));
      },
      { schema: 'empty' },
    ),
    60000,
  );
});
