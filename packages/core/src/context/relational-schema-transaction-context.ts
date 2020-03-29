import {MigrationSchema} from '../schema/migration-schema';
import {RelationalDataContext} from './relational-data-context';
import {RelationalSchemaContext} from './relational-schema-context';
import {RelationalTransactionContext} from './relational-transaction-context';
import {RelationalTransactionAdapter} from '../adapter';

export class RelationalSchemaTransactionContext extends RelationalSchemaContext implements RelationalTransactionContext {
  constructor(protected relationalTransactionAdapter: RelationalTransactionAdapter,
              schema: MigrationSchema) {
    super(relationalTransactionAdapter, schema);
  }

  async transaction<T>(action: (trx: RelationalDataContext) => Promise<T>): Promise<T> {
    return await this.relationalTransactionAdapter.transaction<T>(async adapter => {
      return await action(new RelationalSchemaContext(adapter, this.schema));
    });
  }
}
