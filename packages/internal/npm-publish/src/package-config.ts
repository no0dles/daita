export interface PackageConfig {
  name: string;
  main: string;
  types: string;
  bin?: {[key: string]: string};
  version: string;
  publishConfig: any;
  scripts: { [key: string]: string };
  devDependencies: { [key: string]: string };
  dependencies: { [key: string]: string };
  repository: any;
  license: string;
}
