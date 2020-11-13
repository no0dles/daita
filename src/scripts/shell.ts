import { spawn } from 'child_process';

export function shell(
  cmd: string,
  args: string[],
  cwd: string,
  options?: { stdIn?: (output: string) => string | null; env?: { [key: string]: string } },
) {
  return new Promise<number>((resolve, reject) => {
    const env = Object.create(process.env);
    if (options?.env) {
      for (const key of Object.keys(options.env)) {
        env[key] = options.env[key];
      }
    }
    env.PWD = cwd;
    const ps = spawn(cmd, args, {
      cwd,
      //env,
    });
    ps.stderr.pipe(process.stderr);
    ps.stdout.pipe(process.stdout);

    const stdInFn = options?.stdIn;
    if (stdInFn) {
      ps.stdout.on('data', (chunk) => {
        const output = chunk.toString();
        const input = stdInFn(output);
        if (input) {
          ps.stdin.write(input);
        }
      });
    }
    ps.on('error', (err) => {
      reject(err);
    });
    ps.once('exit', (code) => {
      if (code === 0) {
        resolve(code);
      } else {
        reject(code);
      }
    });
  });
}
