import * as path from 'path';
import * as fs from 'fs';
import { copyDir } from './file';
import { getDaitaUsage, updatePaths, UsageInfo } from './javascript';
import { shell } from '../packages/node/command';

function parseJsonFile(fileName: string) {
  return JSON.parse(fs.readFileSync(fileName).toString());
}

const packageJson = parseJsonFile(path.join(__dirname, '../../package.json'));
const rootPackageJson = parseJsonFile(path.join(__dirname, '../../package.json'));

export function copyReadme(pkg: PackageInfo) {
  const source = path.join(pkg.srcPath, 'README.md');
  const target = path.join(pkg.path, 'README.md');
  if (fs.existsSync(source)) {
    fs.copyFileSync(source, target);
  } else {
    fs.writeFileSync(target, `# @daita/${pkg.name}`);
  }
}

export function createNpmIgnore(pkg: PackageInfo) {
  const target = path.join(pkg.path, '.npmignore');
  fs.writeFileSync(
    target,
    ['*.tar', '**/*.spec.js', '**/*.spec.d.ts', '**/*.test.js', '**/*.test.d.ts'].join('\n') + '\n',
  );
}

export function getOrderedNpmPackages(): PackageInfo[] {
  const packages = Array.from(getNpmPackages());
  const usages: { [key: string]: UsageInfo } = {};
  const values: { [key: string]: number } = {};
  for (const pkg of packages) {
    usages[pkg.name] = getDaitaUsage(pkg.path);
  }
  function getChildCount(pkgName: string, pkgs: string[]) {
    let value = 0;
    for (const dep of Object.keys(usages[pkgName])) {
      if (pkgs.indexOf(dep) >= 0) {
        throw new Error(`loop detected ${pkgs.join(' - ')} - ${dep}`);
      }
      const newPkg = [...pkgs, dep];
      value++;
      value += getChildCount(dep, newPkg);
    }
    return value;
  }
  for (const pkg of packages) {
    values[pkg.name] = getChildCount(pkg.name, []);
  }
  return packages.sort((first, second) => {
    return values[first.name] - values[second.name];
  });
}

export const skipPackages = ['websocket-server', 'websocket-adapter'];
export function* getNpmPackages(): Iterable<PackageInfo> {
  const packagesDir = path.join(__dirname, '../../dist/packages');

  for (const packageName of fs.readdirSync(packagesDir)) {
    if (skipPackages.indexOf(packageName) >= 0) {
      continue;
    }

    yield {
      path: path.join(packagesDir, packageName),
      name: packageName,
      srcPath: path.join(process.cwd(), 'src/packages', packageName),
      esmPath: path.join(packagesDir, '../esm/packages', packageName),
    };
  }
}

export interface PackageInfo {
  path: string;
  name: string;
  srcPath: string;
  esmPath: string;
}

interface PublishConfig {
  registry?: string;
  version?: string;
}

export function createPackageJson(pkg: PackageInfo, packages: Set<string>, options: PublishConfig) {
  const fileName = path.join(pkg.path, 'package.json');
  const content: any = {
    name: `@daita/${pkg.name}`,
    version: options.version || rootPackageJson.version,
    license: 'MIT',
    homepage: 'https://daita.ch',
    publishConfig: {
      access: 'public',
      registry: options.registry,
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

  if (fs.existsSync(path.join(pkg.path, 'esm/browser.js'))) {
    content.browser = 'esm/browser.js';
  }

  const sourcePackageJson = path.join(pkg.srcPath, 'package.json');
  if (fs.existsSync(sourcePackageJson)) {
    const sourcePackageJsonContent = JSON.parse(fs.readFileSync(sourcePackageJson).toString());
    for (const key of Object.keys(sourcePackageJsonContent)) {
      content[key] = sourcePackageJsonContent[key];
    }
  }

  const blacklist = require('module').builtinModules;
  for (const dep of Array.from(packages).sort()) {
    if (dep.startsWith('@daita/')) {
      const packageName = dep.substr('@daita/'.length).split('/')[0];
      if (!fs.existsSync(path.join(pkg.path, '..', packageName))) {
        throw new Error(`invalid daita dependency ${packageName}`);
      }
      if (!/^[a-zA-Z0-9\-]+$/.test(packageName)) {
        throw new Error('package ' + pkg.name + ' has invalid package name' + packageName);
      }
      content.dependencies[`@daita/${packageName}`] = `^${options.version || rootPackageJson.version}`; // `file:///home/pascal/Repos/daita/dist/packages/${packageName}`; //
    } else if (blacklist.indexOf(dep) === -1) {
      if (!rootPackageJson.dependencies[dep]) {
        throw new Error(`could not find ${dep} in ${pkg.name}`);
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

export async function buildNpmPackages(options: PublishConfig) {
  await shell('node_modules/.bin/tsc', [], process.cwd());
  await shell('node_modules/.bin/tsc', ['-p', 'tsconfig-esm.json'], process.cwd());

  for (const pkg of getNpmPackages()) {
    const packages = new Set<string>();
    updatePaths(packages, pkg.esmPath, pkg.esmPath);
    copyDir(pkg.esmPath, path.join(pkg.path, 'esm'));
    updatePaths(packages, pkg.path, pkg.path);
    copyJson(pkg);
    createPackageJson(pkg, packages, options);
    copyReadme(pkg);
    createNpmIgnore(pkg);
  }

  // const missingExports: MissingExport[] = [];
  // for (const pkg of getNpmPackages()) {
  //   missingExports.push(...checkExportedUsage(pkg));
  // }
  // for (const missingExport of missingExports) {
  //   for (const exportName of missingExport.exports) {
  //     console.error(
  //       `package ${missingExport.sourcePackage} requires ${missingExport.targetPackage} to export ${exportName}`,
  //     );
  //   }
  // }
  // if (missingExports.length > 0) {
  //   process.exit(1);
  //   return;
  // }
}

function copyJson(pkg: PackageInfo) {
  copyDir(pkg.srcPath, pkg.path, { selector: (file) => file.isFile && file.fileName.endsWith('.json') });
}

export async function publishNpmPackages(options: PublishConfig) {
  await buildNpmPackages(options);

  for (const pkg of getOrderedNpmPackages()) {
    await shell('npm', ['publish'], pkg.path);
  }
}
