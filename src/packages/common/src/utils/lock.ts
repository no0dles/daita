import { Defer } from './defer';

interface LockEntry {
  fn: () => Promise<any> | any;
  defer: Defer<any>;
}

export class Lock {
  private queue: LockEntry[] = [];
  private current: LockEntry | null = null;

  acquire<T = void>(fn: () => Promise<T> | T): Promise<T> {
    const defer = new Defer<T>();
    const entry: LockEntry = { fn, defer };
    if (this.current) {
      this.queue.push(entry);
    } else {
      this.run(entry);
    }
    return defer.promise;
  }

  private async run(entry: LockEntry) {
    this.current = entry;
    try {
      const result = await entry.fn();
      entry.defer.resolve(result);
    } catch (e) {
      entry.defer.reject(e);
    }
    if (this.queue.length > 0) {
      const nextEntry = this.queue.splice(0, 1)[0];
      this.run(nextEntry);
    } else {
      this.current = null;
    }
  }
}
