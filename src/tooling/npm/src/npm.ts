import * as path from 'path';
import * as fs from 'fs';
import { copyDirectoryRecursive, removeDirectoryRecursive, shell } from '@daita/node';

interface PublishConfig {
  registry: string;
  version: string;
}

const packagesRoot = path.join(process.cwd(), 'src/packages');
const toolingRoot = path.join(process.cwd(), 'src/tooling');
const packagesBuildRoot = path.join(process.cwd(), 'dist/npm');

function getNpmPackageDestinationPath(packageName: string) {
  return path.join(packagesBuildRoot, packageName);
}

export async function buildNpmPackage(packageName: string): Promise<string> {
  const pkgPath = path.join(packagesRoot, packageName);
  const pkgNpmIgnore = path.join(packagesRoot, packageName, '.npmignore');
  const destinationPath = getNpmPackageDestinationPath(packageName);

  removeDirectoryRecursive(destinationPath);
  fs.mkdirSync(destinationPath, { recursive: true });

  await shell('npm', ['run', 'build'], pkgPath);

  const npmIgnore = fs.existsSync(pkgNpmIgnore)
    ? fs.readFileSync(pkgNpmIgnore).toString().split('\n')
    : ['node_modules', 'src'];

  const filter = (file: string) => {
    if (npmIgnore.indexOf(file) >= 0) {
      return false;
    }
    return true;
  };
  copyDirectoryRecursive(pkgPath, destinationPath, filter);

  return destinationPath;
}

export async function publishNpmPackage(packageName: string, options: PublishConfig) {
  const destinationPath = getNpmPackageDestinationPath(packageName);

  const npmrcFile = path.join(destinationPath, '.npmrc');
  if (fs.existsSync(npmrcFile)) {
    fs.unlinkSync(npmrcFile);
  }
  fs.writeFileSync(npmrcFile, `registry=${options.registry}`);

  const packageJsonFile = path.join(destinationPath, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonFile).toString());
  fs.writeFileSync(
    packageJsonFile,
    JSON.stringify(
      {
        ...packageJson,
        version: options.version,
        dependencies: overrideDaitaDependencies(packageJson.dependencies, options.version),
        devDependencies: overrideDaitaDependencies(packageJson.devDependencies, options.version),
      },
      null,
      2,
    ),
  );

  await shell('npm', ['publish'], destinationPath);
}

function overrideDaitaDependencies(dependencies: { [key: string]: string }, version: string) {
  if (!dependencies) {
    return dependencies;
  }
  return Object.keys(dependencies).reduce<{ [key: string]: string }>((deps, key) => {
    deps[key] = key.startsWith('@daita/') ? version : dependencies[key];
    return deps;
  }, {});
}

export async function buildNpmPackages() {
  const promises: Promise<void>[] = [];
  for (const pkg of getOrderedNpmPackages()) {
    promises.push(
      buildNpmPackage(pkg).then(() => {
        console.log('built ' + pkg);
      }),
    );
  }
  await Promise.all(promises);
}
export async function publishNpmPackages(options: PublishConfig) {
  for (const pkg of getOrderedNpmPackages()) {
    await publishNpmPackage(pkg, options);
  }
}

function getUsage(root: string, packageName: string): Set<string> {
  const pkgPath = path.join(root, packageName, 'package.json');
  const pkgJson = JSON.parse(fs.readFileSync(pkgPath).toString());
  const deps = Object.keys(pkgJson.dependencies || {});
  const devDeps = Object.keys(pkgJson.devDependencies || {});
  const peerDeps = Object.keys(pkgJson.peerDependencies || {});
  return new Set<string>(
    [...deps, ...devDeps, ...peerDeps]
      .filter((pkg) => pkg.startsWith('@daita/'))
      .map((pkg) => pkg.substr('@daita/'.length)),
  );
}

export function getOrderedNpmPackages(): string[] {
  const packages = fs.readdirSync(packagesRoot).filter((pkg) => !pkg.startsWith('.'));
  const toolingPackages = fs.readdirSync(toolingRoot).filter((pkg) => !pkg.startsWith('.'));
  const usages: { [key: string]: Set<string> } = {};
  const values: { [key: string]: number } = {};
  for (const pkg of toolingPackages) {
    usages[pkg] = getUsage(toolingRoot, pkg);
  }
  for (const pkg of packages) {
    usages[pkg] = getUsage(packagesRoot, pkg);
  }
  function getChildCount(pkgName: string, pkgs: string[]) {
    let value = 0;
    const usage = usages[pkgName];
    if (!usage) {
      throw new Error(`unable to get usage for ${pkgName}`);
    }
    for (const dep of usages[pkgName].keys()) {
      if (pkgs.indexOf(dep) >= 0) {
        throw new Error(`loop detected ${pkgs.join(' - ')} - ${dep}`);
      }
      const newPkg = [...pkgs, dep];
      value++;
      value += getChildCount(dep, newPkg);
    }
    return value;
  }
  for (const pkg of [...packages, ...toolingPackages]) {
    values[pkg] = getChildCount(pkg, []);
  }
  return packages.sort((first, second) => {
    return values[first] - values[second];
  });
}
