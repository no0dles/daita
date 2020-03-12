import {
  Debouncer,
  Defer, MigrationTree,
  RelationalContext,
  RelationalDataAdapter, RelationalTransactionAdapter,
} from '@daita/core';
import {
  AppOptions,
} from './app-options';
import * as debug from 'debug';
import {ContextUser} from '@daita/core/dist/auth';
import {RelationalMigrationAdapter} from '@daita/core/dist/adapter/relational-migration-adapter';

interface ContextTransaction {
  adapter: RelationalDataAdapter | RelationalTransactionAdapter | RelationalMigrationAdapter;
  commitDefer: Defer<void>;
  resultDefer: Defer<void>;
  debouncer: Debouncer;
}

export interface ContextTransactionTimeoutEmitter {
  emit: (name: string, data: any) => void;
}

export class ContextManager {
  private readonly migrationTree: MigrationTree;
  private readonly transactionTimeout: number;
  private readonly transactions: { [key: string]: ContextTransaction } = {};

  constructor(private appOptions: AppOptions,
              private timeoutEmitter?: ContextTransactionTimeoutEmitter) {
    this.transactionTimeout = appOptions.transactionTimeout || 5000;
    if (appOptions.type === 'schema') {
      this.migrationTree = (<any>appOptions.schema).migrationTree;
    } else {
      this.migrationTree = (<any>this.appOptions).migrationTree;
    }
  }

  close() {
    for (const id of Object.keys(this.transactions)) {
      this.transactions[id].commitDefer.reject('canceled');
    }
  }

  getTransactionTimeout(transactionId: string) {
    const transaction = this.transactions[transactionId];
    if (transaction) {
      return transaction.debouncer.timeout;
    }
    return 0;
  }

  getDataAdapter(
    transactionId?: string,
  ): RelationalTransactionAdapter | RelationalDataAdapter | RelationalMigrationAdapter {
    if (transactionId) {
      const transaction = this.transactions[transactionId];
      if (transaction) {
        transaction.debouncer.bounce();
        return transaction.adapter;
      }
      throw new Error('could not find transaction for ' + transactionId);
    } else {
      return this.appOptions.dataAdapter;
    }
  }

  async beginTransaction(transactionId: string, user: ContextUser | null) {
    const transactionDefer = new Defer<RelationalDataAdapter>();
    const commitDefer = new Defer<void>();
    const resultDefer = new Defer<void>();

    if(!this.appOptions.dataAdapter.isKind('transaction')) {
      throw new Error('transaction not supported by the data adapter');
    }

    const transactionAdapter = this.appOptions.dataAdapter as RelationalTransactionAdapter;

    transactionAdapter
      .transaction(async adapter => {
        transactionDefer.resolve(adapter);
        await commitDefer.promise;
      })
      .then(() => {
        resultDefer.resolve();
      })
      .catch(err => {
        if (err.message === 'canceled' || err.message === 'timeout') {
          resultDefer.resolve();
        } else {
          resultDefer.reject(err);
        }
      });

    await Promise.race([transactionDefer.promise, resultDefer.promise]);

    if (resultDefer.isRejected) {
      throw resultDefer.rejectedError;
    }

    if (resultDefer.isResolved) {
      throw new Error('transaction closed');
    }

    const timeoutTransaction = () => {
      debug('daita:web:context-manager')(`timeout transaction ${transactionId}`);
      delete this.transactions[transactionId];
      if (!commitDefer.isRejected && !commitDefer.isResolved) {
        commitDefer.reject(new Error('timeout'));
        if (this.timeoutEmitter) {
          this.timeoutEmitter.emit('trxTimeout', {tid: transactionId});
        }
      }
    };

    this.transactions[transactionId] = {
      adapter: await transactionDefer.promise,
      commitDefer,
      resultDefer,
      debouncer: new Debouncer(timeoutTransaction, this.transactionTimeout),
    };
  }

  async commitTransaction(transactionId: string) {
    const transaction = this.transactions[transactionId];
    if (!transaction) {
      throw new Error('could not find transaction for ' + transactionId);
    }

    transaction.debouncer.clear();
    delete this.transactions[transactionId];
    transaction.commitDefer.resolve();
    await transaction.resultDefer.promise;
  }

  async rollbackTransaction(transactionId: string) {
    const transaction = this.transactions[transactionId];
    if (transaction) {
      transaction.debouncer.clear();
      delete this.transactions[transactionId];
      transaction.commitDefer.reject(new Error('canceled'));
      await transaction.resultDefer.promise;
    }
  }

  getContext(options: { migrationId?: string, user?: ContextUser | null, transactionId?: string }) {
    const schema = this.migrationTree.defaultSchema(options.migrationId);
    const user = (options.user ? options.user : null) || null;
    const dataAdapter = this.getDataAdapter(options.transactionId);
    return new RelationalContext(
      dataAdapter,
      schema,
      this.migrationTree,
      user,
    );
  }

  getMigration(migrationId? : string) {
    return this.migrationTree.defaultSchema(migrationId);
  }
}
