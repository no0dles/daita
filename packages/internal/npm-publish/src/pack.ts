import { getPublishPackageNames, iteratePackage } from "./package";
import * as path from "path";
import { execute } from "./exec";
import { PackageConfig } from "./package-config";
import * as fs from "fs";

export async function pack() {
  const publishPackageNames = getPublishPackageNames();
  await iteratePackage(async packagePath => {
    const filesToCopy = [".npmignore", "README.md"];
    const sourcePkgPath = path.join(packagePath, "package.json");
    const buildDir = path.join(packagePath, "dist");
    const buildPkgPath = path.join(buildDir, "package.json");

    for (const fileToCopy of filesToCopy) {
      const sourceFile = path.join(packagePath, fileToCopy);
      const buildFile = path.join(buildDir, fileToCopy);
      if (fs.existsSync(sourceFile)) {
        throw new Error(`missing file ${filesToCopy}`);
      }
      fs.copyFileSync(sourceFile, buildFile);
    }

    try {
      await execute("npm run build", packagePath);
    } catch (e) {
      throw new Error(`build failure in ${packagePath}`);
    }

    const sourcePkg: PackageConfig = require(sourcePkgPath);

    delete sourcePkg.scripts;
    delete sourcePkg.devDependencies;

    if (sourcePkg.dependencies) {
      const daitaPackageKeys = Object.keys(sourcePkg.dependencies).filter(key => key.startsWith("@daita/"));
      const keysToDelete = daitaPackageKeys.filter(key => key.startsWith("@daita/internal-"));
      for (const key of keysToDelete) {
        delete sourcePkg.dependencies[key];
      }
      for (const key of daitaPackageKeys) {
        if (sourcePkg.dependencies[key].startsWith("file:")) {
          const depPackagePath = sourcePkg.dependencies[key].substr("file:".length);
          const packageConfigPath = path.join(packagePath, depPackagePath, "package.json");
          const packageConfig: PackageConfig = require(packageConfigPath);
          sourcePkg.dependencies[key] = packageConfig.version;
        }
      }
      for (const daitaPackageKey of daitaPackageKeys) {
        if (publishPackageNames.indexOf(daitaPackageKey) === -1) {
          throw new Error(`missing dependency ${daitaPackageKey} to be published`);
        }
      }
    }

    fs.writeFileSync(buildPkgPath, JSON.stringify(sourcePkg, null, 2));
  });
}
