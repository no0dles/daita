import * as path from 'path';
import * as fs from 'fs';
import {spawn} from 'child_process';

const containersDir = path.join(__dirname, '../containers');
const packageJson = require(path.join(__dirname, '../../package.json'));


async function buildContainerPackageJsons(directory: string) {
  for (const file of fs.readdirSync(directory, {withFileTypes: true})) {
    if (file.name === 'Dockerfile') {
      const dockerfile = path.join(directory, file.name);
      buildContainerPackageJson(dockerfile);
      await buildContainerImage(dockerfile);
    } else if (!file.isFile()) {
      await buildContainerPackageJsons(path.join(directory, file.name));
    }
  }
}

async function buildContainerImage(dockerfile: string) {
  const parts = path.dirname(dockerfile).split(path.sep);
  const imageName = 'docker.pkg.github.com/no0dles/daita/' + parts[parts.length - 1];
  await runCommand('docker', ['build', '-t', imageName, '-t', `${imageName}:${packageJson.version}`, '-f', dockerfile, '.'], path.join(__dirname, '../..'));
}

function runCommand(cmd: string, args: string[], cwd: string) {
  return new Promise(((resolve, reject) => {
    const ps = spawn(cmd, args, {cwd, stdio: [process.stdin, process.stdout, process.stderr]});
    ps.once('exit', code => {
      if (code === 0) {
        resolve();
      } else {
        reject(code);
      }
    });
  }));
}

function buildContainerPackageJson(dockerfile: string) {
  const indexFile = path.join(path.dirname(dockerfile), 'index.ts');
  const packagePath = path.join(path.dirname(dockerfile), 'package.json');

  const dependencies = new Set<string>();
  const files = new Set<string>();
  scanDependencies(indexFile, dependencies, files);

  const pkg: any = {
    version: packageJson.version,
    dependencies: {},
  };
  for (const dep of dependencies) {
    pkg.dependencies[dep] = packageJson.dependencies[dep];
  }
  fs.writeFileSync(packagePath, JSON.stringify(pkg, null, 2));
}

function scanDependencies(file: string, dependencies: Set<string>, files: Set<string>) {
  files.add(file);
  const content = fs.readFileSync(file).toString();
  const regex = / from [\"'](?<import>[\.\/\-@\w]+)[\"']/g;
  content.replace(regex, (substring: string, importPath: string) => {
    if (importPath.startsWith('.')) {
      let fullImportPath = path.join(path.dirname(file), importPath);
      if (!fullImportPath.endsWith('.ts')) {
        if (fs.existsSync(fullImportPath + '.ts')) {
          fullImportPath += '.ts';
        } else if (fs.existsSync(path.join(fullImportPath, '/index.ts'))) {
          fullImportPath = path.join(fullImportPath, '/index.ts');
        }
      }
      if (files.has(fullImportPath)) {
        return substring;
      }
      scanDependencies(fullImportPath, dependencies, files);
    } else {
      if (packageJson.dependencies[importPath]) {
        dependencies.add(importPath);
      }
    }
    return substring;
  });
}

buildContainerPackageJsons(containersDir);
