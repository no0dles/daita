import {RelationalTransactionDataAdapter} from '../adapter';
import {MigrationSchema} from '../schema/migration-schema';
import { RelationalDeleteContext } from './relational-delete-context';
import { RelationalInsertContext } from './relational-insert-context';
import { RelationalSelectContext } from './relational-select-context';
import { RelationalUpdateContext } from './relational-update-context';
import {TableInformation} from './table-information';
import {DefaultConstructable} from '../constructable';

export class RelationalTransactionContext {
  constructor(
    protected schema: MigrationSchema,
    protected dataAdapter: RelationalTransactionDataAdapter,
  ) {}

  insert<T>(type: TableInformation<T>): RelationalInsertContext<T> {
    return new RelationalInsertContext<T>(this.dataAdapter, this.schema, type, []);
  }
  select<T>(type: DefaultConstructable<T>): RelationalSelectContext<T> {
    return new RelationalSelectContext<T>(this.dataAdapter, this.schema, type, {
      orderBy: [],
      filter: null,
      limit: null,
      include: [],
      skip: null,
    });
  }
  update<T>(type: TableInformation<T>): RelationalUpdateContext<T> {
    return new RelationalUpdateContext<T>(this.dataAdapter, this.schema, type, {}, null);
  }
  delete<T>(type: TableInformation<T>): RelationalDeleteContext<T> {
    return new RelationalDeleteContext<T>(this.dataAdapter, this.schema, type, null);
  }
}
