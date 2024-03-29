import * as path from 'path';
import * as fs from 'fs';
import * as https from 'https';
import { createLogger } from '@daita/common';
import { shell } from '@daita/node';

const logger = createLogger({ package: 'cli', command: 'upgrade' });

export async function upgrade(opts: { cwd?: string; npmClient?: string; skipInstall?: boolean }) {
  const cwd = opts.cwd ? path.resolve(opts.cwd) : process.cwd();
  const packagePath = path.join(cwd, 'package.json');
  if (!fs.existsSync(packagePath)) {
    throw new Error('could not locate package.json');
  }

  let pkg: any;
  try {
    const content = fs.readFileSync(packagePath).toString();
    pkg = JSON.parse(content);
  } catch (e) {
    throw new Error('unable to parse package.json');
  }

  let hasChanges = false;
  hasChanges = hasChanges || (await upgradeDependencies(pkg.dependencies));
  hasChanges = hasChanges || (await upgradeDependencies(pkg.devDependencies));
  if (!hasChanges) {
    logger.info('all daita packages are up to date');
    return;
  }

  fs.writeFileSync(packagePath, JSON.stringify(pkg, null, 2));
  logger.info('updated daita packages successfully');
  if (!opts.skipInstall) {
    await shell(opts.npmClient || 'npm', ['install'], cwd);
  }
}

async function upgradeDependencies(dependencies: any) {
  let hasChanges = false;
  for (const key of Object.keys(dependencies)) {
    if (!key.startsWith('@daita/')) {
      continue;
    }
    const daitaName = key.substr('@daita/'.length);
    const latestVersion = await getLatest(daitaName);
    const currentVersion = dependencies[key];
    if (currentVersion.startsWith('~') || currentVersion.startsWith('^')) {
      if (currentVersion.substr(1) !== latestVersion) {
        dependencies[key] = `${currentVersion[0]}${latestVersion}`;
        hasChanges = true;
      }
    } else {
      if (currentVersion !== latestVersion) {
        dependencies[key] = latestVersion;
        hasChanges = true;
      }
    }
  }
  return hasChanges;
}

function getLatest(daitaName: string): Promise<string> {
  const url = `https://registry.npmjs.org/-/package/@daita/${daitaName}/dist-tags`;
  return new Promise<string>((resolve, reject) => {
    https
      .get(url, {}, (resp) => {
        let data = '';
        resp.on('data', (chunk) => {
          data += chunk;
        });
        resp.on('end', () => {
          const content = JSON.parse(data);
          resolve(content.latest);
        });
      })
      .on('error', (err) => {
        reject(err);
      })
      .end();
  });
}
