import { adapter } from '../packages/pg-adapter/adapter';
import { TransactionClient } from '../packages/relational/client/transaction-client';
import { getClient } from '../packages/relational/client/get-client';

export type TestCaseCallback = (client: TransactionClient<any>) => void;

// class SimpleLock {
//   private readonly callbacks: {
//     fn: () => Promise<any>;
//     defer: Defer<any>;
//   }[] = [];
//   private running = false;
//
//   constructor() {}
//
//   private async execute(fn: () => Promise<any>, defer: Defer<any>) {
//     this.running = true;
//
//     try {
//       const result = await fn();
//       defer.resolve(result);
//     } catch (e) {
//       defer.reject(e);
//     }
//
//     if (this.callbacks.length > 0) {
//       const callback = this.callbacks.slice(0, 1)[0];
//       this.execute(callback.fn, callback.defer);
//     } else {
//       this.running = false;
//     }
//   }
//
//   async run<T>(fn: () => Promise<T>): Promise<T> {
//     const defer = new Defer<T>();
//     if (this.running) {
//       this.callbacks.push({ fn, defer });
//     } else {
//       this.execute(fn, defer);
//     }
//     return defer.promise;
//   }
// }

let testIndex = 0;

export function clientTest(name: string, fn: TestCaseCallback): () => void;
export function clientTest(fn: TestCaseCallback): () => void;
export function clientTest(nameOrFn: string | TestCaseCallback, fn?: TestCaseCallback): () => void {
  if (typeof nameOrFn === 'string') {
    const client = getClient(adapter, {
      connectionString: process.env.DATABASE_URL || `postgres://postgres:postgres@localhost:5432/${nameOrFn}`,
      dropIfExists: true,
    });
    return () => {
      fn!(client);
    };
  } else {
    const client = getClient(adapter, {
      connectionString: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/test-' + testIndex++,
      dropIfExists: true,
    });
    return () => {
      nameOrFn(client);
    };
  }
}
