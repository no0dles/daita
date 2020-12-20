import { HttpDataAdapter } from './http-data-adapter';
import { HttpTransactionDataAdapter } from './http-transaction-data-adapter';
import { RelationalTransactionAdapter } from '../relational/adapter/relational-transaction-adapter';
import { RelationalDataAdapter } from '../relational/adapter/relational-data-adapter';
import { randomString } from '../common/utils/random-string';

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
