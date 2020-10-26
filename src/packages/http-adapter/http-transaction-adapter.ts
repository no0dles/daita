import { HttpDataAdapter } from './http-data-adapter';
import { HttpTransactionDataAdapter } from './http-transaction-data-adapter';
import { RelationalDataAdapter, RelationalTransactionAdapter } from '../relational/adapter';
import { IdGenerator } from '../http-client-common';

export class HttpTransactionAdapter extends HttpDataAdapter implements RelationalTransactionAdapter {
  private idGenerator = new IdGenerator();

  transaction<T>(action: (adapter: RelationalDataAdapter) => Promise<T>): Promise<T> {
    const tid = this.idGenerator.next();
    const transaction = new HttpTransactionDataAdapter(tid, this.http);
    return transaction.run(() => action(transaction));
  }
}
