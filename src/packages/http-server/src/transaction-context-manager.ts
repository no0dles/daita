import { TransactionManager } from './transaction-manager';
import { HttpServerRelationalOptions } from './http-server-options';
import { HttpError } from './http-error';
import { RelationalAdapter } from '@daita/relational';

export class TransactionContextManager {
  private readonly transactionTimeout: number;
  private readonly transactions: { [key: string]: TransactionManager } = {};

  constructor(private options: HttpServerRelationalOptions) {
    this.transactionTimeout = options.transactionTimeout || 5000;
  }

  async close() {
    for (const id in this.transactions) {
      await this.transactions[id].close();
    }
  }

  private getTimeout(timeout: number | undefined) {
    if (timeout === null || timeout === undefined) {
      return this.transactionTimeout;
    } else {
      if (timeout > this.transactionTimeout) {
        return this.transactionTimeout;
      } else {
        return timeout;
      }
    }
  }

  create(client: RelationalAdapter<any>, transactionId: string, timeout: number | undefined) {
    if (this.transactions[transactionId]) {
      throw new HttpError(400, 'transaction already exists');
    }
    const transaction = new TransactionManager(client, this.getTimeout(timeout));
    this.transactions[transactionId] = transaction;
    transaction.result.finally(() => {
      delete this.transactions[transactionId];
    });
    return transaction;
  }

  get(transactionId: string): TransactionManager {
    if (this.transactions[transactionId]) {
      return this.transactions[transactionId];
    }
    throw new HttpError(400, 'could not find transaction for ' + transactionId);
  }
}
