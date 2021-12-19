import { HttpDataAdapter } from './http-data-adapter';
import { RelationalTransactionAdapter } from '@daita/relational';
import { RelationalDataAdapter } from '@daita/relational';
import { randomString } from '@daita/common';
import { HttpTransactionDataAdapter } from './http-transaction-data-adapter';

export class HttpTransactionAdapter extends HttpDataAdapter implements RelationalTransactionAdapter {
  async transaction<T>(action: (adapter: RelationalDataAdapter) => Promise<T>): Promise<T> {
    const http = await this.http.get();
    const tid = randomString(12);
    const transaction = new HttpTransactionDataAdapter(tid, http);
    return transaction.run(() => action(transaction));
  }

  toString() {
    return `http`;
  }
}
