import { TransactionManager } from './transaction-manager';
import { AppOptions } from './app-options';
import { TransactionClient } from '../relational/client/transaction-client';
import { Client } from '../relational/client/client';
import { TimeoutError } from '../relational/error/timeout-error';

export class ContextManager {
  constructor(private client: Client<any>) {}

  async exec(sql: any) {
    if (!this.client.supportsQuery(sql)) {
      throw new Error('invalid sql');
    } else {
      return this.client.exec(sql);
    }
  }
}

export class TransactionContextManager {
  private readonly transactionTimeout: number;
  private readonly transactions: { [key: string]: TransactionManager } = {};

  constructor(private options: AppOptions) {
    this.transactionTimeout = options.transactionTimeout || 5000;
  }

  async close() {
    for (const id in this.transactions) {
      await this.transactions[id].close();
    }
  }

  create(client: TransactionClient<any>, transactionId: string) {
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
