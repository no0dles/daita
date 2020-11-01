import { TransactionContext } from './transaction-context';
import { RelationalContext } from './relational-context';
import { RelationalTransactionAdapter } from '../../relational/adapter/relational-transaction-adapter';
import { OrmRelationalSchema } from '../schema/orm-relational-schema';
import { Client } from '../../relational/client/client';

export class RelationalTransactionContext extends RelationalContext implements TransactionContext<any> {
  constructor(private transactionAdapter: RelationalTransactionAdapter<any>, schema: OrmRelationalSchema) {
    super(transactionAdapter, schema);
  }

  transaction<R>(action: (trx: Client<any>) => Promise<R>): Promise<R> {
    return this.transactionAdapter.transaction<R>(async (adapter) => {
      return await action(new RelationalContext(adapter, this.schema));
    });
  }
}
