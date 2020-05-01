import {RelationalDataAdapter, RelationalTransactionAdapter} from '@daita/relational';
import {IdGenerator} from '@daita/http-client-common';
import {HttpDataAdapter} from './http-data-adapter';
import {HttpTransactionDataAdapter} from './http-transaction-data-adapter';

export class HttpTransactionAdapter extends HttpDataAdapter implements RelationalTransactionAdapter {
  private idGenerator = new IdGenerator();

  transaction<T>(action: (adapter: RelationalDataAdapter) => Promise<T>): Promise<T> {
    const tid = this.idGenerator.next();
    const transaction = new HttpTransactionDataAdapter<T>(tid, this.baseUrl, this.authProvider);
    return transaction.run(() => action(transaction));
  }
}
