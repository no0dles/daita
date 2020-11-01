import * as path from 'path';
import * as fs from 'fs';
import * as https from 'https';
import { spawn } from 'child_process';
import { Defer } from '../../common/utils/defer';

export async function upgrade(opts: { cwd?: string; npmClient?: string }) {
  const cwd = opts.cwd ? path.resolve(opts.cwd) : process.cwd();
  const packagePath = path.join(cwd, 'package.json');
  if (!fs.existsSync(packagePath)) {
    console.warn('could not locate package.json');
    return;
  }

  try {
    const content = fs.readFileSync(packagePath).toString();
    const pkg = JSON.parse(content);
    let hasChanges = false;
    hasChanges = hasChanges || (await upgradeDependencies(pkg.dependencies));
    hasChanges = hasChanges || (await upgradeDependencies(pkg.devDependencies));
    if (!hasChanges) {
      console.info('all daita packages are up to date');
      return;
    }

    fs.writeFileSync(packagePath, JSON.stringify(pkg, null, 2));
    console.info('updated daita packages successfully');
    await runCommand(opts.npmClient || 'npm', ['install'], cwd);
  } catch (e) {
    console.error('unable to parse package.json');
    return;
  }
}

function runCommand(cmd: string, args: string[], cwd: string) {
  return new Promise((resolve, reject) => {
    const ps = spawn(cmd, args, {
      cwd,
      stdio: [process.stdin, process.stdout, process.stderr],
    });
    ps.once('exit', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(code);
      }
    });
  });
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
  const defer = new Defer<string>();
  https
    .get(url, {}, (resp) => {
      let data = '';
      resp.on('data', (chunk) => {
        data += chunk;
      });
      resp.on('end', () => {
        const content = JSON.parse(data);
        defer.resolve(content.latest);
      });
    })
    .on('error', (err) => {
      defer.reject(err);
    });
  return defer.promise;
}
