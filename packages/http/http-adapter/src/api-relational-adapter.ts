import {ApiRelationalDataAdapter} from './api-relational-data-adapter';
import { RelationalDataAdapter, RelationalTransactionAdapter } from "@daita/relational";
import { AuthProvider } from "./auth/auth-provider";
import { Defer } from "@daita/common";

export class ApiRelationalAdapter extends ApiRelationalDataAdapter implements RelationalTransactionAdapter {

  private transactions: { [key: string]: { timeoutDefer: Defer<void>, timeoutCountdown: Countdown } } = {};

  constructor(baseUrl: string, options?: { auth?: AuthProvider }) {
    super(baseUrl, {}, options || {}, () => {
    });
  }

  async transaction<T>(action: (adapter: RelationalDataAdapter) => Promise<T>): Promise<T> {
    const tid = this.idGenerator.next();
    const timeoutDefer = new Defer<void>();
    const timeoutCountdown = new Countdown(() => timeoutDefer.reject(new Error('transaction timeout')));
    this.transactions[tid] = {timeoutDefer, timeoutCountdown};

    await this.send(`trx/${tid}`);

    try {
      const dataAdapter = new ApiRelationalDataAdapter(this.baseUrl, {tid}, {auth: this.auth}, response => {
        const transactionId = response.headers['x-transaction'];
        const timeout = response.headers['x-transaction-timeout'];
        if (transactionId && timeout && timeout > 0) {
          const transaction = this.transactions[transactionId];
          if (transaction) {
            transaction.timeoutCountdown.setExpire(timeout);
          }
        }
      });
      const execution = action(dataAdapter);
      await Promise.race([execution, timeoutDefer.promise]);
      if (timeoutDefer.isRejected) {
        throw timeoutDefer.rejectedError;
      }
      await this.send(`trx/${tid}/commit`);
      return execution;
    } catch (e) {
      if (e.message === 'transaction timeout') {
        throw e;
      }

      await this.send(`trx/${tid}/rollback`);
      throw e;
    } finally {
      delete this.transactions[tid];
    }
  }
}

class Countdown {
  private timeoutHandle: any | null = null;

  constructor(private trigger: () => any) {
  }

  setExpire(time: number) {
    if (this.timeoutHandle) {
      clearTimeout(this.timeoutHandle);
    }
    const now = new Date().getTime();
    if (time > now) {
      this.timeoutHandle = setTimeout(() => this.trigger(), time - now);
    } else {
      this.trigger();
    }
  }
}
