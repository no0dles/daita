import * as path from 'path';
import * as fs from 'fs';

const packagesDir = path.join(__dirname, '../../dist/packages');
const rootPackageJson = require(path.join(__dirname, '../../package.json'));

for (const packageName of fs.readdirSync(packagesDir)) {
  const packageDir = path.join(packagesDir, packageName);
  const packages = new Set<string>();
  updatePaths(packages, packageDir, packageDir);
  createPackageJson(packageDir, packageName, packages);
  copyReadme(packageDir, packageName);
}

export function copyReadme(packageDir: string, packageName: string) {
  const source = path.join(__dirname, '../packages', packageName, 'README.md');
  const target = path.join(packageDir, 'README.md');
  if (fs.existsSync(source)) {
    fs.copyFileSync(source, target);
  }
}

export function createPackageJson(
  packageDir: string,
  packageName: string,
  packages: Set<string>,
) {
  const fileName = path.join(packageDir, 'package.json');
  const content: any = {
    name: `@daita/${packageName}`,
    version: rootPackageJson.version,
    license: 'MIT',
    homepage: 'https://daita.ch',
    repository: {
      type: 'git',
      url: 'https://github.com/no0dles/daita',
    },
    bugs: {
      url: 'https://github.com/no0dles/daita/issues',
    },
    main: 'index.js',
    types: 'index.d.ts',
    dependencies: {},
  };
  for (const dep of packages) {
    console.log(dep, packageName);
    if (dep.startsWith('@daita/')) {
      content.dependencies[dep] = `^${rootPackageJson.version}`;
    } else {
      content.dependencies[dep] = rootPackageJson.dependencies[dep];
    }
  }
  fs.writeFileSync(fileName, JSON.stringify(content, null, 2));
}

export function updatePaths(
  packages: Set<string>,
  root: string,
  directory: string,
) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.isFile()) {
      updatePath(packages, root, path.join(directory, entry.name));
    } else {
      updatePaths(packages, root, path.join(directory, entry.name));
    }
  }
}

export function updatePath(packages: Set<string>, root: string, file: string) {
  if (!file.endsWith('.js')) {
    return;
  }

  const content = fs.readFileSync(file).toString();
  const regex = /require\(\"(?<import>[\.\/\-@\w]+)\"\)/g;
  const result = content.replace(
    regex,
    (substring: string, importPath: string) => {
      if (importPath.startsWith('.')) {
        const fullImportPath = path.join(path.dirname(file), importPath);
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
    },
  );

  fs.writeFileSync(file, result);
}
