import {
  isRelationalTransactionAdapter,
  isSqlQuery, RelationalDataAdapter,
  RelationalMigrationAdapter,
  RelationalTransactionAdapter, SqlDmlQuery,
  SqlPermissions, SqlQuery
} from "@daita/relational";
import { Debouncer, Defer } from "@daita/common";
import { ContextTransaction } from "./context-transaction";
import { ContextTransactionTimeoutEmitter } from "./context-transaction-timeout-emitter";
import { AppOptions } from "./app-options";


export class ContextManager {
  private readonly transactionTimeout: number;
  private readonly transactions: { [key: string]: ContextTransaction } = {};

  constructor(private appOptions: AppOptions,
              private timeoutEmitter?: ContextTransactionTimeoutEmitter) {
    this.transactionTimeout = appOptions.transactionTimeout || 5000;
  }

  close() {
    for (const id of Object.keys(this.transactions)) {
      this.transactions[id].commitDefer.reject("canceled");
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
    transactionId?: string
  ): RelationalTransactionAdapter | RelationalDataAdapter | RelationalMigrationAdapter {
    if (transactionId) {
      const transaction = this.transactions[transactionId];
      if (transaction) {
        transaction.debouncer.bounce();
        return transaction.adapter;
      }
      throw new Error("could not find transaction for " + transactionId);
    } else {
      return this.appOptions.dataAdapter;
    }
  }

  async beginTransaction(transactionId: string) {
    const transactionDefer = new Defer<RelationalDataAdapter>();
    const commitDefer = new Defer<void>();
    const resultDefer = new Defer<void>();

    if (!isRelationalTransactionAdapter(this.appOptions.dataAdapter)) {
      throw new Error("transaction not supported by the data adapter");
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
        if (err.message === "canceled" || err.message === "timeout") {
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
      throw new Error("transaction closed");
    }

    const timeoutTransaction = () => {
      delete this.transactions[transactionId];
      if (!commitDefer.isRejected && !commitDefer.isResolved) {
        commitDefer.reject(new Error("timeout"));
        if (this.timeoutEmitter) {
          this.timeoutEmitter.emit("trxTimeout", { tid: transactionId });
        }
      }
    };

    this.transactions[transactionId] = {
      adapter: await transactionDefer.promise,
      commitDefer,
      resultDefer,
      debouncer: new Debouncer(timeoutTransaction, this.transactionTimeout)
    };
  }

  async commitTransaction(transactionId: string) {
    const transaction = this.transactions[transactionId];
    if (!transaction) {
      throw new Error("could not find transaction for " + transactionId);
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
      transaction.commitDefer.reject(new Error("canceled"));
      await transaction.resultDefer.promise;
    }
  }

  async raw(transactionId: string, sql: SqlQuery | SqlDmlQuery, permissions?: SqlPermissions | null) {
    const dataAdapter = this.getDataAdapter(transactionId);
    if (this.appOptions.auth) {
      if(!permissions) {
        throw new Error('no permissions')
      }

      if (!permissions.isQueryAuthorized(sql)) {
        throw new Error("not authorized");
      }
    }

    if (isSqlQuery(sql)) {
      return dataAdapter.raw(sql);
    } else {
      throw new Error("invalid sql");
    }
  }
}
