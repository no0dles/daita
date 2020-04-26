#!/usr/bin/env node

import { iteratePackage } from "./package";
import * as path from "path";
import * as fs from "fs";

iteratePackage(async packagePath => {
  const pkgPaths = ["dist", "node_modules", "coverage"];
  for (const pkgPath of pkgPaths) {
    const buildPath = path.join(packagePath, pkgPath);
    console.log(`clean ${buildPath}`);
    fs.rmdirSync(buildPath, { recursive: true });
  }
});
