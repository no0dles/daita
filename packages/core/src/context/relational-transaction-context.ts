import {RelationalTransactionDataAdapter} from '../adapter';
import {MigrationSchema} from '../schema/migration-schema';
import {RelationalDeleteContext} from './relational-delete-context';
import {RelationalInsertContext} from './relational-insert-context';
import {RelationalSelectContext} from './relational-select-context';
import {RelationalUpdateContext} from './relational-update-context';
import {TableInformation} from './table-information';
import {DefaultConstructable} from '../constructable';
import {ContextUser} from '../auth';

export class RelationalTransactionContext {
  constructor(
    protected schema: MigrationSchema,
    protected dataAdapter: RelationalTransactionDataAdapter,
    protected user: ContextUser | null,
  ) {
  }

  insert<T>(type: TableInformation<T>): RelationalInsertContext<T> {
    return new RelationalInsertContext<T>(
      this.dataAdapter,
      this.schema,
      type,
      [],
      this.user,
    );
  }

  select<T>(type: DefaultConstructable<T>): RelationalSelectContext<T> {
    return new RelationalSelectContext<T>(this.dataAdapter, this.schema, type, {
      orderBy: [],
      filter: null,
      limit: null,
      include: [],
      skip: null,
    }, this.user);
  }

  update<T>(type: TableInformation<T>): RelationalUpdateContext<T> {
    return new RelationalUpdateContext<T>(
      this.dataAdapter,
      this.schema,
      type,
      {},
      null,
      this.user,
    );
  }

  delete<T>(type: TableInformation<T>): RelationalDeleteContext<T> {
    return new RelationalDeleteContext<T>(
      this.dataAdapter,
      this.schema,
      type,
      null,
      this.user,
    );
  }

  raw(query: string, values?: any[]) {
    return this.dataAdapter.raw(query, values || []);
  }
}
