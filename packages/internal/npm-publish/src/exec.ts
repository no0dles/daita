import { exec } from "child_process";

export function execute(cmd: string, cwd: string) {
  return new Promise<string>((resolve, reject) => {
    console.log(`- [*] ${cmd}`);
    exec(cmd, { cwd }, (err, stdout) => {
      if (err) {
        reject(err);
      } else {
        resolve(stdout);
      }
    });
  });
}
