#!/usr/bin/env node

import * as path from 'path';
import { iteratePackage } from './package';
import { pack } from './pack';
import { execute } from './exec';
import { PackageConfig } from './package-config';

pack().then(async () => {
  await iteratePackage(async packagePath => {
    const buildPkgPath = path.join(packagePath, 'dist');
    const pkgConfigPath = path.join(buildPkgPath, 'package.json');
    const pkgConfig: PackageConfig = require(pkgConfigPath);

    let result = '';
    try {
      result = await execute(`npm info ${pkgConfig.name}@${pkgConfig.version}`, buildPkgPath);
    } catch (e) {

    }

    if (result !== '') {
      throw new Error(`package ${pkgConfig.name}@${pkgConfig.version} already exists`);
    }
  });

  await iteratePackage(async packagePath => {
    const buildPkgPath = path.join(packagePath, 'dist');
    await execute('npm publish', buildPkgPath);
  });
});
