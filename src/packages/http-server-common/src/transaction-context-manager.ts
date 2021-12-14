import { TransactionManager } from './transaction-manager';
import { HttpServerRelationalOptions } from './http-server-options';
import { TransactionClient } from '@daita/relational';
import { TimeoutError } from '@daita/relational';
import { AuthorizedTransactionContext, TransactionContext } from '@daita/orm';

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

  create(client: TransactionContext<any> | AuthorizedTransactionContext<any>, transactionId: string) {
    if (this.transactions[transactionId]) {
      throw new Error('transaction already exists');
    }
    const transaction = new TransactionManager(client, this.transactionTimeout);
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
    throw new TimeoutError('could not find transaction for ' + transactionId);
  }
}
