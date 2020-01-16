import {
  Defer, RelationalDataAdapter,
  RelationalTransactionDataAdapter,
} from '@daita/core';
import {RelationalSqlBuilder} from '@daita/core/dist/adapter/relational-sql-builder';
import {BaseApiDataAdapter} from './base-api-data-adapter';
import {ApiRelationalTransactionDataAdapter} from './api-relational-transaction-data-adapter';
import {AxiosResponse} from 'axios';

export class ApiRelationalDataAdapter extends BaseApiDataAdapter
  implements RelationalDataAdapter {
  private transactions: { [key: string]: { timeoutDefer: Defer<void>, timeoutCountdown: Countdown } } = {};

  kind: 'dataAdapter' = 'dataAdapter';

  constructor(baseUrl: string) {
    super(baseUrl, {});
  }


  get sqlBuilder(): RelationalSqlBuilder {
    throw new Error('not implemented');
  }

  async transaction(action: (adapter: RelationalTransactionDataAdapter) => Promise<any>): Promise<void> {
    const tid = this.idGenerator.next();
    const timeoutDefer = new Defer<void>();
    const timeoutCountdown = new Countdown(() => timeoutDefer.reject(new Error('transaction timeout')));
    this.transactions[tid] = {timeoutDefer, timeoutCountdown};

    await this.send(`trx/${tid}`);

    try {
      const execution = action(new ApiRelationalTransactionDataAdapter(this.baseUrl, tid, res => this.handleResponse(res)));
      await Promise.race([execution, timeoutDefer.promise]);
      if (timeoutDefer.isRejected) {
        throw timeoutDefer.rejectedError;
      }
      await this.send(`trx/${tid}/commit`);
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

  protected handleResponse(response: AxiosResponse<any>): void {
    const transactionId = response.headers['x-transaction'];
    const timeout = response.headers['x-transaction-timeout'];
    if (transactionId && timeout && timeout > 0) {
      const transaction = this.transactions[transactionId];
      if (transaction) {
        transaction.timeoutCountdown.setExpire(timeout);
      }
    }
  }
}

class Countdown {
  private timeoutHandle: number | null = null;

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