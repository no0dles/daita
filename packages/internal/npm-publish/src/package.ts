import * as path from "path";
import { PackageConfig } from "./package-config";

interface PackagesConfig {
  packages: string[];
}

export async function iteratePackage(fn: (packagePath: string) => Promise<any> | void) {
  const currentDir = process.cwd();
  for (const packagePath of getPublishPackages()) {
    console.log(packagePath);
    await fn(path.join(currentDir, packagePath));
  }
}

export function getPublishPackages() {
  const currentDir = process.cwd();
  const packageFilePath = path.join(currentDir, "publish.json");
  const publishConfig: PackagesConfig = require(packageFilePath);
  return publishConfig.packages;
}

export function getPublishPackageNames() {
  const currentDir = process.cwd();
  return getPublishPackages().map(packagePath => {
    const pkgConfig: PackageConfig = require(path.join(currentDir, packagePath, 'package.json'));
    return pkgConfig.name;
  });
}
