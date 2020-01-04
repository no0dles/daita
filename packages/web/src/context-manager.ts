import {
  Debouncer,
  Defer,
  RelationalContext,
  RelationalDataAdapter,
  RelationalTransactionContext,
  RelationalTransactionDataAdapter,
} from '@daita/core';
import {
  AppMigrationTreeOptions,
  AppOptions,
  AppSchemaOptions,
} from './app-options';
import {getMigrationSchema} from '@daita/core/dist/schema/migration-schema-builder';

export class ContextManager {
  private readonly transactionTimeout: number;
  private readonly transactions: {
    [key: string]: {
      adapter: RelationalTransactionDataAdapter;
      commitDefer: Defer<void>;
      resultDefer: Defer<void>;
      debouncer: Debouncer;
    };
  } = {};

  constructor(private appOptions: AppOptions, private timeoutEmitter?: { emit: (name: string, data: any) => void }) {
    this.transactionTimeout = appOptions.transactionTimeout || 5000;
  }

  close() {
    for (const id of Object.keys(this.transactions)) {
      this.transactions[id].commitDefer.reject('canceled');
    }
  }

  getDataAdapter(
    transactionId?: string,
  ): RelationalTransactionDataAdapter | RelationalDataAdapter {
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

  async beginTransaction(transactionId: string) {
    const transactionDefer = new Defer<RelationalTransactionDataAdapter>();
    const commitDefer = new Defer<void>();
    const resultDefer = new Defer<void>();

    this.appOptions.dataAdapter
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

    const dataAdapter = await transactionDefer.promise;
    const debouncer = new Debouncer(() => {
      commitDefer.reject(new Error('timeout'));
      if (this.timeoutEmitter) {
        this.timeoutEmitter.emit('trxTimeout', {tid: transactionId});
      }
    }, this.transactionTimeout);
    this.transactions[transactionId] = {
      adapter: dataAdapter,
      commitDefer,
      resultDefer,
      debouncer,
    };
  }

  async commitTransaction(transactionId: string) {
    const transaction = this.transactions[transactionId];
    if (transaction) {
      transaction.commitDefer.resolve();
      await transaction.resultDefer.promise;
    }
    throw new Error('could not find transaction for ' + transactionId);
  }

  async rollbackTransaction(transactionId: string) {
    const transaction = this.transactions[transactionId];
    if (transaction) {
      transaction.commitDefer.reject(new Error('canceled'));
      await transaction.resultDefer.promise;
    }
  }

  getContext(migrationId: string, transactionId?: string) {
    if ((<AppSchemaOptions>this.appOptions).schema) {
      const dataAdapter = this.getDataAdapter(transactionId);
      if (dataAdapter.kind === 'dataAdapter') {
        return (<AppSchemaOptions>this.appOptions).schema.context(
          dataAdapter,
          migrationId,
        );
      } else {
        return (<AppSchemaOptions>this.appOptions).schema.context(
          dataAdapter,
          migrationId,
        );
      }
    }

    if ((<AppMigrationTreeOptions>this.appOptions).migrationTree) {
      const migrationTree = (<AppMigrationTreeOptions>this.appOptions)
        .migrationTree;
      const path = migrationTree.path(migrationId);
      const dataAdapter = this.getDataAdapter(transactionId);
      if (dataAdapter.kind === 'dataAdapter') {
        return new RelationalContext(
          getMigrationSchema(path),
          (<AppMigrationTreeOptions>this.appOptions).migrationTree,
          dataAdapter,
        );
      } else {
        return new RelationalTransactionContext(
          getMigrationSchema(path),
          dataAdapter,
        );
      }
    }

    throw new Error('Could not create context');
  }
}
