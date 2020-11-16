import * as fs from 'fs';
import * as path from 'path';
import { createLogger } from '../../../common/utils/logger';
import { create } from '../../../create/create';
import { popPath } from '../../../node/path';

const logger = createLogger({ package: 'cli', command: 'init' });

export async function init(options: { cwd?: string; adapter?: string; skipInstall?: boolean; npmClient?: string }) {
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
