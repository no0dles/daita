import { spawn } from 'child_process';

export function runCommand(cmd: string, args: string[], cwd: string) {
  return new Promise((resolve, reject) => {
    const ps = spawn(cmd, args, {
      cwd,
      stdio: [process.stdin, process.stdout, process.stderr],
    });
    ps.once('exit', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(code);
      }
    });
  });
}
