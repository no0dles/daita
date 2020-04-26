#!/usr/bin/env node

import * as path from "path";
import { iteratePackage } from "./package";
import { pack } from "./pack";
import { execute } from "./exec";
import { PackageConfig } from "./package-config";

pack().then(async () => {
  return iteratePackage(async packagePath => {
    const buildPkgPath = path.join(packagePath, "dist");
    const pkgConfigPath = path.join(buildPkgPath, "package.json");
    const pkgConfig: PackageConfig = require(pkgConfigPath);

    try {
      await execute(`npm info ${pkgConfig.name}@${pkgConfig.version}`, buildPkgPath);
    } catch (e) {
      await execute("npm publish", buildPkgPath);
    }
  });
});
