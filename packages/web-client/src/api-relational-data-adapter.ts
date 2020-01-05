import {
  Defer, RelationalDataAdapter,
  RelationalTransactionDataAdapter,
} from '@daita/core';
import {RelationalSqlBuilder} from '@daita/core/dist/adapter/relational-sql-builder';
import {BaseApiDataAdapter} from './base-api-data-adapter';
import {ApiRelationalTransactionDataAdapter} from './api-relational-transaction-data-adapter';

export class ApiRelationalDataAdapter extends BaseApiDataAdapter
  implements RelationalDataAdapter {
  private transactions: { [key: string]: Defer<void> } = {};

  kind: 'dataAdapter' = 'dataAdapter';

  constructor(baseUrl: string) {
    super(baseUrl, {});
  }


  get sqlBuilder(): RelationalSqlBuilder {
    throw new Error('not implemented');
  }

  async transaction(action: (adapter: RelationalTransactionDataAdapter) => Promise<any>): Promise<void> {
    const tid = this.idGenerator.next();
    await this.send(`trx/${tid}`);

    try {
      const timeoutDefer = new Defer<void>();
      this.transactions[tid] = timeoutDefer;
      const execution = action(new ApiRelationalTransactionDataAdapter(this.baseUrl, tid));
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
}

