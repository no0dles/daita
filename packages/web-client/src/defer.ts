export class Defer<T> {
  private resolveFn: ((value?: T) => void) | null = null;
  private rejectFn: ((err?: Error) => void) | null = null;

  promise: Promise<T>;

  constructor() {
    this.promise = new Promise((resolve, reject) => {
      this.rejectFn = reject;
      this.resolveFn = resolve;
    });
  }

  resolve(value?: T) {
    if (this.resolveFn) {
      this.resolveFn(value);
    }
  }

  reject(err?: any) {
    if (this.rejectFn) {
      this.rejectFn(err);
    }
  }
}