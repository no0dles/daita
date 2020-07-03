import { TransactionContext } from './transaction-context';
import { RelationalContext } from './relational-context';
import { Client, RelationalTransactionAdapter } from '@daita/relational';
import { OrmRelationalSchema } from '../schema';

export class RelationalTransactionContext extends RelationalContext implements TransactionContext<any> {
  constructor(private transactionAdapter: RelationalTransactionAdapter, schema: OrmRelationalSchema) {
    super(transactionAdapter, schema);
  }

  transaction<R>(action: (trx: Client<any>) => Promise<R>): Promise<R> {
    return this.transactionAdapter.transaction<R>(async adapter => {
      return await action(new RelationalContext(adapter, this.schema));
    });
  }
}
