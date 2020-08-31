import { TransactionManager } from './transaction-manager';
import {
  RelationalDataAdapter,
  RelationalTransactionAdapter,
} from '../relational/adapter';
import { AppOptions } from './app-options';

export class ContextManager {
  constructor(private dataAdapter: RelationalDataAdapter) {}

  async exec(sql: any) {
    if (!this.dataAdapter.supportsQuery(sql)) {
      throw new Error('invalid sql');
    } else {
      return this.dataAdapter.exec(sql);
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

  create(adapter: RelationalTransactionAdapter, transactionId: string) {
    if (this.transactions[transactionId]) {
      throw new Error('transaction already exists');
    }
    const transaction = new TransactionManager(
      adapter,
      this.transactionTimeout,
    );
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
    throw new Error('could not find transaction for ' + transactionId);
  }
}
