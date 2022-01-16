import { ContextManager } from './context-manager';
import { Debouncer } from '@daita/common';
import { Defer } from '@daita/common';
import { TimeoutError } from '@daita/common';
import { RelationalAdapter, RelationalTransactionAdapter } from '@daita/relational';

export type TransactionResult = 'committed' | 'timeout' | 'rollback' | 'canceled';

export class TransactionManager {
  private readonly commitDefer = new Defer<void>();
  private readonly adapterDefer = new Defer<RelationalTransactionAdapter<any>>();
  private readonly resultDefer = new Defer<TransactionResult>();
  private readonly debouncer: Debouncer;

  get result() {
    return this.resultDefer.promise;
  }

  get started() {
    return this.adapterDefer.promise.then(() => {});
  }

  constructor(private client: RelationalAdapter<any>, private transactionTimeout: number) {
    this.debouncer = new Debouncer(() => this.timeout(), this.transactionTimeout);
    this.client
      .transaction(async (adapter) => {
        this.debouncer.start();
        this.adapterDefer.resolve(adapter);
        await this.commitDefer.promise;
      })
      .then(() => {
        this.resultDefer.resolve('committed');
      })
      .catch((err) => {
        if (err.message === 'canceled' || err.message === 'rollback' || err.message === 'timeout') {
          this.resultDefer.resolve(err.message);
        } else {
          this.resultDefer.reject(err);
        }
      });
  }

  private timeout() {
    if (!this.commitDefer.isRejected && !this.commitDefer.isResolved) {
      this.commitDefer.reject(new TimeoutError());
    }
  }

  getClient() {
    return this.adapterDefer.promise;
  }

  close() {
    this.commitDefer.reject('canceled');
  }

  getTimeout() {
    return this.debouncer.timeout;
  }

  async exec(sql: any) {
    const client = await this.getClient();
    const context = new ContextManager(client);
    return await context.exec(sql);
  }

  async commit() {
    this.debouncer.clear();
    this.commitDefer.resolve();
    await this.resultDefer.promise;
  }

  async rollback() {
    this.debouncer.clear();
    this.commitDefer.reject(new Error('rollback'));
    await this.resultDefer.promise;
  }
}
