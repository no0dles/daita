import {RelationalDataContext} from './relational-data-context';
import {RelationalSchemaContext} from './relational-schema-context';
import {RelationalTransactionContext} from './relational-transaction-context';
import {RelationalSchemaDescription} from '../schema/description/relational-schema-description';
import { RelationalTransactionAdapter } from "@daita/core";

export class RelationalSchemaTransactionContext extends RelationalSchemaContext implements RelationalTransactionContext {
  constructor(protected relationalTransactionAdapter: RelationalTransactionAdapter,
              schema: RelationalSchemaDescription) {
    super(relationalTransactionAdapter, schema);
  }

  async transaction<T>(action: (trx: RelationalDataContext) => Promise<T>): Promise<T> {
    return await this.relationalTransactionAdapter.transaction<T>(async adapter => {
      return await action(new RelationalSchemaContext(adapter, this.schema));
    });
  }
}
