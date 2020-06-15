import { getPublishPackageNames, iteratePackage } from './package';
import * as path from 'path';
import { execute } from './exec';
import { PackageConfig } from './package-config';
import * as fs from 'fs';

export async function pack() {
  const publishPackageNames = getPublishPackageNames();
  await iteratePackage(async packagePath => {
    const filesToCopy = ['.npmignore', 'README.md'];
    const sourcePkgPath = path.join(packagePath, 'package.json');
    const buildDir = path.join(packagePath, 'dist');
    const buildPkgPath = path.join(buildDir, 'package.json');

    try {
      await execute('npm run build', packagePath);
    } catch (e) {
      throw new Error(`build failure in ${packagePath}`);
    }

    for (const fileToCopy of filesToCopy) {
      const sourceFile = path.join(packagePath, fileToCopy);
      const buildFile = path.join(buildDir, fileToCopy);
      if (!fs.existsSync(sourceFile)) {
        throw new Error(`${packagePath}: missing file ${sourceFile}`);
      }
      fs.copyFileSync(sourceFile, buildFile);
    }

    const sourcePkg: PackageConfig = require(sourcePkgPath);

    delete sourcePkg.scripts;
    delete sourcePkg.devDependencies;

    if (sourcePkg.dependencies) {
      const daitaPackageKeys = Object.keys(sourcePkg.dependencies).filter(key => key.startsWith('@daita/'));
      const keysToDelete = daitaPackageKeys.filter(key => key.startsWith('@daita/internal-'));
      for (const key of keysToDelete) {
        delete sourcePkg.dependencies[key];
      }
      for (const key of daitaPackageKeys) {
        if (sourcePkg.dependencies[key].startsWith('file:')) {
          const depPackagePath = sourcePkg.dependencies[key].substr('file:'.length);
          const packageConfigPath = path.join(packagePath, depPackagePath, 'package.json');
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

    if (!sourcePkg.main) {
      throw new Error('missing main');
    }
    if (!sourcePkg.types) {
      throw new Error('missing types');
    }

    if (sourcePkg.main.startsWith('dist/')) {
      sourcePkg.main = sourcePkg.main.substr('dist/'.length);
    }
    if (sourcePkg.types.startsWith('dist/')) {
      sourcePkg.types = sourcePkg.types.substr('dist/'.length);
    }

    if (!fs.existsSync(path.join(buildDir, sourcePkg.main))) {
      throw new Error('main file does not exists');
    }
    if (!fs.existsSync(path.join(buildDir, sourcePkg.types))) {
      throw new Error('types file does not exists');
    }

    if (sourcePkg.bin) {
      for (const key of Object.keys(sourcePkg.bin)) {
        const binPath = sourcePkg.bin[key];
        if (binPath.startsWith('dist/')) {
          sourcePkg.bin[key] = binPath.substr('dist/'.length);
        }

        if (!fs.existsSync(path.join(buildDir, sourcePkg.bin[key]))) {
          throw new Error(`bin ${key} does not exists`);
        }
      }
    }

    fs.writeFileSync(buildPkgPath, JSON.stringify(sourcePkg, null, 2));
  });
}
