import path from 'path';
import fs from 'fs';

export interface PackageJson {
  version?: string;
  name?: string;
  license?: string;
  description?: string;
  keywords?: string[];
  homepage?: string;
  dependencies?: { [key: string]: string };
  devDependencies?: { [key: string]: string };
  scripts?: { [key: string]: string };
  bin?: { [key: string]: string };
  main?: string;
  browser?: string;
}

export function getOwnPackageJson<T>(selector: (pkg: PackageJson) => T, dir?: string): T | null {
  const currentDir = path.join(dir || __dirname);
  const packagePath = path.join(currentDir, 'package.json');

  if (fs.existsSync(packagePath)) {
    const packageContent = require(packagePath);
    const value = selector(packageContent);
    if (value !== null && value !== undefined) {
      return value;
    }
  }
  const parentDir = path.resolve(currentDir, '..');
  if (parentDir === currentDir) {
    return null;
  }
  return getOwnPackageJson(selector, parentDir);
}
