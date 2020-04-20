import {
  Debouncer,
  Defer,
  RelationalDataAdapter, RelationalTransactionAdapter, SqlPermissions
} from "@daita/core";
import {
  AppOptions
} from "./app-options";
import * as debug from "debug";
import { RelationalMigrationAdapter } from "@daita/core/dist/adapter/relational-migration-adapter";
import { isRelationalTransactionAdapter } from "@daita/core/dist/adapter/relational-transaction-adapter";
import { SocketRawEvent } from "./socket/events/socket-raw-event";
import { isSqlQuery } from "@daita/core/dist/sql/sql-query";

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
      debug("daita:web:context-manager")(`timeout transaction ${transactionId}`);
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

  async raw(value: SocketRawEvent, permissions?: SqlPermissions | null) {
    const dataAdapter = this.getDataAdapter(value.tid);
    if (this.appOptions.auth) {
      if (typeof value.sql === "string") {
        throw new Error("raw string sql not implemented yet");
      }

      if(!permissions) {
        throw new Error('no permissions')
      }

      if (!permissions.isQueryAuthorized(value.sql)) {
        throw new Error("not authorized");
      }
    }

    if (isSqlQuery(value.sql)) {
      return dataAdapter.raw(value.sql);
    } else {
      throw new Error("invalid sql");
    }
  }
}
