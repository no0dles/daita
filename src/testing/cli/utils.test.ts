import * as fs from 'fs';
import * as path from 'path';
import * as childProcess from 'child_process';
import { getSchemaInformation, SchemaLocation } from '../../packages/cli/utils/path';
import { AstContext } from '../../packages/cli/ast/ast-context';
import { generateRelationalMigrationSteps } from '../../packages/orm/migration/generation/generate-relational-migration-steps';
import { Defer } from '../../packages/common/utils/defer';

export function isNotNull<T>(value: T): asserts value is NonNullable<T> {
  expect(value).not.toBeUndefined();
  expect(value).not.toBeNull();
}

function cloneDirectory(sourceDir: string, targetDir: string) {
  deepClone(sourceDir, targetDir);
}

function removeDirectory(target: string) {
  if (!fs.existsSync(target)) {
    return;
  }

  for (const file of fs.readdirSync(target, { withFileTypes: true })) {
    const filePath = path.join(target, file.name);
    if (file.isDirectory()) {
      removeDirectory(filePath);
    } else {
      fs.unlinkSync(filePath);
    }
  }

  fs.rmdirSync(target);
}

function deepClone(sourceDir: string, targetDir: string) {
  fs.mkdirSync(targetDir, { recursive: true });
  for (const file of fs.readdirSync(sourceDir, { withFileTypes: true })) {
    if (file.isDirectory()) {
      deepClone(path.join(sourceDir, file.name), path.join(targetDir, file.name));
    } else {
      const srcFile = path.join(sourceDir, file.name);
      const targetFile = path.join(targetDir, file.name);
      const content = fs.readFileSync(srcFile).toString();
      const regex = / from [\"'](?<import>[\.\/\-@\w]+)[\"']/g;
      const result = content.replace(regex, (substring: string, importPath: string) => {
        if (importPath.startsWith('.')) {
          const fullImportPath = path.join(path.dirname(srcFile), importPath);
          if (fullImportPath.indexOf('cli') === -1) {
            //TODO improve check condition
            return ` from '${path.relative(targetDir, fullImportPath)}'`;
          }
          return substring;
        } else {
          return substring;
        }
      });
      fs.writeFileSync(targetFile, result);
    }
  }
}

export interface CliEnvironment {
  env: (name: string, value: string) => void;
  cwd: string;

  exists(dir: string, file?: RegExp): Promise<void>;

  notExists(dir: string, file?: RegExp): Promise<void>;

  contains(dir: string, files: string[]): Promise<void>;
  replaceContent(file: string, replace: RegExp, value: string): Promise<void>;
}

export interface RunResult {
  onStdOut(callback: (text: string) => void): void;

  onStdErr(callback: (text: string) => void): void;

  finished: Promise<number>;

  cancel(): void;
}

export type CliEnvironmentCallback = (ctx: CliEnvironment) => Promise<any>;

export function setupEnv(testName: string, callback: CliEnvironmentCallback, options?: { schema?: string }) {
  const scenarioResultRoot = path.join(process.cwd(), 'dist/tmp/scenario');
  const resultPath = path.join(scenarioResultRoot, testName);

  function exists(dir: string, file?: RegExp): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      fs.stat(path.join(resultPath, dir), (err, stats) => {
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
    removeDirectory(resultPath);
    fs.mkdirSync(resultPath, { recursive: true });

    if (options && options.schema) {
      const schemaRoot = path.join(process.cwd(), './src/testing/cli/schemas');
      const schemaPath = path.join(schemaRoot, options.schema);
      cloneDirectory(schemaPath, resultPath);
    }

    const context: CliEnvironment = {
      cwd: resultPath,
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

export async function getMigrationSteps(fileName: string) {
  const schemaLocation: SchemaLocation = {
    fileName,
    directory: path.dirname(fileName),
    migrationDirectory: path.join(path.dirname(fileName), 'migrations'),
  };

  const astContext = new AstContext();
  const schemaInfo = await getSchemaInformation(astContext, schemaLocation);
  if (!schemaInfo) {
    throw new Error('unable to get schema information');
  }

  const migrationTree = schemaInfo.getMigrationTree();
  const currentSchema = migrationTree.getSchemaDescription();

  return generateRelationalMigrationSteps(currentSchema, schemaInfo.getRelationalSchema());
}
