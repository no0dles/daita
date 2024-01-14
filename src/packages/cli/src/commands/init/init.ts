import * as fs from 'fs';
import * as path from 'path';
import { createLogger } from '@daita/common';
import { create } from '@daita/create';
import { popPath } from '@daita/node';

const logger = createLogger({ package: 'cli', command: 'init' });

export async function init(options: {
  cwd?: string;
  adapter?: 'pg' | 'sqlite';
  skipInstall?: boolean;
  npmClient?: 'npm' | 'yarn' | 'none';
}) {
  const projectDir = options.cwd || process.cwd();
  const { start, end } = popPath(projectDir);

  const cliFile = path.join(options.cwd || process.cwd(), 'daita.json');
  if (fs.existsSync(cliFile)) {
    logger.warn('daita.json already exists');
    return;
  }

  await create({
    cwd: start,
    projectName: end,
    adapter: options.adapter,
    skipInstall: options.skipInstall,
    npmClient: options.npmClient,
  });
}
