#!/usr/bin/env node

import { iteratePackage } from "./package";
import * as path from "path";
import * as fs from "fs";
import { PackageConfig } from "./package-config";

const version = process.argv[2];
if (!version) {
  throw new Error("no version defined");
}
if (!/^\d+\.\d+\.\d+$/.test(version)) {
  throw new Error(`${version} is not a valid version`);
}

iteratePackage(packagePath => {
  const sourcePkgPath = path.join(packagePath, "package.json");
  const sourcePkg: PackageConfig = require(sourcePkgPath);
  sourcePkg.version = version;
  fs.writeFileSync(sourcePkgPath, JSON.stringify(sourcePkg, null, 2));
});
