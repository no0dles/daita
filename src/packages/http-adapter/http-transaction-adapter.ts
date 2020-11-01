import { HttpDataAdapter } from './http-data-adapter';
import { HttpTransactionDataAdapter } from './http-transaction-data-adapter';
import { RelationalTransactionAdapter } from '../relational/adapter/relational-transaction-adapter';
import { RelationalDataAdapter } from '../relational/adapter/relational-data-adapter';
import { IdGenerator } from '../http-client-common/id-generator';

export class HttpTransactionAdapter extends HttpDataAdapter implements RelationalTransactionAdapter {
  private idGenerator = new IdGenerator();

  transaction<T>(action: (adapter: RelationalDataAdapter) => Promise<T>): Promise<T> {
    const tid = this.idGenerator.next();
    const transaction = new HttpTransactionDataAdapter(tid, this.http);
    return transaction.run(() => action(transaction));
  }
}
