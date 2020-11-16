import { getFiles } from './file';
import fs from 'fs';
import path from 'path';
import { PackageInfo } from './npm';

interface ExportReference {
  fileName: string;
  exports: string[];
}

function getExportsForDirectory(dir: string): ExportReference[] {
  const refs: ExportReference[] = [];
  for (const file of fs.readdirSync(dir, { withFileTypes: true })) {
    if (file.name === 'esm') {
      continue;
    }

    const fileName = path.join(dir, file.name);

    if (file.isFile()) {
      const exports = getExportsForFile(fileName);
      refs.push({ fileName, exports });
    } else {
      const newRefs = getExportsForDirectory(fileName);
      refs.push(...newRefs);
    }
  }
  return refs;
}

function getExportsForFile(fileName: string): string[] {
  const content = fs.readFileSync(fileName, { encoding: 'utf8' }).toString();
  const exportNames = new Set<string>();
  for (const match of content.matchAll(/Object\.defineProperty\(exports, "(?<exportName>[\w_\-\d]+)"/g)) {
    const exportName = match.groups?.exportName;
    if (!exportName || exportName.startsWith('__')) {
      continue;
    }
    exportNames.add(exportName);
  }
  for (const match of content.matchAll(/exports\.(?<exportName>[\w_\-\d]+) =/g)) {
    const exportName = match.groups?.exportName;
    if (!exportName) {
      continue;
    }
    exportNames.add(exportName);
  }
  return Array.from(exportNames);
}

export interface MissingExport {
  targetPackage: string;
  sourcePackage: string;
  exports: string[];
}

export function checkExportedUsage(pkg: PackageInfo) {
  const usages = getDaitaUsage(pkg.path);
  const exports: MissingExport[] = [];

  for (const depName of Object.keys(usages)) {
    const nodeIndex = path.join(pkg.path, '..', depName, 'index.js');
    const browserIndex = path.join(pkg.path, '..', depName, 'browser.js');

    const nodeExports = fs.existsSync(nodeIndex) ? getExportsForFile(nodeIndex) : [];
    const browserExports = fs.existsSync(browserIndex) ? getExportsForFile(browserIndex) : [];

    const missingExports = Array.from(usages[depName]).filter(
      (value) => nodeExports.indexOf(value) === -1 && browserExports.indexOf(value) === -1,
    );
    if (missingExports.length > 0) {
      exports.push({ sourcePackage: pkg.name, targetPackage: depName, exports: missingExports });
    }
  }
  return exports;
}

export interface UsageInfo {
  [key: string]: Set<string>;
}

export function getUsage(directory: string): UsageInfo {
  const regex = /const (?<var>\w+) = (__importStar\(|__importDefault\()*require\(["'](?<packageName>[@/\-_\w]+)["']\)/g;
  const usageInfo: UsageInfo = {};

  for (const file of getFiles(directory)) {
    const content = fs.readFileSync(file.fileName, { encoding: 'utf8' }).toString();
    const matches = content.matchAll(regex);
    for (const match of matches) {
      const variable = match.groups?.var;
      const packageName = match.groups?.packageName;

      if (!variable || !packageName) {
        continue;
      }

      const usageRegex = new RegExp(`${variable}\\.(?<value>\\w+)`, 'g');
      for (const usage of content.matchAll(usageRegex)) {
        const usageValue = usage.groups?.value;
        if (!usageValue) {
          continue;
        }

        if (!usageInfo[packageName]) {
          usageInfo[packageName] = new Set<string>();
        }
        usageInfo[packageName].add(usageValue);
      }
    }
  }

  return usageInfo;
}

export function getDaitaUsage(directory: string): UsageInfo {
  const usages = getUsage(directory);
  const daitaUsage: UsageInfo = {};
  for (const usage of Object.keys(usages)) {
    if (usage.startsWith('@daita/')) {
      let packageName = usage.substr('@daita/'.length);
      if (packageName.indexOf('/') >= 0) {
        packageName = packageName.substr(0, packageName.indexOf('/'));
      }
      daitaUsage[packageName] = usages[usage];
    }
  }
  return daitaUsage;
}

export function updatePaths(packages: Set<string>, root: string, directory: string) {
  const files = getFiles(directory, {
    selector: (file) =>
      file.fileName.endsWith('.js') && !file.fileName.endsWith('.spec.js') && !file.fileName.endsWith('.test.js'),
  });
  for (const file of files) {
    const content = fs.readFileSync(file.fileName).toString();

    function replaceDaitaImport(
      substring: string,
      importPath: string,
      template: (packageName: string, packagePath: string) => string,
    ) {
      if (importPath.startsWith('.')) {
        const fullImportPath = path.join(path.dirname(file.fileName), importPath); //TODO verify if export exists
        const relativeImportPath = path.relative(root, fullImportPath);
        if (relativeImportPath.startsWith('..')) {
          const packageName = relativeImportPath.split(path.sep)[1];
          const packagePath = relativeImportPath.split(path.sep).slice(2).join(path.sep);
          packages.add(`@daita/${packageName}`);
          return template(packageName, packagePath);
        }
        return substring;
      } else {
        packages.add(importPath);
        return substring;
      }
    }

    const regex = /require\([\"'](?<import>[\.\/\-@\w]+)[\"']\)/g;
    let result = content.replace(regex, (substring: string, importPath: string) => {
      return replaceDaitaImport(
        substring,
        importPath,
        (packageName, packagePath) => `require("@daita/${packageName}/${packagePath}")`,
      );
    });

    const esRegex = / from '(?<import>[\.\/\-@\w]+)'/g;
    result = result.replace(esRegex, (substring: string, importPath: string) => {
      return replaceDaitaImport(
        substring,
        importPath,
        (packageName, packagePath) => ` from '@daita/${packageName}/${packagePath}'`,
      );
    });

    fs.writeFileSync(file.fileName, result);
  }
}
