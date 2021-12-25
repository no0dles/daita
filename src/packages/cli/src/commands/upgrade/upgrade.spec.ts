import { upgrade } from './upgrade';
import { setupEnv } from '@daita/testing';
import { schemaRoot } from '../../testing';

describe('cli/commands/upgrade', () => {
  it(
    `should upgrade to latest`,
    setupEnv(
      schemaRoot,
      'upgrade',
      async (ctx) => {
        await upgrade({ cwd: ctx.cwd, skipInstall: true });
      },
      { schema: 'package-json' },
    ),
  );
});
