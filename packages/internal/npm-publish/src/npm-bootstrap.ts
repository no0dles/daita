#!/usr/bin/env node

import { iteratePackage } from "./package";
import { execute } from "./exec";

iteratePackage(async packagePath => {
  await execute('npm install', packagePath);
});
