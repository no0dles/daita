import {
  RelationalDataAdapter,
  SqlPermissions,
  SqlQuery,
  isSqlQuery,
} from '@daita/relational';
import {AppTransactionOptions} from './app-options';
import {TransactionManager} from './transaction-manager';

export class ContextManager {

  constructor(private dataAdapter: RelationalDataAdapter,
              private permissions: SqlPermissions | null | undefined) {
  }

  async exec(sql: SqlQuery, validateAuth: boolean) {
    if (validateAuth) {
      if (!this.permissions) {
        throw new Error('no permissions');
      }

      if (!this.permissions.isQueryAuthorized(sql)) {
        throw new Error('not authorized');
      }
    }

    if (!isSqlQuery(sql)) {
      throw new Error('invalid sql');
    } else {
      return this.dataAdapter.exec(sql);
    }
  }
}

export class TransactionContextManager {
  private readonly transactionTimeout: number;
  private readonly transactions: { [key: string]: TransactionManager } = {};

  constructor(private options: AppTransactionOptions) {
    this.transactionTimeout = options.transactionTimeout || 5000;
  }

  async close() {
    for (const id in this.transactions) {
      await this.transactions[id].close();
    }
  }

  create(transactionId: string, permissions: SqlPermissions | null | undefined) {
    if (this.transactions[transactionId]) {
      throw new Error('transaction already exists');
    }
    const transaction = new TransactionManager(this.options.dataAdapter, permissions, this.transactionTimeout);
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
