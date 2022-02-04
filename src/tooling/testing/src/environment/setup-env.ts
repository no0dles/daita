import fs from 'fs';
import path from 'path';
import { copyDirectoryRecursive, removeDirectoryRecursive } from '@daita/node';

export interface CliEnvironment {
  env: (name: string, value: string) => void;
  cwd: string;

  exists(dir: string, file?: RegExp): Promise<void>;

  notExists(dir: string, file?: RegExp): Promise<void>;

  contains(dir: string, files: string[]): Promise<void>;
  replaceContent(file: string, replace: RegExp, value: string): Promise<void>;

  linkNodeModules(): Promise<void>;
}

export type CliEnvironmentCallback = (ctx: CliEnvironment) => Promise<any>;

export function setupEnv(
  schemaRoot: string,
  testName: string,
  callback: CliEnvironmentCallback,
  options?: { schema?: string },
) {
  const scenarioResultRoot = path.join(process.cwd(), 'dist/tmp/scenario');
  const resultPath = path.join(scenarioResultRoot, testName);

  function exists(dir: string, file?: RegExp): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      fs.stat(path.join(resultPath, dir), (err) => {
        if (err) {
          resolve(false);
          //assert.fail(null, dir, `expected path ${dir} to exist`);
        } else if (file) {
          fs.readdir(path.join(resultPath, dir), { withFileTypes: true }, (e, listedFiles) => {
            if (e) {
              resolve(false);
              //assert.fail(`could not list files in ${path.join(resultPath, dir)}`);
            } else {
              for (const listedFile of listedFiles) {
                if (!listedFile.isDirectory()) {
                  if (file.test(listedFile.name)) {
                    resolve(true);
                    return;
                  }
                }
              }
              resolve(false);
              //assert.fail(`could not find matching file for ${file}`);
            }
          });
        } else {
          resolve(true);
        }
      });
    });
  }

  const envs: { [key: string]: string } = {};

  return async () => {
    removeDirectoryRecursive(resultPath);
    fs.mkdirSync(resultPath, { recursive: true });

    if (options && options.schema) {
      const schemaPath = path.join(schemaRoot, options.schema);
      copyDirectoryRecursive(schemaPath, resultPath, () => true);
    }

    const context: CliEnvironment = {
      cwd: resultPath,
      linkNodeModules: async () => {
        const pkgContent = JSON.parse(fs.readFileSync(path.join(resultPath, 'package.json')).toString());
        const packages = Object.keys(pkgContent.dependencies);

        const nodeModulesPath = path.join(resultPath, 'node_modules/@daita');
        fs.mkdirSync(nodeModulesPath, { recursive: true });

        for (const pkg of packages) {
          const pkgName = pkg.substr('@daita/'.length);
          fs.symlinkSync(path.join(process.cwd(), './src/packages', pkgName), path.join(nodeModulesPath, pkgName));
        }
      },
      env: (name: string, value: string) => {
        envs[name] = value;
      },
      contains(dir: string, expectedFiles: string[]): Promise<void> {
        return new Promise<void>((resolve) => {
          fs.readdir(path.join(resultPath, dir), { withFileTypes: true }, (e, listedFiles) => {
            if (e) {
              expect(e).toBeUndefined();
              //.fail(`could not list files in ${path.join(resultPath, dir)}`);
            } else {
              const actualFiles = listedFiles.map((f) => f.name);
              expect(actualFiles.sort()).toEqual(expectedFiles.sort());
              resolve();
            }
          });
        });
      },
      notExists(dir: string, file?: RegExp): Promise<void> {
        return exists(dir, file).then((exists) => {
          if (exists) {
            expect('').toBe(`could find matching file for ${file}`);
          }
        });
      },
      exists(dir: string, file?: RegExp): Promise<void> {
        return exists(dir, file).then((exists) => {
          if (!exists) {
            expect('').toBe(`could not find matching file for ${file}`);
          }
        });
      },
      replaceContent: async (file: string, regex: RegExp, value: string) => {
        const filePath = path.join(resultPath, file);
        const exists = fs.existsSync(filePath);
        if (!exists) {
          expect('').toBe('could not find file ' + file);
          return;
        }

        const content = fs.readFileSync(filePath).toString();
        const newContent = content.replace(regex, value);
        fs.writeFileSync(filePath, newContent);
      },
    };
    return await callback(context);
  };
}
