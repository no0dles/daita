import * as path from 'path';
import * as fs from 'fs';
import { shell } from './shell';

const packageJson = require(path.join(__dirname, '../../package.json'));
const rootPackageJson = require(path.join(__dirname, '../../package.json'));

export function copyReadme(packageDir: string, packageName: string) {
  const source = path.join(__dirname, '../packages', packageName, 'README.md');
  const target = path.join(packageDir, 'README.md');
  if (fs.existsSync(source)) {
    fs.copyFileSync(source, target);
  } else {
    fs.writeFileSync(target, `# @daita/${packageName}`);
  }
}

export function createNpmIgnore(packageDir: string) {
  const target = path.join(packageDir, '.npmignore');
  fs.writeFileSync(
    target,
    ['*.tar', '**/*.spec.js', '**/*.spec.d.ts', '**/*.test.js', '**/*.test.d.ts'].join('\n') + '\n',
  );
}

export function* getNpmPackages() {
  const packagesDir = path.join(__dirname, '../../dist/packages');

  for (const packageName of fs.readdirSync(packagesDir)) {
    if (!fs.existsSync(path.join(packagesDir, packageName, 'index.js'))) {
      continue;
    }
    yield { path: path.join(packagesDir, packageName), name: packageName };
  }
}

export function createPackageJson(packageDir: string, packageName: string, packages: Set<string>) {
  const fileName = path.join(packageDir, 'package.json');
  const content: any = {
    name: `@daita/${packageName}`,
    version: rootPackageJson.version,
    license: 'MIT',
    homepage: 'https://daita.ch',
    publishConfig: {
      access: 'public',
    },
    repository: {
      type: 'git',
      url: 'https://github.com/no0dles/daita',
    },
    bugs: {
      url: 'https://github.com/no0dles/daita/issues',
    },
    main: 'index.js',
    types: 'index.d.ts',
    module: 'esm/index.js',
    dependencies: {},
  };

  if (packageName === 'cli') {
    content.bin = {
      daita: 'index.js',
    };
  } else if (fs.existsSync(path.join(packageDir, 'esm/browser.js'))) {
    content.browser = 'esm/browser.js';
  }
  const blacklist = require('module').builtinModules;
  for (const dep of packages) {
    if (dep.startsWith('@daita/')) {
      if (!fs.existsSync(path.join(packageDir, '..', dep.substr('@daita/'.length)))) {
        throw new Error(`invalid daita dependency ${dep}`);
      }
      content.dependencies[dep] = `^${rootPackageJson.version}`;
    } else if (blacklist.indexOf(dep) === -1) {
      if (!rootPackageJson.dependencies[dep]) {
        throw new Error(`could not find ${dep} in ${packageName}`);
      }
      content.dependencies[dep] = rootPackageJson.dependencies[dep];
    }
  }
  fs.writeFileSync(fileName, JSON.stringify(content, null, 2));
}

export function scanDependencies(file: string, dependencies: Set<string>, files: Set<string>) {
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

export function updatePaths(packages: Set<string>, root: string, directory: string) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.isFile()) {
      updatePath(packages, root, path.join(directory, entry.name));
    } else {
      updatePaths(packages, root, path.join(directory, entry.name));
    }
  }
}

export function updatePath(packages: Set<string>, root: string, file: string) {
  if (!file.endsWith('.js') || file.endsWith('.spec.js') || file.endsWith('.test.js')) {
    return;
  }

  const content = fs.readFileSync(file).toString();
  const regex = /require\([\"'](?<import>[\.\/\-@\w]+)[\"']\)/g;
  let result = content.replace(regex, (substring: string, importPath: string) => {
    if (importPath.startsWith('.')) {
      const fullImportPath = path.join(path.dirname(file), importPath); //TODO verify if export exists
      const relativeImportPath = path.relative(root, fullImportPath);
      if (relativeImportPath.startsWith('..')) {
        const packageName = relativeImportPath.split(path.sep)[1];
        packages.add(`@daita/${packageName}`);
        return `require("@daita/${packageName}")`;
      }
      return substring;
    } else {
      packages.add(importPath);
      return substring;
    }
  });

  const esRegex = / from '(?<import>[\.\/\-@\w]+)'/g;
  result = result.replace(esRegex, (substring: string, importPath: string) => {
    if (importPath.startsWith('.')) {
      const fullImportPath = path.join(path.dirname(file), importPath); //TODO verify if export exists
      const relativeImportPath = path.relative(root, fullImportPath);
      if (relativeImportPath.startsWith('..')) {
        const packageName = relativeImportPath.split(path.sep)[1];
        packages.add(`@daita/${packageName}`);
        return ` from '@daita/${packageName}'`;
      }
      return substring;
    } else {
      packages.add(importPath);
      return substring;
    }
  });

  fs.writeFileSync(file, result);
}

export async function buildNpmPackages() {
  await shell('node_modules/.bin/tsc', [], path.join(__dirname, '../..'));
  await shell('node_modules/.bin/tsc', ['-p', 'tsconfig-esm.json'], path.join(__dirname, '../..'));

  for (const pkg of getNpmPackages()) {
    const packages = new Set<string>();
    const esmPath = path.join(pkg.path, '../../esm/packages', pkg.name);
    updatePaths(packages, esmPath, esmPath);
    createIndex();
    copyDir(esmPath, path.join(pkg.path, 'esm'));
    updatePaths(packages, pkg.path, pkg.path);
    createPackageJson(pkg.path, pkg.name, packages);
    copyReadme(pkg.path, pkg.name);
    copyJson(pkg.path, pkg.name);
    createNpmIgnore(pkg.path);
  }
}

function createIndex() {}

function copyJson(packageDir: string, packageName: string) {
  const sourceDir = path.join(process.cwd(), 'src/packages', packageName);
  copyDir(sourceDir, packageDir, (file) => file.name.endsWith('.json'));
}

function copyDir(from: string, to: string, filter?: (file: fs.Dirent) => boolean) {
  if (!fs.existsSync(to)) {
    fs.mkdirSync(to);
  }
  for (const file of fs.readdirSync(from, { withFileTypes: true })) {
    if (file.isFile()) {
      if (!filter || filter(file)) {
        fs.copyFileSync(path.join(from, file.name), path.join(to, file.name));
      }
    } else {
      copyDir(path.join(from, file.name), path.join(to, file.name), filter);
    }
  }
}

export async function publishNpmPackages() {
  await buildNpmPackages();

  for (const pkg of getNpmPackages()) {
    await shell('npm', ['publish'], pkg.path);
  }
}
