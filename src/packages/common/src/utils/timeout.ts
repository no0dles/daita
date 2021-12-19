import { TimeoutError } from './timeout-error';

export function handleTimeout<T>(action: () => Promise<T>, timeout?: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    let resolved = false;
    if (timeout !== null && timeout !== undefined) {
      setTimeout(() => {
        if (!resolved) {
          reject(new TimeoutError());
        }
      }, timeout);
    }
    action()
      .then((res) => {
        resolved = true;
        resolve(res);
      })
      .catch((err) => {
        resolved = true;
        reject(err);
      });
  });
}
