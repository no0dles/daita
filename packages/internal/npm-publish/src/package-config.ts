export interface PackageConfig {
  name: string;
  version: string;
  publishConfig: any;
  scripts: { [key: string]: string };
  devDependencies: { [key: string]: string };
  dependencies: { [key: string]: string };
  repository: any;
  license: string;
}
