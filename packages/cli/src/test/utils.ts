import * as fs from 'fs';
import * as path from 'path';
import * as cli from '../index';
import {Defer} from '@daita/common';

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

  for (const file of fs.readdirSync(target, {withFileTypes: true})) {
    const filePath = path.join(target, file.name);
    if (file.isDirectory()) {
      removeDirectory(filePath)
    } else {
      fs.unlinkSync(filePath);
    }
  }

  fs.rmdirSync(target);
}

function deepClone(sourceDir: string, targetDir: string) {
  fs.mkdirSync(targetDir, {recursive: true});
  for (const file of fs.readdirSync(sourceDir, {withFileTypes: true})) {
    if (file.isDirectory()) {
      deepClone(path.join(sourceDir, file.name), path.join(targetDir, file.name));
    } else {
      fs.copyFileSync(path.join(sourceDir, file.name), path.join(targetDir, file.name));
    }
  }
}

export interface CliEnvironment {
  env: (name: string, value: string) => void;
  run: (args: string) => PromiseLike<any>;

  expectConsoleOutput(expectedOutput: string): Promise<void>;

  exists(dir: string, file?: RegExp): Promise<void>;

  contains(dir: string, files: string[]): Promise<void>;
}

export type CliEnvironmentCallback = (ctx: CliEnvironment) => Promise<any>;

export function setupEnv(testName: string, callback: CliEnvironmentCallback, options?: { schema?: string }) {
  const scenarioResultRoot = path.join(__dirname, '../../test/tmp/scenario');
  const resultPath = path.join(scenarioResultRoot, testName);

  const originalStdoutWrite = process.stdout.write.bind(process.stdout);
  const consoleOutputDefers: { text: string, defer: Defer<void> }[] = [];

  process.stdout.write = (chunk: Uint8Array | string, encoding?: string | ((err?: Error) => void), cb?: (err?: Error) => void) => {
    if (typeof chunk === 'string') {
      for (let i = 0; i < consoleOutputDefers.length; i++) {
        if (chunk.indexOf(consoleOutputDefers[i].text) >= 0) {
          consoleOutputDefers[i].defer.resolve();
          consoleOutputDefers.splice(i, 1);
          i--;
        }
      }
    }
    return (<any>originalStdoutWrite)(chunk, encoding, cb);
  };

  return async () => {
    removeDirectory(resultPath);
    fs.mkdirSync(resultPath, {recursive: true});

    if (options && options.schema) {
      const schemaRoot = path.join(__dirname, '../../test/schemas');
      const schemaPath = path.join(schemaRoot, options.schema);
      cloneDirectory(schemaPath, resultPath);
    }

    const context: CliEnvironment = {
      env: (name: string, value: string) => {
        process.env[name] = value;
      },
      run:args => {
        return cli.run([...args.split(' '), '--cwd', resultPath]);
      },
      expectConsoleOutput: (expectedOutput: string, timeout?: number) => {
        const defer = new Defer<void>();
        consoleOutputDefers.push({text: expectedOutput, defer});
        return defer.promise;
      },
      contains(dir: string, expectedFiles: string[]): Promise<void> {
        return new Promise<void>(resolve => {
          fs.readdir(path.join(resultPath, dir), {withFileTypes: true}, (e, listedFiles) => {
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
      exists(dir: string, file?: RegExp): Promise<void> {
        return new Promise<void>(resolve => {
          fs.stat(path.join(resultPath, dir), (err, stats) => {
            if (err) {
              expect(err).toBeUndefined();
              //assert.fail(null, dir, `expected path ${dir} to exist`);
            } else if (file) {
              fs.readdir(path.join(resultPath, dir), {withFileTypes: true}, (e, listedFiles) => {
                if (e) {
                  expect(e).toBeUndefined();
                  //assert.fail(`could not list files in ${path.join(resultPath, dir)}`);
                } else {
                  for (const listedFile of listedFiles) {
                    if (!listedFile.isDirectory()) {
                      if (file.test(listedFile.name)) {
                        resolve();
                        return;
                      }
                    }
                  }
                  expect('').toBe(`could not find matching file for ${file}`);
                  //assert.fail(`could not find matching file for ${file}`);
                }
              });
            } else {
              resolve();
            }
          });
        });
      },
    };
    const result = await callback(context);

    process.stdout.write = originalStdoutWrite;

    return result;
  }
}
