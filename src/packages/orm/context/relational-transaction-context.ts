import { TransactionContext } from './transaction-context';
import { RelationalContext } from './relational-context';
import { OrmRelationalSchema } from '../schema';
import { RelationalTransactionAdapter } from '../../relational/adapter';
import { Client } from '../../relational/client';

export class RelationalTransactionContext
  extends RelationalContext
  implements TransactionContext<any> {
  constructor(
    private transactionAdapter: RelationalTransactionAdapter<any>,
    schema: OrmRelationalSchema,
  ) {
    super(transactionAdapter, schema);
  }

  transaction<R>(action: (trx: Client<any>) => Promise<R>): Promise<R> {
    return this.transactionAdapter.transaction<R>(async (adapter) => {
      return await action(new RelationalContext(adapter, this.schema));
    });
  }
}
