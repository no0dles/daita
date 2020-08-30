import * as fs from 'fs';
import * as path from 'path';
import { shell } from './shell';
import { scanDependencies } from './npm';

const rootPackageJson = require(path.join(__dirname, '../../package.json'));

export function getDockerFiles() {
  const containersDir = path.join(__dirname, '../containers');
  return getRecursiveDockerFiles(containersDir);
}

function* getRecursiveDockerFiles(
  directory: string,
): Generator<{ dockerfile: string; path: string }> {
  for (const file of fs.readdirSync(directory, { withFileTypes: true })) {
    if (file.name === 'Dockerfile') {
      const dockerfile = path.join(directory, file.name);
      yield { dockerfile, path: directory };
    } else if (!file.isFile()) {
      for (const result of getRecursiveDockerFiles(
        path.join(directory, file.name),
      )) {
        yield result;
      }
    }
  }
}

export async function buildContainerImages() {
  for (const docker of getDockerFiles()) {
    buildContainerPackageJson(docker.dockerfile);
    await buildContainerImage(docker.dockerfile);
  }
}

export async function pushContainerImages() {
  await buildContainerImages();
  for (const docker of getDockerFiles()) {
    for (const imageName of getImageNames(docker.dockerfile)) {
      await shell('docker', ['push', imageName], path.join(__dirname, '../..'));
    }
  }
}

function getImageNames(dockerfile: string): string[] {
  const parts = path.dirname(dockerfile).split(path.sep);
  const imageName =
    'docker.pkg.github.com/no0dles/daita/' + parts[parts.length - 1];
  return [imageName, `${imageName}:${rootPackageJson.version}`];
}

async function buildContainerImage(dockerfile: string) {
  for (const imageName of getImageNames(dockerfile)) {
    await shell(
      'docker',
      ['build', '-t', imageName, '-f', dockerfile, '.'],
      path.join(__dirname, '../..'),
    );
  }
}

export function buildContainerPackageJson(dockerfile: string) {
  const indexFile = path.join(path.dirname(dockerfile), 'index.ts');
  const packagePath = path.join(path.dirname(dockerfile), 'package.json');

  const dependencies = new Set<string>();
  const files = new Set<string>();
  scanDependencies(indexFile, dependencies, files);

  const pkg: any = {
    version: rootPackageJson.version,
    dependencies: {},
  };
  for (const dep of dependencies) {
    pkg.dependencies[dep] = rootPackageJson.dependencies[dep];
  }
  fs.writeFileSync(packagePath, JSON.stringify(pkg, null, 2));
}
