import * as fs from 'fs';
import * as path from 'path';
import * as childProcess from 'child_process';
import { Defer } from '@daita/common';
import { getSchemaInformation, getSchemaLocation, SchemaLocation } from '../utils/path';
import { AstContext } from '../ast/ast-context';
import { generateRelationalMigrationSteps } from '@daita/orm';

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
      fs.copyFileSync(path.join(sourceDir, file.name), path.join(targetDir, file.name));
    }
  }
}

export interface CliEnvironment {
  env: (name: string, value: string) => void;
  run: (args: string) => RunResult;
  cwd: string;

  exists(dir: string, file?: RegExp): Promise<void>;

  notExists(dir: string, file?: RegExp): Promise<void>;

  contains(dir: string, files: string[]): Promise<void>;
}

export interface RunResult {
  onStdOut(callback: (text: string) => void): void;

  onStdErr(callback: (text: string) => void): void;

  finished: Promise<number>;

  cancel(): void;
}

export type CliEnvironmentCallback = (ctx: CliEnvironment) => Promise<any>;

export function setupEnv(testName: string, callback: CliEnvironmentCallback, options?: { schema?: string }) {
  const scenarioResultRoot = path.join(__dirname, '../../test/tmp/scenario');
  const resultPath = path.join(scenarioResultRoot, testName);

  function exists(dir: string, file?: RegExp): Promise<boolean> {
    return new Promise<boolean>(resolve => {
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
      const schemaRoot = path.join(__dirname, './schemas');
      const schemaPath = path.join(schemaRoot, options.schema);
      cloneDirectory(schemaPath, resultPath);
    }

    const cliPath = path.join(__dirname, '../index.ts');
    const context: CliEnvironment = {
      cwd: resultPath,
      env: (name: string, value: string) => {
        envs[name] = value;
      },
      run: args => {
        const proc = childProcess.spawn(`node`, ['-r', 'ts-node/register', cliPath, ...args.split(' ')], {
          cwd: resultPath,
          env: { ...process.env, ...envs },
        });
        const finishedDefer = new Defer<number>();
        proc.on('exit', code => {
          if (code !== 0) {
            finishedDefer.reject(code);
          } else {
            finishedDefer.resolve(code);
          }
        });
        proc.stdout.on('data', (data) => {
          if (typeof data === 'string') {
            for (const callback of stdOutCallback) {
              callback(data);
            }
          } else if (data instanceof Buffer) {
            for (const callback of stdOutCallback) {
              callback(data.toString());
            }
          }
        });

        proc.stderr.on('data', (data) => {
          if (typeof data === 'string') {
            for (const callback of stdErrCallback) {
              callback(data);
            }
          } else if (data instanceof Buffer) {
            for (const callback of stdErrCallback) {
              callback(data.toString());
            }
          }
        });

        const stdOutCallback: ((text: string) => void)[] = [];
        const stdErrCallback: ((text: string) => void)[] = [];

        return {
          onStdOut: (callback: (text: string) => void) => {
            stdOutCallback.push(callback);
          },
          onStdErr: (callback: (text: string) => void) => {
            stdErrCallback.push(callback);
          },
          cancel: () => {
            proc.kill('SIGINT');
          },
          finished: finishedDefer.promise,
        };
        // return cli.run([...args.split(' '), '--cwd', resultPath]);
      },
      contains(dir: string, expectedFiles: string[]): Promise<void> {
        return new Promise<void>(resolve => {
          fs.readdir(path.join(resultPath, dir), { withFileTypes: true }, (e, listedFiles) => {
            if (e) {
              expect(e).toBeUndefined();
              //.fail(`could not list files in ${path.join(resultPath, dir)}`);
            } else {
              const actualFiles = listedFiles.map(f => f.name);
              expect(actualFiles.sort()).toEqual(expectedFiles.sort());
              resolve();
            }
          });
        });
      },
      notExists(dir: string, file?: RegExp): Promise<void> {
        return exists(dir, file).then(exists => {
          if (exists) {
            expect('').toBe(`could find matching file for ${file}`);
          }
        });
      },
      exists(dir: string, file?: RegExp): Promise<void> {
        return exists(dir, file).then(exists => {
          if (!exists) {
            expect('').toBe(`could not find matching file for ${file}`);
          }
        });
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
    sourceDirectory: path.dirname(fileName),
  };

  const astContext = new AstContext();
  const schemaInfo = await getSchemaInformation(astContext, schemaLocation);
  if (!schemaInfo) {
    throw new Error('unable to get schema information');
  }

  const migrationTree = schemaInfo.getMigrationTree();
  const currentSchema = migrationTree.getSchemaDescription({ backwardCompatible: false });

  return generateRelationalMigrationSteps(
    currentSchema,
    schemaInfo.getRelationalSchema(),
  );
}
