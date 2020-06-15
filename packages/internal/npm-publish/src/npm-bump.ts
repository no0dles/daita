#!/usr/bin/env node

import * as path from 'path';
import { iteratePackage } from './package';
import { PackageConfig } from './package-config';
import * as fs from 'fs';

const version = process.argv[2];
if (!version) {
  throw new Error('no version defined');
}
if (!/^\d+\.\d+\.\d+$/.test(version)) {
  throw new Error(`${version} is not a valid version`);
}

iteratePackage(async packagePath => {
  const pkgConfigPath = path.join(packagePath, 'package.json');
  const pkgConfig: PackageConfig = require(pkgConfigPath);
  pkgConfig.version = version;
  fs.writeFileSync(pkgConfigPath, JSON.stringify(pkgConfig, null, 2));
});
