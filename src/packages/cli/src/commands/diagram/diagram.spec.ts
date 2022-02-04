import { diagram } from './diagram';
import { setupEnv } from '@daita/testing';
import { schemaRoot } from '../../testing';

describe('cli/commands/diagram', () => {
  it(
    `should create diagram`,
    setupEnv(
      schemaRoot,
      'create-diagram',
      async (ctx) => {
        await ctx.linkNodeModules();
        await diagram({ cwd: ctx.cwd });
        await ctx.exists('docs', /^schema\.svg$/);
      },
      { schema: 'auth-schema' },
    ),
  );
});
